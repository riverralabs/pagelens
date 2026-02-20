import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create a test user
  const user = await prisma.user.upsert({
    where: { email: 'test@pagelens.ai' },
    update: {},
    create: {
      supabaseId: 'test-supabase-id',
      email: 'test@pagelens.ai',
      name: 'Test User',
    },
  });

  // Create a workspace
  const workspace = await prisma.workspace.upsert({
    where: { slug: 'test-workspace' },
    update: {},
    create: {
      name: 'Test Workspace',
      slug: 'test-workspace',
      ownerId: user.id,
    },
  });

  // Create a subscription
  await prisma.subscription.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
      plan: 'FREE',
      status: 'ACTIVE',
      analysesLimit: 3,
    },
  });

  // Create a sample project
  await prisma.project.upsert({
    where: { id: 'sample-project' },
    update: {},
    create: {
      id: 'sample-project',
      workspaceId: workspace.id,
      name: 'Example Website',
      url: 'https://example.com',
      domain: 'example.com',
      description: 'A sample project for testing',
    },
  });

  console.log('Seeding complete!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
