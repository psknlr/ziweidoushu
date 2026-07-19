/**
 * RAG 加权信号生成(采纳紫微知道 deriveGuidanceSignals 的分层权重思想):
 * 「星+四化+宫」100 > 格局 90/85 > 借宫 70 > 「星+宫」60 > 亮度 40。
 * 信号供 @ziwei/knowledge 检索层按权重召回知识条目。
 */
import type { Astrolabe, ChartFeatures, MatchedPattern, Signal } from '../types.js';
import { MAJOR_STARS, zh } from '../keys.js';
import { soulPalaceIndex, trineIndexes } from './surround.js';
import { summarizeBrightness } from './brightness.js';

const majorOrder = (key: string) => MAJOR_STARS.indexOf(key as (typeof MAJOR_STARS)[number]);

export function deriveSignals(chart: Astrolabe, patterns: MatchedPattern[]): Signal[] {
  const signals: Signal[] = [];
  const soulTrine = new Set(trineIndexes(soulPalaceIndex(chart)));

  for (const palace of chart.palaces) {
    for (const star of palace.majorStars) {
      if (star.type !== 'major') continue;
      signals.push({
        entities: [star.key, palace.name],
        weight: 60,
        kind: 'star-palace',
        note: `${zh(star.key)}坐${zh(palace.name)}`,
      });
      if (star.mutagen) {
        signals.push({
          entities: [star.key, star.mutagen, palace.name],
          weight: 100,
          kind: 'star-mutagen-palace',
          note: `${zh(star.key)}化${zh(star.mutagen)}在${zh(palace.name)}`,
        });
      }
      // 亮度信号:庙旺(正面上限)与不/陷(保守口径)全盘皆发;命宫三方加权
      if (star.brightness === 'miao' || star.brightness === 'wang' || star.brightness === 'xian' || star.brightness === 'bu') {
        const inSoulTrine = soulTrine.has(palace.index);
        const exalted = star.brightness === 'miao' || star.brightness === 'wang';
        signals.push({
          entities: [star.key, star.brightness, palace.name],
          weight: inSoulTrine ? 45 : 40,
          kind: 'brightness',
          note: `${zh(star.key)}${exalted ? (star.brightness === 'miao' ? '入庙' : '居旺') : star.brightness === 'xian' ? '落陷' : '不得地'}于${zh(palace.name)}${inSoulTrine ? '(命宫三方)' : ''}`,
        });
      }
    }
    // 辅星亮度信号(35):煞星庙旺化煞为权、文星落陷科名受阻等规则依赖此信号召回
    for (const star of palace.minorStars) {
      if (!star.brightness) continue;
      if (star.brightness === 'miao' || star.brightness === 'wang' || star.brightness === 'xian' || star.brightness === 'bu') {
        signals.push({
          entities: [star.key, star.brightness, palace.name],
          weight: 35,
          kind: 'brightness',
          note: `${zh(star.key)}${zh(star.brightness)}于${zh(palace.name)}`,
        });
      }
    }

    // 双主星同宫 → 组合信号(80):双星组合是常用解读单元(紫府/武贪/同阴…)
    const majors = palace.majorStars.filter((s) => s.type === 'major');
    if (majors.length >= 2) {
      const sorted = [...majors].sort((a, b) => majorOrder(a.key) - majorOrder(b.key));
      for (let i = 0; i < sorted.length - 1; i++) {
        for (let j = i + 1; j < sorted.length; j++) {
          const a = sorted[i]!;
          const b = sorted[j]!;
          signals.push({
            entities: [a.key, b.key, palace.name],
            weight: 80,
            kind: 'combo',
            note: `${zh(a.key)}${zh(b.key)}同宫于${zh(palace.name)}`,
          });
        }
      }
    }
    if (palace.borrowed && palace.name === 'soulPalace') {
      signals.push({
        entities: ['emptyPalace', palace.name, ...palace.borrowed.stars.map((s) => s.key)],
        weight: 70,
        kind: 'borrowed',
        note: `命宫无主星,借对宫(${zh(palace.borrowed.fromBranch)})${palace.borrowed.stars.map((s) => zh(s.key)).join('、')}`,
      });
    }
  }

  for (const pattern of patterns) {
    signals.push({
      entities: ['pattern', pattern.id],
      weight: pattern.brokenBy.length > 0 ? 85 : 90,
      kind: 'pattern',
      note:
        pattern.brokenBy.length > 0
          ? `${pattern.name}(见破格:${pattern.brokenBy.join(';')})`
          : `${pattern.name}(${pattern.bonusHits.length > 0 ? `加分:${pattern.bonusHits.join(';')}` : '成格'})`,
    });
  }

  return signals.sort((a, b) => b.weight - a.weight);
}

export function buildFeatures(chart: Astrolabe, patterns: MatchedPattern[]): ChartFeatures {
  const soulIdx = soulPalaceIndex(chart);
  return {
    brightness: summarizeBrightness(chart),
    soulSurround: {
      target: soulIdx,
      opposite: (soulIdx + 6) % 12,
      wealth: (soulIdx + 4) % 12,
      career: (soulIdx + 8) % 12,
    },
    surroundByPalace: chart.palaces.map((p) => ({
      target: p.index,
      opposite: (p.index + 6) % 12,
      wealth: (p.index + 4) % 12,
      career: (p.index + 8) % 12,
    })),
    patterns,
    signals: deriveSignals(chart, patterns),
  };
}
