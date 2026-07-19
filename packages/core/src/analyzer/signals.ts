/**
 * RAG 加权信号生成(采纳紫微知道 deriveGuidanceSignals 的分层权重思想):
 * 「星+四化+宫」100 > 格局 90/85 > 借宫 70 > 「星+宫」60 > 亮度 40。
 * 信号供 @ziwei/knowledge 检索层按权重召回知识条目。
 */
import type { Astrolabe, ChartFeatures, MatchedPattern, Signal } from '../types.js';
import { zh } from '../keys.js';
import { soulPalaceIndex, trineIndexes } from './surround.js';

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
      if (soulTrine.has(palace.index) && (star.brightness === 'miao' || star.brightness === 'xian')) {
        signals.push({
          entities: [star.key, star.brightness, palace.name],
          weight: 40,
          kind: 'brightness',
          note: `${zh(star.key)}${star.brightness === 'miao' ? '入庙' : '落陷'}于${zh(palace.name)}(命宫三方)`,
        });
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
