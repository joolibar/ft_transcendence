import { z } from 'zod';

// Validate environment variables once at startup so a missing or malformed
// value fails fast with a clear message instead of breaking later.
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(3000),
  DATABASE_URL: z.url(),
});

export type Env = z.infer<typeof envSchema>;

export function loadEnv(): Env {
  const result = envSchema.safeParse(process.env);
  if (!result.success) {
    console.error('Invalid environment variables:', z.prettifyError(result.error));
    process.exit(1);
  }
  return result.data;
}
