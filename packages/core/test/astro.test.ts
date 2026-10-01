/**
 * 星座(西洋占星)模块测试:以独立天文事实校验(春分/夏至太阳黄经、满月月日黄经差、
 * 赤道 RAMC=0 时上升 90°),再核对星座归属、整宫制、相位、元素平衡、小限,以及与紫微盘共用出生时刻的一致性。
 */
import { describe, expect, test } from 'vitest';
import {
  ascendantMidheaven, astroFromAstrolabe, astroSignals, astroYear, compareAstro, computeAstro, describeAstro, dignityOf,
  exportChartData, meanNodeLongitude, planetEcliptic, SIGN_ELEMENT, SIGN_MODALITY, signOfLongitude, wholeSignHouse, ZiweiEngine,
} from '@ziwei/core';

const near = (a: number, b: number, tol: number) => Math.abs((((a - b) % 360) + 540) % 360 - 180) <= tol;

describe('天文独立事实', () => {
  test('2024 春分(03-20 03:06 UTC)太阳黄经 ≈ 0°;夏至(06-20 20:51 UTC)≈ 90°', () => {
    expect(near(planetEcliptic('sun', new Date(Date.UTC(2024, 2, 20, 3, 6))).lon, 0, 0.01)).toBe(true);
    expect(near(planetEcliptic('sun', new Date(Date.UTC(2024, 5, 20, 20, 51))).lon, 90, 0.01)).toBe(true);
  });
  test('2024-03-25 07:00 UTC 满月:月日黄经差 ≈ 180°', () => {
    const d = new Date(Date.UTC(2024, 2, 25, 7, 0));
    const sep = ((planetEcliptic('moon', d).lon - planetEcliptic('sun', d).lon) % 360 + 360) % 360;
    expect(near(sep, 180, 0.2)).toBe(true);
  });
  test('太阳经 GeoVector→Ecliptic 与 SunPosition 一致(验证行星路径为当日真黄道)', async () => {
    const AEm = await import('astronomy-engine');
    const AE = ((AEm as unknown as { default?: typeof AEm }).default ?? AEm) as typeof AEm;
    const d = new Date(Date.UTC(1990, 0, 15, 0, 30));
    const viaVector = AE.Ecliptic(AE.GeoVector('Sun' as typeof AE.Body.Sun, d, true)).elon;
    expect(near(viaVector, planetEcliptic('sun', d).lon, 0.01)).toBe(true);
  });
  test('赤道上 RAMC=0 → 上升 90°(巨蟹 0°)、天顶 0°;北纬 40° 上升领先天顶 0~180°', () => {
    // 寻找使 RAMC≈0 的经度:取 2000-01-01 12:00 UTC,GAST≈18.70h → 东经 -(18.70×15)
    const AEm = require('astronomy-engine') as typeof import('astronomy-engine');
    const AE = ((AEm as unknown as { default?: typeof AEm }).default ?? AEm) as typeof AEm;
    const d = new Date(Date.UTC(2000, 0, 1, 12, 0));
    const lon = ((-(AE.SiderealTime(d) * 15) % 360) + 360) % 360;
    const eq = ascendantMidheaven(d, 0, lon);
    expect(near(eq.ramc, 0, 1e-6)).toBe(true);
    expect(near(eq.ascendant, 90, 1e-3)).toBe(true);
    expect(near(eq.midheaven, 0, 1e-3)).toBe(true);
    const mid = ascendantMidheaven(new Date(Date.UTC(1990, 0, 15, 0, 30)), 39.9, 116.4);
    const lead = ((mid.ascendant - mid.midheaven) % 360 + 360) % 360;
    expect(lead).toBeGreaterThan(0);
    expect(lead).toBeLessThan(180);
  });
  test('平均北交点 2000-01-01 ≈ 125.04°(Meeus 多项式常数项)', () => {
    expect(near(meanNodeLongitude(new Date(Date.UTC(2000, 0, 1, 12))), 125.04, 0.01)).toBe(true);
  });
});

