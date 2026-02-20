import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import prisma from '@/lib/prisma';
import { createProjectSchema } from '@/validators/project';
import { extractDomain, slugify } from '@/lib/utils';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const workspaces = await prisma.workspace.findMany({
      where: { ownerId: dbUser.id },
      select: { id: true },
    });

    const projects = await prisma.project.findMany({
      where: { workspaceId: { in: workspaces.map((w) => w.id) } },
      include: { _count: { select: { analyses: true } }, analyses: { take: 1, orderBy: { createdAt: 'desc' }, select: { overallScore: true, status: true } } },
      orderBy: { updatedAt: 'desc' },
    });

    const data = projects.map((p) => ({
      ...p,
      latestScore: p.analyses[0]?.overallScore || null,
    }));

    return NextResponse.json({ data });
  } catch (error) {
    console.error('GET /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = createProjectSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input', details: parsed.error.issues }, { status: 400 });

    let dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { supabaseId: user.id, email: user.email!, name: user.user_metadata?.name },
      });
    }

    let workspace = await prisma.workspace.findFirst({ where: { ownerId: dbUser.id } });
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: { name: 'My Workspace', slug: slugify(dbUser.email || 'workspace'), ownerId: dbUser.id },
      });
    }

    const project = await prisma.project.create({
      data: {
        workspaceId: workspace.id,
        name: parsed.data.name,
        url: parsed.data.url,
        domain: extractDomain(parsed.data.url),
        description: parsed.data.description,
      },
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    console.error('POST /api/projects error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
