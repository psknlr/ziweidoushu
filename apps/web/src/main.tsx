import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import { setupServiceWorker } from './lib/sw-lifecycle.js';
import './styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

// 网页 / PWA:注册随构建号更新的 Service Worker;Android App 内注销 SW 并清除旧缓存
if (import.meta.env.PROD) setupServiceWorker();
