/**
 * 西洋占星(星座)模块入口:computeAstro / astroFromAstrolabe / astroYear / describeAstro / astroSignals / compareAstro。
 */
import { ZH_CN } from '../keys.js';
import type { Astrolabe, Signal } from '../types.js';
import { aspectBetween, astroYear, computeAstro, type AstroInput } from './compute.js';
import {
  ASPECT_GLYPH, ASPECT_ZH, DIGNITY_ZH, ELEMENT4_ZH, HOUSE_ZH, MODALITY_ZH, MOON_PHASES, POINT_GLYPH, POINT_ZH, SIGN_ELEMENT,
  SIGN_ZH, type PointKey,
} from './tables.js';
import type { Aspect, AstroChart, PlanetPosition } from './types.js';

export * from './types.js';
export * from './tables.js';
export {
  computeAstro, astroYear, planetEcliptic, meanNodeLongitude, obliquity, ascendantMidheaven, toSignPosition, wholeSignHouse,
  aspectBetween, ASTRO_KERNEL, type AstroInput,
} from './compute.js';

/**
 * 由紫微星盘派生星座盘:取**标准民用时**(钟表时扣除夏令时;不用真太阳时),
 * 出生地取 chart.meta.location(由城市库或显式经纬度写入)。
 */
export function astroFromAstrolabe(chart: Astrolabe, location?: { latitude: number; longitude: number }, utcOffsetMinutes?: number): AstroChart {
  const tst = chart.meta.input.trueSolarTime;
  let y: number, m: number, d: number, h: number, mi: number;
  let timeSource: AstroChart['meta']['timeSource'];
  if (tst.originalLocal) {
    const [date, time] = tst.originalLocal.split(' ') as [string, string];
    const [oy, om, od] = date.split('-').map(Number) as [number, number, number];
    const [oh, omi] = time.split(':').map(Number) as [number, number];
    // 钟表时 → 标准时:扣夏令时
    const std = new Date(Date.UTC(oy, om - 1, od, oh, omi) - (tst.dstMinutes ?? 0) * 60_000);
    y = std.getUTCFullYear(); m = std.getUTCMonth() + 1; d = std.getUTCDate(); h = std.getUTCHours(); mi = std.getUTCMinutes();
    timeSource = tst.dstMinutes ? 'clock-dst' : 'clock';
  } else {
    [y, m, d] = chart.meta.input.solarDate.split('-').map(Number) as [number, number, number];
    const idx = chart.meta.input.timeIndex;
    h = idx === 0 ? 0 : idx === 12 ? 23 : 2 * idx - 1;
    mi = 30;
    timeSource = 'timeIndex';
  }
  const loc = location ?? chart.meta.location;
  return computeAstro({
    year: y, month: m, day: d, hour: h, minute: mi,
    gender: chart.gender,
    ...(loc ? { latitude: loc.latitude, longitude: loc.longitude } : {}),
    ...(utcOffsetMinutes !== undefined ? { utcOffsetMinutes } : {}),
    timeSource,
  });
}

const fmtDeg = (deg: number): string => {
  const d = Math.floor(deg);
  const m = Math.round((deg - d) * 60);
  return m === 60 ? `${d + 1}°00′` : `${d}°${String(m).padStart(2, '0')}′`;
};
export const formatPosition = (p: { sign: PlanetPosition['sign']; degree: number }): string => `${SIGN_ZH[p.sign]}${fmtDeg(p.degree)}`;
const planetLine = (p: PlanetPosition): string =>
  `${POINT_ZH[p.key]}${formatPosition(p)}${p.retrograde ? '(逆)' : ''}${p.dignity ? `[${DIGNITY_ZH[p.dignity]}]` : ''} ${p.house}宫`;
const aspectLine = (a: Aspect): string => `${POINT_ZH[a.a]}${ASPECT_GLYPH[a.type]}${POINT_ZH[a.b]}(${ASPECT_ZH[a.type]},差${a.orb}°)`;

