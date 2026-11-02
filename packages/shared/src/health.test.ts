import { describe, expect, it } from 'vitest';
import { healthResponseSchema } from './health.js';

describe('healthResponseSchema', () => {
  it('accepts a valid health response', () => {
    const data = { status: 'ok', database: 'up', uptimeSeconds: 12 };

    expect(healthResponseSchema.parse(data)).toEqual(data);
  });

  it('rejects an unknown status', () => {
    const result = healthResponseSchema.safeParse({
      status: 'broken',
      database: 'up',
      uptimeSeconds: 12,
    });

    expect(result.success).toBe(false);
  });

  it('rejects a response with missing fields', () => {
    const result = healthResponseSchema.safeParse({ status: 'ok' });

    expect(result.success).toBe(false);
  });
});
