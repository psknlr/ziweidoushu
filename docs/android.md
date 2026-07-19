# Android App 构建指南

工作台已通过 **Capacitor** 封装为原生 Android 工程(`apps/web/android/`)。
排盘引擎、全国城市真太阳时、六级运限下钻、本地档案与合盘全部**离线运行**于 WebView;
AI 解读在 App 内使用「直连模式」置入自己的 API Key(存于设备本地,无浏览器 CORS 限制),
或配置远程网关地址。

## 构建 APK

前置:Android Studio(或命令行 Android SDK + JDK 17)。

```bash
npm install                        # 仓库根目录
cd apps/web
npm run build                      # 构建 Web 产物 → dist/
npx cap sync android               # 拷贝产物与插件到原生工程

# 方式一:Android Studio
npx cap open android               # 打开工程,Run ▶ 即装机调试,Build → APK/AAB 发布

# 方式二:命令行
cd android
./gradlew assembleDebug            # 产物: app/build/outputs/apk/debug/app-debug.apk
./gradlew bundleRelease            # AAB(上架用,需配置签名)
```

## 签名发布(release)

在 `android/app/build.gradle` 的 `signingConfigs` 配置 keystore,或使用
Android Studio → Build → Generate Signed Bundle/APK 向导。

## App 内的 AI 通道

| 通道 | 配置 | 说明 |
|---|---|---|
| 直连模式(推荐) | App 内「AI 解读 → 模型配置」填 Base URL/模型/Key | Key 仅存设备 localStorage;WebView 无 CORS 限制,任何 OpenAI 兼容端点可用(含局域网 LiteLLM/Ollama 网关) |
| 远程网关 | 构建时注入 `VITE_GATEWAY_URL=https://你的网关` | Key 在服务端,见 docker 部署 |

## 多用户档案与本地配对

「本地档案」将多位用户出生资料存于设备(localStorage,随 App 数据保留);
勾选两人即可本地合盘(命宫/年支合冲刑害、四化互飞、夫妻宫互参为确定性计算,
不联网即可看结构结论;AI 深度合盘解读走上述任一通道)。

## 常见问题

- **改了 Web 代码 App 没变化**:重新 `npm run build && npx cap sync android`。
- **WebView 版本过旧**:Capacitor 要求 Android 5.1+ 且系统 WebView 较新;建议 Android 8+。
- **国产 ROM 网络权限**:直连模式首次调用若失败,检查系统是否拦截了 App 联网。
