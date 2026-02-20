import { z } from 'zod/v4';

export const checkoutSchema = z.object({
  priceId: z.string().min(1),
  plan: z.enum(['STARTER', 'PRO', 'BUSINESS']),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