/** 星座盘 → 结构化事实文字(供 Prompt / 导出 / 智能体上下文;只述事实,不作吉凶) */
export function describeAstro(astro: AstroChart, year?: number): string {
  const lines: string[] = [];
  const b = astro.bigThree;
  lines.push(
    `星座(回归黄道,${astro.meta.houseSystem === 'whole-sign' ? '整宫制' : '无出生地→太阳整宫制'}):太阳${SIGN_ZH[b.sun]}、月亮${SIGN_ZH[b.moon]}` +
      (b.ascendant ? `、上升${SIGN_ZH[b.ascendant]}` : '(无上升,缺出生地经纬度)') +
      `;${ZH_CN[astro.meta.gender] ?? astro.meta.gender}命;标准时 ${astro.meta.localTime}(UTC${astro.meta.utcOffsetMinutes >= 0 ? '+' : ''}${astro.meta.utcOffsetMinutes / 60})` +
      (astro.meta.timeSource === 'timeIndex' ? ',按时辰中点' : astro.meta.timeSource === 'clock-dst' ? ',已扣夏令时' : ''),
  );
  lines.push(`行星:${astro.planets.map(planetLine).join(';')}`);
  if (astro.ascendant && astro.midheaven) {
    lines.push(`上升 ${formatPosition(astro.ascendant)};天顶 ${formatPosition(astro.midheaven)};北交点 ${formatPosition(astro.northNode)}`);
  } else {
    lines.push(`北交点 ${formatPosition(astro.northNode)}`);
  }
  if (astro.chartRuler) {
    const r = astro.chartRuler;
    lines.push(
      `命主星:${POINT_ZH[r.traditional]}${r.modern !== r.traditional ? `(现代守护 ${POINT_ZH[r.modern]})` : ''},落${formatPosition(r.position)} ${r.position.house}宫`,
    );
  }
  const el = astro.elements;
  const mo = astro.modalities;
  lines.push(
    `元素:${(['fire', 'earth', 'air', 'water'] as const).map((e) => `${ELEMENT4_ZH[e]}${el.weights[e]}`).join(' ')}(偏重${el.dominant.map((e) => ELEMENT4_ZH[e]).join('/')}${el.lacking.length ? `,缺${el.lacking.map((e) => ELEMENT4_ZH[e]).join('')}` : ''});` +
      `三方性质:${(['cardinal', 'fixed', 'mutable'] as const).map((m) => `${MODALITY_ZH[m]}${mo.weights[m]}`).join(' ')}(偏重${mo.dominant.map((m) => MODALITY_ZH[m]).join('/')})`,
  );
  const phase = MOON_PHASES.find((p) => p.key === astro.moonPhase.key)!;
  lines.push(`月相:${phase.zh}(月日黄经差 ${astro.moonPhase.elongation}°)` + (astro.stelliums.length ? `;星群:${astro.stelliums.map((s) => `${SIGN_ZH[s.sign]}(${s.planets.map((p) => POINT_ZH[p]).join('、')})`).join('、')}` : ''));
  const major = astro.aspects.filter((a) => a.orb <= 6).slice(0, 14);
  if (major.length) lines.push(`主要相位:${major.map(aspectLine).join(';')}`);
  if (year !== undefined) {
    const y = astroYear(astro, year);
    lines.push(
      `${year} 流年:小限行至第 ${y.profection.house} 宫(${SIGN_ZH[y.profection.sign]},${HOUSE_ZH[y.profection.house]}),年主星${POINT_ZH[y.profection.timeLord]}(本命落${formatPosition(y.profection.timeLordNatal)} ${y.profection.timeLordNatal.house}宫);` +
        `生日时刻过境:${y.transits.positions.map((p) => `${POINT_ZH[p.key]}${formatPosition(p)}${p.retrograde ? '逆' : ''}→本命${p.house}宫`).join('、')}` +
        (y.transits.aspects.length ? `;过境相位:${y.transits.aspects.slice(0, 8).map((a) => `${POINT_ZH[a.transit]}${ASPECT_GLYPH[a.type]}本命${POINT_ZH[a.natal]}(差${a.orb}°)`).join('、')}` : ''),
    );
  }
  return lines.join('\n');
}

