import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  typescript: true,
});

export function getStripePrice(plan: string, interval: 'monthly' | 'annual' = 'monthly') {
  const priceMap: Record<string, string | undefined> = {
    STARTER: process.env.STRIPE_STARTER_PRICE_ID,
    PRO: process.env.STRIPE_PRO_PRICE_ID,
    BUSINESS: process.env.STRIPE_BUSINESS_PRICE_ID,
  };
  return priceMap[plan];
}
