/**
 * 技法库与合盘引擎测试。
 */
import { describe, expect, test } from 'vitest';
import { ZiweiEngine } from '@ziwei/core';
import {
  branchRelation,
  buildSynastryPrompt,
  buildSystemPrompt,
  compareCharts,
  READING_SKILLS,
  retrieve,
  ALL_ENTRIES,
} from '@ziwei/knowledge';

const engine = new ZiweiEngine();
const chartA = engine.bySolar('2000-8-16', 2, 'female');
const chartB = engine.bySolar('1998-3-16', 6, 'male');

describe('解读技法库', () => {
  test('七大技法齐全,方法论与输出结构非空', () => {
    const ids = ['overall', 'marriage', 'career', 'business', 'education', 'health', 'wealth'] as const;
    for (const id of ids) {
      const skill = READING_SKILLS[id];
      expect(skill.method.length).toBeGreaterThanOrEqual(3);
      expect(skill.cautions.length).toBeGreaterThanOrEqual(1);
      expect(skill.outputStructure.length).toBeGreaterThanOrEqual(3);
      expect(skill.corePalaces.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('技法注入 Prompt:方法论、纪律、专属输出结构生效', () => {
    const features = engine.features(chartA);
    const retrieved = retrieve(features, ALL_ENTRIES, { topics: READING_SKILLS.marriage.topics });
    const prompt = buildSystemPrompt(chartA, features, retrieved, { skill: READING_SKILLS.marriage });
    expect(prompt).toContain('本次解读技法:姻缘婚恋');
    expect(prompt).toContain('夫妻宫为体');
    expect(prompt).toContain('严禁「必离婚');
    expect(prompt).toContain('婚期与时机参考');
    expect(prompt).not.toContain('undefined');
  });

  test('健康技法带非医疗红线', () => {
    expect(READING_SKILLS.health.cautions.join('')).toContain('严禁诊断');
  });
});

describe('地支关系', () => {
  test('六合/三合/对冲/相害/相刑/同宫', () => {
    expect(branchRelation('ziEarthly', 'chouEarthly')).toBe('liuhe');
    expect(branchRelation('shenEarthly', 'chenEarthly')).toBe('sanhe');
    expect(branchRelation('ziEarthly', 'wuEarthly')).toBe('chong');
    expect(branchRelation('ziEarthly', 'weiEarthly')).toBe('hai');
    expect(branchRelation('ziEarthly', 'maoEarthly')).toBe('xing');
    expect(branchRelation('wuEarthly', 'wuEarthly')).toBe('same');
    expect(branchRelation('ziEarthly', 'shenEarthly')).toBe('sanhe');
    expect(branchRelation('ziEarthly', 'youEarthly')).toBe('none');
  });
});

describe('合盘引擎', () => {
  const syn = compareCharts(chartA, chartB);

  test('四化互飞:双方各 4 条,忌星必有落宫记录结构', () => {
    expect(syn.flights).toHaveLength(8);
    expect(syn.flights.filter((f) => f.from === 'a')).toHaveLength(4);
    for (const f of syn.flights) {
      expect(['sihuaLu', 'sihuaQuan', 'sihuaKe', 'sihuaJi']).toContain(f.mutagen);
    }
  });

  test('确定性:同输入两次比较结果一致', () => {
    expect(compareCharts(chartA, chartB)).toEqual(syn);
  });

  test('夫妻宫主星提取(含借宫标记)', () => {
    expect(Array.isArray(syn.spouseStars.a)).toBe(true);
    expect(typeof syn.spouseStars.aBorrowed).toBe('boolean');
  });

  test('合盘 Prompt:双盘事实、方法论、纪律、免责齐备', () => {
    const prompt = buildSynastryPrompt(chartA, chartB, syn);
    expect(prompt).toContain('双人合盘');
    expect(prompt).toContain('甲方');
    expect(prompt).toContain('四化互飞明细');
    expect(prompt).toContain('严禁「必离');
    expect(prompt).toContain('不构成婚恋决策建议');
    expect(prompt).not.toContain('undefined');
  });
});
