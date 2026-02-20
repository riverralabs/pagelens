import { z } from 'zod/v4';

export const startAnalysisSchema = z.object({
  crawlDepth: z.number().min(1).max(5).default(2),
  maxPages: z.number().min(1).max(500).default(50),
});

export const graderSchema = z.object({
  url: z.url('Please enter a valid URL'),
});

export type StartAnalysisInput = z.infer<typeof startAnalysisSchema>;
export type GraderInput = z.infer<typeof graderSchema>;
