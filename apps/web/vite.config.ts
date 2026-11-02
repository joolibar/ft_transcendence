import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // In development, forward API calls to the local Fastify server.
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
});
