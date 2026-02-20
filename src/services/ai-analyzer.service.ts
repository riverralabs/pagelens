import { openai, VISUAL_ANALYSIS_PROMPT, COPY_ANALYSIS_PROMPT, UX_ANALYSIS_PROMPT, CONVERSION_ANALYSIS_PROMPT, IMAGE_ANALYSIS_PROMPT } from '@/lib/openai';
import { anthropic, REPORT_GENERATION_PROMPT } from '@/lib/anthropic';
import type { VisualAnalysisResult, CopyAnalysisResult, ReportContent, ExtractedContent, AnalysisScores } from '@/types/analysis';

export async function analyzeScreenshot(imageUrl: string, pageUrl: string): Promise<VisualAnalysisResult> {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: VISUAL_ANALYSIS_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Analyze this screenshot of ${pageUrl}. Return JSON only.` },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4096,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Visual analysis error:', error);
    return { scores: { visualHierarchy: 50, layoutQuality: 50, colorHarmony: 50, typography: 50, whitespace: 50, ctaVisibility: 50, overall: 50 }, findings: [], summary: 'Analysis unavailable' };
  }
}

export async function analyzeCopy(content: ExtractedContent, pageUrl: string): Promise<CopyAnalysisResult> {
  try {
    const textContent = {
      title: content.title,
      headings: content.headings,
      paragraphs: content.paragraphs.slice(0, 20),
      ctaButtons: content.ctaButtons,
      metaDescription: content.metaDescription,
    };

    const response = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: COPY_ANALYSIS_PROMPT },
        { role: 'user', content: `Analyze the copy from ${pageUrl}:\n${JSON.stringify(textContent)}\n\nReturn JSON only.` },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4096,
    });

    return JSON.parse(response.choices[0].message.content || '{}');
  } catch (error) {
    console.error('Copy analysis error:', error);
    return { scores: { headlineEffectiveness: 50, ctaClarity: 50, valueProposition: 50, readability: 50, toneConsistency: 50, overall: 50 }, findings: [], summary: 'Analysis unavailable' };
  }
}

export async function generateReport(analysisData: Record<string, unknown>): Promise<ReportContent> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [
        { role: 'user', content: `${REPORT_GENERATION_PROMPT}\n\nAnalysis data:\n${JSON.stringify(analysisData, null, 2)}\n\nReturn JSON.` },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || [null, text];
    return JSON.parse(jsonMatch[1] || text);
  } catch (error) {
    console.error('Report generation error:', error);
    return { executiveSummary: 'Report generation failed', sections: [], topRecommendations: [] };
  }
}

export function aggregateScores(pageScores: AnalysisScores[]): AnalysisScores {
  if (pageScores.length === 0) {
    return { visual: 0, copywriting: 0, ux: 0, conversion: 0, seo: 0, images: 0 };
  }

  const totals: AnalysisScores = { visual: 0, copywriting: 0, ux: 0, conversion: 0, seo: 0, images: 0 };
  for (const scores of pageScores) {
    for (const key of Object.keys(totals) as (keyof AnalysisScores)[]) {
      totals[key] += scores[key] || 0;
    }
  }

  const count = pageScores.length;
  return {
    visual: Math.round(totals.visual / count),
    copywriting: Math.round(totals.copywriting / count),
    ux: Math.round(totals.ux / count),
    conversion: Math.round(totals.conversion / count),
    seo: Math.round(totals.seo / count),
    images: Math.round(totals.images / count),
  };
}
