import { defineProject } from 'vitest/config';

// Tests that need PostgreSQL read DATABASE_URL from the root .env locally,
// or from the environment in CI.
try {
  process.loadEnvFile(new URL('../../.env', import.meta.url));
} catch {
  // No .env file: rely on the environment.
}

export default defineProject({
  test: {
    name: 'api',
    environment: 'node',
    env: { NODE_ENV: 'test' },
  },
});
