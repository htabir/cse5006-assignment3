import path from 'node:path';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// In development the browser only ever talks to :5173; /api and /auth are proxied to Express so
// the JWT cookie is first-party exactly as it is in production (single origin).
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: { alias: { '@': path.resolve(import.meta.dirname, './src') } },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/api': 'http://localhost:4000',
      '/auth': 'http://localhost:4000',
    },
  },
});
