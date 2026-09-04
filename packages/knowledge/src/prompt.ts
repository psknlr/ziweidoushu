/**
 * Prompt 装配(L4)—— 五要素规范(设计文档 §7.3):
 * 1 人格与师承 / 2 知识注入 / 3 语言风格约束 / 4 固定输出结构 / 5 强制免责声明。
 *
 * 装配结果是纯文本 system prompt,与具体 LLM 供应商解耦;
 * promptVersion 纳入解读缓存 key,变更必须升版本。
 */
import { describeBaZi, describeBrightness, zh, type Astrolabe, type BaZiChart, type ChartFeatures } from '@ziwei/core';
import type { RetrievedEntry } from './retrieval.js';
import { buildSkillBlock, type ReadingSkill } from './skills.js';

export const PROMPT_VERSION = '0.3.0';

export interface PromptOptions {
  /** 命理师人设名 */
  personaName?: string;
  /** 流派立场声明 */
  schoolStatement?: string;
  /** 解读技法(注入方法论与专属输出结构) */
  skill?: ReadingSkill;
  /** 附带八字(四柱)事实,做紫微 + 八字双系统互参 */
  bazi?: BaZiChart;
  /** 关注的流年(八字流年与大运定位) */
  year?: number;
}

/** 双系统互参纪律 */
const DUAL_SYSTEM_DISCIPLINE = [
  '- 双系统互参:紫微以宫位星曜定「舞台与角色」,八字以日主十神定「体质与动力」;二者相合处加重断语,相悖处并陈并说明各自依据,不得强行统一。',
  '- 八字部分以旺衰、格局、用神为纲,神煞只作辅助标签;五行缺项只是表面计数,禁止「缺什么补什么」式话术。',
];

export const DISCLAIMER =
  '命理解读仅供参考与自我认知探索,不构成医疗、投资、法律或任何重大决策建议;请理性看待,人生选择始终在自己手中。';

/** 星盘 → 结构化文字摘要(只描述事实,不做吉凶判断) */
export function describeChart(chart: Astrolabe, features: ChartFeatures): string {
  const soul = chart.palaces[features.soulSurround.target];
  const lines: string[] = [];
  lines.push(
    `性别:${zh(chart.gender)};阳历 ${chart.solarDate};农历 ${chart.lunarDate};` +
      `年柱 ${zh(chart.ganzhi.year.stem)}${zh(chart.ganzhi.year.branch)};五行局:${zh(chart.fiveElementsClass)};` +
      `命主:${zh(chart.soul)};身主:${zh(chart.body)}`,
  );
  if (chart.meta.input.trueSolarTime.enabled) {
    const t = chart.meta.input.trueSolarTime;
    lines.push(`已按真太阳时校正(偏移 ${t.totalOffsetMinutes} 分钟${t.timeIndexChanged ? ',时辰因此改变' : ''})。`);
  }
  if (soul) {
    const majors = soul.majorStars.filter((s) => s.type === 'major');
    const desc =
      majors.length > 0
        ? majors
            .map(
              (s) =>
                `${zh(s.key)}${s.brightness ? `(${zh(s.brightness)})` : ''}${s.mutagen ? `化${zh(s.mutagen)}` : ''}`,
            )
            .join('、')
        : soul.borrowed
          ? `无主星,借对宫${soul.borrowed.stars.map((s) => zh(s.key)).join('、')}`
          : '无主星';
    lines.push(`命宫在${zh(soul.branch)},${desc}。`);
  }
  for (const p of features.patterns) {
    lines.push(
      `格局【${p.name}】成立` +
        (p.bonusHits.length > 0 ? `;加分:${p.bonusHits.join(';')}` : '') +
        (p.brokenBy.length > 0 ? `;破格:${p.brokenBy.join(';')}` : '') +
        `(出处:${p.source})`,
    );
  }
  const brightness = describeBrightness(features.brightness);
  if (brightness) {
    lines.push('星曜亮度总览(庙旺得利平不陷):');
    lines.push(brightness);
  }
  return lines.join('\n');
}

/** 检索结果 → 知识导向区块(要求 LLM 自然融入,不逐条复述) */
export function buildGuidanceBlock(retrieved: RetrievedEntry[]): string {
  if (retrieved.length === 0) return '(本盘暂无高置信知识条目命中,请仅基于盘面事实稳妥解读。)';
  return retrieved
    .map((r) => {
      const g = r.entry.content.guidance;
      const parts = [
        `- ${r.entry.content.summary}`,
        `  依据:${r.entry.source.ref}(置信度 ${r.entry.confidence})`,
        `  详述:${r.entry.content.detail}`,
      ];
      if (g) {
        if (g.focus.length > 0) parts.push(`  应强调:${g.focus.join(';')}`);
        if (g.nuance.length > 0) parts.push(`  分寸:${g.nuance.join(';')}`);
        if (g.avoid.length > 0) parts.push(`  禁止:${g.avoid.join(';')}`);
      }
      return parts.join('\n');
    })
    .join('\n');
}

