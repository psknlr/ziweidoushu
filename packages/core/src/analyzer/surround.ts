/**
 * 三方四正(地支几何,与宫名无关):
 * 本宫 i、对宫 i+6、三合 i+4 与 i+8(寅午戌/申子辰/巳酉丑/亥卯未)。
 */
import type { Astrolabe, SurroundedPalaces } from '../types.js';

export function surroundedIndexes(index: number): SurroundedPalaces {
  const mod = (n: number) => ((n % 12) + 12) % 12;
  return {
    target: mod(index),
    opposite: mod(index + 6),
    wealth: mod(index + 4),
    career: mod(index + 8),
  };
}

export function soulPalaceIndex(chart: Astrolabe): number {
  const palace = chart.palaces.find((p) => p.name === 'soulPalace');
  if (!palace) throw new Error('[@ziwei/core] 星盘缺少命宫');
  return palace.index;
}

/** 三方四正的四个宫位索引(含本宫) */
export function trineIndexes(index: number): number[] {
  const s = surroundedIndexes(index);
  return [s.target, s.wealth, s.career, s.opposite];
}
