import { NextRequest, NextResponse } from 'next/server';
import { openai, COPY_ANALYSIS_PROMPT } from '@/lib/openai';

export async function POST(request: NextRequest) {
  try {
    const { content, pageUrl } = await request.json();
    if (!content) return NextResponse.json({ error: 'content required' }, { status: 400 });

    const response = await openai.chat.completions.create({
      model: 'gpt-4.1',
      messages: [
        { role: 'system', content: COPY_ANALYSIS_PROMPT },
        { role: 'user', content: `Analyze the following website copy from ${pageUrl || 'a web page'}. Return JSON only.\n\n${JSON.stringify(content)}` },
      ],
      response_format: { type: 'json_object' },
      max_tokens: 4096,
    });

    const result = JSON.parse(response.choices[0].message.content || '{}');
    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('POST /api/ai/analyze-copy error:', error);
    return NextResponse.json({ error: 'AI analysis failed' }, { status: 500 });
  }
}
