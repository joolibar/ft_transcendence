import { defineConfig } from 'vitest/config';

// Runs the tests of every workspace with one command (`pnpm test`).
// Each project keeps its own vitest.config.ts with its environment.
export default defineConfig({
  test: {
    projects: ['shared', 'backend', 'frontend'],
    coverage: {
      provider: 'v8',
      include: ['{backend,frontend,shared}/src/**'],
      exclude: ['**/*.test.{ts,tsx}', '**/src/generated/**', '**/main.tsx', '**/server.ts'],
      reporter: ['text', 'html'],
      // The CI fails if coverage drops below these percentages. Raise them as
      // the project grows; never lower them to make a PR pass.
      thresholds: { statements: 80, branches: 80, functions: 80, lines: 80 },
    },
  },
});
