import { z } from 'zod';

// Response of GET /api/health. Defined once here so the API and the web app
// always agree on its shape: if it changes, both fail to compile until updated.
export const healthResponseSchema = z.object({
  status: z.enum(['ok', 'degraded']),
  database: z.enum(['up', 'down']),
  uptimeSeconds: z.number(),
});

export type HealthResponse = z.infer<typeof healthResponseSchema>;
