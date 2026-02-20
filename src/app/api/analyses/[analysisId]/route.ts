import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ analysisId: string }> }) {
  try {
    const { analysisId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const analysis = await prisma.analysis.findUnique({
      where: { id: analysisId },
      include: {
        project: { include: { workspace: { select: { ownerId: true } } } },
        pageResults: {
          include: {
            screenshots: true,
            findings: { include: { recommendation: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
        report: true,
        crawlJob: true,
      },
    });

    if (!analysis) return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });

    const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser || analysis.project.workspace.ownerId !== dbUser.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    return NextResponse.json({ data: analysis });
  } catch (error) {
    console.error('GET /api/analyses/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
