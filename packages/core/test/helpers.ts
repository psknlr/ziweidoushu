/**
 * 测试辅助:构造合成星盘(synthetic Astrolabe)。
 * 格局引擎/借宫/四化叠加的单测用合成盘,避免"寻找特定生日"的脆弱测试;
 * 真实排盘正确性由黄金命例(golden.test.ts)保障。
 */
import {
  PALACES,
  PRESET_QUANSHU,
  type Astrolabe,
  type BranchKey,
  type Palace,
  type Star,
} from '@ziwei/core';

/** 盘面索引 → 地支(寅宫起) */
export const BRANCH_BY_INDEX: BranchKey[] = [
  'yinEarthly',
  'maoEarthly',
  'chenEarthly',
  'siEarthly',
  'wuEarthly',
  'weiEarthly',
  'shenEarthly',
  'youEarthly',
  'xuEarthly',
  'haiEarthly',
  'ziEarthly',
  'chouEarthly',
];

export function makeStar(key: Star['key'], extra: Partial<Star> = {}): Star {
  return { key, type: 'major', scope: 'origin', ...extra };
}

/**
 * 构造合成星盘:soulIndex 指定命宫位置,starsByIndex 指定各宫主/辅星。
 * 宫名从命宫起逆时针铺满(名称正确性与格局判定无关,只需 12 名齐全)。
 */
export function makeChart(
  soulIndex: number,
  starsByIndex: Partial<Record<number, { majors?: Star[]; minors?: Star[] }>> = {},
): Astrolabe {
  const palaces: Palace[] = Array.from({ length: 12 }, (_, i) => {
    const nameIdx = (((i - soulIndex) % 12) + 12) % 12;
    const name = PALACES[nameIdx];
    const branch = BRANCH_BY_INDEX[i];
    if (!name || !branch) throw new Error('fixture 越界');
    return {
      index: i,
      name,
      isBodyPalace: false,
      isOriginalPalace: false,
      stem: 'jiaHeavenly',
      branch,
      majorStars: starsByIndex[i]?.majors ?? [],
      minorStars: starsByIndex[i]?.minors ?? [],
      adjectiveStars: [],
      changsheng12: 'changsheng',
      boshi12: 'boshi',
      jiangqian12: 'jiangxing',
      suiqian12: 'suijian',
      decadal: { range: [2, 11], stem: 'jiaHeavenly', branch },
      ages: [],
    };
  });

  const soulBranch = BRANCH_BY_INDEX[soulIndex];
  if (!soulBranch) throw new Error('fixture 越界');

  return {
    meta: {
      engine: 'test',
      kernel: 'synthetic',
      school: PRESET_QUANSHU,
      input: {
        solarDate: '2000-1-1',
        timeIndex: 0,
        gender: 'male',
        fixLeap: true,
        trueSolarTime: { enabled: false },
      },
      chartHash: 'synthetic',
    },
    gender: 'male',
    solarDate: '2000-1-1',
    lunarDate: '',
    ganzhi: {
      year: { stem: 'gengHeavenly', branch: 'chenEarthly' },
      month: { stem: 'jiaHeavenly', branch: 'ziEarthly' },
      day: { stem: 'jiaHeavenly', branch: 'ziEarthly' },
      hour: { stem: 'jiaHeavenly', branch: 'ziEarthly' },
    },
    timeIndex: 0,
    sign: '',
    zodiac: '',
    soulPalaceBranch: soulBranch,
    bodyPalaceBranch: soulBranch,
    soul: 'pojunMaj',
    body: 'wenchangMin',
    fiveElementsClass: 'wood3rd',
    palaces,
  };
}
