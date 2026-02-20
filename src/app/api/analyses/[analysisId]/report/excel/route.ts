import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { createClient } from '@/lib/supabase/server';

export async function GET(_request: NextRequest, { params }: { params: Promise<{ analysisId: string }> }) {
  try {
    const { analysisId } = await params;
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const report = await prisma.report.findUnique({
      where: { analysisId },
      include: { analysis: { include: { project: { include: { workspace: { select: { ownerId: true } } } } } } },
    });

    if (!report) return NextResponse.json({ error: 'Report not found' }, { status: 404 });

    if (report.excelUrl) {
      return NextResponse.redirect(report.excelUrl);
    }

    return NextResponse.json({ error: 'Excel not yet generated' }, { status: 404 });
  } catch (error) {
    console.error('GET /api/analyses/[id]/report/excel error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
