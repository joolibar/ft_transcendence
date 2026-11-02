import { buildApp } from './app.js';
import { loadEnv } from './config/env.js';

const env = loadEnv();
const app = await buildApp(env);

for (const signal of ['SIGINT', 'SIGTERM'] as const) {
  process.on(signal, async () => {
    await app.close();
    process.exit(0);
  });
}

try {
  await app.listen({ host: '0.0.0.0', port: env.API_PORT });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
