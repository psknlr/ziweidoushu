/**
 * 西洋占星(星座)计算:行星黄经(回归黄道、真黄道 of date)、上升/天顶、整宫制宫位、相位、元素/三方性质平衡。
 *
 * 天文内核:astronomy-engine(MIT,Don Cross;VSOP87/ELP 简化模型,行星 ±1′ 精度,远超占星需要)。
 * - 太阳:SunPosition(地心视黄经);月亮:EclipticGeoMoon;其它行星:Ecliptic(GeoVector(body, date, aberration=true))
 *   (GeoVector 返回 J2000 赤道坐标,Ecliptic 转为当日真黄道坐标 —— 即回归黄道黄经)
 * - 上升/天顶:标准球面三角公式(见维基百科 "Ascendant" 条目):
 *     RAMC = 格林尼治视恒星时 × 15 + 东经
 *     MC   = atan2(sin RAMC, cos RAMC · cos ε)
 *     ASC  = atan2(cos RAMC, −(sin RAMC · cos ε + tan φ · sin ε))
 *   ε 取当日真黄赤交角(e_tilt().tobl)
 * - 平均北交点:Meeus《Astronomical Algorithms》第 47 章多项式
 *
 * 时间:占星用**民用标准时**换算 UTC(与紫微/八字的真太阳时不同),中国大陆默认 UTC+8;
 * 1986-1991 夏令时须先扣回(调用方传入已扣夏令时的标准时)。
 */
import * as AEm from 'astronomy-engine';
import type { Gender } from '../keys.js';
import { ENGINE_ID, ENGINE_VERSION } from '../adapter.js';
import {
  ASPECTS, BALANCE_WEIGHT, ELEMENTS4, MODALITIES, MOON_PHASES, PLANETS, RULER_MODERN, RULER_TRADITIONAL,
  SIGN_ELEMENT, SIGN_MODALITY, SIGNS, dignityOf, signIndex, signOfLongitude,
  type Element4, type Modality, type PlanetKey, type PointKey, type SignKey,
} from './tables.js';
import type { Aspect, AstroChart, AstroYear, Balance, PlanetPosition, SignPosition } from './types.js';

// CJS/ESM 互操作:tsx 走 require 条件时命名导出挂在 default 上;ESM 打包(Vite)时直接用命名空间。
// 用变量键访问以免打包器对「default 不存在」发静态警告。
const DEFAULT_KEY = 'default';
const AE = ('Body' in AEm ? AEm : (AEm as unknown as Record<string, typeof AEm>)[DEFAULT_KEY]) as typeof AEm;

export const ASTRO_KERNEL = 'astronomy-engine@2.1.19';

const RAD = Math.PI / 180;
const norm360 = (d: number): number => ((d % 360) + 360) % 360;
/** 把角差归一到 (-180, 180] */
const wrap180 = (d: number): number => {
  const n = norm360(d);
  return n > 180 ? n - 360 : n;
};
const round = (n: number, p = 2): number => Math.round(n * 10 ** p) / 10 ** p;
const pad = (n: number) => String(n).padStart(2, '0');

export interface AstroInput {
  /** 本地**标准时**(已扣夏令时;不要传真太阳时) */
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  gender: Gender;
  /** 时区偏移(分钟),默认 480(UTC+8) */
  utcOffsetMinutes?: number;
  /** 出生地(北纬/东经为正);缺省则无上升天顶 */
  latitude?: number;
  longitude?: number;
  timeSource?: AstroChart['meta']['timeSource'];
}

const BODY_OF: Record<Exclude<PlanetKey, 'sun' | 'moon'>, AEm.Body> = {
  mercury: 'Mercury' as AEm.Body, venus: 'Venus' as AEm.Body, mars: 'Mars' as AEm.Body, jupiter: 'Jupiter' as AEm.Body,
  saturn: 'Saturn' as AEm.Body, uranus: 'Uranus' as AEm.Body, neptune: 'Neptune' as AEm.Body, pluto: 'Pluto' as AEm.Body,
};

