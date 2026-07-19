import { describe, expect, test } from 'vitest';
import { equationOfTimeMinutes, normalizeBirth, timeIndexFromHour, toTrueSolarTime } from '@ziwei/core';

describe('均时差(Spencer)', () => {
  test('2 月中旬为全年最小值附近(约 -14 分钟)', () => {
    expect(equationOfTimeMinutes(2024, 2, 11)).toBeCloseTo(-14.2, 0);
  });

  test('11 月初为全年最大值附近(约 +16.4 分钟)', () => {
    expect(equationOfTimeMinutes(2024, 11, 3)).toBeCloseTo(16.4, 0);
  });

  test('全年幅度在 ±17 分钟内', () => {
    for (let n = 1; n <= 365; n += 3) {
      const d = new Date(Date.UTC(2023, 0, n));
      const eot = equationOfTimeMinutes(2023, d.getUTCMonth() + 1, d.getUTCDate());
      expect(Math.abs(eot)).toBeLessThan(17);
    }
  });
});

describe('时辰索引(iztro 约定)', () => {
  test('0 点为早子时(0),23 点为晚子时(12)', () => {
    expect(timeIndexFromHour(0)).toBe(0);
    expect(timeIndexFromHour(23)).toBe(12);
  });

  test('常规时辰:1-2 丑,11-12 午,15-16 申', () => {
    expect(timeIndexFromHour(1)).toBe(1);
    expect(timeIndexFromHour(2)).toBe(1);
    expect(timeIndexFromHour(11)).toBe(6);
    expect(timeIndexFromHour(12)).toBe(6);
    expect(timeIndexFromHour(15)).toBe(8);
    expect(timeIndexFromHour(16)).toBe(8);
  });

  test('非法输入抛错', () => {
    expect(() => timeIndexFromHour(24)).toThrow();
    expect(() => timeIndexFromHour(-1)).toThrow();
  });
});

describe('真太阳时校正', () => {
  test('120°E 上仅剩均时差', () => {
    const r = toTrueSolarTime({ year: 2024, month: 2, day: 11, hour: 12, minute: 0, longitude: 120 });
    expect(r.longitudeMinutes).toBe(0);
    expect(r.totalOffsetMinutes).toBeCloseTo(r.eotMinutes, 5);
  });

  test('北京(116.41°E)经度修正约 -14.4 分钟', () => {
    const r = toTrueSolarTime({ year: 2024, month: 6, day: 1, hour: 12, minute: 0, longitude: 116.41 });
    expect(r.longitudeMinutes).toBeCloseTo(-14.36, 1);
  });

  test('乌鲁木齐(87.62°E)下午三点校正后退回午/未之间,时辰改变', () => {
    const n = normalizeBirth({ year: 2000, month: 8, day: 16, hour: 15, minute: 0, longitude: 87.62 });
    expect(n.record.enabled).toBe(true);
    expect(n.record.timeIndexChanged).toBe(true);
    // (87.62-120)*4 ≈ -129.5 分钟,叠加均时差后约提前 2 小时 14 分
    expect(n.timeIndex).toBeLessThan(8);
  });

  test('凌晨出生 + 西部经度 → 跨日回退', () => {
    const n = normalizeBirth({ year: 2000, month: 8, day: 16, hour: 0, minute: 20, longitude: 87.62 });
    expect(n.solarDate).toBe('2000-8-15');
    expect(n.record.timeIndexChanged).toBe(true);
  });

  test('不给经度则不校正', () => {
    const n = normalizeBirth({ year: 2000, month: 8, day: 16, hour: 4 });
    expect(n.record.enabled).toBe(false);
    expect(n.solarDate).toBe('2000-8-16');
    expect(n.timeIndex).toBe(2);
  });
});
