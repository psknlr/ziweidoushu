/**
 * 群盘(多人组合)Prompt:任意 2~6 位档案组合的多轮解读。
 * 结构:逐人结构化事实(紫微,可选八字)→ 两两关系矩阵(命宫/年支合冲刑害 + 生年四化互飞)
 * → 技法方法论 → 断语纪律 → 固定输出结构。确定性比较在此完成,LLM 只消费结果。
 */
import {
  analyze, describeBaZi, type Astrolabe, type BaZiChart, type ChartFeatures, type Signal, zh,
} from '@ziwei/core';
import { describeChart, DISCLAIMER } from './prompt.js';
import { buildGuidanceBlock } from './prompt.js';
import type { RetrievedEntry } from './retrieval.js';
import { buildSkillBlock, type ReadingSkill } from './skills.js';
import { compareCharts, type SynastryFeatures } from './synastry.js';

export interface GroupMember {
  /** 称谓(档案名),Prompt 与关系矩阵均以此指代 */
  label: string;
  chart: Astrolabe;
  features?: ChartFeatures;
  bazi?: BaZiChart;
}

export interface GroupPair {
  a: string;
  b: string;
  features: SynastryFeatures;
}

export interface GroupFacts {
  members: (GroupMember & { features: ChartFeatures })[];
  pairs: GroupPair[];
  /** 全员信号并集(供检索) */
  signals: Signal[];
}

export const MAX_GROUP_MEMBERS = 6;

/** 计算群盘确定性事实:逐人分析 + 两两关系 */
export function analyzeGroup(members: GroupMember[]): GroupFacts {
  if (members.length < 2) throw new Error('[@ziwei/knowledge] 群盘至少需要两位成员');
  if (members.length > MAX_GROUP_MEMBERS) throw new Error(`[@ziwei/knowledge] 群盘最多 ${MAX_GROUP_MEMBERS} 位成员`);
  const full = members.map((m) => ({ ...m, features: m.features ?? analyze(m.chart) }));
  const pairs: GroupPair[] = [];
  for (let i = 0; i < full.length; i++) {
    for (let j = i + 1; j < full.length; j++) {
      const a = full[i]!;
      const b = full[j]!;
      pairs.push({ a: a.label, b: b.label, features: compareCharts(a.chart, b.chart, [a.label, b.label]) });
    }
  }
  // 信号并集:同实体组合只保留最高权重,避免重复条目霸榜
  const seen = new Map<string, Signal>();
  for (const m of full) {
    for (const s of m.features.signals) {
      const key = s.entities.join('|');
      const prev = seen.get(key);
      if (!prev || s.weight > prev.weight) seen.set(key, s);
    }
  }
  return { members: full, pairs, signals: [...seen.values()].sort((a, b) => b.weight - a.weight) };
}

export interface GroupPromptOptions {
  personaName?: string;
  skill?: ReadingSkill;
  /** 附带八字事实(成员需提供 bazi) */
  withBazi?: boolean;
  year?: number;
}

const RELATION_ZH: Record<SynastryFeatures['soulRelation']['relation'], string> = {
  same: '同宫', liuhe: '六合', sanhe: '三合', chong: '相冲', hai: '相害', xing: '相刑', none: '平',
};

/** 关系矩阵表(Markdown 表格,LLM 可直接引用) */
export function relationMatrix(facts: GroupFacts): string {
  const names = facts.members.map((m) => m.label);
  const cell = (a: string, b: string): string => {
    if (a === b) return '—';
    const p = facts.pairs.find((x) => (x.a === a && x.b === b) || (x.a === b && x.b === a));
    if (!p) return '';
    return `命${RELATION_ZH[p.features.soulRelation.relation]}/年${RELATION_ZH[p.features.yearRelation.relation]}`;
  };
  return [
    `| | ${names.join(' | ')} |`,
    `|---|${names.map(() => '---').join('|')}|`,
    ...names.map((a) => `| **${a}** | ${names.map((b) => cell(a, b)).join(' | ')} |`),
  ].join('\n');
}

