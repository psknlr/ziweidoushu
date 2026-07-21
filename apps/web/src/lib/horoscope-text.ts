/**
 * 运限上下文摘要:把当前所选运限(大限~流时)转成结构化文字,
 * 供智能体提问时随问题携带(AI 解读支持流年流月流日流时)。
 */
import { sihuaForStem, zh, type Astrolabe, type HoroscopeSnapshot } from '@ziwei/core';
import type { HoroscopeMode } from '../components/TimeNav.js';

const MUTAGEN_NAMES = ['禄', '权', '科', '忌'];
const SCOPE_LABEL: Record<Exclude<HoroscopeMode, 'origin'>, string> = {
  decadal: '大限', yearly: '流年', monthly: '流月', daily: '流日', hourly: '流时',
};

export function horoscopeDigest(chart: Astrolabe, horoscope: HoroscopeSnapshot, mode: HoroscopeMode): string {
  if (mode === 'origin') return '';
  const lines: string[] = [`[运限上下文 · ${horoscope.solarDate}(${horoscope.lunarDate})]`];
  const scopes: Exclude<HoroscopeMode, 'origin'>[] =
    mode === 'decadal' ? ['decadal']
    : mode === 'yearly' ? ['decadal', 'yearly']
    : mode === 'monthly' ? ['decadal', 'yearly', 'monthly']
    : mode === 'daily' ? ['decadal', 'yearly', 'monthly', 'daily']
    : ['decadal', 'yearly', 'monthly', 'daily', 'hourly'];
  for (const s of scopes) {
    const item = horoscope[s];
    const sihua = sihuaForStem(item.stem, chart.meta.school)
      .map((star, i) => `${zh(star)}化${MUTAGEN_NAMES[i]}`)
      .join('、');
    const soulAt = item.palaceNames.indexOf('soulPalace');
    const soulBranch = soulAt >= 0 ? zh(chart.palaces[soulAt]!.branch) : '?';
    lines.push(`${SCOPE_LABEL[s]}:${zh(item.stem)}${zh(item.branch)},${SCOPE_LABEL[s]}命宫在${soulBranch};四化:${sihua}`);
  }
  if (mode === 'decadal') lines.push(`当前虚岁:${horoscope.age.nominalAge}`);
  lines.push('请结合以上运限四化对本命盘的引动作答。');
  return lines.join('\n');
}
