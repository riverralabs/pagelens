import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { updateProjectSchema } from '@/validators/project';

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;
  return prisma.user.findUnique({ where: { supabaseId: user.id } });
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const dbUser = await getAuthUser();
    if (!dbUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const project = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        analyses: { orderBy: { createdAt: 'desc' }, take: 20, select: { id: true, status: true, overallScore: true, scores: true, pagesFound: true, pagesCrawled: true, createdAt: true } },
        workspace: { select: { ownerId: true } },
      },
    });

    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    if (project.workspace.ownerId !== dbUser.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    return NextResponse.json({ data: project });
  } catch (error) {
    console.error('GET /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const dbUser = await getAuthUser();
    if (!dbUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = updateProjectSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });

    const project = await prisma.project.findUnique({ where: { id: projectId }, include: { workspace: { select: { ownerId: true } } } });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    if (project.workspace.ownerId !== dbUser.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: parsed.data,
    });

    return NextResponse.json({ data: updated });
  } catch (error) {
    console.error('PATCH /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ projectId: string }> }) {
  try {
    const { projectId } = await params;
    const dbUser = await getAuthUser();
    if (!dbUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const project = await prisma.project.findUnique({ where: { id: projectId }, include: { workspace: { select: { ownerId: true } } } });
    if (!project) return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    if (project.workspace.ownerId !== dbUser.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    await prisma.project.delete({ where: { id: projectId } });

    return NextResponse.json({ message: 'Project deleted' });
  } catch (error) {
    console.error('DELETE /api/projects/[id] error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
