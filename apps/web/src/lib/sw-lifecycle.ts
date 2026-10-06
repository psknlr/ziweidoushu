/**
 * Service Worker 生命周期:
 * - Android App(Capacitor):资源随 APK 打包在本地,不需要 SW。注销所有 SW 并删除旧缓存,
 *   避免覆盖安装升级后旧缓存继续顶替新界面(0.1.0.12 及以前的 App 存在此问题)。
 * - 网页 / PWA:注册按构建号变化的 sw.js,新版本部署后自动接管并刷新到新界面。
 */
import { Capacitor } from '@capacitor/core';

export function isNativeApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return false;
  }
}

/** 注销全部 SW 并删除本应用缓存;返回是否清理掉了东西 */
export async function purgeServiceWorkers(): Promise<boolean> {
  let removed = false;
  if ('serviceWorker' in navigator) {
    const regs = await navigator.serviceWorker.getRegistrations();
    const results = await Promise.all(regs.map((r) => r.unregister().catch(() => false)));
    removed = results.some(Boolean);
  }
  if (typeof caches !== 'undefined') {
    const keys = await caches.keys();
    const mine = keys.filter((k) => k.startsWith('ziwei'));
    await Promise.all(mine.map((k) => caches.delete(k)));
    removed = removed || mine.length > 0;
  }
  return removed;
}

/** 手动兜底(设置页):清空缓存后整页重载,确保载入当前安装版本 */
export async function hardReload(): Promise<void> {
  await purgeServiceWorkers().catch(() => false);
  location.reload();
}

export function setupServiceWorker(): void {
  if (!('serviceWorker' in navigator)) return;
  if (isNativeApp()) {
    void purgeServiceWorkers().catch(() => false);
    return;
  }
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => undefined);
  });
}
