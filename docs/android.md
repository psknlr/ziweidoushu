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
./gradlew assembleRelease          # 产物: app/build/outputs/apk/release/app-release.apk(内置分发密钥签名)
./gradlew assembleDebug            # 调试包同样用分发密钥签名,可与 CI 产物互相覆盖安装
./gradlew bundleRelease            # AAB(上架用,需用 Secrets/环境变量提供私有密钥)
```

## 签名与覆盖安装升级(不丢数据)

Android 只允许**同一签名密钥**且 **versionCode 递增**的 APK 覆盖安装;满足这两点,
档案/对话/设置(均在 WebView localStorage)在升级后原样保留。本仓库的做法:

| 项目 | 机制 |
|---|---|
| 签名 | `app/build.gradle` 的 `signingConfigs.dist`:优先读环境变量 `ZIWEI_KEYSTORE_FILE / ZIWEI_KEYSTORE_PASSWORD / ZIWEI_KEY_ALIAS / ZIWEI_KEY_PASSWORD`;未提供时回退到仓库内置分发密钥 `android/keystore/ziwei-dist.jks`(别名 `ziwei`,口令 `ziwei-dist-2026`) |
| 版本号 | `ZIWEI_VERSION_CODE`(CI 取 `1000 + GITHUB_RUN_NUMBER`)与 `ZIWEI_VERSION_NAME`(`包版本.构建号`,同时注入 `VITE_APP_VERSION` 显示在「设置 → 关于」) |
| CI | `.github/workflows/build-android.yml` 构建 `assembleRelease`,用 `apksigner` 校验签名后发布到 `apk-latest` |

内置分发密钥在公开仓库中,**只适用于侧载分发**(任何人都能用它签名)。正式上架请在 GitHub
仓库 Settings → Secrets 添加 `ANDROID_KEYSTORE_BASE64`(`base64 -w0 your.jks`)、
`ANDROID_KEYSTORE_PASSWORD`、`ANDROID_KEY_ALIAS`、`ANDROID_KEY_PASSWORD`,CI 会自动改用私有密钥;
注意换密钥后已装机的用户需卸载重装一次(可先用「设置 → 数据备份」导出再恢复)。

**从旧版升级**:2026-09-17 之前的 CI 产物每次构建用随机 debug 密钥签名,首次升级到稳定签名版本
必须先卸载旧版;旧版可在「智能体 → 历史 → 导出全部历史」保存对话,档案需重新录入。此后所有版本
均可直接覆盖安装。

## 数据备份

「设置 → 数据备份」可导出/导入全部本机数据(档案、对话、模型配置、通道与流派、研究权限)为 JSON;
移动端走系统分享面板保存到文件或云盘,导入支持「合并」(按 id 去重)与「整体替换」。

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
