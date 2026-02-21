import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { PLAN_LIMITS } from '@/lib/constants';
import type { Plan } from '@/generated/prisma/client';

export async function getOrCreateSubscription(userId: string) {
  let subscription = await prisma.subscription.findUnique({ where: { userId } });
  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: { userId, plan: 'FREE', analysesLimit: PLAN_LIMITS.FREE.analyses },
    });
  }
  return subscription;
}

export async function canRunAnalysis(userId: string): Promise<{ allowed: boolean; reason?: string }> {
  const subscription = await getOrCreateSubscription(userId);
  const limit = subscription.analysesLimit;
  const used = subscription.analysesUsed;

  if (limit === -1) return { allowed: true }; // unlimited
  if (used >= limit) {
    return { allowed: false, reason: `You've used ${used}/${limit} analyses this period. Please upgrade your plan.` };
  }

  return { allowed: true };
}

export async function incrementUsage(userId: string): Promise<void> {
  await prisma.subscription.update({
    where: { userId },
    data: { analysesUsed: { increment: 1 } },
  });
}

export function getPlanLimits(plan: Plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.FREE;
}

export async function resetMonthlyUsage(): Promise<void> {
  await prisma.subscription.updateMany({
    data: { analysesUsed: 0 },
  });
}
