export interface CheckoutRequest {
  priceId: string;
  plan: string;
}

export interface SubscriptionInfo {
  plan: string;
  status: string;
  analysesUsed: number;
  analysesLimit: number;
  currentPeriodEnd?: string;
  cancelAtPeriodEnd: boolean;
}

export interface PlanInfo {
  name: string;
  price: {
    monthly: number;
    annual: number;
  };
  limits: {
    analyses: number;
    pages: number;
    history: number;
    team: number;
    whiteLabel: boolean;
    api: boolean;
  };
  features: string[];
}