/** 某时刻行星的地心视黄经/黄纬(回归黄道,当日真黄道) */
export function planetEcliptic(key: PlanetKey, date: Date): { lon: number; lat: number } {
  if (key === 'sun') {
    const p = AE.SunPosition(date);
    return { lon: norm360(p.elon), lat: p.elat };
  }
  if (key === 'moon') {
    const m = AE.EclipticGeoMoon(date);
    return { lon: norm360(m.lon), lat: m.lat };
  }
  const ecl = AE.Ecliptic(AE.GeoVector(BODY_OF[key], date, true));
  return { lon: norm360(ecl.elon), lat: ecl.elat };
}

/** 平均北交点黄经(Meeus 47.7) */
export function meanNodeLongitude(date: Date): number {
  const jd = date.getTime() / 86_400_000 + 2_440_587.5;
  const t = (jd - 2_451_545) / 36_525;
  return norm360(125.0445479 - 1934.1362891 * t + 0.0020754 * t * t + (t * t * t) / 467_441 - (t * t * t * t) / 60_616_000);
}

/** 当日真黄赤交角(度) */
export function obliquity(date: Date): number {
  return AE.e_tilt(AE.MakeTime(date)).tobl;
}

/** 上升与天顶黄经;latitude 北纬为正,longitude 东经为正 */
export function ascendantMidheaven(date: Date, latitude: number, longitude: number): { ascendant: number; midheaven: number; ramc: number } {
  const gast = AE.SiderealTime(date); // 小时
  const ramc = norm360(gast * 15 + longitude);
  const eps = obliquity(date) * RAD;
  const r = ramc * RAD;
  const phi = latitude * RAD;
  const mc = norm360(Math.atan2(Math.sin(r), Math.cos(r) * Math.cos(eps)) / RAD);
  const asc = norm360(Math.atan2(Math.cos(r), -(Math.sin(r) * Math.cos(eps) + Math.tan(phi) * Math.sin(eps))) / RAD);
  return { ascendant: asc, midheaven: mc, ramc };
}

export function toSignPosition(longitude: number): SignPosition {
  const lon = norm360(longitude);
  return { sign: signOfLongitude(lon), degree: round(lon % 30), longitude: round(lon, 4) };
}

/** 整宫制:以第一宫星座起算 */
export function wholeSignHouse(sign: SignKey, firstHouseSign: SignKey): number {
  return ((signIndex(sign) - signIndex(firstHouseSign) + 12) % 12) + 1;
}

function isRetrograde(key: PlanetKey, date: Date, lonNow: number): boolean {
  if (key === 'sun' || key === 'moon') return false;
  const later = planetEcliptic(key, new Date(date.getTime() + 3_600_000)).lon;
  return wrap180(later - lonNow) < 0;
}

/** 两点间相位(含容许度判定);luminary 参与时容许度 +1 */
export function aspectBetween(a: PointKey, lonA: number, b: PointKey, lonB: number, orbScale = 1): Aspect | undefined {
  const diff = Math.abs(wrap180(lonA - lonB));
  const bonus = a === 'sun' || a === 'moon' || b === 'sun' || b === 'moon' ? 1 : 0;
  let best: Aspect | undefined;
  for (const def of ASPECTS) {
    const orb = Math.abs(diff - def.angle);
    if (orb <= (def.orb + bonus) * orbScale && (!best || orb < best.orb)) {
      best = { a, b, type: def.key, orb: round(orb), nature: def.nature };
    }
  }
  return best;
}

function balance<K extends string>(keys: readonly K[], weightOf: (p: PlanetPosition | SignPosition, k: PointKey) => Partial<Record<K, number>>, points: { key: PointKey; pos: SignPosition }[]): Balance<K> {
  const weights = Object.fromEntries(keys.map((k) => [k, 0])) as Record<K, number>;
  for (const { key, pos } of points) {
    const w = weightOf(pos, key);
    for (const k of keys) weights[k] += w[k] ?? 0;
  }
  const max = Math.max(...keys.map((k) => weights[k]));
  return {
    weights,
    dominant: keys.filter((k) => weights[k] === max && max > 0),
    lacking: keys.filter((k) => weights[k] < 1),
  };
}

