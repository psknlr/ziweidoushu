/**
 * 加权检索(L4 RAG 管线的检索段)。
 *
 * score = 信号权重 × 实体覆盖率 × 条目 confidence × 流派匹配系数
 * (紫微知道 retrieveGuidance 的评分思想,简化为可测的纯函数。)
 */
import type { ChartFeatures, Signal } from '@ziwei/core';
import type { KnowledgeEntry, Topic } from './schema.js';

export interface RetrievalOptions {
  /** 限定话题;缺省不过滤 */
  topics?: Topic[];
  /** 用户流派;条目声明了不同流派时降权 */
  school?: string;
  /** 返回条数上限 */
  limit?: number;
  /** 分数下限(0-100) */
  minScore?: number;
}

export interface RetrievedEntry {
  entry: KnowledgeEntry;
  score: number;
  /** 命中的信号(解释可追溯:为什么召回了这条知识) */
  matchedSignals: Signal[];
}

const SCHOOL_MISMATCH_FACTOR = 0.5;

export function retrieve(
  features: ChartFeatures,
  entries: readonly KnowledgeEntry[],
  options: RetrievalOptions = {},
): RetrievedEntry[] {
  const { topics, school, limit = 8, minScore = 10 } = options;

  const results: RetrievedEntry[] = [];
  for (const entry of entries) {
    if (topics && !entry.topics.some((t) => topics.includes(t))) continue;

    const matchedSignals = features.signals.filter((signal) => overlap(signal, entry) > 0);
    if (matchedSignals.length === 0) continue;

    const best = Math.max(...matchedSignals.map((s) => s.weight * overlap(s, entry)));
    const schoolFactor = entry.source.school && school && entry.source.school !== school ? SCHOOL_MISMATCH_FACTOR : 1;
    const score = best * entry.confidence * schoolFactor;
    if (score < minScore) continue;

    results.push({ entry, score: Math.round(score * 100) / 100, matchedSignals });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * 实体覆盖:精度优先,只认全覆盖(条目实体 ⊆ 信号实体 → 1,否则 0)。
 * 半覆盖会把"贪狼坐官禄"匹配到"贪狼坐财帛"、"廉贞坐命"匹配到"紫微坐命",
 * 星曜/宫位/格局 id 都是定位性实体,错一个语义就错。
 * 召回广度靠多粒度条目(星、星+宫、四化+宫…)与后续向量召回层解决,
 * 不靠放松符号匹配。
 */
function overlap(signal: Signal, entry: KnowledgeEntry): number {
  const signalSet = new Set(signal.entities);
  return entry.entities.every((e) => signalSet.has(e)) ? 1 : 0;
}
