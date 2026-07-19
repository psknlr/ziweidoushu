/**
 * 实例隔离测试 —— 验证对 iztro 全局可变配置缺陷的修复。
 * 多引擎、多流派交错调用必须互不污染(设计文档 §4.1)。
 */
import { describe, expect, test } from 'vitest';
import { resolveSchool, ZiweiEngine } from '@ziwei/core';

describe('流派配置实例隔离', () => {
  test('年分界:正月初一 vs 立春,同日不同年柱(2023-1-25 在初一后、立春前)', () => {
    const normal = new ZiweiEngine({ yearDivide: 'normal', horoscopeDivide: 'normal' });
    const exact = new ZiweiEngine({ yearDivide: 'exact', horoscopeDivide: 'exact' });

    expect(normal.bySolar('2023-1-25', 6, 'male').ganzhi.year).toEqual({
      stem: 'guiHeavenly',
      branch: 'maoEarthly',
    });
    expect(exact.bySolar('2023-1-25', 6, 'male').ganzhi.year).toEqual({
      stem: 'renHeavenly',
      branch: 'yinEarthly',
    });
  });

  test('交错调用不泄漏:A→B→A 的 A 两次结果完全一致', () => {
    const a = new ZiweiEngine({ yearDivide: 'normal' });
    const b = new ZiweiEngine({ yearDivide: 'exact', dayDivide: 'forward', algorithm: 'zhongzhou' });

    const first = a.bySolar('2023-1-25', 6, 'male');
    b.bySolar('2023-1-25', 12, 'female');
    const second = a.bySolar('2023-1-25', 6, 'male');

    expect(second).toEqual(first);
  });

  test('自定义四化表只作用于本实例,且不残留污染后续实例', () => {
    // 庚干默认:太阳禄 武曲权 太阴科 天同忌;自定义把"科"改到天府(仅测隔离,非流派主张)
    const custom = new ZiweiEngine({
      mutagens: { gengHeavenly: ['taiyangMaj', 'wuquMaj', 'tianfuMaj', 'tiantongMaj'] },
    });
    const chartCustom = custom.bySolar('2000-8-16', 2, 'female');
    const mutagens = (chart: typeof chartCustom) =>
      new Map(
        chart.palaces
          .flatMap((p) => [...p.majorStars, ...p.minorStars])
          .filter((s) => s.mutagen)
          .map((s) => [s.key, s.mutagen]),
      );

    expect(mutagens(chartCustom).get('tianfuMaj')).toBe('sihuaKe');
    expect(mutagens(chartCustom).get('taiyinMaj')).toBeUndefined();

    // 新的默认引擎不应继承上面的覆盖(iztro 原生 config 会残留,引擎必须清空)
    const plain = new ZiweiEngine();
    const chartPlain = plain.bySolar('2000-8-16', 2, 'female');
    expect(mutagens(chartPlain).get('taiyinMaj')).toBe('sihuaKe');
    expect(mutagens(chartPlain).get('tianfuMaj')).toBeUndefined();
  });

  test('未知预设名抛错', () => {
    expect(() => resolveSchool('no-such-preset')).toThrow(/未知流派预设/);
  });

  test('运限推算使用盘上配置快照,而非引擎当前配置', () => {
    const a = new ZiweiEngine({ yearDivide: 'normal', horoscopeDivide: 'normal' });
    const chart = a.bySolar('2000-8-16', 2, 'female');
    // 用另一个配置完全不同的引擎推同一张盘的运限,结果必须由盘上快照决定
    const b = new ZiweiEngine({ yearDivide: 'exact', horoscopeDivide: 'exact', algorithm: 'zhongzhou' });
    const ha = a.horoscope(chart, '2023-8-19 3:12');
    const hb = b.horoscope(chart, '2023-8-19 3:12');
    expect(hb).toEqual(ha);
  });
});
