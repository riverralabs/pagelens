import { NextRequest, NextResponse } from 'next/server';
import { graderSchema } from '@/validators/analysis';
import { graderRatelimit } from '@/lib/redis';
import { openai, VISUAL_ANALYSIS_PROMPT, COPY_ANALYSIS_PROMPT } from '@/lib/openai';
import { extractDomain } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    // Rate limit by IP
    const ip = request.headers.get('x-forwarded-for') || 'anonymous';
    const { success } = await graderRatelimit.limit(ip);
    if (!success) return NextResponse.json({ error: 'Rate limit exceeded. Try again later.' }, { status: 429 });

    const body = await request.json();
    const parsed = graderSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });

    const url = parsed.data.url;

    // For the free grader, we do a simplified analysis
    // In production, this would use Playwright to screenshot and analyze
    // For now, return a mock result to demonstrate the flow
    const mockScores = {
      visual: Math.floor(Math.random() * 30) + 55,
      copywriting: Math.floor(Math.random() * 30) + 50,
      ux: Math.floor(Math.random() * 30) + 55,
      conversion: Math.floor(Math.random() * 30) + 45,
      seo: Math.floor(Math.random() * 30) + 50,
      images: Math.floor(Math.random() * 30) + 50,
    };

    const weights = { visual: 0.25, copywriting: 0.20, ux: 0.20, conversion: 0.15, seo: 0.10, images: 0.10 };
    let overallScore = 0;
    for (const [key, score] of Object.entries(mockScores)) {
      overallScore += score * (weights[key as keyof typeof weights] || 0);
    }

    return NextResponse.json({
      url,
      domain: extractDomain(url),
      overallScore: Math.round(overallScore),
      scores: mockScores,
      topFindings: [
        { title: 'CTA buttons need more contrast', description: 'Primary call-to-action buttons don\'t stand out enough from the background.', severity: 'HIGH', category: 'VISUAL' },
        { title: 'Missing meta description', description: 'The homepage is missing a meta description tag for SEO.', severity: 'MEDIUM', category: 'SEO' },
        { title: 'No social proof visible', description: 'The landing page lacks testimonials or trust signals.', severity: 'HIGH', category: 'CONVERSION' },
      ],
      summary: `The website at ${extractDomain(url)} scores ${Math.round(overallScore)}/100 overall. Key areas for improvement include visual design contrast, SEO meta tags, and adding social proof elements.`,
    });
  } catch (error) {
    console.error('POST /api/grader error:', error);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
