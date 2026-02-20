export const APP_NAME = 'PageLens';
export const APP_TAGLINE = 'See What Your Visitors See. Fix What They Don\'t.';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

export const PLAN_LIMITS = {
  FREE:       { analyses: 3,   pages: 10,  history: 1,  team: 1,  whiteLabel: false, api: false },
  STARTER:    { analyses: 5,   pages: 50,  history: 5,  team: 1,  whiteLabel: false, api: false },
  PRO:        { analyses: 25,  pages: 100, history: 25, team: 5,  whiteLabel: true,  api: true  },
  BUSINESS:   { analyses: -1,  pages: 500, history: -1, team: 20, whiteLabel: true,  api: true  },
  ENTERPRISE: { analyses: -1,  pages: -1,  history: -1, team: -1, whiteLabel: true,  api: true  },
} as const;

export const PLAN_PRICES = {
  STARTER:  { monthly: 4900,  annual: 39000  },
  PRO:      { monthly: 14900, annual: 119000 },
  BUSINESS: { monthly: 34900, annual: 279000 },
} as const;

export const SCORING_CATEGORIES = [
  'visual', 'copywriting', 'ux', 'conversion', 'seo', 'images'
] as const;

export const SCORING_WEIGHTS: Record<string, number> = {
  visual: 0.25,
  copywriting: 0.20,
  ux: 0.20,
  conversion: 0.15,
  seo: 0.10,
  images: 0.10,
};

export const SCORING_LABELS: Record<string, string> = {
  visual: 'Visual Design',
  copywriting: 'Copywriting',
  ux: 'UX/Usability',
  conversion: 'Conversion Readiness',
  seo: 'SEO Health',
  images: 'Image Quality',
};

export const VIEWPORTS = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'mobile',  width: 375,  height: 812 },
] as const;

export const SEVERITY_ORDER = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
  INFO: 4,
} as const;

export const MAX_FREE_GRADER_USES = 3;

export const ANALYSIS_STATUS_LABELS: Record<string, string> = {
  QUEUED: 'Queued',
  CRAWLING: 'Crawling',
  ANALYZING: 'Analyzing',
  GENERATING_REPORT: 'Generating Report',
  COMPLETED: 'Completed',
  FAILED: 'Failed',
};
