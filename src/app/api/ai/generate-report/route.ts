import { NextRequest, NextResponse } from 'next/server';
import { anthropic, REPORT_GENERATION_PROMPT } from '@/lib/anthropic';

export async function POST(request: NextRequest) {
  try {
    const { analysisData } = await request.json();
    if (!analysisData) return NextResponse.json({ error: 'analysisData required' }, { status: 400 });

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 8192,
      messages: [
        { role: 'user', content: `${REPORT_GENERATION_PROMPT}\n\nHere is the analysis data:\n${JSON.stringify(analysisData, null, 2)}\n\nGenerate the report as a JSON object.` },
      ],
    });

    const text = response.content[0].type === 'text' ? response.content[0].text : '';
    // Extract JSON from potential markdown code blocks
    const jsonMatch = text.match(/```json\n?([\s\S]*?)\n?```/) || [null, text];
    const result = JSON.parse(jsonMatch[1] || text);
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('POST /api/ai/generate-report error:', error);
    return NextResponse.json({ error: 'Report generation failed' }, { status: 500 });
  }
}
