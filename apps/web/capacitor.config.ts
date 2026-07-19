import type { CapacitorConfig } from '@capacitor/cli';

/**
 * Android/iOS 封装配置(Capacitor)。
 * 排盘/档案/合盘全部离线运行于 WebView;AI 走直连(App 内置入 Key,无浏览器
 * CORS 限制)或远程网关。构建步骤见 docs/android.md。
 */
const config: CapacitorConfig = {
  appId: 'com.ziwei.workbench',
  appName: '紫微斗数工作台',
  webDir: 'dist',
  android: {
    allowMixedContent: false,
  },
};

export default config;
