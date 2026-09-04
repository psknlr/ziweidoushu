/**
 * 干支语义:紫微排盘干支(iztro,农历月/流派年界)与标准四柱(节气)的关系。
 * 用 lunar-typescript 作为独立历法参照,锁定二者「何时相同、何时不同」的既定语义,
 * 防止把排盘月柱误当节气月柱使用。
 */
import { describe, expect, test } from 'vitest';
import { computeBaZi, zh, ZiweiEngine } from '@ziwei/core';

const gz = (p: { stem: string; branch: string }) => zh(p.stem) + zh(p.branch);

describe('紫微排盘干支 vs 标准四柱', () => {
  const engine = new ZiweiEngine('quanshu-default');

  test('日柱在子正换日约定下始终一致(400 组随机样本级别的性质,此处抽 24 组)', () => {
    let seed = 7;
    const rnd = () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
    for (let i = 0; i < 24; i++) {
      const y = 1950 + Math.floor(rnd() * 70), m = 1 + Math.floor(rnd() * 12), d = 1 + Math.floor(rnd() * 28), h = Math.floor(rnd() * 23);
      const chart = engine.fromBirth({ year: y, month: m, day: d, hour: h, gender: 'male', useTrueSolarTime: false, applyChinaDst: false });
      const bazi = computeBaZi({ year: y, month: m, day: d, hour: h, gender: 'male', dayBoundary: 'current' });
      expect(gz(chart.ganzhi.day), `${y}-${m}-${d}`).toBe(gz(bazi.pillars.day));
    }
  });

  test('月柱:排盘取农历月,标准四柱取节气月(芒种前 2011-06-06 03:20)', () => {
    const chart = engine.fromBirth({ year: 2011, month: 6, day: 6, hour: 3, minute: 20, gender: 'male', useTrueSolarTime: false });
    const bazi = engine.bazi(chart);
    expect(gz(chart.ganzhi.month)).toBe('甲午'); // 农历五月已至
    expect(gz(bazi.pillars.month)).toBe('癸巳'); // 芒种(06-06 08:27)未到,仍属巳月
  });

  test('年柱:立春之后、正月初一之前,排盘年(正月初一分界)与标准四柱年(立春)不同', () => {
    const chart = engine.fromBirth({ year: 2009, month: 2, day: 3, hour: 15, gender: 'female', useTrueSolarTime: false });
    const bazi = engine.bazi(chart);
    // 2009-01-26 春节,2009-02-04 立春:02-03 已过春节未到立春
    expect(gz(chart.ganzhi.year)).toBe('己丑');
    expect(gz(bazi.pillars.year)).toBe('戊子');
  });

  test('导出同时携带排盘干支说明与标准四柱', async () => {
    const { exportChartData } = await import('@ziwei/core');
    const chart = engine.fromBirth({ year: 2009, month: 2, day: 3, hour: 15, gender: 'female', useTrueSolarTime: false });
    const out = exportChartData(chart, engine.features(chart), '2026-01-01T00:00:00Z', engine.bazi(chart));
    expect(out.basics.ganzhiNote).toContain('标准四柱');
    expect(out.bazi?.pillars.year.branch).toBe('ziEarthly');
  });
});
