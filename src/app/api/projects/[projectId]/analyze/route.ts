import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { startAnalysisSchema } from '@/validators/analysis';

export async function POST(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await request.json();
    const parsed = startAnalysisSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: { workspace: { select: { ownerId: true } } },
    });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    if (project.workspace.ownerId !== dbUser.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    // Check subscription limits
    const subscription = await prisma.subscription.findUnique({ where: { userId: dbUser.id } });
    const limit = subscription?.analysesLimit ?? 3;
    const used = subscription?.analysesUsed ?? 0;
    if (limit !== -1 && used >= limit) {
      return NextResponse.json({ error: 'Analysis limit reached. Please upgrade your plan.' }, { status: 403 });
    }

    // Create analysis record
    const analysis = await prisma.analysis.create({
      data: {
        projectId,
        config: { crawlDepth: parsed.data.crawlDepth, maxPages: parsed.data.maxPages },
      },
    });

    // Create crawl job record
    await prisma.crawlJob.create({
      data: { analysisId: analysis.id },
    });

    // Increment usage
    if (subscription) {
      await prisma.subscription.update({
        where: { id: subscription.id },
        data: { analysesUsed: { increment: 1 } },
      });
    }

    // TODO: Queue the crawl job via BullMQ
    // await crawlQueue.add('crawl', { analysisId: analysis.id, url: project.url, config: parsed.data });

    return NextResponse.json({ data: analysis }, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects/[id]/analyze error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
