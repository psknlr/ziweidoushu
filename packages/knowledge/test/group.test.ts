/**
 * 群盘:两两关系矩阵、Prompt 结构、成员上限、信号并集。
 */
import { describe, expect, test } from 'vitest';
import { ZiweiEngine } from '@ziwei/core';
import { ALL_ENTRIES, ALL_SKILLS, analyzeGroup, buildGroupPrompt, relationMatrix, retrieveSignals } from '@ziwei/knowledge';

const engine = new ZiweiEngine();
const a = engine.bySolar('1990-1-15', 4, 'male');
const b = engine.bySolar('1992-8-16', 6, 'female');
const c = engine.bySolar('2018-3-3', 2, 'male');

describe('analyzeGroup', () => {
  test('三人 → 三对关系,称谓沿用档案名', () => {
    const facts = analyzeGroup([{ label: '父', chart: a }, { label: '母', chart: b }, { label: '子', chart: c }]);
    expect(facts.pairs.map((p) => `${p.a}×${p.b}`)).toEqual(['父×母', '父×子', '母×子']);
    for (const p of facts.pairs) {
      expect(p.features.notes[0]).toMatch(/^命宫:/);
      expect(p.features.notes.join('\n')).not.toContain('甲方');
    }
    expect(facts.signals.length).toBeGreaterThan(0);
    const keys = facts.signals.map((s) => s.entities.join('|'));
    expect(new Set(keys).size).toBe(keys.length); // 去重
  });

  test('成员数边界', () => {
    expect(() => analyzeGroup([{ label: 'x', chart: a }])).toThrow(/至少/);
    const seven = Array.from({ length: 7 }, (_, i) => ({ label: `p${i}`, chart: a }));
    expect(() => analyzeGroup(seven)).toThrow(/最多/);
  });
});

describe('relationMatrix / buildGroupPrompt', () => {
  const facts = analyzeGroup([{ label: '父', chart: a }, { label: '母', chart: b }, { label: '子', chart: c }]);

  test('矩阵为 Markdown 表格且对称', () => {
    const md = relationMatrix(facts);
    const rows = md.split('\n');
    expect(rows[0]).toBe('| | 父 | 母 | 子 |');
    expect(rows[1]).toMatch(/^\|---\|---\|---\|---\|$/);
    expect(rows).toHaveLength(5);
    const cell = (r: number, col: number) => rows[r]!.split('|').map((s) => s.trim())[col];
    expect(cell(2, 3)).toBe(cell(3, 2)); // 父×母 == 母×父
    expect(cell(2, 2)).toBe('—');
  });

  test('Prompt 含各人事实、关系矩阵、方法论、免责与技法', () => {
    const retrieved = retrieveSignals(facts.signals, ALL_ENTRIES, { limit: 10 });
    const prompt = buildGroupPrompt(facts, retrieved, { skill: ALL_SKILLS['parents'] });
    expect(prompt).toContain('3 人群盘分析(父、母、子)');
    expect(prompt).toContain('## 父');
    expect(prompt).toContain('## 子');
    expect(prompt).toContain('### 父 × 母');
    expect(prompt).toContain('| | 父 | 母 | 子 |');
    expect(prompt).toContain('本次解读技法:父母孝亲');
    expect(prompt).toContain('各人定位(父、母、子)');
    expect(prompt).toContain('不构成医疗');
    expect(prompt).not.toContain('八字:');
  });

  test('群盘技法:沿用其完整输出结构;单盘技法:前后补各人定位与关系矩阵', () => {
    const couple = analyzeGroup([{ label: '甲', chart: a }, { label: '乙', chart: b }]);
    const p1 = buildGroupPrompt(couple, [], { skill: ALL_SKILLS['group-couple'] });
    expect(p1).toContain('本次解读技法:伴侣合盘');
    expect(p1).toContain('1. 缘分总论(150字内)');
    expect(p1).toContain('当前运限的同步与错位(如有)');
    expect(p1).not.toContain('各人定位(甲、乙)');
    const p2 = buildGroupPrompt(couple, [], { skill: ALL_SKILLS['career'] });
    expect(p2).toContain('1. 各人定位(甲、乙)');
    expect(p2).toContain('关系矩阵与经营建议');
  });

  test('withBazi 时附各人八字', () => {
    const withBazi = analyzeGroup([
      { label: '甲', chart: a, bazi: engine.bazi(a) },
      { label: '乙', chart: b, bazi: engine.bazi(b) },
    ]);
    const prompt = buildGroupPrompt(withBazi, [], { withBazi: true, year: 2026 });
    expect(prompt).toContain('八字:己巳 丁丑 庚辰 庚辰');
    expect(prompt).toContain('2026 流年');
    expect(prompt).toContain('兼通子平八字');
  });
});
