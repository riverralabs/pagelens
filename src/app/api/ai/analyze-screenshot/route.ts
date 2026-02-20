import { NextRequest, NextResponse } from 'next/server';
import { openai, VISUAL_ANALYSIS_PROMPT } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { imageUrl, pageUrl } = await request.json();
    if (!imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 });

    const response = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: VISUAL_ANALYSIS_PROMPT },
        {
          role: 'user',
          content: [
            { type: 'text', text: `Analyze this screenshot of ${pageUrl || 'a web page'}. Return JSON only.` },
            { type: 'image_url', image_url: { url: imageUrl } },
          ],
        },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4096,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('POST /api/ai/analyze-screenshot error:', error);
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 });
  }
}
