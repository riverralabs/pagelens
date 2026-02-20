import { z } from 'zod/v4';

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  url: z.url('Please enter a valid URL'),
  description: z.string().max(500).optional(),
});

export const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  settings: z
    .object({
      crawlDepth: z.number().min(1).max(5).optional(),
      maxPages: z.number().min(1).max(500).optional(),
      viewports: z.array(z.number()).optional(),
    })
    .optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
