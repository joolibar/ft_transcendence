import { describe, expect, it } from 'vitest';
import { loggerOptions } from './app.js';

describe('loggerOptions', () => {
  it('turns logging off in tests', () => {
    expect(loggerOptions('test')).toBe(false);
  });

  it('prints readable, coloured logs in development', () => {
    expect(loggerOptions('development')).toEqual({
      transport: { target: 'pino-pretty', options: { colorize: true } },
    });
  });

  it('prints JSON logs in production', () => {
    expect(loggerOptions('production')).toBe(true);
  });
});
