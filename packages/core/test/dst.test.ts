/**
 * 中国夏令时(1986-1991)扣除测试。
 * 实施日期(公开档案):1986-05-04~09-14、1987-04-12~09-13、1988-04-10~09-11、
 * 1989-04-16~09-17、1990-04-15~09-16、1991-04-14~09-15,均于 02:00 切换。
 */
import { describe, expect, test } from 'vitest';
import { chinaDstMinutes, normalizeBirth, ZiweiEngine } from '@ziwei/core';

describe('chinaDstMinutes', () => {
  test('区间内 60 分钟,区间外 0', () => {
    expect(chinaDstMinutes(1990, 6, 1, 12)).toBe(60);
    expect(chinaDstMinutes(1990, 3, 1, 12)).toBe(0);
    expect(chinaDstMinutes(1985, 6, 1, 12)).toBe(0);
    expect(chinaDstMinutes(1992, 6, 1, 12)).toBe(0);
    expect(chinaDstMinutes(2000, 6, 1, 12)).toBe(0);
  });

  test('切换边界:起始日 02:00 起算,结束日 02:00(夏令时)止', () => {
    expect(chinaDstMinutes(1986, 5, 4, 1, 59)).toBe(0);
    expect(chinaDstMinutes(1986, 5, 4, 2, 0)).toBe(60);
    expect(chinaDstMinutes(1991, 9, 15, 1, 59)).toBe(60);
    expect(chinaDstMinutes(1991, 9, 15, 2, 0)).toBe(0);
    expect(chinaDstMinutes(1988, 4, 9, 23, 0)).toBe(0);
    expect(chinaDstMinutes(1988, 4, 10, 2, 0)).toBe(60);
  });
});

describe('normalizeBirth 扣除夏令时', () => {
  test('钟表 11:30(夏令时)= 标准时 10:30,时辰由午改巳', () => {
    const n = normalizeBirth({ year: 1990, month: 6, day: 1, hour: 11, minute: 30 });
    expect(n.timeIndex).toBe(5); // 巳 09:00-10:59
    expect(n.record.dstMinutes).toBe(60);
    expect(n.record.correctedLocal).toBe('1990-06-01 10:30');
    expect(n.record.timeIndexChanged).toBe(true);
  });

  test('跨日:钟表 00:30(夏令时)= 前一日 23:30', () => {
    const n = normalizeBirth({ year: 1987, month: 7, day: 1, hour: 0, minute: 30 });
    expect(n.solarDate).toBe('1987-6-30');
    expect(n.timeIndex).toBe(12); // 晚子时
  });

  test('与真太阳时叠加:先扣夏令时再做经度/均时差校正', () => {
    const withDst = normalizeBirth({ year: 1990, month: 6, day: 1, hour: 11, minute: 30, longitude: 116.4 });
    const noDst = normalizeBirth({ year: 1990, month: 6, day: 1, hour: 11, minute: 30, longitude: 116.4, applyChinaDst: false });
    expect(withDst.record.dstMinutes).toBe(60);
    expect(noDst.record.dstMinutes).toBeUndefined();
    // 两者恰差 60 分钟
    expect(withDst.record.totalOffsetMinutes!).toBeCloseTo(noDst.record.totalOffsetMinutes! - 60, 1);
    // 北京 116.4°E:经度差 −14.4 分,6 月 1 日均时差 ≈ +2.2 分 → 净 −12 分
    expect(withDst.record.correctedLocal).toBe('1990-06-01 10:18');
    expect(noDst.record.correctedLocal).toBe('1990-06-01 11:18');
  });

  test('可显式关闭', () => {
    const n = normalizeBirth({ year: 1990, month: 6, day: 1, hour: 11, minute: 30, applyChinaDst: false });
    expect(n.timeIndex).toBe(6);
    expect(n.record.dstMinutes).toBeUndefined();
  });
});

describe('ZiweiEngine.fromBirth 默认扣除夏令时', () => {
  test('1990-06-01 11:30 北京 → 时辰按真太阳时 10:18 取巳', () => {
    const engine = new ZiweiEngine();
    const chart = engine.fromBirth({ year: 1990, month: 6, day: 1, hour: 11, minute: 30, gender: 'male', city: '北京' });
    expect(chart.meta.input.timeIndex).toBe(5);
    expect(chart.meta.input.trueSolarTime.dstMinutes).toBe(60);
    const off = engine.fromBirth({
      year: 1990, month: 6, day: 1, hour: 11, minute: 30, gender: 'male', city: '北京', applyChinaDst: false,
    });
    expect(off.meta.input.timeIndex).toBe(6);
  });

  test('不做真太阳时也扣夏令时', () => {
    const engine = new ZiweiEngine();
    const chart = engine.fromBirth({ year: 1988, month: 7, day: 1, hour: 13, minute: 10, gender: 'female', useTrueSolarTime: false });
    expect(chart.meta.input.trueSolarTime.enabled).toBe(false);
    expect(chart.meta.input.trueSolarTime.dstMinutes).toBe(60);
    expect(chart.meta.input.timeIndex).toBe(6); // 标准时 12:10 → 午
  });
});
