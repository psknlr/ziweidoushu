# 紫微斗数 App —— 设计框架与参考实现

基于对 6 个开源紫微斗数项目(iztro、dart_iztro、iztro_py、tianji、紫微知道、王多鱼AI)的深度代码调研,
本仓库包含:

1. **设计框架文档**:[docs/ziwei-app-design-framework.md](docs/ziwei-app-design-framework.md)
   —— 五层架构(排盘内核 / 历法时空 / 知识库 / AI 解读 / 应用 UI)、六项设计原则、测试与合规策略、实施路线图。
2. **Phase 0 参考实现**(TypeScript monorepo,`packages/`):设计文档的核心主张全部落地为可运行、有测试的代码。

## 包结构

| 包 | 职责 | 对应设计层 |
|---|---|---|
| [`@ziwei/core`](packages/core) | 实例化排盘引擎(封装 iztro 2.5.8 并修复其全局可变配置缺陷)、真太阳时校正、离线城市库、盘面分析器(三方四正/借宫/四化叠加/格局三层判定)、RAG 加权信号 | L1 + L2 |
| [`@ziwei/knowledge`](packages/knowledge) | 可溯源知识条目 schema(zod)、300+ 条知识库(星×宫/四化×宫/星×四化/双星组合/格局)、精度优先加权检索、LLM System Prompt 五要素装配 | L3 + L4 |
| [`@ziwei/gateway`](packages/gateway) | 服务端 AI 解读网关:RAG + Prompt 装配在服务端完成,多供应商流式适配(MiniMax / Azure OpenAI / Poe / LiteLLM / 任意 OpenAI 兼容),Key 永不进前端 | L4 |
| [`@ziwei/web`](apps/web) | 星盘工作台:传统 4×4 宫格、点击宫位 SVG 三方四正联动、本命/大限/流年切换与四化叠加、真太阳时提示、AI 流式解读 | L5 |

## 快速开始

```bash
npm install
npm test        # 120+ 测试:54 黄金命例回归 / 实例隔离 / 真太阳时 / 格局引擎 / 知识库 lint+覆盖率 / 网关(mock 上游)
npm run demo    # 端到端:出生信息 → 真太阳时 → 排盘 → 格局/信号 → 检索 → System Prompt
npm run typecheck
npm run golden  # 重新生成黄金命例基准(需在 PR 中说明理由)

# 启动工作台(两个终端)
export MINIMAX_API_KEY=...   # 或 POE_API_KEY / LITELLM_* / AZURE_OPENAI_* / OPENAI_*
npm run gateway              # AI 网关 :8787(ZIWEI_PROVIDER 可指定 minimax|azure|poe|litellm|custom)
npm run web                  # 前端 :5173(/api 代理到网关)
```

## 知识库审核流水线

批量条目默认 `draft`;审核状态记录在 `packages/knowledge/review/ledger.json` 台账,与条目
**内容哈希**绑定 —— 条目在审核后被修改,审核自动失效(CI 报 stale),杜绝"已审核"内容被静默篡改:

```bash
npx tsx scripts/review.ts stats                 # 各状态统计
npx tsx scripts/review.ts list --domain pattern # 待审核清单
npx tsx scripts/review.ts show star.qisha.soul  # 查看条目全文与台账状态
npx tsx scripts/review.ts approve star.qisha.soul --reviewer 张三 [--verified] [--note 备注]
npx tsx scripts/review.ts audit                 # 台账健康检查(CI 同款)
```

## 部署

**方式一:单容器(完整功能,推荐)** —— 网关同时托管前端静态文件与 `/api`,同源单进程:

```bash
docker compose up -d --build     # 读取 .env 中的供应商 Key
# 或
docker build -t ziwei-app . && docker run -p 8787:8787 -e MINIMAX_API_KEY=xxx ziwei-app
```

打开 `http://localhost:8787` 即为完整工作台。解读结果按
`(星盘内容, 话题, 问题, 供应商, 模型, promptVersion)` 缓存(LRU+TTL,`/api/cache/stats` 可观测)。

**方式二:GitHub Pages(纯静态)** —— 排盘/三方四正/运限下钻全端侧可用,零服务器成本;
AI 解读需另行部署网关并在仓库 Variables 配置 `ZIWEI_GATEWAY_URL`(构建时注入)。
在仓库 Settings → Pages 将 Source 设为 "GitHub Actions" 后,推送 main 即自动部署
(工作流:`.github/workflows/deploy-pages.yml`)。

### 排盘(实例化引擎,多流派并存互不污染)

```ts
import { ZiweiEngine, PRESET_WENMO_ZHONGZHOU } from '@ziwei/core';

const engine = new ZiweiEngine(PRESET_WENMO_ZHONGZHOU); // 或自定义 SchoolConfig
const chart = engine.fromBirth({
  year: 1990, month: 1, day: 15, hour: 8, minute: 30,
  gender: 'male',
  city: '北京',              // 离线城市库 → 真太阳时校正,校正记录随盘返回
});

const features = engine.features(chart);           // 格局 + 三方四正 + RAG 信号
const horoscope = engine.horoscope(chart, '2026-6-1'); // 大限~流时(按盘上配置快照,可复现)
```

### 解读 Prompt(确定性排盘 + 可溯源知识 → LLM)

```ts
import { retrieve, buildSystemPrompt, STARTER_ENTRIES } from '@ziwei/knowledge';

const retrieved = retrieve(features, STARTER_ENTRIES, { topics: ['career'] });
const systemPrompt = buildSystemPrompt(chart, features, retrieved);
// → 交给任意 LLM(服务端网关);输出结构、语言风格、免责声明均已约束
```

## 设计原则(详见设计文档)

1. **确定性与解释性分离** —— 排盘是纯函数,解读是概率性的,物理分层。
2. **流派即配置** —— 年分界/晚子时/四化表等分歧点显式建模,实例隔离,绝不硬编码。
3. **知识可溯源** —— 每条断语带来源等级、出处、置信度、审核状态,CI 强校验。
4. **中文语义、多语呈现** —— 内部全部使用语言无关 key,词表漂移由适配层大声报错。
5. **隐私默认** —— 端侧排盘;AI 只上传结构化星盘特征,不传原始生日。
6. **文档即代码** —— 架构决策与代码同仓同步。

## 仓库其他内容

- `*.zip` / `*.tar.gz`:调研用的 6 个开源项目源码存档(licenses 归各自作者)。
- 排盘内核依赖 [iztro](https://github.com/SylarLong/iztro)(MIT),黄金命例基准取自其官方测试套件。

## 路线图

Phase 0(本次):内核奠基 ✅ → Phase 1:星盘工作台 UI + 服务端 AI 网关 → Phase 2:人生K线/合盘/格局库扩至 60-80 → Phase 3:百科/古籍/多端。详见设计文档 §12。
