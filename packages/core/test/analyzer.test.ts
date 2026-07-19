/**
 * 分析器单测:三方四正几何、借宫、四化叠加、格局三层判定、RAG 信号。
 * 使用合成盘(helpers.makeChart)保证条件精确可控。
 */
import { describe, expect, test } from 'vitest';
import {
  analyze,
  evaluatePatterns,
  fillBorrowedStars,
  sihuaOverlay,
  STARTER_PATTERNS,
  surroundedIndexes,
  trineIndexes,
} from '@ziwei/core';
import { makeChart, makeStar } from './helpers.js';

describe('三方四正(地支几何)', () => {
  test('寅宫(0):对宫申(6),三合午戌(4/8)', () => {
    expect(surroundedIndexes(0)).toEqual({ target: 0, opposite: 6, wealth: 4, career: 8 });
  });

  test('环形回绕:亥宫(9)的三合为卯(1)/未(5)', () => {
    expect(surroundedIndexes(9)).toEqual({ target: 9, opposite: 3, wealth: 1, career: 5 });
    expect(trineIndexes(9)).toEqual([9, 1, 5, 3]);
  });
});

describe('借宫', () => {
  test('空宫借对宫主星,结构化写入 borrowed', () => {
    const chart = makeChart(0, {
      6: { majors: [makeStar('tianjiMaj'), makeStar('taiyinMaj')] },
    });
    fillBorrowedStars(chart);
    const soul = chart.palaces[0]!;
    expect(soul.borrowed).toBeDefined();
    expect(soul.borrowed!.fromIndex).toBe(6);
    expect(soul.borrowed!.stars.map((s) => s.key)).toEqual(['tianjiMaj', 'taiyinMaj']);
  });

  test('对宫也是空宫则不借', () => {
    const chart = makeChart(0);
    fillBorrowedStars(chart);
    expect(chart.palaces[0]!.borrowed).toBeUndefined();
  });
});

describe('四化叠加(sihuaOverlay)', () => {
  test('庚干四化定位到正确宫位,盘上无此星则为 null', () => {
    const chart = makeChart(0, {
      0: { majors: [makeStar('taiyangMaj')] },
      4: { majors: [makeStar('wuquMaj')] },
      8: { majors: [makeStar('taiyinMaj')] },
      // 天同不放入盘面
    });
    const hits = sihuaOverlay(chart, 'gengHeavenly');
    expect(hits).toEqual([
      { star: 'taiyangMaj', mutagen: 'sihuaLu', palaceIndex: 0 },
      { star: 'wuquMaj', mutagen: 'sihuaQuan', palaceIndex: 4 },
      { star: 'taiyinMaj', mutagen: 'sihuaKe', palaceIndex: 8 },
      { star: 'tiantongMaj', mutagen: 'sihuaJi', palaceIndex: null },
    ]);
  });
});

