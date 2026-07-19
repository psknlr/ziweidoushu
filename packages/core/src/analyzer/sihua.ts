/**
 * 四化引擎:十天干四化表 + 运限四化叠加(overlay)。
 *
 * 默认表依据《紫微斗数全书》通行版,与 iztro data/heavenlyStems.ts 逐条对齐。
 * 流派分歧(如戊干化科右弼/太阳之争)通过 SchoolConfig.mutagens 覆盖,不改默认表。
 */
import { MUTAGENS, type MutagenKey, type StarKey, type StemKey } from '../keys.js';
import type { SchoolConfig } from '../config.js';
import type { Astrolabe } from '../types.js';

/** [化禄, 化权, 化科, 化忌] */
export const SIHUA_TABLE: Record<StemKey, [StarKey, StarKey, StarKey, StarKey]> = {
  jiaHeavenly: ['lianzhenMaj', 'pojunMaj', 'wuquMaj', 'taiyangMaj'],
  yiHeavenly: ['tianjiMaj', 'tianliangMaj', 'ziweiMaj', 'taiyinMaj'],
  bingHeavenly: ['tiantongMaj', 'tianjiMaj', 'wenchangMin', 'lianzhenMaj'],
  dingHeavenly: ['taiyinMaj', 'tiantongMaj', 'tianjiMaj', 'jumenMaj'],
  wuHeavenly: ['tanlangMaj', 'taiyinMaj', 'youbiMin', 'tianjiMaj'],
  jiHeavenly: ['wuquMaj', 'tanlangMaj', 'tianliangMaj', 'wenquMin'],
  gengHeavenly: ['taiyangMaj', 'wuquMaj', 'taiyinMaj', 'tiantongMaj'],
  xinHeavenly: ['jumenMaj', 'taiyangMaj', 'wenquMin', 'wenchangMin'],
  renHeavenly: ['tianliangMaj', 'ziweiMaj', 'zuofuMin', 'wuquMaj'],
  guiHeavenly: ['pojunMaj', 'jumenMaj', 'taiyinMaj', 'tanlangMaj'],
};

/** 取某天干的四化星(流派覆盖优先) */
export function sihuaForStem(stem: StemKey, school?: SchoolConfig): [StarKey, StarKey, StarKey, StarKey] {
  return school?.mutagens?.[stem] ?? SIHUA_TABLE[stem];
}

export interface SihuaHit {
  star: StarKey;
  mutagen: MutagenKey;
  /** 星曜所在宫位索引;流耀/borrowed 不参与定位时为 null */
  palaceIndex: number | null;
}

/**
 * 四化落宫叠加:给定运限天干,输出四化星各自落在盘面哪一宫。
 * UI 据此在宫格上叠加「限禄/年忌」等角标(参考王多鱼 TimeNav 的 buildSiHuaOverlay)。
 */
export function sihuaOverlay(chart: Astrolabe, stem: StemKey, school?: SchoolConfig): SihuaHit[] {
  const stars = sihuaForStem(stem, school ?? chart.meta.school);
  return stars.map((star, i) => {
    const mutagen = MUTAGENS[i];
    if (!mutagen) throw new Error('[@ziwei/core] 四化表长度异常');
    const palace = chart.palaces.find((p) =>
      [...p.majorStars, ...p.minorStars].some((s) => s.key === star),
    );
    return { star, mutagen, palaceIndex: palace ? palace.index : null };
  });
}
