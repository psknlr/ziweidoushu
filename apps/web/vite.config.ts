import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@ziwei/core': fileURLToPath(new URL('../../packages/core/src/index.ts', import.meta.url)),
      '@ziwei/knowledge': fileURLToPath(new URL('../../packages/knowledge/src/index.ts', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // AI 解读走本地网关(npm run gateway),Key 永不进前端
      '/api': 'http://127.0.0.1:8787',
    },
  },
});
