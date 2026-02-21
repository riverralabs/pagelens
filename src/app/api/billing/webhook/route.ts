import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { PLAN_LIMITS } from '@/lib/constants';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;

    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const plan = (session.metadata?.plan || 'STARTER') as keyof typeof PLAN_LIMITS;

        if (userId) {
          await prisma.subscription.upsert({
            where: { userId },
            update: {
              stripeSubId: session.subscription as string,
              plan,
              status: 'ACTIVE',
              analysesLimit: PLAN_LIMITS[plan]?.analyses ?? 5,
              analysesUsed: 0,
            },
            create: {
              userId,
              stripeCustomerId: session.customer as string,
              stripeSubId: session.subscription as string,
              plan,
              status: 'ACTIVE',
              analysesLimit: PLAN_LIMITS[plan]?.analyses ?? 5,
            },
          });
        }
        break;
      }

      case 'customer.subscription.updated': {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubId: sub.id },
          data: {
            status: sub.status === 'active' ? 'ACTIVE' : sub.status === 'past_due' ? 'PAST_DUE' : 'CANCELLED',
            cancelAtPeriodEnd: sub.cancel_at_period_end,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            currentPeriodStart: new Date(((sub as any).current_period_start as number) * 1000),
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            currentPeriodEnd: new Date(((sub as any).current_period_end as number) * 1000),
          },
        });
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = event.data.object as Stripe.Subscription;
        await prisma.subscription.updateMany({
          where: { stripeSubId: sub.id },
          data: { status: 'CANCELLED', plan: 'FREE', analysesLimit: 3 },
        });
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('POST /api/billing/webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
