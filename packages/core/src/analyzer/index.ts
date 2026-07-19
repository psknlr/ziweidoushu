/**
 * 盘面分析器(Analyzer):把"命理师的眼睛"代码化。
 * 排盘之上、解读之下的确定性结构分析,输出 ChartFeatures 供 RAG 与 UI 共用。
 */
import type { Astrolabe, ChartFeatures } from '../types.js';
import { STARTER_PATTERNS } from '../data/patterns.js';
import { evaluatePatterns, type PatternDef } from './patterns.js';
import { buildFeatures } from './signals.js';

export { surroundedIndexes, trineIndexes, soulPalaceIndex } from './surround.js';
export { fillBorrowedStars } from './borrow.js';
export { SIHUA_TABLE, sihuaForStem, sihuaOverlay, type SihuaHit } from './sihua.js';
export { evaluatePatterns, type Condition, type PatternDef } from './patterns.js';
export { deriveSignals } from './signals.js';

/** 全量分析:格局匹配 + 三方四正 + RAG 信号 */
export function analyze(chart: Astrolabe, patternDefs: readonly PatternDef[] = STARTER_PATTERNS): ChartFeatures {
  const patterns = evaluatePatterns(chart, patternDefs);
  return buildFeatures(chart, patterns);
}
