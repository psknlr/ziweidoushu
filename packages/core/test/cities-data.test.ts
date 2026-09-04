/**
 * 城市库数据完整性:坐标范围、无占位/零坐标条目、关键城市可查。
 */
import { describe, expect, test } from 'vitest';
import { CITIES, lookupCity, normalizeBirth } from '@ziwei/core';

describe('城市库数据完整性', () => {
  test('所有条目坐标在中国及港澳台范围内,无 (0,0) 占位', () => {
    const bad = CITIES.filter((c) => c.longitude < 73 || c.longitude > 135.5 || c.latitude < 3 || c.latitude > 54);
    expect(bad).toEqual([]);
    expect(CITIES.some((c) => c.longitude === 0 && c.latitude === 0)).toBe(false);
    // 新疆「自治区直辖县级行政区划」占位行(无坐标)已移除;各省「省直辖县级行政区划」为有坐标的真实分组行,保留
    expect(CITIES.some((c) => c.name === '自治区直辖县级行政区划')).toBe(false);
  });

  test('新疆兵团市与港澳台可查且经度正确', () => {
    expect(lookupCity('石河子')?.longitude).toBeCloseTo(86.08, 1);
    expect(lookupCity('阿拉尔')?.longitude).toBeCloseTo(81.28, 1);
    expect(lookupCity('图木舒克')?.longitude).toBeCloseTo(79.08, 1);
    expect(lookupCity('五家渠')?.longitude).toBeCloseTo(87.53, 1);
    expect(lookupCity('台北')?.longitude).toBeCloseTo(121.56, 1);
    expect(lookupCity('香港')?.longitude).toBeCloseTo(114.17, 1);
    expect(lookupCity('澳门')?.longitude).toBeCloseTo(113.55, 1);
  });

  test('石河子出生按真太阳时应偏移约 -2 小时,而非 -8 小时', () => {
    const n = normalizeBirth({ year: 2000, month: 6, day: 1, hour: 12, longitude: lookupCity('石河子')!.longitude });
    expect(n.record.totalOffsetMinutes!).toBeGreaterThan(-150);
    expect(n.record.totalOffsetMinutes!).toBeLessThan(-120);
  });
});