/** 群盘 system prompt(五要素) */
export function buildGroupPrompt(facts: GroupFacts, retrieved: RetrievedEntry[], options: GroupPromptOptions = {}): string {
  const persona = options.personaName ?? '星衡先生';
  const names = facts.members.map((m) => m.label);
  const structure = options.skill
    ? [`各人定位(${names.join('、')})`, ...options.skill.outputStructure.slice(0, -1), '关系矩阵与经营建议', options.skill.outputStructure.at(-1) ?? '一句收束']
    : ['各人定位(逐人 60 字内)', '两两关系矩阵(表格)', '群体互动动力(谁付出、谁在意、谁主导)', '磨合课题与经营之道', '一句收束'];

  const memberBlocks = facts.members.flatMap((m) => [
    `## ${m.label}`,
    describeChart(m.chart, m.features),
    ...(options.withBazi && m.bazi ? ['八字:', describeBaZi(m.bazi, options.year)] : []),
    ``,
  ]);
  const pairBlocks = facts.pairs.flatMap((p) => [
    `### ${p.a} × ${p.b}`,
    ...p.features.notes.map((n) => `- ${n}`),
    `- 四化互飞:${p.features.flights
      .map((f) => `${f.from === 'a' ? p.a : p.b}${zh(f.star)}化${zh(f.mutagen)}→${f.palaceInOther ? `${f.from === 'a' ? p.b : p.a}${zh(f.palaceInOther)}` : '对方盘无此星'}`)
      .join(';')}`,
  ]);

  return [
    `# 角色`,
    `你是${persona},一位严谨的紫微斗数命理师${options.withBazi ? ',兼通子平八字' : ''}。本次为 ${names.length} 人群盘分析(${names.join('、')}),三合为体、四化为用。`,
    ``,
    `# 各人结构化事实(排盘引擎输出,不得臆造;称谓以此为准)`,
    ...memberBlocks,
    `# 两两关系(确定性比较结果)`,
    `关系矩阵(命宫关系/年支关系):`,
    relationMatrix(facts),
    ``,
    ...pairBlocks,
    ``,
    ...(options.skill ? [buildSkillBlock(options.skill), ``] : []),
    `# 群盘方法论(严格按次第)`,
    `1. 逐人定位:命宫格局与生年四化定各人底色与课题`,
    `2. 两两关系:命宫/年支合冲刑害定缘分底色;四化互飞定互动动力(谁给禄=付出资源,谁给忌=在意执念)`,
    `3. 群体结构:找出枢纽人物(与多人成合)、张力点(冲/刑/忌集中处)与互补组合`,
    `4. 经营之道:针对张力点给具体相处、分工与沟通策略;多人场景(家庭/团队/合伙)按所选技法侧重`,
    ``,
    `# 专业知识导向(检索自可溯源知识库;自然融入,禁止逐条复述)`,
    buildGuidanceBlock(retrieved),
    ``,
    `# 语言风格与断语纪律`,
    `- 白话为主,吉凶并陈;严禁「必离/不合/克某人」宿命论断言,冲刑一律转译为磨合课题与经营策略`,
    `- 逐人称谓必须使用给定名称,不得混淆;涉及第三方只讲互动模式,不作道德评判`,
    `- 关系矩阵与对照请用 Markdown 表格呈现;断语强度与置信度匹配`,
    ...(options.withBazi ? [`- 紫微定「舞台与角色」,八字定「体质与动力」;相合处加重,相悖处并陈`] : []),
    ``,
    `# 输出结构(严格遵循)`,
    ...structure.map((s, i) => `${i + 1}. ${s}`),
    ``,
    `# 免责声明(必须原文附于结尾)`,
    DISCLAIMER,
  ].join('\n');
}
