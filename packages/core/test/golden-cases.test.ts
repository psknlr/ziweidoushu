/**
 * 黄金命例库回归(54 例):适配层/内核/流派配置的任何行为变化都会在此失败。
 * 基准与再生成规则见 scripts/generate-golden.ts 头注。
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, test } from 'vitest';
import { ZiweiEngine, type Gender } from '@ziwei/core';

interface GoldenCase {
  input: { solarDate: string; timeIndex: number; gender: Gender; preset: string; note?: string };
  expected: {
    lunarDate: string;
    ganzhi: string[];
    soulBranch: string;
    bodyBranch: string;
    soul: string;
    body: string;
    fiveElementsClass: string;
    majors: string[];
    mutagens: string[];
    decadalRanges: string[];
  };
}

const file = JSON.parse(
  readFileSync(join(fileURLToPath(new URL('.', import.meta.url)), 'golden/cases.json'), 'utf-8'),
) as { kernel: string; cases: GoldenCase[] };

const engines = new Map<string, ZiweiEngine>();
const engineFor = (preset: string) => {
  if (!engines.has(preset)) engines.set(preset, new ZiweiEngine(preset));
  return engines.get(preset)!;
};

describe(`黄金命例库(${file.cases.length} 例,基准 ${file.kernel})`, () => {
  test('规模 ≥ 50', () => {
    expect(file.cases.length).toBeGreaterThanOrEqual(50);
  });

  test.each(file.cases.map((c) => [`${c.input.solarDate} t${c.input.timeIndex} ${c.input.gender} ${c.input.preset}${c.input.note ? ` (${c.input.note})` : ''}`, c] as const))(
    '%s',
    (_name, c) => {
      const chart = engineFor(c.input.preset).bySolar(c.input.solarDate, c.input.timeIndex, c.input.gender);

      expect(chart.lunarDate).toBe(c.expected.lunarDate);
      expect(
        [chart.ganzhi.year, chart.ganzhi.month, chart.ganzhi.day, chart.ganzhi.hour].map((p) => `${p.stem}.${p.branch}`),
      ).toEqual(c.expected.ganzhi);
      expect(chart.soulPalaceBranch).toBe(c.expected.soulBranch);
      expect(chart.bodyPalaceBranch).toBe(c.expected.bodyBranch);
      expect(chart.soul).toBe(c.expected.soul);
      expect(chart.body).toBe(c.expected.body);
      expect(chart.fiveElementsClass).toBe(c.expected.fiveElementsClass);
      expect(
        chart.palaces.map((p) => p.majorStars.filter((s) => s.type === 'major').map((s) => s.key).join('+')),
      ).toEqual(c.expected.majors);
      expect(
        chart.palaces
          .flatMap((p) => [...p.majorStars, ...p.minorStars])
          .filter((s) => s.mutagen)
          .map((s) => `${s.key}:${s.mutagen}`)
          .sort(),
      ).toEqual(c.expected.mutagens);
      expect(chart.palaces.map((p) => `${p.decadal.range[0]}-${p.decadal.range[1]}`)).toEqual(c.expected.decadalRanges);

      // 结构不变量
      expect(chart.palaces).toHaveLength(12);
      expect(new Set(chart.palaces.map((p) => p.name)).size).toBe(12);
      expect(chart.palaces.flatMap((p) => p.majorStars.filter((s) => s.type === 'major'))).toHaveLength(14);
      expect(c.expected.mutagens).toHaveLength(4);
    },
  );
});
