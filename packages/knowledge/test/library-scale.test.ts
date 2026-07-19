/**
 * 知识库规模与覆盖率(CI 知识库 lint 的一部分):
 * - 全库 ≥ 300 条且全部通过 zod 校验、id 唯一
 * - 14 主星 × 12 宫全覆盖;四化 × 12 宫全覆盖
 * - 实体 key 全部指向内核注册表(防拼写漂移)
 */
import { describe, expect, test } from 'vitest';
import {
  MAJOR_STARS,
  MUTAGENS,
  PALACES,
  STAR_KEY_SET,
  MUTAGEN_KEY_SET,
  PALACE_KEY_SET,
} from '@ziwei/core';
import { ALL_ENTRIES, validateEntries } from '@ziwei/knowledge';

describe('知识库规模', () => {
  test('全库 ≥ 300 条,zod 全通过,id 唯一', () => {
    const validated = validateEntries(ALL_ENTRIES);
    expect(validated.length).toBeGreaterThanOrEqual(300);
  });

  test('实体 key 全部合法(星/宫/四化/格局约定)', () => {
    const KNOWN_EXTRA = new Set(['emptyPalace', 'pattern']);
    for (const e of ALL_ENTRIES) {
      for (const entity of e.entities) {
        const ok =
          STAR_KEY_SET.has(entity) ||
          PALACE_KEY_SET.has(entity) ||
          MUTAGEN_KEY_SET.has(entity) ||
          KNOWN_EXTRA.has(entity) ||
          (e.domain === 'pattern' && /^[a-z0-9-]+$/.test(entity));
        expect(ok, `条目 ${e.id} 含非法实体 "${entity}"`).toBe(true);
      }
    }
  });
});

describe('知识库覆盖率', () => {
  const byEntityPair = new Set(
    ALL_ENTRIES.map((e) => [...e.entities].sort().join('|')),
  );

  test('14 主星 × 12 宫全覆盖(168 组合)', () => {
    const missing: string[] = [];
    for (const star of MAJOR_STARS) {
      for (const palace of PALACES) {
        if (!byEntityPair.has([star, palace].sort().join('|'))) missing.push(`${star}×${palace}`);
      }
    }
    expect(missing, `缺失组合: ${missing.join(', ')}`).toHaveLength(0);
  });

  test('四化 × 12 宫全覆盖(48 组合)', () => {
    const missing: string[] = [];
    for (const mutagen of MUTAGENS) {
      for (const palace of PALACES) {
        if (!byEntityPair.has([mutagen, palace].sort().join('|'))) missing.push(`${mutagen}×${palace}`);
      }
    }
    expect(missing, `缺失组合: ${missing.join(', ')}`).toHaveLength(0);
  });

  test('人工精修条目(reviewed/verified)不少于 7 条', () => {
    expect(ALL_ENTRIES.filter((e) => e.reviewStatus !== 'draft').length).toBeGreaterThanOrEqual(7);
  });
});
