/**
 * @ziwei/core —— 紫微斗数排盘内核(L1 + L2)。
 *
 * 分层与原则见 docs/ziwei-app-design-framework.md:
 * - 确定性排盘与概率性解读物理分离
 * - 流派即配置(SchoolConfig,实例隔离)
 * - 输出全部为语言无关 key 的可序列化结构
 */
export * from './keys.js';
export * from './types.js';
export * from './config.js';
export { ZiweiEngine, type BirthInput } from './engine.js';
export { ENGINE_ID, ENGINE_VERSION, KERNEL_ID } from './adapter.js';
export {
  analyze,
  summarizeBrightness,
  describeBrightness,
  BRIGHTNESS_SCORE,
  type BrightnessSummary,
  type BrightStarNote,
  surroundedIndexes,
  trineIndexes,
  soulPalaceIndex,
  fillBorrowedStars,
  SIHUA_TABLE,
  sihuaForStem,
  sihuaOverlay,
  evaluatePatterns,
  deriveSignals,
  type SihuaHit,
  type Condition,
  type PatternDef,
} from './analyzer/index.js';
export { STARTER_PATTERNS } from './data/patterns.js';
export { CLASSIC_PATTERNS } from './data/patterns-classic.js';
export { ALL_PATTERNS } from './analyzer/index.js';
export {
  equationOfTimeMinutes,
  toTrueSolarTime,
  timeIndexFromHour,
  normalizeBirth,
  dayOfYear,
  type TrueSolarTimeInput,
  type TrueSolarTimeOutput,
  type NormalizeBirthInput,
  type NormalizedBirth,
} from './solar-time.js';
export { CITIES, lookupCity, searchCities, cityLabel, type City } from './cities.js';
export { stableHash, stableStringify, fnv1a64 } from './hash.js';
