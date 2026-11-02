import type { HealthResponse } from '@miga/shared';
import type { FastifyInstance } from 'fastify';

export async function healthRoutes(app: FastifyInstance) {
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
}
