/**
 * 审核流水线测试:台账套用、内容哈希失效、CI 台账健康强校验。
 */
import { describe, expect, test } from 'vitest';
import {
  applyReviewLedger,
  entryContentHash,
  RAW_ENTRIES,
  REVIEW_APPLY_RESULT,
  REVIEW_LEDGER,
  entry,
  type ReviewLedger,
} from '@ziwei/knowledge';

const sample = entry({
  id: 'test.sample',
  domain: 'star',
  entities: ['ziweiMaj', 'soulPalace'],
  topics: ['overview'],
  summary: '测试条目摘要,长度符合规范要求。',
  detail: '这是一条仅用于审核流水线单元测试的条目,内容稳定,用于验证哈希与台账套用逻辑的正确性表现。',
});

describe('台账套用逻辑', () => {
  test('hash 匹配 → 升级为台账状态', () => {
    const ledger: ReviewLedger = {
      records: [
        { id: 'test.sample', status: 'verified', reviewer: '测试员', date: '2026-07-19', contentHash: entryContentHash(sample) },
      ],
    };
    const result = applyReviewLedger([sample], ledger);
    expect(result.entries[0]!.reviewStatus).toBe('verified');
    expect(result.stale).toHaveLength(0);
    expect(result.unknown).toHaveLength(0);
  });

  test('内容变更 → 审核失效,回退 draft 并报 stale', () => {
    const ledger: ReviewLedger = {
      records: [
        { id: 'test.sample', status: 'verified', reviewer: '测试员', date: '2026-07-19', contentHash: entryContentHash(sample) },
      ],
    };
    const tampered = { ...sample, content: { ...sample.content, summary: '被悄悄改掉的摘要,审核必须失效。' } };
    const result = applyReviewLedger([tampered], ledger);
    expect(result.entries[0]!.reviewStatus).toBe('draft');
    expect(result.stale).toEqual(['test.sample']);
  });

  test('台账指向不存在的条目 → 报 unknown', () => {
    const ledger: ReviewLedger = {
      records: [{ id: 'no.such.entry', status: 'reviewed', reviewer: 'x', date: '2026-07-19', contentHash: 'deadbeef' }],
    };
    expect(applyReviewLedger([sample], ledger).unknown).toEqual(['no.such.entry']);
  });

  test('contentHash 对 id/审核状态不敏感,对实质内容敏感', () => {
    expect(entryContentHash({ ...sample, id: 'renamed' })).toBe(entryContentHash(sample));
    expect(entryContentHash({ ...sample, reviewStatus: 'verified' })).toBe(entryContentHash(sample));
    expect(entryContentHash({ ...sample, confidence: 0.9 })).not.toBe(entryContentHash(sample));
    expect(
      entryContentHash({ ...sample, source: { ...sample.source, ref: '换了出处' } }),
    ).not.toBe(entryContentHash(sample));
  });
});

describe('生产台账健康(CI 强校验)', () => {
  test('无 stale(已审核条目未被改动)、无 unknown(无悬空记录)', () => {
    expect(REVIEW_APPLY_RESULT.stale, `以下条目在审核后被修改,需重审: ${REVIEW_APPLY_RESULT.stale.join(', ')}`).toHaveLength(0);
    expect(REVIEW_APPLY_RESULT.unknown, `台账悬空记录: ${REVIEW_APPLY_RESULT.unknown.join(', ')}`).toHaveLength(0);
  });

  test('台账记录字段完整(责任落名)', () => {
    for (const r of REVIEW_LEDGER.records) {
      expect(r.reviewer.length).toBeGreaterThan(0);
      expect(r.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(r.contentHash).toMatch(/^[0-9a-f]{16}$/);
    }
  });

  test('源文件中的 reviewed/verified 仅限 curated(批量条目必须走台账升级)', () => {
    const inSource = RAW_ENTRIES.filter((e) => e.reviewStatus !== 'draft');
    for (const e of inSource) {
      expect(
        ['star.ziwei.soul', 'star.tanlang.wealth', 'mutagen.ji.spouse', 'mutagen.lu.career', 'pattern.huo-tan', 'pattern.jiyue-tongliang', 'combination.empty-soul-borrow'],
        `条目 ${e.id} 在源文件直接标记 ${e.reviewStatus},批量条目应通过审核台账升级`,
      ).toContain(e.id);
    }
  });
});