describe('星座归属与静态表', () => {
  test('黄经 → 星座,边界 29.99/30.0', () => {
    expect(signOfLongitude(0)).toBe('aries');
    expect(signOfLongitude(29.99)).toBe('aries');
    expect(signOfLongitude(30)).toBe('taurus');
    expect(signOfLongitude(359.9)).toBe('pisces');
    expect(signOfLongitude(-10)).toBe('pisces');
  });
  test('元素与三方性质循环;庙旺陷弱表', () => {
    expect(SIGN_ELEMENT.leo).toBe('fire');
    expect(SIGN_ELEMENT.capricorn).toBe('earth');
    expect(SIGN_MODALITY.aries).toBe('cardinal');
    expect(SIGN_MODALITY.pisces).toBe('mutable');
    expect(dignityOf('sun', 'leo')).toBe('domicile');
    expect(dignityOf('sun', 'aries')).toBe('exaltation');
    expect(dignityOf('saturn', 'aries')).toBe('fall');
    expect(dignityOf('venus', 'scorpio')).toBe('detriment');
    expect(dignityOf('uranus', 'cancer')).toBeUndefined();
  });
  test('整宫制宫位', () => {
    expect(wholeSignHouse('libra', 'libra')).toBe(1);
    expect(wholeSignHouse('cancer', 'libra')).toBe(10);
    expect(wholeSignHouse('virgo', 'libra')).toBe(12);
  });
});