export function computeAstro(input: AstroInput): AstroChart {
  const minute = input.minute ?? 0;
  const offset = input.utcOffsetMinutes ?? 480;
  const utc = new Date(Date.UTC(input.year, input.month - 1, input.day, input.hour, minute) - offset * 60_000);
  const hasLocation = typeof input.latitude === 'number' && typeof input.longitude === 'number' && Math.abs(input.latitude) < 89.9;

  const angles = hasLocation ? ascendantMidheaven(utc, input.latitude!, input.longitude!) : undefined;
  const ascendant = angles ? toSignPosition(angles.ascendant) : undefined;
  const midheaven = angles ? toSignPosition(angles.midheaven) : undefined;

  const raw = PLANETS.map((key) => ({ key, ...planetEcliptic(key, utc) }));
  const sunSign = signOfLongitude(raw[0]!.lon);
  const firstHouse = ascendant?.sign ?? sunSign;

  const planets: PlanetPosition[] = raw.map(({ key, lon, lat }) => {
    const pos = toSignPosition(lon);
    const dignity = dignityOf(key, pos.sign);
    return {
      key, ...pos,
      retrograde: isRetrograde(key, utc, lon),
      house: wholeSignHouse(pos.sign, firstHouse),
      ...(dignity ? { dignity } : {}),
      latitude: round(lat),
    };
  });
  const northNode = toSignPosition(meanNodeLongitude(utc));

  // 相位:行星两两 + 行星×上升/天顶;北交点仅取合/冲
  const pointList: { key: PointKey; lon: number }[] = [
    ...planets.map((p) => ({ key: p.key, lon: p.longitude })),
    ...(ascendant ? [{ key: 'ascendant' as const, lon: ascendant.longitude }] : []),
    ...(midheaven ? [{ key: 'midheaven' as const, lon: midheaven.longitude }] : []),
  ];
  const aspects: Aspect[] = [];
  for (let i = 0; i < pointList.length; i++) {
    for (let j = i + 1; j < pointList.length; j++) {
      const a = pointList[i]!;
      const b = pointList[j]!;
      if (a.key === 'ascendant' && b.key === 'midheaven') continue;
      const hit = aspectBetween(a.key, a.lon, b.key, b.lon);
      if (hit) aspects.push(hit);
    }
  }
  for (const p of planets) {
    const hit = aspectBetween(p.key, p.longitude, 'northNode', northNode.longitude);
    if (hit && (hit.type === 'conjunction' || hit.type === 'opposition')) aspects.push(hit);
  }
  aspects.sort((x, y) => x.orb - y.orb);

  const balancePoints = [
    ...planets.map((p) => ({ key: p.key as PointKey, pos: p as SignPosition })),
    ...(ascendant ? [{ key: 'ascendant' as PointKey, pos: ascendant }] : []),
  ];
  const elements = balance<Element4>(ELEMENTS4, (pos, k) => ({ [SIGN_ELEMENT[pos.sign]]: BALANCE_WEIGHT[k] ?? 0 }) as Partial<Record<Element4, number>>, balancePoints);
  const modalities = balance<Modality>(MODALITIES, (pos, k) => ({ [SIGN_MODALITY[pos.sign]]: BALANCE_WEIGHT[k] ?? 0 }) as Partial<Record<Modality, number>>, balancePoints);

  const sun = planets[0]!;
  const moon = planets[1]!;
  const elongation = norm360(moon.longitude - sun.longitude);
  const phaseIdx = Math.floor(norm360(elongation + 22.5) / 45) % 8;

  const rulerSign = ascendant?.sign ?? sunSign;
  const trad = RULER_TRADITIONAL[rulerSign];
  const modern = RULER_MODERN[rulerSign];

  const bySign = new Map<SignKey, PlanetKey[]>();
  for (const p of planets) bySign.set(p.sign, [...(bySign.get(p.sign) ?? []), p.key as PlanetKey]);
  const stelliums = [...bySign.entries()].filter(([, ps]) => ps.length >= 3).map(([sign, ps]) => ({ sign, planets: ps }));

  return {
    meta: {
      engine: `${ENGINE_ID}@${ENGINE_VERSION}`,
      kernel: ASTRO_KERNEL,
      localTime: `${input.year}-${pad(input.month)}-${pad(input.day)} ${pad(input.hour)}:${pad(minute)}`,
      utcOffsetMinutes: offset,
      utc: utc.toISOString(),
      timeSource: input.timeSource ?? 'clock',
      gender: input.gender,
      ...(hasLocation ? { location: { latitude: input.latitude!, longitude: input.longitude! } } : {}),
      houseSystem: ascendant ? 'whole-sign' : 'solar-whole-sign',
      zodiac: 'tropical',
    },
    planets,
    ...(ascendant ? { ascendant } : {}),
    ...(midheaven ? { midheaven } : {}),
    northNode,
    aspects,
    elements,
    modalities,
    moonPhase: { key: MOON_PHASES[phaseIdx]!.key, elongation: round(elongation) },
    chartRuler: { traditional: trad, modern, position: planets.find((p) => p.key === trad)! },
    stelliums,
    bigThree: { sun: sunSign, moon: moon.sign, ...(ascendant ? { ascendant: ascendant.sign } : {}) },
  };
}

