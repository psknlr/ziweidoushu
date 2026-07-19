/**
 * 黄金命例回归(设计文档 §10.1)。
 *
 * 基准来源:iztro 2.5.8 官方测试套件中经作者对拍验证的命例
 * (src/__tests__/astro/astro.test.ts),口径为 iztro 出厂默认配置。
 * 本测试保护的是适配层映射与未来内核替换 —— 任何算法/映射改动
 * 导致与基准不符都会在此失败。
 */
import { describe, expect, test } from 'vitest';
import { PRESET_QUANSHU, ZiweiEngine } from '@ziwei/core';

const engine = new ZiweiEngine(PRESET_QUANSHU);

describe('黄金命例:2000-8-16 寅时 女(iztro 官方验证盘)', () => {
  const chart = engine.bySolar('2000-8-16', 2, 'female');

  test('基础盘面信息', () => {
    expect(chart.lunarDate).toBe('二〇〇〇年七月十七');
    expect(chart.ganzhi.year).toEqual({ stem: 'gengHeavenly', branch: 'chenEarthly' });
    expect(chart.ganzhi.month).toEqual({ stem: 'jiaHeavenly', branch: 'shenEarthly' });
    expect(chart.ganzhi.day).toEqual({ stem: 'bingHeavenly', branch: 'wuEarthly' });
    expect(chart.ganzhi.hour).toEqual({ stem: 'gengHeavenly', branch: 'yinEarthly' });
    expect(chart.soulPalaceBranch).toBe('wuEarthly');
    expect(chart.bodyPalaceBranch).toBe('xuEarthly');
    expect(chart.soul).toBe('pojunMaj');
    expect(chart.body).toBe('wenchangMin');
    expect(chart.fiveElementsClass).toBe('wood3rd');
    expect(chart.zodiac).toBe('龙');
    expect(chart.sign).toBe('狮子座');
  });

  test('结构不变量:12 宫齐全、名称唯一、索引对齐、14 主星齐全', () => {
    expect(chart.palaces).toHaveLength(12);
    const names = new Set(chart.palaces.map((p) => p.name));
    expect(names.size).toBe(12);
    chart.palaces.forEach((p, i) => expect(p.index).toBe(i));
    const majorCount = chart.palaces.flatMap((p) => p.majorStars.filter((s) => s.type === 'major')).length;
    expect(majorCount).toBe(14);
  });

  test('生年四化(庚干):太阳禄、武曲权、太阴科、天同忌', () => {
    const withMutagen = new Map(
      chart.palaces
        .flatMap((p) => [...p.majorStars, ...p.minorStars])
        .filter((s) => s.mutagen)
        .map((s) => [s.key, s.mutagen]),
    );
    expect(withMutagen.get('taiyangMaj')).toBe('sihuaLu');
    expect(withMutagen.get('wuquMaj')).toBe('sihuaQuan');
    expect(withMutagen.get('taiyinMaj')).toBe('sihuaKe');
    expect(withMutagen.get('tiantongMaj')).toBe('sihuaJi');
    expect(withMutagen.size).toBe(4);
  });

  test('空宫借宫:父母宫无主星,借对宫主星(结构化字段)', () => {
    const parents = chart.palaces.find((p) => p.name === 'parentsPalace');
    expect(parents).toBeDefined();
    expect(parents!.majorStars.filter((s) => s.type === 'major')).toHaveLength(0);
    expect(parents!.borrowed).toBeDefined();
    expect(parents!.borrowed!.stars.length).toBeGreaterThan(0);
    expect(parents!.borrowed!.fromIndex).toBe((parents!.index + 6) % 12);
  });

  test('chartHash 稳定且与配置绑定', () => {
    const again = engine.bySolar('2000-8-16', 2, 'female');
    expect(again.meta.chartHash).toBe(chart.meta.chartHash);
    const other = new ZiweiEngine({ yearDivide: 'exact' }).bySolar('2000-8-16', 2, 'female');
    expect(other.meta.chartHash).not.toBe(chart.meta.chartHash);
  });

  test('运限快照 2023-8-19 3:12(大限/小限/流年/流月/流日/流时)', () => {
    const h = engine.horoscope(chart, '2023-8-19 3:12');

    expect(h.decadal.index).toBe(2);
    expect(h.decadal.stem).toBe('gengHeavenly');
    expect(h.decadal.branch).toBe('chenEarthly');
    expect(h.decadal.mutagen).toEqual(['taiyangMaj', 'wuquMaj', 'taiyinMaj', 'tiantongMaj']);
    expect(h.decadal.palaceNames[0]).toBe('spousePalace');
    expect(h.decadal.palaceNames[2]).toBe('soulPalace');

    expect(h.age.index).toBe(9);
    expect(h.age.nominalAge).toBe(24);

    expect(h.yearly.index).toBe(1);
    expect(h.yearly.stem).toBe('guiHeavenly');
    expect(h.yearly.branch).toBe('maoEarthly');
    expect(h.yearly.mutagen).toEqual(['pojunMaj', 'jumenMaj', 'taiyinMaj', 'tanlangMaj']);

    expect(h.monthly.index).toBe(3);
    expect(h.monthly.stem).toBe('gengHeavenly');
    expect(h.monthly.branch).toBe('shenEarthly');

    expect(h.daily.index).toBe(6);
    expect(h.daily.stem).toBe('jiHeavenly');
    expect(h.daily.branch).toBe('youEarthly');

    expect(h.hourly.index).toBe(8);
    expect(h.hourly.stem).toBe('bingHeavenly');
    expect(h.hourly.branch).toBe('yinEarthly');
  });
});
