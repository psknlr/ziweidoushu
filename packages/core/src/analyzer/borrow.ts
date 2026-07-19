/**
 * 借宫:空宫(无主星)借对宫主星。
 * 结构化写入 palace.borrowed,禁止让下游(UI/LLM)从文字自行反推。
 */
import type { Astrolabe } from '../types.js';
import { surroundedIndexes } from './surround.js';

export function fillBorrowedStars(chart: Astrolabe): Astrolabe {
  for (const palace of chart.palaces) {
    if (palace.majorStars.some((s) => s.type === 'major')) continue;
    const oppositeIndex = surroundedIndexes(palace.index).opposite;
    const opposite = chart.palaces[oppositeIndex];
    if (!opposite) continue;
    const stars = opposite.majorStars.filter((s) => s.type === 'major');
    if (stars.length === 0) continue;
    palace.borrowed = {
      fromIndex: opposite.index,
      fromBranch: opposite.branch,
      stars: stars.map((s) => ({ ...s })),
    };
  }
  return chart;
}
