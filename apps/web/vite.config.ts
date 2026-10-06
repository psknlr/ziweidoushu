import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

/** 构建号:版本号(CI 注入)+ 时间戳,保证每次构建唯一 */
const BUILD_ID = `${process.env.VITE_APP_VERSION ?? 'dev'}-${Date.now().toString(36)}`;

/**
 * 把 dist/sw.js 中的 __BUILD_ID__ 替换为本次构建号:
 * sw.js 内容随版本变化,浏览器才会安装新 SW、清理旧缓存(否则升级后旧界面会被缓存顶替)。
 */
function swBuildId(): Plugin {
  let outDir = 'dist';
  return {
    name: 'sw-build-id',
    apply: 'build',
    configResolved(config) {
      outDir = config.build.outDir;
    },
    closeBundle() {
      const file = join(outDir, 'sw.js');
      if (!existsSync(file)) return;
      writeFileSync(file, readFileSync(file, 'utf-8').replaceAll('__BUILD_ID__', BUILD_ID));
    },
  };
}

export default defineConfig({
  // GitHub Pages 等子路径部署时由 CI 注入 VITE_BASE(如 /ziweidoushu/)
  base: process.env.VITE_BASE ?? '/',
  plugins: [react(), swBuildId()],
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
