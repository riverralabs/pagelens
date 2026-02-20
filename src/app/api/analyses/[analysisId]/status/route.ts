import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ analysisId: string }> }) {
  const { analysisId } = await params;

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (data: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      const poll = async () => {
        try {
          const analysis = await prisma.analysis.findUnique({
            where: { id: analysisId },
            select: { status: true, pagesFound: true, pagesCrawled: true, pagesAnalyzed: true, overallScore: true },
          });

          if (!analysis) {
            sendEvent({ error: 'Analysis not found' });
            controller.close();
            return;
          }

          sendEvent({
            status: analysis.status,
            pagesFound: analysis.pagesFound,
            pagesCrawled: analysis.pagesCrawled,
            pagesAnalyzed: analysis.pagesAnalyzed,
            overallScore: analysis.overallScore,
          });

          if (analysis.status === 'COMPLETED' || analysis.status === 'FAILED') {
            controller.close();
            return;
          }

          setTimeout(poll, 2000);
        } catch {
          controller.close();
        }
      };

      await poll();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
    },
  });
}
