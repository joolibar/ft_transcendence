import type { HealthResponse } from '@miga/shared';
import type { FastifyInstance } from 'fastify';
import { afterEach, describe, expect, it } from 'vitest';
import { buildApp } from '../../app.js';

// Port 1 is never a PostgreSQL server, so the connection fails immediately.
const UNREACHABLE_DATABASE_URL = 'postgresql://miga:miga@127.0.0.1:1/miga';

async function getHealth(databaseUrl: string) {
  app = await buildApp({ NODE_ENV: 'test', API_PORT: 0, DATABASE_URL: databaseUrl });
  const response = await app.inject({ method: 'GET', url: '/api/health' });
  return { statusCode: response.statusCode, body: response.json<HealthResponse>() };
}

let app: FastifyInstance | undefined;

afterEach(async () => {
  await app?.close();
  app = undefined;
});

describe('GET /api/health', () => {
  it('reports ok when the database answers', async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl)
      throw new Error('DATABASE_URL is not set. Start the database with `make db` and create .env');

    const { statusCode, body } = await getHealth(databaseUrl);

    expect(statusCode).toBe(200);
    expect(body).toMatchObject({ status: 'ok', database: 'up' });
    expect(body.uptimeSeconds).toBeGreaterThanOrEqual(0);
  });

  it('reports degraded instead of crashing when the database is unreachable', async () => {
    const { statusCode, body } = await getHealth(UNREACHABLE_DATABASE_URL);

    expect(statusCode).toBe(200);
    expect(body).toMatchObject({ status: 'degraded', database: 'down' });
  });
});
