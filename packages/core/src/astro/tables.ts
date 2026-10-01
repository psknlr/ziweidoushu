/**
 * 西洋占星(星座)静态表:黄道十二宫、行星、元素/三方性质、守护与庙旺(Essential Dignities)、相位定义。
 *
 * 依据(公开通行框架):
 * - 回归黄道(Tropical Zodiac):春分点 0° 白羊,每 30° 一宫 —— 现代西洋占星通行标准
 * - 元素/三方性质、传统守护与庙旺陷弱表:托勒密《四书》(Tetrabiblos)传统体系 + 现代外行星守护(天王/海王/冥王)
 * - 相位与容许度:主要相位(合 0°、冲 180°、拱 120°、刑 90°、六合 60°),容许度采用常见中位值
 *
 * 命名约定:星座/行星 key 一律英文小写;中文仅在 *_ZH 表中,与内核其它模块一致。
 */

export const SIGNS = [
  'aries', 'taurus', 'gemini', 'cancer', 'leo', 'virgo',
  'libra', 'scorpio', 'sagittarius', 'capricorn', 'aquarius', 'pisces',
] as const;
export type SignKey = (typeof SIGNS)[number];

export const SIGN_ZH: Record<SignKey, string> = {
  aries: '白羊座', taurus: '金牛座', gemini: '双子座', cancer: '巨蟹座', leo: '狮子座', virgo: '处女座',
  libra: '天秤座', scorpio: '天蝎座', sagittarius: '射手座', capricorn: '摩羯座', aquarius: '水瓶座', pisces: '双鱼座',
};

export const SIGN_GLYPH: Record<SignKey, string> = {
  aries: '♈', taurus: '♉', gemini: '♊', cancer: '♋', leo: '♌', virgo: '♍',
  libra: '♎', scorpio: '♏', sagittarius: '♐', capricorn: '♑', aquarius: '♒', pisces: '♓',
};

export const ELEMENTS4 = ['fire', 'earth', 'air', 'water'] as const;
export type Element4 = (typeof ELEMENTS4)[number];
export const ELEMENT4_ZH: Record<Element4, string> = { fire: '火', earth: '土', air: '风', water: '水' };

export const MODALITIES = ['cardinal', 'fixed', 'mutable'] as const;
export type Modality = (typeof MODALITIES)[number];
export const MODALITY_ZH: Record<Modality, string> = { cardinal: '启动', fixed: '固定', mutable: '变动' };

export const POLARITY_ZH = { positive: '阳', negative: '阴' } as const;

/** 星座 → 元素(火土风水循环)与三方性质(启动固定变动循环) */
export const SIGN_ELEMENT: Record<SignKey, Element4> = Object.fromEntries(
  SIGNS.map((s, i) => [s, ELEMENTS4[i % 4]!]),
) as Record<SignKey, Element4>;
export const SIGN_MODALITY: Record<SignKey, Modality> = Object.fromEntries(
  SIGNS.map((s, i) => [s, MODALITIES[i % 3]!]),
) as Record<SignKey, Modality>;
/** 阴阳:火风为阳,土水为阴 */
export const signPolarity = (s: SignKey): 'positive' | 'negative' =>
  SIGN_ELEMENT[s] === 'fire' || SIGN_ELEMENT[s] === 'air' ? 'positive' : 'negative';

export const PLANETS = ['sun', 'moon', 'mercury', 'venus', 'mars', 'jupiter', 'saturn', 'uranus', 'neptune', 'pluto'] as const;
export type PlanetKey = (typeof PLANETS)[number];
/** 盘上参与相位与宫位统计的点:十行星 + 上升/天顶 + 北交点 */
export const POINTS = [...PLANETS, 'ascendant', 'midheaven', 'northNode'] as const;
export type PointKey = (typeof POINTS)[number];

export const POINT_ZH: Record<PointKey, string> = {
  sun: '太阳', moon: '月亮', mercury: '水星', venus: '金星', mars: '火星', jupiter: '木星', saturn: '土星',
  uranus: '天王星', neptune: '海王星', pluto: '冥王星', ascendant: '上升', midheaven: '天顶', northNode: '北交点',
};
export const POINT_GLYPH: Record<PointKey, string> = {
  sun: '☉', moon: '☽', mercury: '☿', venus: '♀', mars: '♂', jupiter: '♃', saturn: '♄',
  uranus: '♅', neptune: '♆', pluto: '♇', ascendant: 'AC', midheaven: 'MC', northNode: '☊',
};

/** 个人行星 / 社会行星 / 世代行星(解读权重与容许度依据) */
export const PLANET_CLASS: Record<PlanetKey, 'luminary' | 'personal' | 'social' | 'outer'> = {
  sun: 'luminary', moon: 'luminary', mercury: 'personal', venus: 'personal', mars: 'personal',
  jupiter: 'social', saturn: 'social', uranus: 'outer', neptune: 'outer', pluto: 'outer',
};

/** 元素/三方性质统计权重(通行作法:发光体与上升 2,内行星与社会行星 1,世代行星 0.5) */
export const BALANCE_WEIGHT: Partial<Record<PointKey, number>> = {
  sun: 2, moon: 2, ascendant: 2, mercury: 1, venus: 1, mars: 1, jupiter: 1, saturn: 1, uranus: 0.5, neptune: 0.5, pluto: 0.5,
};

