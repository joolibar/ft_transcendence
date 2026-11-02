import helmet from '@fastify/helmet';
import sensible from '@fastify/sensible';
import Fastify from 'fastify';
import type { Env } from './config/env.js';
import { healthRoutes } from './modules/health/health.routes.js';
import { registerPrisma } from './plugins/prisma.js';

export async function buildApp(env: Env) {
  const app = Fastify({
    logger:
      env.NODE_ENV === 'development'
        ? { transport: { target: 'pino-pretty', options: { colorize: true } } }
        : true,
    // nginx sits in front of the API: trust its X-Forwarded-* headers so
    // request.ip and request.protocol describe the real client.
    trustProxy: true,
  });

  await app.register(helmet);
  await app.register(sensible);
  await registerPrisma(app, env.DATABASE_URL);

  // Every feature lives in src/modules/<feature> and is registered under /api.
  await app.register(
    async (api) => {
      await api.register(healthRoutes);
    },
    { prefix: '/api' },
  );

  return app;
}
