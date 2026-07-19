/**
 * 亮度体系测试:七级分值、庙旺/落陷汇总、陷而有救、双重课题、煞星化权。
 */
import { describe, expect, test } from 'vitest';
import { BRIGHTNESS_SCORE, describeBrightness, summarizeBrightness, ZiweiEngine } from '@ziwei/core';
import { makeChart, makeStar } from './helpers.js';

describe('亮度体系', () => {
  test('七级分值单调递减:庙 > 旺 > 得 > 利 > 平 > 不 > 陷', () => {
    const order = ['miao', 'wang', 'de', 'li', 'ping', 'bu', 'xian'] as const;
    for (let i = 1; i < order.length; i++) {
      expect(BRIGHTNESS_SCORE[order[i]!]).toBeLessThan(BRIGHTNESS_SCORE[order[i - 1]!]);
    }
  });

  test('庙旺入清单;落陷会禄存/化科为「陷而有救」;落陷化忌为双重课题', () => {
    const chart = makeChart(0, {
      0: {
        majors: [makeStar('taiyangMaj', { brightness: 'xian', mutagen: 'sihuaJi' })],
        minors: [makeStar('lucunMin', { type: 'lucun' })],
      },
      4: { majors: [makeStar('taiyinMaj', { brightness: 'miao' })] },
      8: { majors: [makeStar('tianjiMaj', { brightness: 'xian' }), makeStar('tianliangMaj', { brightness: 'wang', mutagen: 'sihuaKe' })] },
    });
    const s = summarizeBrightness(chart);

    expect(s.exalted.map((n) => n.star)).toEqual(expect.arrayContaining(['taiyinMaj', 'tianliangMaj']));
    const taiyang = s.fallen.find((n) => n.star === 'taiyangMaj');
    expect(taiyang).toBeDefined();
    expect(taiyang!.doubleBurden).toBe(true);
    expect(taiyang!.rescuedBy).toEqual(expect.arrayContaining(['lucun', 'sihuaKe']));

    const text = describeBrightness(s);
    expect(text).toContain('落陷');
    expect(text).toContain('陷而有救');
    expect(text).toContain('双重课题');
  });

  test('煞星入庙标记「化煞为权」,煞星落陷入落陷清单', () => {
    const chart = makeChart(0, {
      0: { minors: [makeStar('huoxingMin', { type: 'tough', brightness: 'miao' })] },
      6: { majors: [makeStar('ziweiMaj')], minors: [makeStar('qingyangMin', { type: 'tough', brightness: 'xian' })] },
    });
    const s = summarizeBrightness(chart);
    const huo = s.exalted.find((n) => n.star === 'huoxingMin');
    expect(huo?.toughEmpowered).toBe(true);
    expect(s.fallen.some((n) => n.star === 'qingyangMin')).toBe(true);
  });

  test('宫强弱分:无主星宫为 null,主星亮度求和', () => {
    const chart = makeChart(0, {
      0: { majors: [makeStar('ziweiMaj', { brightness: 'miao' }), makeStar('tianfuMaj', { brightness: 'wang' })] },
    });
    const s = summarizeBrightness(chart);
    expect(s.palaceScores[0]).toBe(5);
    expect(s.palaceScores[1]).toBeNull();
  });

  test('真盘端到端:features.brightness 生效且信号含辅星亮度', () => {
    const engine = new ZiweiEngine();
    const chart = engine.bySolar('2000-8-16', 2, 'female');
    const features = engine.features(chart);
    expect(features.brightness.exalted.length + features.brightness.fallen.length).toBeGreaterThan(0);
    expect(features.signals.some((s) => s.kind === 'brightness' && s.weight === 35)).toBe(true);
  });
});
