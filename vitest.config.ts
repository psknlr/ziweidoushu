import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      '@ziwei/core': fileURLToPath(new URL('./packages/core/src/index.ts', import.meta.url)),
      '@ziwei/knowledge': fileURLToPath(new URL('./packages/knowledge/src/index.ts', import.meta.url)),
    },
  },
  test: {
    include: ['packages/*/test/**/*.test.ts'],
  },
});
