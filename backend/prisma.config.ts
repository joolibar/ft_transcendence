import { defineConfig } from 'prisma/config';

// Load the root .env when running Prisma commands locally. In Docker the
// variables come from docker-compose.yml instead.
try {
  process.loadEnvFile('../.env');
} catch {
  // No .env file: rely on the environment.
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: { path: 'prisma/migrations' },
  datasource: { url: process.env.DATABASE_URL ?? '' },
});
