import { defineConfig } from 'vitest/config';

// Runs the tests of every workspace with one command (`pnpm test`).
// Each project keeps its own vitest.config.ts with its environment.
export default defineConfig({
  test: {
    projects: ['packages/shared', 'apps/api', 'apps/web'],
    coverage: {
      provider: 'v8',
      include: ['packages/*/src/**', 'apps/*/src/**'],
      exclude: ['**/*.test.{ts,tsx}', '**/src/generated/**', '**/main.tsx', '**/server.ts'],
      reporter: ['text', 'html'],
    },
  },
});