describe('格局引擎(三层条件)', () => {
  test('紫府同宫:成格 + 加分 + 破格并存呈现', () => {
    const chart = makeChart(0, {
      0: {
        majors: [makeStar('ziweiMaj'), makeStar('tianfuMaj')],
        minors: [makeStar('dikongMin', { type: 'tough' })],
      },
      4: { minors: [makeStar('zuofuMin', { type: 'soft' })] },
    });
    const matched = evaluatePatterns(chart, STARTER_PATTERNS);
    const zifu = matched.find((p) => p.id === 'zifu-tonggong');
    expect(zifu).toBeDefined();
    expect(zifu!.satisfied).toBe(true);
    expect(zifu!.bonusHits).toContain('左辅右弼会照');
    expect(zifu!.brokenBy).toContain('地空地劫同宫');
  });

  test('石中隐玉:命居子 + 巨门化禄 → 成格带加分;命居卯则不成格', () => {
    const atZi = makeChart(10, {
      10: { majors: [makeStar('jumenMaj', { mutagen: 'sihuaLu' })] },
    });
    const hit = evaluatePatterns(atZi, STARTER_PATTERNS).find((p) => p.id === 'shizhong-yinyu');
    expect(hit).toBeDefined();
    expect(hit!.bonusHits).toContain('巨门化禄');

    const atMao = makeChart(1, {
      1: { majors: [makeStar('jumenMaj')] },
    });
    expect(evaluatePatterns(atMao, STARTER_PATTERNS).find((p) => p.id === 'shizhong-yinyu')).toBeUndefined();
  });

  test('阳梁昌禄:anyOf 条件 —— 无禄存但三方见化禄仍成格', () => {
    const chart = makeChart(1, {
      1: { majors: [makeStar('taiyangMaj', { mutagen: 'sihuaLu' })], minors: [makeStar('wenchangMin', { type: 'soft' })] },
      5: { majors: [makeStar('tianliangMaj')] },
    });
    const hit = evaluatePatterns(chart, STARTER_PATTERNS).find((p) => p.id === 'yangliang-changlu');
    expect(hit).toBeDefined();
    expect(hit!.bonusHits).toContain('命居卯位,格局尤佳');
  });

  test('机月同梁:四星须齐会三方四正,缺一不成格', () => {
    const full = makeChart(0, {
      0: { majors: [makeStar('tianjiMaj'), makeStar('taiyinMaj')] },
      4: { majors: [makeStar('tiantongMaj')] },
      8: { majors: [makeStar('tianliangMaj')] },
    });
    expect(evaluatePatterns(full, STARTER_PATTERNS).some((p) => p.id === 'jiyue-tongliang')).toBe(true);

    const missing = makeChart(0, {
      0: { majors: [makeStar('tianjiMaj'), makeStar('taiyinMaj')] },
      4: { majors: [makeStar('tiantongMaj')] },
    });
    expect(evaluatePatterns(missing, STARTER_PATTERNS).some((p) => p.id === 'jiyue-tongliang')).toBe(false);
  });
});

describe('RAG 信号', () => {
  test('权重分层:星+四化+宫(100) > 格局(90) > 星+宫(60)', () => {
    const chart = makeChart(0, {
      0: { majors: [makeStar('ziweiMaj'), makeStar('tianfuMaj')] },
      4: { majors: [makeStar('wuquMaj', { mutagen: 'sihuaQuan' })] },
    });
    fillBorrowedStars(chart);
    const features = analyze(chart);

    const top = features.signals[0]!;
    expect(top.kind).toBe('star-mutagen-palace');
    expect(top.weight).toBe(100);
    expect(top.entities).toEqual(['wuquMaj', 'sihuaQuan', 'wealthPalace']);

    expect(features.signals.some((s) => s.kind === 'pattern' && s.entities.includes('zifu-tonggong'))).toBe(true);
    // 双主星同宫产生 combo 信号(80),星序按 14 主星序稳定排列
    const combo = features.signals.find((s) => s.kind === 'combo');
    expect(combo).toBeDefined();
    expect(combo!.weight).toBe(80);
    expect(combo!.entities).toEqual(['ziweiMaj', 'tianfuMaj', 'soulPalace']);
    expect(features.signals.some((s) => s.kind === 'star-palace' && s.weight === 60)).toBe(true);
    // 排序不增
    for (let i = 1; i < features.signals.length; i++) {
      expect(features.signals[i]!.weight).toBeLessThanOrEqual(features.signals[i - 1]!.weight);
    }
  });

  test('命宫无主星 → borrowed 信号(70)', () => {
    const chart = makeChart(0, { 6: { majors: [makeStar('tianjiMaj')] } });
    fillBorrowedStars(chart);
    const features = analyze(chart);
    const borrowed = features.signals.find((s) => s.kind === 'borrowed');
    expect(borrowed).toBeDefined();
    expect(borrowed!.weight).toBe(70);
    expect(borrowed!.entities).toContain('emptyPalace');
  });
});
