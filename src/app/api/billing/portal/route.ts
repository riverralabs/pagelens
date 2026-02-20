import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { stripe } from '@/lib/stripe';
import prisma from '@/lib/prisma';

export async function POST() {
  try {
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { supabaseId: user.id } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const subscription = await prisma.subscription.findUnique({ where: { userId: dbUser.id } });
    if (!subscription?.stripeCustomerId) return NextResponse.json({ error: 'No subscription found' }, { status: 404 });

    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('POST /api/billing/portal error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
