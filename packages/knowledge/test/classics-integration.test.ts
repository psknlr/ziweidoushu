/**
 * 古籍调研成果集成测试:格局库、赋文条目、进阶技法全链路生效。
 */
import { describe, expect, test } from 'vitest';
import { ALL_PATTERNS, CLASSIC_PATTERNS, STARTER_PATTERNS, ZiweiEngine } from '@ziwei/core';
import { ALL_ENTRIES, ALL_SKILLS, buildSystemPrompt, READING_SKILLS, retrieve, validateEntries } from '@ziwei/knowledge';

describe('古籍格局库集成', () => {
  test('全量格局 = 起步 10 + 古籍 24,id 唯一', () => {
    expect(STARTER_PATTERNS.length).toBe(10);
    expect(CLASSIC_PATTERNS.length).toBe(24);
    expect(ALL_PATTERNS.length).toBe(34);
    expect(new Set(ALL_PATTERNS.map((p) => p.id)).size).toBe(34);
  });

  test('每个古籍格局都引用古籍出处', () => {
    for (const p of CLASSIC_PATTERNS) {
      expect(p.source.length, `${p.id} 缺出处`).toBeGreaterThan(4);
    }
  });

  test('引擎默认使用全量格局库:命中古籍格局', () => {
    const engine = new ZiweiEngine();
    const official = engine.features(engine.bySolar('2000-8-16', 2, 'female')).patterns.map((p) => p.id);
    expect(official).toContain('fuxiang-chaoyuan');
    // 代理冒烟验证过的命例:午时男盘另命中紫府朝垣与禄马交驰
    const smoke = engine.features(engine.bySolar('2000-8-16', 6, 'male')).patterns.map((p) => p.id);
    expect(smoke).toContain('zifu-chaoyuan');
    expect(smoke).toContain('luma-jiaochi');
  });
});

describe('赋文条目与技法集成', () => {
  test('知识库 ≥ 355 条且含格局条目,zod 全通过', () => {
    const validated = validateEntries(ALL_ENTRIES);
    expect(validated.length).toBeGreaterThanOrEqual(355);
    // 每个古籍格局有对应知识条目
    const patternEntryIds = new Set(
      ALL_ENTRIES.filter((e) => e.domain === 'pattern').map((e) => e.entities[1]),
    );
    for (const p of CLASSIC_PATTERNS) {
      expect(patternEntryIds.has(p.id), `格局 ${p.id} 缺知识条目`).toBe(true);
    }
  });

  test('全量技法 15 个(基础 7 + 进阶 8)', () => {
    expect(Object.keys(READING_SKILLS)).toHaveLength(7);
    expect(Object.keys(ALL_SKILLS)).toHaveLength(15);
    for (const id of ['children', 'parents', 'siblings', 'friends', 'relocation', 'spirit', 'decadal', 'annual']) {
      expect(ALL_SKILLS[id], `缺进阶技法 ${id}`).toBeDefined();
      expect(ALL_SKILLS[id]!.method.length).toBeGreaterThanOrEqual(3);
    }
  });

  test('进阶技法端到端:大限技法注入 Prompt,格局条目可被检索', () => {
    const engine = new ZiweiEngine();
    const chart = engine.bySolar('2000-8-16', 2, 'female');
    const features = engine.features(chart);
    const retrieved = retrieve(features, ALL_ENTRIES, { limit: 10 });
    // 命中的古籍格局条目应可召回
    expect(retrieved.some((r) => r.entry.domain === 'pattern')).toBe(true);
    const prompt = buildSystemPrompt(chart, features, retrieved, { skill: ALL_SKILLS['decadal'] });
    expect(prompt).toContain('大限');
    expect(prompt).not.toContain('undefined');
  });
});
