/**
 * Service Worker(仅网页 / PWA 使用;Android App 内由 main.tsx 注销,资源本就在本地)。
 *
 * 每次构建都会把 __BUILD_ID__ 替换为唯一构建号(vite.config.ts 的 sw-build-id 插件),
 * 因此 sw.js 内容随版本变化 → 浏览器检测到更新 → 新 SW 安装并接管:
 * - 删除所有旧版本缓存(含早期固定名 ziwei-v1 的缓存优先缓存,它曾导致升级后仍显示旧界面);
 * - 若确有旧缓存,把已打开的旧页面刷新到新版本(一次)。
 * 策略:页面导航「网络优先、离线回退缓存」;带哈希的 /assets/ 「缓存优先」(内容不可变);
 * 其余同源 GET 「缓存兜底、后台更新」。/api 一律直连网络。
 */
const BUILD_ID = '__BUILD_ID__';
const CACHE = `ziwei-${BUILD_ID}`;

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  const cleanup = (async () => {
    const keys = await caches.keys();
    const stale = keys.filter((k) => k.startsWith('ziwei') && k !== CACHE);
    await Promise.all(stale.map((k) => caches.delete(k)));
    await self.clients.claim();
    return stale.length > 0;
  })();
  event.waitUntil(cleanup);
  // 刷新旧页面必须在 waitUntil 之外:导航请求要等激活结束才会派发,
  // 若在 waitUntil 里等待 navigate,激活与导航会互相等待(死锁)。
  cleanup.then(async (hadStale) => {
    if (!hadStale) return;
    const windows = await self.clients.matchAll({ type: 'window' });
    for (const c of windows) c.navigate(c.url).catch(() => undefined);
  });
});

const isNavigation = (request) =>
  request.mode === 'navigate' || (request.headers.get('accept') ?? '').includes('text/html');

self.addEventListener('fetch', (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin || url.pathname.includes('/api/')) {
    return;
  }

  // 页面:网络优先,保证新版本立即可见;离线时回退缓存
  if (isNavigation(request)) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        try {
          const response = await fetch(request, { cache: 'no-store' });
          if (response.ok) await cache.put(request, response.clone());
          return response;
        } catch {
          return (await cache.match(request)) ?? (await cache.match('./')) ?? Response.error();
        }
      })(),
    );
    return;
  }

  // 带哈希的构建产物:缓存优先
  if (url.pathname.includes('/assets/')) {
    event.respondWith(
      (async () => {
        const cache = await caches.open(CACHE);
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      })(),
    );
    return;
  }

  // 其余(图标、manifest 等):缓存兜底、后台更新
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      const refresh = fetch(request)
        .then(async (response) => {
          if (response.ok) await cache.put(request, response.clone());
          return response;
        })
        .catch(() => cached ?? Response.error());
      return cached ?? refresh;
    })(),
  );
});