/** 装配完整 system prompt(五要素) */
export function buildSystemPrompt(
  chart: Astrolabe,
  features: ChartFeatures,
  retrieved: RetrievedEntry[],
  options: PromptOptions = {},
): string {
  const persona = options.personaName ?? '星衡先生';
  const school =
    options.schoolStatement ??
    `本盘按「${chart.meta.school.preset}」配置排出(安星:${chart.meta.school.algorithm === 'zhongzhou' ? '中州派' : '全书通行版'};年分界:${chart.meta.school.yearDivide === 'exact' ? '立春' : '正月初一'};晚子时:${chart.meta.school.dayDivide === 'forward' ? '归次日' : '归当日'})。三合为体、四化为用。`;

  const structure = options.skill
    ? options.skill.outputStructure
    : ['命格总断(150字内)', '事业与财运', '婚姻与情感', '健康与家庭', '隐忧与建议', '一句收束(命格金句)'];

  return [
    `# 角色`,
    `你是${persona},一位严谨的紫微斗数命理师${options.bazi ? ',兼通子平八字' : ''}。${school}`,
    ``,
    `# 本盘结构化事实(排盘引擎输出,不得自行重排或臆造星曜)`,
    describeChart(chart, features),
    ``,
    ...(options.bazi
      ? [`# 八字(四柱)结构化事实(与紫微盘同一出生时刻排出,不得自行重排)`, describeBaZi(options.bazi, options.year), ``]
      : []),
    ...(options.skill ? [buildSkillBlock(options.skill), ``] : []),
    `# 专业知识导向(检索自可溯源知识库;请自然融入论述,禁止逐条复述或罗列出处)`,
    buildGuidanceBlock(retrieved),
    ``,
    `# 语言风格`,
    `- 白话为主,术语首次出现时随手解释;吉凶并陈,不恐吓、不谄媚、不宿命论。`,
    `- 禁用"能量""磁场""宇宙频率"等身心灵话术。`,
    `- 断语强度与知识置信度匹配:低置信度用"倾向/可能",高置信度方可用确定语气。`,
    `- ${features.brightness.discipline}`,
    ...(options.bazi ? DUAL_SYSTEM_DISCIPLINE : []),
    ``,
    `# 输出结构(严格遵循)`,
    ...structure.map((s, i) => `${i + 1}. ${s}`),
    ``,
    `# 免责声明(必须原文附于结尾)`,
    DISCLAIMER,
  ].join('\n');
}

/** 纯八字解读的 system prompt(五要素结构) */
export function buildBaZiPrompt(
  bazi: BaZiChart,
  retrieved: RetrievedEntry[],
  options: PromptOptions = {},
): string {
  const persona = options.personaName ?? '星衡先生';
  const structure = options.skill
    ? options.skill.outputStructure
    : ['日主与命局总断(150 字内)', '旺衰、格局与用神', '性情与天赋(十神视角)', '事业财运与感情家庭', '大运走势与阶段策略', '一句收束'];
  return [
    `# 角色`,
    `你是${persona},一位严谨的子平八字命理师。以《子平真诠》取格用神、《滴天髓》旺衰体用、《穷通宝鉴》调候为法,神煞仅作辅助。`,
    ``,
    `# 八字结构化事实(排盘引擎输出,不得自行重排或臆造;旺衰/格局/用神为算法初判,可在论证后修正但须说明理由)`,
    describeBaZi(bazi, options.year),
    ``,
    ...(options.skill ? [buildSkillBlock(options.skill), ``] : []),
    `# 专业知识导向(检索自可溯源知识库;请自然融入论述,禁止逐条复述或罗列出处)`,
    buildGuidanceBlock(retrieved),
    ``,
    `# 语言风格`,
    `- 白话为主,术语首次出现时随手解释;吉凶并陈,不恐吓、不谄媚、不宿命论。`,
    `- 禁用"能量""磁场""宇宙频率"等身心灵话术;五行缺项只是表面计数,禁止「缺什么补什么」。`,
    `- 断语强度与知识置信度匹配:低置信度用"倾向/可能",高置信度方可用确定语气;格局与旺衰均为推断。`,
    ``,
    `# 输出结构(严格遵循)`,
    ...structure.map((s, i) => `${i + 1}. ${s}`),
    ``,
    `# 免责声明(必须原文附于结尾)`,
    DISCLAIMER,
  ].join('\n');
}
