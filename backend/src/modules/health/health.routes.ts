import type { HealthResponse } from '@miga/shared';
import type { FastifyPluginCallback } from 'fastify';

export const healthRoutes: FastifyPluginCallback = (app, _options, done) => {
  app.get('/health', async (): Promise<HealthResponse> => {
    let database: HealthResponse['database'] = 'up';
    try {
      await app.prisma.$queryRaw`SELECT 1`;
    } catch (error) {
      app.log.error(error, 'Database health check failed');
      database = 'down';
    }
    return {
      status: database === 'up' ? 'ok' : 'degraded',
      database,
      uptimeSeconds: Math.round(process.uptime()),
    };
  });
  done();
};
