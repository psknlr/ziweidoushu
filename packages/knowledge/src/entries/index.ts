/**
 * 知识库总索引(318 条)。
 *
 * - CURATED_ENTRIES(7):人工精修,reviewed/verified
 * - 分域批量条目(311):初稿(draft),升级 reviewed/verified 须经人工审核;
 *   规模、zod 合法性、星×宫/四化×宫全覆盖由 library-scale.test.ts 在 CI 强校验
 */
import type { KnowledgeEntry } from '../schema.js';
import { CURATED_ENTRIES } from './curated.js';
import { SOUL_STAR_ENTRIES } from './star-soul.js';
import { STAR_PALACE_ENTRIES } from './star-palace.js';
import { MUTAGEN_PALACE_ENTRIES } from './mutagen-palace.js';
import { STAR_SIHUA_ENTRIES } from './star-sihua.js';
import { COMBO_SOUL_ENTRIES } from './combo-soul.js';
import { MINOR_SOUL_ENTRIES } from './minor-soul.js';
import { STAR_OVERVIEW_ENTRIES } from './star-overview.js';
import { PATTERN_EXTRA_ENTRIES } from './pattern-entries.js';

export { CURATED_ENTRIES };

export const ALL_ENTRIES: KnowledgeEntry[] = [
  ...CURATED_ENTRIES,
  ...SOUL_STAR_ENTRIES,
  ...STAR_PALACE_ENTRIES,
  ...MUTAGEN_PALACE_ENTRIES,
  ...STAR_SIHUA_ENTRIES,
  ...COMBO_SOUL_ENTRIES,
  ...MINOR_SOUL_ENTRIES,
  ...STAR_OVERVIEW_ENTRIES,
  ...PATTERN_EXTRA_ENTRIES,
];

/** 兼容旧名 */
export const STARTER_ENTRIES = CURATED_ENTRIES;
