<div align="center">

# 紫微斗数工作台

**确定性排盘 · 真太阳时 · 可溯源知识 · 合盘分析 · 多模型 AI 解读**

医哲未来人工智能研究院（IMPF-AI）参考实现

[在线体验](https://psknlr.github.io/ziweidoushu/) · [Android APK](../../releases/tag/apk-latest) · [架构设计](docs/ziwei-app-design-framework.md) · [Android 构建](docs/android.md)

</div>

> [!IMPORTANT]
> 本项目用于传统文化数字化研究、算法验证与软件工程实践。命理解读具有不确定性，仅供文化研究和自我认知参考，不构成医疗、投资、法律、婚姻或其他重大决策建议。

## 项目简介

紫微斗数工作台是医哲未来人工智能研究院开发的跨端工程参考项目，采用模块化架构，分层实现确定性排盘、真太阳时校正、流派配置、格局分析、知识检索、合盘与人工智能解读。项目支持网页、渐进式应用、容器及安卓部署，内置全国城市经纬度、可溯源知识库和多模型网关，并通过完整自动化测试保障核心算法稳定，适合命理数字化研究、教学演示与产品原型开发。

## 设计目标

本项目不把“排盘计算”和“语言模型解读”混为一体，而是将系统拆分为可验证的确定性层与可替换的生成式 AI 层：

- **排盘可复现**：出生输入、真太阳时校正、流派参数与内核版本随命盘保存。
- **规则可配置**：安星体系、年界、晚子时、四化表与亮度表均显式建模。
- **知识可追溯**：知识条目携带来源层级、出处、置信度及审核状态。
- **AI 可替换**：通过统一网关接入 MiniMax、Azure OpenAI、Poe、LiteLLM 或其他 OpenAI 兼容模型。
- **多端可运行**：同一套核心能力支持 Web、PWA、Docker 与 Capacitor Android。

## 核心能力

### 1. 确定性排盘内核

- 基于 `iztro 2.5.8` 封装实例化引擎，降低全局可变配置造成的跨实例污染。
- 内置“全书通行版”和“文墨中州版”两套预设，支持自定义流派参数。
- 提供真太阳时校正、均时差与经度差计算，并记录校正前后时刻及是否跨时辰。
- 内置 **3337 条**中国城市、区县经纬度数据，可离线查询。
- 支持大限、小限、流年、流月、流日、流时运限快照。
- 输出语言无关、可序列化的统一星盘数据结构，并生成稳定 `chartHash`。

### 2. 盘面分析与合盘

- 三方四正、借宫、四化叠加、星曜亮度与盘面信号提取。
- 内置 **34 个**格局定义，支持成立条件、加分条件与破格条件。
- 合盘包含命宫关系、年支合冲刑害、生年四化互飞及夫妻宫互参等确定性结果。
- 支持完整命盘及分析结果导出为 JSON，供外部智能体或研究工具继续处理。

### 3. 可溯源知识库

- 使用 Zod 对知识条目进行结构化校验。
- 当前包含 **376 条**知识条目，覆盖星曜、宫位、四化、组合、格局与运限等领域。
- 每条知识包含来源等级、出处、流派、置信度与审核状态。
- 内置 **15 类**解读技法，包括整体、婚恋、事业、生意、学业、健康、财帛、子女、父母、兄弟、人际、迁移、福德、大限和流年。
- 审核台账与内容哈希绑定；条目修改后，既有审核状态会自动失效，避免“审核后静默改写”。

### 4. 多模型 AI 网关

- 服务端完成盘面重算、知识检索、System Prompt 装配及 SSE 流式输出。
- API Key 默认保存在服务端环境变量中，不进入网页前端。
- 支持 MiniMax、Azure OpenAI、Poe、LiteLLM 与任意 OpenAI 兼容接口。
- 内置进程级 LRU + TTL 缓存，默认最多 500 条、有效期 24 小时。
- 支持单盘技法解读、自由提问及双盘合盘解读。

### 5. Web、PWA 与 Android

- React 19 + Vite 6 构建的 4×4 宫位工作台。
- SVG 三方四正联动与本命至流时的六级时间导航。
- 本地档案、多用户管理、双人合盘及双模型并行对比。
- 支持安装为 PWA；通过 Capacitor 7 封装 Android 原生工程。
- 排盘、档案与合盘可离线运行；AI 解读需要远程网关或用户自带模型接口。

## 系统架构

```mermaid
flowchart LR
    U[用户] --> W[Web / PWA / Android]
    W --> C[@ziwei/core\n排盘与分析]
    W --> K[@ziwei/knowledge\n知识检索与 Prompt]
    W --> L[(localStorage\n档案与直连配置)]

    W -->|网关模式| G[@ziwei/gateway]
    G --> C
    G --> K
    G --> M[LLM Provider]

    W -->|直连模式| M

    M --> MM[MiniMax]
    M --> AZ[Azure OpenAI]
    M --> PO[Poe]
    M --> LL[LiteLLM]
    M --> OA[OpenAI-compatible]
```

## 仓库结构

```text
ziweidoushu-main/
├── apps/
│   └── web/                    # React Web、PWA 与 Capacitor Android
├── packages/
│   ├── core/                   # 排盘内核、真太阳时、分析器、导出
│   ├── knowledge/              # 知识库、检索、技法、Prompt、审核台账
│   └── gateway/                # 多模型 AI 网关、SSE、缓存、静态托管
├── docs/
│   ├── ziwei-app-design-framework.md
│   └── android.md
├── examples/                   # 端到端演示
├── scripts/                    # 黄金命例与知识审核脚本
├── .github/workflows/          # CI、Pages 与 Android APK 构建
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 技术栈

| 层级 | 技术 |
|---|---|
| 语言与工程 | TypeScript 5.6、Node.js 22、npm workspaces |
| 前端 | React 19、Vite 6、PWA |
| Android | Capacitor 7、Gradle |
| 排盘内核 | iztro 2.5.8 |
| 数据校验 | Zod 3 |
| 服务端 | Node.js 原生 HTTP、SSE |
| 测试 | Vitest 3 |
| 部署 | Docker、Docker Compose、GitHub Pages、GitHub Actions |

## 当前质量状态

以下结果基于本仓库当前快照实际核验：

| 检查项 | 结果 |
|---|---:|
| TypeScript 类型检查 | 通过 |
| 自动化测试 | **14 个测试文件，151 项测试全部通过** |
| Web 生产构建 | 通过 |
| 黄金命例回归 | 55 项 |
| 城市经纬度记录 | 3337 条 |
| 格局定义 | 34 个 |
| 知识条目 | 376 条 |
| 知识审核状态 | 369 draft / 5 reviewed / 2 verified |
| 解读技法 | 15 类 |

> [!NOTE]
> 当前 Web 主 JavaScript 产物约 1.23 MB（gzip 约 383 KB），Vite 会提示大包警告。后续可通过动态导入、知识库分块和手动拆包降低首屏体积。

## 快速开始

### 环境要求

- Node.js 22 或更高版本
- npm 10 或更高版本
- Android 构建另需 JDK 17+ 与 Android SDK

### 安装与验证

```bash
npm ci
npm run typecheck
npm test
npm run demo
```

### 启动纯前端工作台

```bash
npm run web
```

访问 `http://localhost:5173`。排盘、真太阳时、运限、档案和本地合盘可直接使用；网关模式的 AI 解读需要另行启动服务端。

### 启动完整工作台

终端一：配置模型并启动网关。

```bash
export ZIWEI_PROVIDER=minimax
export MINIMAX_API_KEY=your_api_key
npm run gateway
```

Windows PowerShell：

```powershell
$env:ZIWEI_PROVIDER = "minimax"
$env:MINIMAX_API_KEY = "your_api_key"
npm run gateway
```

终端二：启动前端。

```bash
npm run web
```

默认地址：

- Web：`http://localhost:5173`
- Gateway：`http://localhost:8787`
- 健康检查：`http://localhost:8787/api/health`
- 缓存状态：`http://localhost:8787/api/cache/stats`

## 模型供应商配置

通过 `ZIWEI_PROVIDER` 选择供应商：

| 供应商 | `ZIWEI_PROVIDER` | 必填环境变量 | 可选环境变量 |
|---|---|---|---|
| MiniMax | `minimax` | `MINIMAX_API_KEY` | `MINIMAX_BASE_URL`、`MINIMAX_MODEL` |
| Azure OpenAI | `azure` | `AZURE_OPENAI_ENDPOINT`、`AZURE_OPENAI_API_KEY`、`AZURE_OPENAI_DEPLOYMENT` | `AZURE_OPENAI_API_VERSION` |
| Poe | `poe` | `POE_API_KEY` | `POE_BASE_URL`、`POE_MODEL` |
| LiteLLM | `litellm` | `LITELLM_API_KEY` | `LITELLM_BASE_URL`、`LITELLM_MODEL` |
| 自定义兼容接口 | `custom` | `OPENAI_API_KEY` | `OPENAI_BASE_URL`、`OPENAI_MODEL` |

前端还提供“直连模式”，可在界面内填写两个 OpenAI 兼容模型，用于单模型调用或双模型对比。直连配置保存在当前设备的 `localStorage` 中，仅建议在受信设备、Android App 或受控内部环境中使用。

## 编程接口示例

### 排盘与盘面分析

```ts
import { ZiweiEngine, PRESET_WENMO_ZHONGZHOU } from '@ziwei/core';

const engine = new ZiweiEngine(PRESET_WENMO_ZHONGZHOU);

const chart = engine.fromBirth({
  year: 1990,
  month: 1,
  day: 15,
  hour: 8,
  minute: 30,
  gender: 'male',
  city: '北京',
});

const features = engine.features(chart);
const horoscope = engine.horoscope(chart, '2026-06-01');

console.log(chart.meta.chartHash);
console.log(features.patterns);
console.log(horoscope);
```

### 知识检索与 Prompt 装配

```ts
import {
  ALL_ENTRIES,
  READING_SKILLS,
  buildSystemPrompt,
  retrieve,
} from '@ziwei/knowledge';

const skill = READING_SKILLS.career;
const retrieved = retrieve(features, ALL_ENTRIES, {
  topics: skill.topics,
});

const systemPrompt = buildSystemPrompt(
  chart,
  features,
  retrieved,
  { skill },
);
```

## Docker 部署

在仓库根目录创建 `.env`：

```dotenv
ZIWEI_PROVIDER=minimax
MINIMAX_API_KEY=your_api_key
MINIMAX_MODEL=MiniMax-Text-01
```

启动：

```bash
docker compose up -d --build
```

访问 `http://localhost:8787`。容器会由网关同时托管前端静态文件和 `/api`，避免跨域配置。

## Android 构建

```bash
npm ci
cd apps/web
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
```

调试 APK 位于：

```text
apps/web/android/app/build/outputs/apk/debug/app-debug.apk
```

正式上架前需配置 release keystore、版本号、隐私政策、应用签名及商店合规材料。完整步骤见 [Android 构建指南](docs/android.md)。

## 知识库审核

```bash
npx tsx scripts/review.ts stats
npx tsx scripts/review.ts list --domain pattern
npx tsx scripts/review.ts show star.qisha.soul
npx tsx scripts/review.ts approve star.qisha.soul --reviewer 张三 --verified
npx tsx scripts/review.ts audit
```

审核台账位于：

```text
packages/knowledge/review/ledger.json
```

知识条目内容被修改后，原审核记录会因哈希不一致而被标记为 stale，CI 审核将失败，直至重新审阅。

## 隐私与安全说明

- 本地档案、每日使用次数及直连模型配置保存在浏览器或 App 的 `localStorage` 中。
- 网关模式下，模型 API Key 保存在服务端环境变量中。
- **请求 AI 解读时会发送结构化命盘数据**；当前结构包含归一化阳历日期、时辰索引、性别、流派配置、宫位与星曜等信息。部署者应在隐私政策中明确说明数据字段、处理目的、模型供应商和保存期限。
- 直连模式会从用户设备直接请求第三方模型接口，API Key 存储于本机；公共或共享设备不建议使用。
- 当前网关默认允许跨域访问，且未内置用户认证、租户隔离或细粒度限流。生产部署应增加 HTTPS、反向代理、鉴权、速率限制、日志脱敏和滥用防护。
- 默认缓存为进程内存缓存，不写入磁盘；多实例或生产环境可替换为受控 Redis，并设置数据保留策略。

## 已知边界

1. 当前 376 条知识中有 369 条仍为 `draft`，数量不等于完成专家审核；正式产品应继续开展逐条校勘、流派标注与交叉验证。
2. 生成式 AI 只负责解释结构化结果，不能替代确定性排盘，也不能保证判断正确。
3. 当前前端主包较大，知识库与核心模块尚未按需加载。
4. 网关缺少生产级身份认证、持久化审计、分布式缓存与租户配额管理。
5. Android 工作流当前生成调试签名 APK；正式发布必须使用受控 release 签名。
6. 仓库包含若干第三方项目源码压缩包，仅作为调研存档，不属于运行时依赖，其版权与许可证归原作者所有。

## 建议路线图

- [ ] 完成 369 条 draft 知识的专家审核与证据复核。
- [ ] 为知识条目增加原文证据片段、版本信息和可定位页码。
- [ ] 增加 Playwright 端到端测试、无障碍测试与移动端回归测试。
- [ ] 拆分前端主包，实现知识库按主题和技法懒加载。
- [ ] 增加网关认证、限流、审计、密钥轮换与多租户隔离。
- [ ] 建立隐私政策、数据处理清单及模型供应商合规说明。
- [ ] 输出正式 npm 构建产物和稳定的公共 API 文档。
- [ ] 完成 Android release 签名、AAB 构建及应用商店发布流程。

## 第三方依赖与致谢

排盘内核依赖 [iztro](https://github.com/SylarLong/iztro)，黄金命例基准参考其官方测试资产。仓库中的调研压缩包涉及 iztro、dart_iztro、iztro_py、tianji 等第三方项目，使用或再分发时请分别遵循原项目许可证。

## 许可证

非商用，仅限个人研究使用。在此声明严防沉默推算。

---

<div align="center">

**IMPF-AI · Institute of Medical-Philosophy Future AI**

传统文化的数字化表达，应建立在可复现算法、可追溯知识与负责任使用之上。

</div>