/** 守护星:传统(托勒密)与现代(含外行星) */
export const RULER_TRADITIONAL: Record<SignKey, PlanetKey> = {
  aries: 'mars', taurus: 'venus', gemini: 'mercury', cancer: 'moon', leo: 'sun', virgo: 'mercury',
  libra: 'venus', scorpio: 'mars', sagittarius: 'jupiter', capricorn: 'saturn', aquarius: 'saturn', pisces: 'jupiter',
};
export const RULER_MODERN: Record<SignKey, PlanetKey> = {
  ...RULER_TRADITIONAL, scorpio: 'pluto', aquarius: 'uranus', pisces: 'neptune',
};

export type Dignity = 'domicile' | 'exaltation' | 'detriment' | 'fall';
export const DIGNITY_ZH: Record<Dignity, string> = { domicile: '入庙', exaltation: '旺', detriment: '陷', fall: '弱' };

/**
 * 庙旺陷弱表(Essential Dignities,托勒密传统;外行星仅现代庙位):
 * 庙 = 守护之宫;旺 = 擢升之宫;陷 = 庙之对宫;弱 = 旺之对宫。
 */
const DIGNITY_TABLE: Record<PlanetKey, Partial<Record<Dignity, SignKey[]>>> = {
  sun: { domicile: ['leo'], exaltation: ['aries'], detriment: ['aquarius'], fall: ['libra'] },
  moon: { domicile: ['cancer'], exaltation: ['taurus'], detriment: ['capricorn'], fall: ['scorpio'] },
  mercury: { domicile: ['gemini', 'virgo'], exaltation: ['virgo'], detriment: ['sagittarius', 'pisces'], fall: ['pisces'] },
  venus: { domicile: ['taurus', 'libra'], exaltation: ['pisces'], detriment: ['scorpio', 'aries'], fall: ['virgo'] },
  mars: { domicile: ['aries', 'scorpio'], exaltation: ['capricorn'], detriment: ['libra', 'taurus'], fall: ['cancer'] },
  jupiter: { domicile: ['sagittarius', 'pisces'], exaltation: ['cancer'], detriment: ['gemini', 'virgo'], fall: ['capricorn'] },
  saturn: { domicile: ['capricorn', 'aquarius'], exaltation: ['libra'], detriment: ['cancer', 'leo'], fall: ['aries'] },
  uranus: { domicile: ['aquarius'], detriment: ['leo'] },
  neptune: { domicile: ['pisces'], detriment: ['virgo'] },
  pluto: { domicile: ['scorpio'], detriment: ['taurus'] },
};

/** 行星在某星座的庙旺陷弱(无则 undefined);水星在处女同为庙与旺,优先报「庙」 */
export function dignityOf(planet: PlanetKey, sign: SignKey): Dignity | undefined {
  const row = DIGNITY_TABLE[planet];
  for (const d of ['domicile', 'exaltation', 'detriment', 'fall'] as const) {
    if (row[d]?.includes(sign)) return d;
  }
  return undefined;
}

export type AspectKey = 'conjunction' | 'opposition' | 'trine' | 'square' | 'sextile';
export interface AspectDef {
  key: AspectKey;
  angle: number;
  /** 基础容许度(度);涉及日月时 +1 */
  orb: number;
  nature: 'neutral' | 'harmonious' | 'challenging';
}
export const ASPECTS: AspectDef[] = [
  { key: 'conjunction', angle: 0, orb: 8, nature: 'neutral' },
  { key: 'opposition', angle: 180, orb: 8, nature: 'challenging' },
  { key: 'trine', angle: 120, orb: 7, nature: 'harmonious' },
  { key: 'square', angle: 90, orb: 7, nature: 'challenging' },
  { key: 'sextile', angle: 60, orb: 5, nature: 'harmonious' },
];
export const ASPECT_ZH: Record<AspectKey, string> = {
  conjunction: '合相', opposition: '对分相', trine: '三分相', square: '四分相', sextile: '六分相',
};
export const ASPECT_GLYPH: Record<AspectKey, string> = { conjunction: '☌', opposition: '☍', trine: '△', square: '□', sextile: '⚹' };

/** 十二宫(整宫制)主题 */
export const HOUSE_ZH: Record<number, string> = {
  1: '自我与外貌', 2: '财务与价值', 3: '沟通与手足', 4: '家庭与根基', 5: '创造与恋爱', 6: '工作与健康',
  7: '伴侣与合作', 8: '共享资源与转化', 9: '远行与信念', 10: '事业与声望', 11: '朋友与愿景', 12: '潜意识与隐退',
};

/** 月相八分法(以月亮-太阳黄经差计) */
export const MOON_PHASES = [
  { key: 'new', zh: '新月', from: 0 },
  { key: 'waxingCrescent', zh: '眉月', from: 45 },
  { key: 'firstQuarter', zh: '上弦月', from: 90 },
  { key: 'waxingGibbous', zh: '盈凸月', from: 135 },
  { key: 'full', zh: '满月', from: 180 },
  { key: 'waningGibbous', zh: '亏凸月', from: 225 },
  { key: 'lastQuarter', zh: '下弦月', from: 270 },
  { key: 'waningCrescent', zh: '残月', from: 315 },
] as const;
export type MoonPhaseKey = (typeof MOON_PHASES)[number]['key'];

export function signOfLongitude(lon: number): SignKey {
  const norm = ((lon % 360) + 360) % 360;
  return SIGNS[Math.floor(norm / 30)]!;
}
export const signIndex = (s: SignKey): number => SIGNS.indexOf(s);
