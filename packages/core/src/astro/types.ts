/**
 * 西洋占星(星座)可序列化数据模型。
 * 所有角度为黄经(度,0-360,回归黄道、当日真黄道 ecliptic of date)。
 */
import type { Gender } from '../keys.js';
import type {
  AspectKey, Dignity, Element4, Modality, MoonPhaseKey, PlanetKey, PointKey, SignKey,
} from './tables.js';

export interface SignPosition {
  sign: SignKey;
  /** 星座内度数 0-30 */
  degree: number;
  /** 绝对黄经 */
  longitude: number;
}

export interface PlanetPosition extends SignPosition {
  key: PointKey;
  /** 逆行(日月与上升天顶恒为 false) */
  retrograde: boolean;
  /** 整宫制宫位 1-12(无上升时为太阳整宫) */
  house: number;
  /** 庙旺陷弱(仅行星) */
  dignity?: Dignity;
  /** 黄纬(度),仅行星 */
  latitude?: number;
}

export interface Aspect {
  a: PointKey;
  b: PointKey;
  type: AspectKey;
  /** 与精确角度之差(度) */
  orb: number;
  nature: 'neutral' | 'harmonious' | 'challenging';
}

export interface Balance<K extends string> {
  weights: Record<K, number>;
  dominant: K[];
  lacking: K[];
}

export interface AstroChart {
  meta: {
    engine: string;
    /** 天文内核 */
    kernel: string;
    /** 本地标准时(非真太阳时;占星以民用标准时换算 UTC) */
    localTime: string;
    utcOffsetMinutes: number;
    utc: string;
    timeSource: 'clock' | 'clock-dst' | 'timeIndex';
    gender: Gender;
    /** 出生地;缺省则无上升/天顶,宫位退化为太阳整宫 */
    location?: { latitude: number; longitude: number };
    houseSystem: 'whole-sign' | 'solar-whole-sign';
    zodiac: 'tropical';
  };
  planets: PlanetPosition[];
  ascendant?: SignPosition;
  midheaven?: SignPosition;
  /** 平均北交点(Meeus 公式) */
  northNode: SignPosition;
  aspects: Aspect[];
  elements: Balance<Element4>;
  modalities: Balance<Modality>;
  moonPhase: { key: MoonPhaseKey; /** 月日黄经差 0-360 */ elongation: number };
  /** 命主星(上升守护;无上升则太阳守护):传统与现代 */
  chartRuler?: { traditional: PlanetKey; modern: PlanetKey; position: PlanetPosition };
  /** 星群:同星座 ≥3 颗行星 */
  stelliums: { sign: SignKey; planets: PlanetKey[] }[];
  /** 三大:太阳/月亮/上升 */
  bigThree: { sun: SignKey; moon: SignKey; ascendant?: SignKey };
}

/** 流年:小限(Annual Profection)+ 当年慢行星过境 */
export interface AstroYear {
  year: number;
  /** 周岁(当年生日所满) */
  age: number;
  profection: {
    house: number;
    sign: SignKey;
    /** 年主星(小限宫守护星,传统守护) */
    timeLord: PlanetKey;
    timeLordNatal: PlanetPosition;
  };
  /** 当年生日时刻的过境行星(木土天海冥)及其与本命要点的主要相位 */
  transits: {
    at: string;
    positions: (SignPosition & { key: PlanetKey; retrograde: boolean; /** 以本命整宫计 */ house: number })[];
    aspects: { transit: PlanetKey; natal: PointKey; type: AspectKey; orb: number; nature: Aspect['nature'] }[];
  };
}
