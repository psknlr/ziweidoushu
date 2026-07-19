/**
 * 知识库测试:schema 校验(知识库 lint)、加权检索、Prompt 装配五要素。
 */
import { describe, expect, test } from 'vitest';
import { analyze, fillBorrowedStars, ZiweiEngine } from '@ziwei/core';
import {
  buildSystemPrompt,
  DISCLAIMER,
  retrieve,
  STARTER_ENTRIES,
  validateEntries,
} from '@ziwei/knowledge';
import { makeChart, makeStar } from '../../core/test/helpers.js';

describe('知识条目 schema(CI 知识库 lint)', () => {
  test('起步条目全部合法且 id 唯一', () => {
    expect(() => validateEntries(STARTER_ENTRIES)).not.toThrow();
    expect(validateEntries(STARTER_ENTRIES)).toHaveLength(STARTER_ENTRIES.length);
  });

  test('重复 id 抛错', () => {
    const dup = [STARTER_ENTRIES[0], STARTER_ENTRIES[0]];
    expect(() => validateEntries(dup)).toThrow(/id 重复/);
  });

  test('缺来源的条目被拒绝', () => {
    const bad = { ...STARTER_ENTRIES[0], id: 'bad', source: undefined };
    expect(() => validateEntries([bad])).toThrow();
  });
});

describe('加权检索', () => {
  const chart = fillBorrowedStars(
    makeChart(0, {
      0: { majors: [makeStar('ziweiMaj')] },
      4: { majors: [makeStar('tanlangMaj')] },
    }),
  );
  const features = analyze(chart);

  test('紫微坐命召回对应条目,且可解释(matchedSignals 非空)', () => {
    const results = retrieve(features, STARTER_ENTRIES);
    const ziwei = results.find((r) => r.entry.id === 'star.ziwei.soul');
    expect(ziwei).toBeDefined();
    expect(ziwei!.score).toBeGreaterThan(0);
    expect(ziwei!.matchedSignals.length).toBeGreaterThan(0);
  });

  test('话题过滤:只要婚姻类则紫微命宫条目不召回', () => {
    const results = retrieve(features, STARTER_ENTRIES, { topics: ['marriage'] });
    expect(results.find((r) => r.entry.id === 'star.ziwei.soul')).toBeUndefined();
  });

  test('贪狼坐财帛(星+宫组合)命中财帛条目', () => {
    const results = retrieve(features, STARTER_ENTRIES, { topics: ['wealth'] });
    expect(results.some((r) => r.entry.id === 'star.tanlang.wealth')).toBe(true);
  });

  test('检索精度红线:宫位与格局是定位性实体,错宫/错格不得召回', () => {
    // 贪狼坐官禄(非财帛)且命宫见杀破狼:不得召回"贪狼坐财帛"与"火贪格"条目
    const wrongPalace = fillBorrowedStars(
      makeChart(0, {
        0: { majors: [makeStar('qishaMaj')] },
        8: { majors: [makeStar('tanlangMaj', { mutagen: 'sihuaQuan' })] },
      }),
    );
    const f = analyze(wrongPalace);
    const results = retrieve(f, STARTER_ENTRIES, { minScore: 0 });
    expect(results.find((r) => r.entry.id === 'star.tanlang.wealth')).toBeUndefined();
    expect(results.find((r) => r.entry.id === 'pattern.huo-tan')).toBeUndefined();
    expect(results.find((r) => r.entry.id === 'pattern.jiyue-tongliang')).toBeUndefined();
  });

  test('四化+宫位条目:武曲化禄在官禄命中 mutagen.lu.career', () => {
    const chart2 = fillBorrowedStars(
      makeChart(0, { 8: { majors: [makeStar('wuquMaj', { mutagen: 'sihuaLu' })] } }),
    );
    const results = retrieve(analyze(chart2), STARTER_ENTRIES);
    expect(results.some((r) => r.entry.id === 'mutagen.lu.career')).toBe(true);
  });

  test('按分数降序,limit 生效', () => {
    const results = retrieve(features, STARTER_ENTRIES, { limit: 2 });
    expect(results.length).toBeLessThanOrEqual(2);
    for (let i = 1; i < results.length; i++) {
      expect(results[i]!.score).toBeLessThanOrEqual(results[i - 1]!.score);
    }
  });
});

describe('Prompt 装配(五要素)', () => {
  test('真实命盘端到端:含免责声明、输出结构、流派声明、知识导向', () => {
    const engine = new ZiweiEngine();
    const chart = engine.bySolar('2000-8-16', 2, 'female');
    const features = engine.features(chart);
    const retrieved = retrieve(features, STARTER_ENTRIES);
    const prompt = buildSystemPrompt(chart, features, retrieved);

    expect(prompt).toContain(DISCLAIMER);
    expect(prompt).toContain('输出结构');
    expect(prompt).toContain('命格总断');
    expect(prompt).toContain('安星');
    expect(prompt).toContain('禁用"能量""磁场"');
    expect(prompt).not.toContain('undefined');
  });
});
