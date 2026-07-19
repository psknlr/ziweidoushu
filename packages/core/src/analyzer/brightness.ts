/**
 * 星曜亮度体系(庙旺得利平不陷)——把七级亮度从"展示角标"升级为分析规则。
 *
 * 经典规则(《紫微斗数全书》诸星问答论/通行亮度歌诀):
 * - 七级:庙(特质最正面)> 旺 > 得 > 利 > 平 > 不 > 陷(负面特质凸显)
 * - 吉星庙旺力宏、落陷力微;煞星落陷为害烈、庙旺反主威权武贵
 *   (火铃庙旺可成火贪铃贪,擎羊入庙午宫为「马头带箭」)
 * - 陷而有救:落陷之星会化禄/化科/禄存则课题可解;落陷逢化忌为双重课题
 * - 断语纪律:庙旺取断语上限,落陷取保守口径并给解法
 */
import {
  zh,
  type BrightnessKey,
  type MutagenKey,
  type PalaceKey,
  type StarKey,
} from '../keys.js';
import type { Astrolabe } from '../types.js';

/** 亮度分值:庙+3 旺+2 得+1 利+0.5 平0 不-1 陷-2 */
export const BRIGHTNESS_SCORE: Record<BrightnessKey, number> = {
  miao: 3,
  wang: 2,
  de: 1,
  li: 0.5,
  ping: 0,
  bu: -1,
  xian: -2,
};

/** 六煞类星(亮度语义反转:庙旺化煞为权) */
const TOUGH_STARS: ReadonlySet<string> = new Set(['qingyangMin', 'tuoluoMin', 'huoxingMin', 'lingxingMin']);

export interface BrightStarNote {
  star: StarKey;
  brightness: BrightnessKey;
  palace: PalaceKey;
  palaceIndex: number;
  /** 落陷星的解救:同宫/三方会照的禄科(陷而有救) */
  rescuedBy?: ('sihuaLu' | 'sihuaKe' | 'lucun')[];
  /** 落陷又化忌:双重课题 */
  doubleBurden?: boolean;
  /** 煞星庙旺:化煞为权 */
  toughEmpowered?: boolean;
}

export interface BrightnessSummary {
  /** 庙旺主星(含庙旺之煞星) */
  exalted: BrightStarNote[];
  /** 落陷主星/煞星(不+陷) */
  fallen: BrightStarNote[];
  /** 各宫主星亮度合计分(index 0-11;无主星宫为 null) */
  palaceScores: (number | null)[];
  /** 给 LLM 的一句话纪律提示 */
  discipline: string;
}

const RESCUE_MUTAGENS: ('sihuaLu' | 'sihuaKe')[] = ['sihuaLu', 'sihuaKe'];

/** 汇总全盘亮度:庙旺/落陷清单(含解救与加重标记)+ 各宫强弱分 */
export function summarizeBrightness(chart: Astrolabe): BrightnessSummary {
  const exalted: BrightStarNote[] = [];
  const fallen: BrightStarNote[] = [];
  const palaceScores: (number | null)[] = [];

  const trine = (i: number) => [i, (i + 4) % 12, (i + 8) % 12, (i + 6) % 12];

  for (const palace of chart.palaces) {
    const majors = palace.majorStars.filter((s) => s.type === 'major');
    let score: number | null = null;
    for (const star of [...palace.majorStars, ...palace.minorStars]) {
      if (!star.brightness) continue;
      const isMajor = star.type === 'major';
      const isTough = TOUGH_STARS.has(star.key);
      if (isMajor) score = (score ?? 0) + BRIGHTNESS_SCORE[star.brightness];

      const base: BrightStarNote = {
        star: star.key,
        brightness: star.brightness,
        palace: palace.name,
        palaceIndex: palace.index,
      };

      if (star.brightness === 'miao' || star.brightness === 'wang') {
        if (isMajor) exalted.push(base);
        else if (isTough) exalted.push({ ...base, toughEmpowered: true });
      } else if (star.brightness === 'xian' || star.brightness === 'bu') {
        if (!isMajor && !isTough) continue; // 杂平辅星弱陷不入清单,降噪
        // 陷而有救:本宫及三方会禄/科/禄存
        const rescuedBy: BrightStarNote['rescuedBy'] = [];
        for (const idx of trine(palace.index)) {
          const p = chart.palaces[idx];
          if (!p) continue;
          const cell = [...p.majorStars, ...p.minorStars];
          for (const m of RESCUE_MUTAGENS) {
            if (cell.some((s) => s.mutagen === m) && !rescuedBy.includes(m)) rescuedBy.push(m);
          }
          if (cell.some((s) => s.key === 'lucunMin') && !rescuedBy.includes('lucun')) rescuedBy.push('lucun');
        }
        fallen.push({
          ...base,
          ...(rescuedBy.length > 0 ? { rescuedBy } : {}),
          ...(star.mutagen === 'sihuaJi' ? { doubleBurden: true } : {}),
        });
      }
    }
    palaceScores.push(majors.length > 0 ? score : null);
  }

  return {
    exalted,
    fallen,
    palaceScores,
    discipline:
      '断语强度随亮度调整:庙旺之星取断语上限;落陷之星取保守口径,若「陷而有救」(会禄/科/禄存)须点出解法;落陷化忌为双重课题,煞星庙旺反主威权与爆发力。',
  };
}

/** 亮度清单 → 结构化文字(注入 Prompt) */
export function describeBrightness(summary: BrightnessSummary): string {
  const lines: string[] = [];
  if (summary.exalted.length > 0) {
    lines.push(
      `庙旺:${summary.exalted
        .map((n) => `${zh(n.star)}${n.toughEmpowered ? '(煞星入庙,化煞为权)' : ''}在${zh(n.palace)}`)
        .join(';')}`,
    );
  }
  if (summary.fallen.length > 0) {
    lines.push(
      `落陷:${summary.fallen
        .map((n) => {
          const marks: string[] = [];
          if (n.doubleBurden) marks.push('且化忌,双重课题');
          if (n.rescuedBy?.length) marks.push(`陷而有救:会${n.rescuedBy.map((r) => (r === 'lucun' ? '禄存' : r === 'sihuaLu' ? '化禄' : '化科')).join('、')}`);
          return `${zh(n.star)}在${zh(n.palace)}${marks.length > 0 ? `(${marks.join(';')})` : ''}`;
        })
        .join(';')}`,
    );
  }
  return lines.join('\n');
}
