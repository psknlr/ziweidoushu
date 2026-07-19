/**
 * 人工审核流水线(L3)—— 台账制。
 *
 * 设计:条目源文件保持 draft;审核结果记录在 review/ledger.json 台账中,
 * 每条记录绑定审核时的 contentHash。加载知识库时套用台账:
 * - hash 匹配 → 条目升级为台账中的 reviewed/verified
 * - hash 不匹配(条目在审核后被修改)→ 保持 draft,并报告为 stale
 * 这使"verified 条目不可被静默修改"成为结构性保证而非纪律约定,
 * CI 中 review-pipeline.test.ts 强校验台账完整性。
 *
 * 审核操作使用 CLI:npx tsx scripts/review.ts --help
 */
import { stableHash } from '@ziwei/core';
import type { KnowledgeEntry } from './schema.js';

export interface ReviewRecord {
  /** 条目 id */
  id: string;
  status: 'reviewed' | 'verified';
  reviewer: string;
  /** ISO 日期 */
  date: string;
  note?: string;
  /** 审核时的条目内容哈希(entryContentHash) */
  contentHash: string;
}

export interface ReviewLedger {
  records: ReviewRecord[];
}

/** 条目内容哈希:实质内容变更(实体/文案/来源/置信度)即变化;id 与审核状态本身不参与 */
export function entryContentHash(entry: KnowledgeEntry): string {
  return stableHash({
    domain: entry.domain,
    entities: entry.entities,
    topics: entry.topics,
    content: entry.content,
    source: entry.source,
    confidence: entry.confidence,
  });
}

export interface ApplyResult {
  entries: KnowledgeEntry[];
  /** 台账中 hash 不匹配的条目 id(审核后被修改,已回退 draft,需重审) */
  stale: string[];
  /** 台账中引用了不存在条目的记录 id */
  unknown: string[];
}

/** 将审核台账套用到条目集,返回生效后的条目与异常清单 */
export function applyReviewLedger(entries: readonly KnowledgeEntry[], ledger: ReviewLedger): ApplyResult {
  const byId = new Map(ledger.records.map((r) => [r.id, r]));
  const seen = new Set<string>();
  const stale: string[] = [];

  const applied = entries.map((entry) => {
    const record = byId.get(entry.id);
    if (!record) return entry;
    seen.add(entry.id);
    if (entryContentHash(entry) !== record.contentHash) {
      stale.push(entry.id);
      return { ...entry, reviewStatus: 'draft' as const };
    }
    return { ...entry, reviewStatus: record.status };
  });

  return {
    entries: applied,
    stale,
    unknown: ledger.records.map((r) => r.id).filter((id) => !seen.has(id)),
  };
}