const TRANSITING: PlanetKey[] = ['jupiter', 'saturn', 'uranus', 'neptune', 'pluto'];
const NATAL_TARGETS: PointKey[] = ['sun', 'moon', 'ascendant', 'midheaven', 'mercury', 'venus', 'mars', 'jupiter', 'saturn'];

/**
 * 流年:小限法(Annual Profection,希腊占星通行技法:每岁推进一宫,周岁 0 为一宫)
 * + 当年生日时刻的慢行星过境快照及其与本命要点的相位(容许度收紧为本命一半)。
 */
export function astroYear(chart: AstroChart, year: number): AstroYear {
  const [datePart, timePart] = chart.meta.localTime.split(' ') as [string, string];
  const [by, bm, bd] = datePart.split('-').map(Number) as [number, number, number];
  const [bh, bmi] = timePart.split(':').map(Number) as [number, number];
  const age = Math.max(0, year - by);
  const firstHouse = chart.ascendant?.sign ?? chart.bigThree.sun;
  const house = (age % 12) + 1;
  const sign = SIGNS[(signIndex(firstHouse) + age) % 12]!;
  const timeLord = RULER_TRADITIONAL[sign];

  // 当年生日(2 月 29 日生人非闰年取 2 月 28 日)
  const safeDay = Math.min(bd, new Date(Date.UTC(year, bm, 0)).getUTCDate());
  const at = new Date(Date.UTC(year, bm - 1, safeDay, bh, bmi) - chart.meta.utcOffsetMinutes * 60_000);
  const positions = TRANSITING.map((key) => {
    const { lon } = planetEcliptic(key, at);
    const pos = toSignPosition(lon);
    return { key, ...pos, retrograde: isRetrograde(key, at, lon), house: wholeSignHouse(pos.sign, firstHouse) };
  });
  const natal: { key: PointKey; lon: number }[] = [
    ...chart.planets.map((p) => ({ key: p.key, lon: p.longitude })),
    ...(chart.ascendant ? [{ key: 'ascendant' as const, lon: chart.ascendant.longitude }] : []),
    ...(chart.midheaven ? [{ key: 'midheaven' as const, lon: chart.midheaven.longitude }] : []),
  ].filter((n) => NATAL_TARGETS.includes(n.key));
  const aspects: AstroYear['transits']['aspects'] = [];
  for (const t of positions) {
    for (const n of natal) {
      const hit = aspectBetween(t.key, t.longitude, n.key, n.lon, 0.5);
      if (hit) aspects.push({ transit: t.key, natal: n.key, type: hit.type, orb: hit.orb, nature: hit.nature });
    }
  }
  aspects.sort((x, y) => x.orb - y.orb);

  return {
    year,
    age,
    profection: { house, sign, timeLord, timeLordNatal: chart.planets.find((p) => p.key === timeLord)! },
    transits: { at: `${year}-${pad(bm)}-${pad(safeDay)} ${pad(bh)}:${pad(bmi)}`, positions, aspects },
  };
}
