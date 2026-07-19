/**
 * iztro 适配层:把 iztro 的 FunctionalAstrolabe / Horoscope
 * 转换为本内核的可序列化、语言无关(key-based)数据模型。
 *
 * 内部固定以 zh-CN 调用 iztro,再经 kot 反查为 key;
 * 任何反查失败都会经 assertKey 大声抛错(词表漂移检测)。
 */
import { kot } from 'iztro/lib/i18n';
import type FunctionalAstrolabe from 'iztro/lib/astro/FunctionalAstrolabe';
import type { Horoscope as IztroHoroscope, HoroscopeItem as IztroHoroscopeItem } from 'iztro/lib/data/types';
import type { IFunctionalPalace } from 'iztro/lib/astro/FunctionalPalace';
import type FunctionalStar from 'iztro/lib/star/FunctionalStar';
import {
  assertKey,
  BRANCH_KEY_SET,
  BRIGHTNESS_KEY_SET,
  FIVE_ELEMENTS_KEY_SET,
  MUTAGEN_KEY_SET,
  PALACE_KEY_SET,
  STAR_KEY_SET,
  STEM_KEY_SET,
  type BranchKey,
  type BrightnessKey,
  type Changsheng12Key,
  type Boshi12Key,
  type FiveElementsClassKey,
  type Gender,
  type Jiangqian12Key,
  type MutagenKey,
  type PalaceKey,
  type StarKey,
  type StemKey,
  type Suiqian12Key,
} from './keys.js';
import type {
  Astrolabe,
  GanzhiPillar,
  HoroscopeScopeItem,
  HoroscopeSnapshot,
  NormalizedInput,
  Palace,
  Star,
  StarScope,
  StarType,
} from './types.js';
import type { SchoolConfig } from './config.js';
import { stableHash } from './hash.js';

export const ENGINE_ID = '@ziwei/core';
export const ENGINE_VERSION = '0.1.0';
export const KERNEL_ID = 'iztro@2.5.8';

const toStemKey = (v: string): StemKey => assertKey<StemKey>(kot<string>(v, 'Heavenly'), STEM_KEY_SET, '天干');
const toBranchKey = (v: string): BranchKey => assertKey<BranchKey>(kot<string>(v, 'Earthly'), BRANCH_KEY_SET, '地支');
const toPalaceKey = (v: string): PalaceKey => assertKey<PalaceKey>(kot<string>(v, 'Palace'), PALACE_KEY_SET, '宫名');
const toStarKey = (v: string): StarKey => assertKey<StarKey>(kot<string>(v), STAR_KEY_SET, '星曜');
const toBrightness = (v: string): BrightnessKey => assertKey<BrightnessKey>(kot<string>(v), BRIGHTNESS_KEY_SET, '亮度');
const toMutagen = (v: string): MutagenKey => assertKey<MutagenKey>(kot<string>(v, 'sihua'), MUTAGEN_KEY_SET, '四化');

function toStar(star: FunctionalStar): Star {
  const out: Star = {
    key: toStarKey(star.name),
    type: star.type as StarType,
    scope: star.scope as StarScope,
  };
  if (star.brightness) out.brightness = toBrightness(star.brightness);
  if (star.mutagen) out.mutagen = toMutagen(star.mutagen);
  return out;
}

function toPalace(palace: IFunctionalPalace): Palace {
  return {
    index: palace.index,
    name: toPalaceKey(palace.name),
    isBodyPalace: palace.isBodyPalace,
    isOriginalPalace: palace.isOriginalPalace,
    stem: toStemKey(palace.heavenlyStem),
    branch: toBranchKey(palace.earthlyBranch),
    majorStars: palace.majorStars.map(toStar),
    minorStars: palace.minorStars.map(toStar),
    adjectiveStars: palace.adjectiveStars.map(toStar),
    changsheng12: assertKey<Changsheng12Key>(kot<string>(palace.changsheng12), STAR_KEY_SET, '长生12神'),
    boshi12: assertKey<Boshi12Key>(kot<string>(palace.boshi12), STAR_KEY_SET, '博士12神'),
    jiangqian12: assertKey<Jiangqian12Key>(kot<string>(palace.jiangqian12), STAR_KEY_SET, '将前12神'),
    suiqian12: assertKey<Suiqian12Key>(kot<string>(palace.suiqian12), STAR_KEY_SET, '岁前12神'),
    decadal: {
      range: [...palace.decadal.range] as [number, number],
      stem: toStemKey(palace.decadal.heavenlyStem),
      branch: toBranchKey(palace.decadal.earthlyBranch),
    },
    ages: [...palace.ages],
  };
}

function toPillar(pair: readonly [string, string] | readonly string[]): GanzhiPillar {
  const [stem, branch] = pair;
  if (!stem || !branch) throw new Error('[@ziwei/core] 干支柱数据缺失');
  return { stem: toStemKey(stem), branch: toBranchKey(branch) };
}

/** iztro FunctionalAstrolabe → 可序列化 Astrolabe */
export function adaptAstrolabe(
  raw: FunctionalAstrolabe,
  input: NormalizedInput,
  school: SchoolConfig,
  gender: Gender,
): Astrolabe {
  const chinese = raw.rawDates.chineseDate;
  return {
    meta: {
      engine: `${ENGINE_ID}@${ENGINE_VERSION}`,
      kernel: KERNEL_ID,
      school,
      input,
      chartHash: stableHash({
        solarDate: input.solarDate,
        timeIndex: input.timeIndex,
        gender,
        fixLeap: input.fixLeap,
        school: { ...school, preset: undefined },
      }),
    },
    gender,
    solarDate: raw.solarDate,
    lunarDate: raw.lunarDate,
    ganzhi: {
      year: toPillar(chinese.yearly),
      month: toPillar(chinese.monthly),
      day: toPillar(chinese.daily),
      hour: toPillar(chinese.hourly),
    },
    timeIndex: input.timeIndex,
    sign: raw.sign,
    zodiac: raw.zodiac,
    soulPalaceBranch: toBranchKey(raw.earthlyBranchOfSoulPalace),
    bodyPalaceBranch: toBranchKey(raw.earthlyBranchOfBodyPalace),
    soul: toStarKey(raw.soul),
    body: toStarKey(raw.body),
    fiveElementsClass: assertKey<FiveElementsClassKey>(
      kot<string>(raw.fiveElementsClass),
      FIVE_ELEMENTS_KEY_SET,
      '五行局',
    ),
    palaces: raw.palaces.map(toPalace),
  };
}

function toScopeItem(item: IztroHoroscopeItem): HoroscopeScopeItem {
  return {
    index: item.index,
    stem: toStemKey(item.heavenlyStem),
    branch: toBranchKey(item.earthlyBranch),
    palaceNames: item.palaceNames.map(toPalaceKey),
    mutagen: item.mutagen.map(toStarKey),
    stars: item.stars?.map((group) => group.map(toStar)),
  };
}

/** iztro Horoscope → 可序列化 HoroscopeSnapshot(流年将前/岁前 12 神暂不纳入,P2 再补) */
export function adaptHoroscope(raw: IztroHoroscope): HoroscopeSnapshot {
  return {
    solarDate: raw.solarDate,
    lunarDate: raw.lunarDate,
    decadal: toScopeItem(raw.decadal),
    age: { ...toScopeItem(raw.age), nominalAge: raw.age.nominalAge },
    yearly: toScopeItem(raw.yearly),
    monthly: toScopeItem(raw.monthly),
    daily: toScopeItem(raw.daily),
    hourly: toScopeItem(raw.hourly),
  };
}
