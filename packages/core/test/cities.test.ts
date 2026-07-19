/**
 * 全国城市库测试:规模、省份覆盖、检索排序(市级优先)、真太阳时联动。
 */
import { describe, expect, test } from 'vitest';
import { CITIES, cityLabel, lookupCity, searchCities, ZiweiEngine } from '@ziwei/core';

describe('中国全量城市库', () => {
  test('规模 ≥ 3000,覆盖 31 省级行政区', () => {
    expect(CITIES.length).toBeGreaterThanOrEqual(3000);
    expect(new Set(CITIES.map((c) => c.province)).size).toBe(31);
  });

  test('「北京」命中北京市本级,而非区县', () => {
    const hit = lookupCity('北京');
    expect(hit).toBeDefined();
    expect(hit!.city).toBe('北京市');
    expect(Math.abs(hit!.longitude - 116.41)).toBeLessThan(0.3);
  });

  test('区县级可查:朝阳区(北京)、南山区(深圳)', () => {
    const chaoyang = searchCities('朝阳区').find((c) => c.province === '北京市');
    expect(chaoyang).toBeDefined();
    const nanshan = searchCities('南山').find((c) => c.city === '深圳市');
    expect(nanshan).toBeDefined();
  });

  test('小城市可查:漠河(最北)、三沙以外的偏远县', () => {
    expect(lookupCity('漠河')).toBeDefined();
    expect(lookupCity('喀什')).toBeDefined();
    expect(lookupCity('拉萨')).toBeDefined();
  });

  test('同名消歧:搜索返回多候选并带省市标签', () => {
    const results = searchCities('朝阳');
    expect(results.length).toBeGreaterThan(1);
    expect(new Set(results.map((c) => c.province)).size).toBeGreaterThan(1);
    expect(cityLabel(results[0]!)).toContain('·');
  });

  test('引擎真太阳时联动:乌鲁木齐经度校正生效', () => {
    const chart = new ZiweiEngine().fromBirth({
      year: 2000, month: 8, day: 16, hour: 15, gender: 'male', city: '乌鲁木齐',
    });
    const tst = chart.meta.input.trueSolarTime;
    expect(tst.enabled).toBe(true);
    expect(tst.longitude).toBeGreaterThan(87);
    expect(tst.longitude).toBeLessThan(88.5);
    expect(tst.timeIndexChanged).toBe(true);
  });
});
