/**
 * 知识库总索引。
 * CURATED_ENTRIES:人工精修条目(reviewed/verified);
 * 其余为分域批量条目(draft,待人工审核升级)。
 */
import { CURATED_ENTRIES } from './curated.js';
import type { KnowledgeEntry } from '../schema.js';

export { CURATED_ENTRIES };

/** 全库(合并去重责任在 validateEntries,CI 强校验) */
export const ALL_ENTRIES: KnowledgeEntry[] = [...CURATED_ENTRIES];

/** 兼容旧名 */
export const STARTER_ENTRIES = CURATED_ENTRIES;