/** 星座盘 → RAG 检索信号(实体约定:['astro', <维度>, <key>...]) */
export function astroSignals(astro: AstroChart): Signal[] {
  const out: Signal[] = [];
  const b = astro.bigThree;
  out.push({ entities: ['astro', 'sun', b.sun], weight: 90, kind: 'astro', note: `太阳${SIGN_ZH[b.sun]}` });
  out.push({ entities: ['astro', 'moon', b.moon], weight: 86, kind: 'astro', note: `月亮${SIGN_ZH[b.moon]}` });
  if (b.ascendant) out.push({ entities: ['astro', 'asc', b.ascendant], weight: 86, kind: 'astro', note: `上升${SIGN_ZH[b.ascendant]}` });
  for (const p of astro.planets) {
    if (p.key === 'mercury' || p.key === 'venus' || p.key === 'mars') {
      out.push({ entities: ['astro', p.key, p.sign], weight: 72, kind: 'astro', note: `${POINT_ZH[p.key]}${SIGN_ZH[p.sign]}` });
    } else if (p.key === 'jupiter' || p.key === 'saturn') {
      out.push({ entities: ['astro', p.key, p.sign], weight: 62, kind: 'astro', note: `${POINT_ZH[p.key]}${SIGN_ZH[p.sign]}` });
    }
    if (p.dignity) out.push({ entities: ['astro', 'dignity', p.key, p.dignity], weight: 55, kind: 'astro', note: `${POINT_ZH[p.key]}${DIGNITY_ZH[p.dignity]}` });
  }
  const sun = astro.planets[0]!;
  const moon = astro.planets[1]!;
  out.push({ entities: ['astro', 'sunHouse', String(sun.house)], weight: astro.ascendant ? 74 : 40, kind: 'astro', note: `太阳${sun.house}宫` });
  out.push({ entities: ['astro', 'moonHouse', String(moon.house)], weight: astro.ascendant ? 64 : 35, kind: 'astro', note: `月亮${moon.house}宫` });
  for (const e of astro.elements.dominant) out.push({ entities: ['astro', 'element', e], weight: 76, kind: 'astro', note: `偏${ELEMENT4_ZH[e]}` });
  for (const e of astro.elements.lacking) out.push({ entities: ['astro', 'elementLack', e], weight: 66, kind: 'astro', note: `缺${ELEMENT4_ZH[e]}` });
  for (const m of astro.modalities.dominant) out.push({ entities: ['astro', 'modality', m], weight: 70, kind: 'astro', note: `偏${MODALITY_ZH[m]}` });
  for (const a of astro.aspects) {
    const pair = [a.a, a.b].sort();
    const lum = pair.includes('sun') || pair.includes('moon');
    out.push({ entities: ['astro', 'aspect', a.type, ...pair], weight: Math.max(40, (lum ? 72 : 58) - Math.round(a.orb * 2)), kind: 'astro', note: aspectLine(a) });
  }
  out.push({ entities: ['astro', 'moonPhase', astro.moonPhase.key], weight: 50, kind: 'astro', note: MOON_PHASES.find((p) => p.key === astro.moonPhase.key)!.zh });
  for (const s of astro.stelliums) out.push({ entities: ['astro', 'stellium', s.sign], weight: 68, kind: 'astro', note: `${SIGN_ZH[s.sign]}星群` });
  if (astro.chartRuler) out.push({ entities: ['astro', 'ruler', astro.chartRuler.traditional], weight: 60, kind: 'astro', note: `命主星${POINT_ZH[astro.chartRuler.traditional]}` });
  return out.sort((a, b) => b.weight - a.weight);
}