describe('computeAstro', () => {
  const chart = computeAstro({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male', latitude: 39.9, longitude: 116.4 });

  test('1990-01-15 08:30 北京:太阳摩羯、月亮处女(公开星历),有上升天顶与整宫制', () => {
    expect(chart.bigThree.sun).toBe('capricorn');
    expect(chart.bigThree.moon).toBe('virgo');
    expect(chart.meta.utc).toBe('1990-01-15T00:30:00.000Z');
    expect(chart.meta.houseSystem).toBe('whole-sign');
    expect(chart.ascendant).toBeDefined();
    expect(chart.planets).toHaveLength(10);
    const asc = chart.ascendant!.sign;
    const sun = chart.planets[0]!;
    expect(sun.house).toBe(wholeSignHouse(sun.sign, asc));
    for (const p of chart.planets) {
      expect(p.degree).toBeGreaterThanOrEqual(0);
      expect(p.degree).toBeLessThan(30);
      expect(p.house).toBeGreaterThanOrEqual(1);
      expect(p.house).toBeLessThanOrEqual(12);
    }
    expect(chart.planets.find((p) => p.key === 'sun')!.retrograde).toBe(false);
  });

  test('相位:容许度内、无自反、按容许度排序;日月参与容许度 +1', () => {
    for (const a of chart.aspects) {
      expect(a.a).not.toBe(a.b);
      expect(a.orb).toBeLessThanOrEqual(9);
    }
    for (let i = 1; i < chart.aspects.length; i++) expect(chart.aspects[i]!.orb).toBeGreaterThanOrEqual(chart.aspects[i - 1]!.orb);
  });

  test('元素/三方性质权重和一致(10 行星 + 上升 = 12.5)', () => {
    const sumEl = Object.values(chart.elements.weights).reduce((a, b) => a + b, 0);
    const sumMo = Object.values(chart.modalities.weights).reduce((a, b) => a + b, 0);
    expect(sumEl).toBe(12.5);
    expect(sumMo).toBe(12.5);
    expect(chart.elements.dominant.length).toBeGreaterThan(0);
  });

  test('无出生地 → 太阳整宫制、无上升;权重和 10.5', () => {
    const solar = computeAstro({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male' });
    expect(solar.ascendant).toBeUndefined();
    expect(solar.meta.houseSystem).toBe('solar-whole-sign');
    expect(solar.planets[0]!.house).toBe(1);
    expect(Object.values(solar.elements.weights).reduce((a, b) => a + b, 0)).toBe(10.5);
    expect(solar.chartRuler!.traditional).toBe('saturn'); // 摩羯守护
  });

  test('月相:新月/满月判定', () => {
    // 2024-03-25 07:00 UTC 满月 → 北京时间 15:00
    const full = computeAstro({ year: 2024, month: 3, day: 25, hour: 15, gender: 'female' });
    expect(full.moonPhase.key).toBe('full');
    // 2024-04-08 18:21 UTC 新月(日全食)→ 北京 04-09 02:21
    const nw = computeAstro({ year: 2024, month: 4, day: 9, hour: 2, minute: 21, gender: 'female' });
    expect(nw.moonPhase.key).toBe('new');
    expect(nw.moonPhase.elongation < 2 || nw.moonPhase.elongation > 358).toBe(true);
  });

  test('逆行判定:2024-04-09 水星逆行(4/1–4/25 公开星历)', () => {
    const c = computeAstro({ year: 2024, month: 4, day: 9, hour: 12, gender: 'male' });
    expect(c.planets.find((p) => p.key === 'mercury')!.retrograde).toBe(true);
    expect(c.planets.find((p) => p.key === 'venus')!.retrograde).toBe(false);
  });

  test('时区偏移:UTC+0 输入与 UTC+8 输入指向同一时刻时结果一致', () => {
    const a = computeAstro({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male' });
    const b = computeAstro({ year: 1990, month: 1, day: 15, hour: 0, minute: 30, gender: 'male', utcOffsetMinutes: 0 });
    expect(a.planets.map((p) => p.longitude)).toEqual(b.planets.map((p) => p.longitude));
  });
});

describe('astroYear / describe / signals / synastry / export', () => {
  const engine = new ZiweiEngine();
  const chart = engine.fromBirth({ year: 1990, month: 1, day: 15, hour: 8, minute: 30, gender: 'male', city: '北京' });
  const astro = engine.astro(chart);

  test('fromBirth 写入出生地;astroFromAstrolabe 用标准时(非真太阳时)', () => {
    expect(chart.meta.location).toBeDefined();
    expect(chart.meta.input.trueSolarTime.enabled).toBe(true);
    expect(astro.meta.localTime).toBe('1990-01-15 08:30'); // 真太阳时校正不影响星座盘
    expect(astro.meta.timeSource).toBe('clock');
    expect(astro.ascendant).toBeDefined();
    expect(engine.astro(chart)).toBe(astro); // 缓存
  });

  test('夏令时扣除:1988-07-01 09:00 钟表时 → 标准时 08:00', () => {
    const c = engine.fromBirth({ year: 1988, month: 7, day: 1, hour: 9, gender: 'female' });
    const a = astroFromAstrolabe(c);
    expect(a.meta.localTime).toBe('1988-07-01 08:00');
    expect(a.meta.timeSource).toBe('clock-dst');
  });

  test('bySolar 盘(无钟表时)按时辰中点', () => {
    const c = engine.bySolar('1990-1-15', 4, 'male');
    const a = astroFromAstrolabe(c);
    expect(a.meta.localTime).toBe('1990-01-15 07:30');
    expect(a.meta.timeSource).toBe('timeIndex');
    expect(a.bigThree.sun).toBe('capricorn');
  });

  test('小限:周岁 0 为一宫,每岁进一宫;36 岁回到一宫', () => {
    const y0 = astroYear(astro, 1990);
    expect(y0.age).toBe(0);
    expect(y0.profection.house).toBe(1);
    expect(y0.profection.sign).toBe(astro.ascendant!.sign);
    const y36 = astroYear(astro, 2026);
    expect(y36.age).toBe(36);
    expect(y36.profection.house).toBe(1);
    const y5 = astroYear(astro, 1995);
    expect(y5.profection.house).toBe(6);
    expect(y36.transits.positions).toHaveLength(5);
    expect(y36.transits.at).toBe('2026-01-15 08:30');
    for (const a of y36.transits.aspects) expect(a.orb).toBeLessThanOrEqual(4.5);
  });

  test('describeAstro 含三大、行星、元素、流年', () => {
    const text = describeAstro(astro, 2026);
    expect(text).toContain('太阳摩羯座');
    expect(text).toContain('月亮处女座');
    expect(text).toContain('上升');
    expect(text).toContain('元素:');
    expect(text).toContain('2026 流年:小限行至第 1 宫');
    expect(text).toContain('年主星');
  });

  test('astroSignals 实体以 astro 开头、含三大与元素', () => {
    const sig = astroSignals(astro);
    for (const s of sig) {
      expect(s.entities[0]).toBe('astro');
      expect(s.kind).toBe('astro');
    }
    expect(sig.find((s) => s.entities.join('|') === 'astro|sun|capricorn')).toBeDefined();
    expect(sig.find((s) => s.entities.join('|') === 'astro|moon|virgo')).toBeDefined();
    expect(sig.some((s) => s.entities[1] === 'element')).toBe(true);
    expect(sig.some((s) => s.entities[1] === 'aspect')).toBe(true);
  });

  test('compareAstro:元素关系与跨盘相位', () => {
    const other = engine.astro(engine.fromBirth({ year: 1992, month: 8, day: 16, hour: 11, gender: 'female', city: '上海' }));
    const syn = compareAstro(astro, other, ['甲', '乙']);
    expect(syn.sunElements.a).toBe('earth'); // 摩羯
    expect(syn.sunElements.b).toBe('fire'); // 狮子
    expect(syn.sunElements.relation).toBe('tension');
    expect(syn.notes[0]).toContain('甲摩羯座 × 乙狮子座');
    for (const x of syn.interAspects) expect(x.orb).toBeLessThanOrEqual(7);
  });

  test('exportChartData 附带 astro', () => {
    const data = exportChartData(chart, engine.features(chart), '2026-01-01T00:00:00Z', engine.bazi(chart), astro) as { astro?: { bigThree: { sun: string } } };
    expect(data.astro?.bigThree.sun).toBe('capricorn');
  });
});
