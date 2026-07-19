/**
 * 格局引擎:三层条件模型(必须/加分/破格),采纳王多鱼 patterns.ts 的分层思想。
 *
 * 格局判定是**确定性**的,在此完成;LLM 只消费判定结果,
 * 绝不让 LLM 自己"看盘认格局"(设计文档 §6.2)。
 *
 * v0.1 约定:三方四正判定不含借宫星(借宫是否成格各派不一,后续做成配置)。
 */
import type { BranchKey, BrightnessKey, MutagenKey, StarKey } from '../keys.js';
import type { Astrolabe, MatchedPattern, Palace } from '../types.js';
import { soulPalaceIndex, trineIndexes } from './surround.js';

export type Condition =
  | { kind: 'soulHasAll'; stars: StarKey[]; desc: string }
  | { kind: 'soulHasOne'; stars: StarKey[]; desc: string }
  | { kind: 'soulBranchIn'; branches: BranchKey[]; desc: string }
  | { kind: 'trineHasAll'; stars: StarKey[]; desc: string }
  | { kind: 'trineHasOne'; stars: StarKey[]; desc: string }
  | { kind: 'soulStarBrightnessIn'; star: StarKey; brightness: BrightnessKey[]; desc: string }
  | { kind: 'starHasMutagen'; star: StarKey; mutagen: MutagenKey; desc: string }
  | { kind: 'trineHasMutagen'; mutagen: MutagenKey; desc: string }
  | { kind: 'anyOf'; conds: Condition[]; desc: string };

export interface PatternDef {
  id: string;
  name: string;
  /** 古籍出处(原句) */
  source: string;
  required: Condition[];
  bonus: Condition[];
  broken: Condition[];
  /** 判定口径备注(如做了何种简化) */
  note?: string;
}

interface Ctx {
  chart: Astrolabe;
  soul: Palace;
  trine: Palace[];
}

const cellStars = (p: Palace): { key: StarKey; brightness?: BrightnessKey; mutagen?: MutagenKey }[] => [
  ...p.majorStars,
  ...p.minorStars,
];

function evalCond(cond: Condition, ctx: Ctx): boolean {
  switch (cond.kind) {
    case 'soulHasAll':
      return cond.stars.every((s) => cellStars(ctx.soul).some((x) => x.key === s));
    case 'soulHasOne':
      return cond.stars.some((s) => cellStars(ctx.soul).some((x) => x.key === s));
    case 'soulBranchIn':
      return cond.branches.includes(ctx.soul.branch);
    case 'trineHasAll':
      return cond.stars.every((s) => ctx.trine.some((p) => cellStars(p).some((x) => x.key === s)));
    case 'trineHasOne':
      return cond.stars.some((s) => ctx.trine.some((p) => cellStars(p).some((x) => x.key === s)));
    case 'soulStarBrightnessIn': {
      const star = cellStars(ctx.soul).find((x) => x.key === cond.star);
      return !!star?.brightness && cond.brightness.includes(star.brightness);
    }
    case 'starHasMutagen':
      return ctx.chart.palaces.some((p) => cellStars(p).some((x) => x.key === cond.star && x.mutagen === cond.mutagen));
    case 'trineHasMutagen':
      return ctx.trine.some((p) => cellStars(p).some((x) => x.mutagen === cond.mutagen));
    case 'anyOf':
      return cond.conds.some((c) => evalCond(c, ctx));
  }
}

/** 对整张盘评估格局库,只返回必要条件全部满足的格局(含破格信息) */
export function evaluatePatterns(chart: Astrolabe, defs: readonly PatternDef[]): MatchedPattern[] {
  const soulIdx = soulPalaceIndex(chart);
  const soul = chart.palaces[soulIdx];
  if (!soul) throw new Error('[@ziwei/core] 命宫索引越界');
  const trine = trineIndexes(soulIdx).map((i) => {
    const p = chart.palaces[i];
    if (!p) throw new Error('[@ziwei/core] 三方四正索引越界');
    return p;
  });
  const ctx: Ctx = { chart, soul, trine };

  const matched: MatchedPattern[] = [];
  for (const def of defs) {
    if (!def.required.every((c) => evalCond(c, ctx))) continue;
    matched.push({
      id: def.id,
      name: def.name,
      satisfied: true,
      bonusHits: def.bonus.filter((c) => evalCond(c, ctx)).map((c) => c.desc),
      brokenBy: def.broken.filter((c) => evalCond(c, ctx)).map((c) => c.desc),
      source: def.source,
    });
  }
  return matched;
}
