import { describe, expect, it } from 'vitest';
import { parseEnv } from './env.js';

const DATABASE_URL = 'postgresql://miga:secret@localhost:5432/miga';

describe('parseEnv', () => {
  it('applies defaults when optional variables are missing', () => {
    expect(parseEnv({ DATABASE_URL })).toEqual({
      NODE_ENV: 'development',
      API_PORT: 3000,
      DATABASE_URL,
    });
  });

  it('converts API_PORT from text to a number', () => {
    expect(parseEnv({ DATABASE_URL, API_PORT: '4000' }).API_PORT).toBe(4000);
  });

  it('fails when DATABASE_URL is missing', () => {
    expect(() => parseEnv({})).toThrow(/DATABASE_URL/);
  });

  it('fails when DATABASE_URL is not a URL', () => {
    expect(() => parseEnv({ DATABASE_URL: 'not-a-url' })).toThrow(/DATABASE_URL/);
  });

  it('fails when API_PORT is not a positive integer', () => {
    expect(() => parseEnv({ DATABASE_URL, API_PORT: '-1' })).toThrow(/API_PORT/);
  });

  it('fails when NODE_ENV has an unknown value', () => {
    expect(() => parseEnv({ DATABASE_URL, NODE_ENV: 'staging' })).toThrow(/NODE_ENV/);
  });
});
