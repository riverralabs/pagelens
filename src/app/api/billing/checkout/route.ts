import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe, getStripePrice } from '@/lib/stripe';
import prisma from '@/lib/prisma';
import { checkoutSchema } from '@/validators/billing';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 });

    const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const priceId = getStripePrice(parsed.data.plan);
    if (!priceId) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 });

    let subscription = await prisma.subscription.findUnique({ where: { userId: dbUser.id } });
    let customerId = subscription?.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: dbUser.email,
        name: dbUser.name || undefined,
        metadata: { userId: dbUser.id },
      });
      customerId = customer.id;

      if (!subscription) {
        subscription = await prisma.subscription.create({
          data: { userId: dbUser.id, stripeCustomerId: customerId },
        });
      } else {
        await prisma.subscription.update({
          where: { id: subscription.id },
          data: { stripeCustomerId: customerId },
        });
      }
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing?canceled=true`,
      metadata: { userId: dbUser.id, plan: parsed.data.plan },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('POST /api/billing/checkout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