export interface AstroSynastry {
  /** 太阳元素关系:同元素/相生(火风、土水)/相克 */
  sunElements: { a: string; b: string; relation: 'same' | 'compatible' | 'tension' };
  moonElements: { a: string; b: string; relation: 'same' | 'compatible' | 'tension' };
  /** 跨盘主要相位(日月金火上升两两) */
  interAspects: (Aspect & { fromA: PointKey; fromB: PointKey })[];
  notes: string[];
}

const SYN_POINTS: PointKey[] = ['sun', 'moon', 'venus', 'mars', 'ascendant', 'saturn'];
const elementRelation = (x: string, y: string): 'same' | 'compatible' | 'tension' => {
  if (x === y) return 'same';
  const pairs = new Set(['fire|air', 'air|fire', 'earth|water', 'water|earth']);
  return pairs.has(`${x}|${y}`) ? 'compatible' : 'tension';
};

/** 双盘星座比较(合盘 synastry 的确定性部分):元素关系 + 跨盘相位 */
export function compareAstro(a: AstroChart, b: AstroChart, labels: [string, string] = ['甲', '乙']): AstroSynastry {
  const lonOf = (c: AstroChart, k: PointKey): number | undefined =>
    k === 'ascendant' ? c.ascendant?.longitude : k === 'midheaven' ? c.midheaven?.longitude : k === 'northNode' ? c.northNode.longitude : c.planets.find((p) => p.key === k)?.longitude;
  const inter: AstroSynastry['interAspects'] = [];
  for (const pa of SYN_POINTS) {
    for (const pb of SYN_POINTS) {
      const la = lonOf(a, pa);
      const lb = lonOf(b, pb);
      if (la === undefined || lb === undefined) continue;
      const hit = aspectBetween(pa, la, pb, lb, 0.75);
      if (hit) inter.push({ ...hit, fromA: pa, fromB: pb });
    }
  }
  inter.sort((x, y) => x.orb - y.orb);
  const se = { a: SIGN_ELEMENT[a.bigThree.sun], b: SIGN_ELEMENT[b.bigThree.sun] };
  const me = { a: SIGN_ELEMENT[a.bigThree.moon], b: SIGN_ELEMENT[b.bigThree.moon] };
  const rel = (r: 'same' | 'compatible' | 'tension') => (r === 'same' ? '同元素' : r === 'compatible' ? '元素相生' : '元素相异');
  const notes = [
    `太阳:${labels[0]}${SIGN_ZH[a.bigThree.sun]} × ${labels[1]}${SIGN_ZH[b.bigThree.sun]}(${rel(elementRelation(se.a, se.b))});月亮:${labels[0]}${SIGN_ZH[a.bigThree.moon]} × ${labels[1]}${SIGN_ZH[b.bigThree.moon]}(${rel(elementRelation(me.a, me.b))})`,
    ...(inter.length
      ? [`跨盘相位:${inter.slice(0, 8).map((x) => `${labels[0]}${POINT_ZH[x.fromA]}${ASPECT_GLYPH[x.type]}${labels[1]}${POINT_ZH[x.fromB]}(差${x.orb}°)`).join('、')}`]
      : ['跨盘无紧密主要相位']),
  ];
  return {
    sunElements: { ...se, relation: elementRelation(se.a, se.b) },
    moonElements: { ...me, relation: elementRelation(me.a, me.b) },
    interAspects: inter,
    notes,
  };
}

/** 盘面一行速览,如「☉白羊 ☽巨蟹 AC天秤」 */
export function astroBrief(astro: AstroChart): string {
  const b = astro.bigThree;
  return `${POINT_GLYPH.sun}${SIGN_ZH[b.sun].slice(0, 2)} ${POINT_GLYPH.moon}${SIGN_ZH[b.moon].slice(0, 2)}${b.ascendant ? ` AC${SIGN_ZH[b.ascendant].slice(0, 2)}` : ''}`;
}
