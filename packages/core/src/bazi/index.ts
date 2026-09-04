/**
 * 八字(四柱)模块入口:computeBaZi / baziFromAstrolabe / liuNianOf / describeBaZi / baziSignals。
 */
import { ZH_CN, type BranchKey, type Gender, type StemKey } from '../keys.js';
import type { Astrolabe, Signal } from '../types.js';
import { ENGINE_ID, ENGINE_VERSION } from '../adapter.js';
import { BAZI_KERNEL, computeCalendar, yearGanzhi } from './calendar.js';
import {
  assessStrength, buildPillar, chooseYongShen, countFiveElements, countTenGods, detectPattern, detectRelations,
  detectShenSha, PATTERN_ZH, SEASON_STATE_ZH, STRENGTH_ZH,
} from './analysis.js';
import {
  ELEMENT_ZH, ELEMENTS, HIDDEN_STEMS, PILLAR_POSITIONS, PILLAR_ZH, STEM_ELEMENT, TEN_GOD_ZH, stemYinYang, tenGodOf,
  type ElementKey, type PillarPos,
} from './tables.js';
import type { BaZiChart, LiuNian } from './types.js';

export * from './types.js';
export {
  ELEMENTS, ELEMENT_ZH, TEN_GODS, TEN_GOD_ZH, TEN_GOD_GROUP, GROUP_ZH, PILLAR_ZH, HIDDEN_STEMS, HIDDEN_ROLE_ZH,
  SHEN_SHA_ZH, RELATION_ZH, STEM_ELEMENT, BRANCH_ELEMENT, tenGodOf, seasonState, stemYinYang,
  type ElementKey, type TenGodKey, type PillarPos, type ShenShaKey, type RelationKind, type SeasonState,
} from './tables.js';
export { STRENGTH_ZH, PATTERN_ZH, SEASON_STATE_ZH } from './analysis.js';
export { BAZI_KERNEL } from './calendar.js';

const zh = (k: string) => ZH_CN[k] ?? k;
const pad = (n: number) => String(n).padStart(2, '0');

export interface BaZiInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  gender: Gender;
  /** 晚子时日柱归属,默认 current(子正换日) */
  dayBoundary?: 'current' | 'forward';
  timeSource?: BaZiChart['meta']['timeSource'];
}

export function computeBaZi(input: BaZiInput): BaZiChart {
  const minute = input.minute ?? 0;
  const dayBoundary = input.dayBoundary ?? 'current';
  const cal = computeCalendar({ ...input, minute, dayBoundary });
  const dayMaster = cal.pillars.day.stem;
  const pillars = Object.fromEntries(
    PILLAR_POSITIONS.map((p) => [p, buildPillar(cal.pillars[p], dayMaster, cal.pillars.day.xunKong)]),
  ) as Record<PillarPos, ReturnType<typeof buildPillar>>;

  const fiveElements = countFiveElements(pillars);
  const tenGodCounts = countTenGods(pillars);
  const strength = assessStrength(pillars, dayMaster);
  const pattern = detectPattern(pillars, dayMaster, strength, tenGodCounts);
  const yongShen = chooseYongShen(pillars, dayMaster, strength, fiveElements.weighted);
  const shenSha = detectShenSha(pillars, dayMaster);
  const relations = detectRelations(pillars);

  return {
    meta: {
      engine: `${ENGINE_ID}@${ENGINE_VERSION}`,
      kernel: BAZI_KERNEL,
      localTime: `${input.year}-${pad(input.month)}-${pad(input.day)} ${pad(input.hour)}:${pad(minute)}`,
      timeSource: input.timeSource ?? 'clock',
      dayBoundary,
      gender: input.gender,
    },
    pillars,
    dayMaster: { stem: dayMaster, element: STEM_ELEMENT[dayMaster], yinYang: stemYinYang(dayMaster) },
    fiveElements,
    tenGodCounts,
    strength,
    pattern,
    yongShen,
    shenSha,
    relations,
    extras: {
      taiYuan: cal.taiYuan,
      mingGong: cal.mingGong,
      shenGong: cal.shenGong,
      prevJie: cal.prevJie,
      nextJie: cal.nextJie,
    },
    yun: {
      startAge: cal.yun.daYun[1]?.startAge ?? cal.yun.startYears + 1,
      startYears: cal.yun.startYears,
      startMonths: cal.yun.startMonths,
      startDays: cal.yun.startDays,
      startDate: cal.yun.startDate,
      forward: cal.yun.forward,
      daYun: cal.yun.daYun.map((d) => ({
        ...d,
        stemTenGod: tenGodOf(dayMaster, d.stem),
        branchMainTenGod: tenGodOf(dayMaster, HIDDEN_STEMS[d.branch][0]!),
      })),
    },
  };
}

/**
 * 由紫微星盘的归一化输入派生八字:与紫微共用同一出生时刻
 * (已含夏令时扣除与真太阳时校正),晚子时归属沿用流派 dayDivide。
 */
export function baziFromAstrolabe(chart: Astrolabe): BaZiChart {
  const tst = chart.meta.input.trueSolarTime;
  const local = tst.correctedLocal ?? tst.originalLocal;
  let y: number, m: number, d: number, h: number, mi: number;
  let timeSource: BaZiChart['meta']['timeSource'];
  if (local) {
    const [date, time] = local.split(' ') as [string, string];
    [y, m, d] = date.split('-').map(Number) as [number, number, number];
    [h, mi] = time.split(':').map(Number) as [number, number];
    timeSource = tst.enabled ? 'trueSolarTime' : tst.dstMinutes ? 'clock-dst' : 'clock';
  } else {
    [y, m, d] = chart.meta.input.solarDate.split('-').map(Number) as [number, number, number];
    const idx = chart.meta.input.timeIndex;
    h = idx === 0 ? 0 : idx === 12 ? 23 : 2 * idx - 1;
    mi = 30;
    timeSource = 'timeIndex';
  }
  return computeBaZi({
    year: y, month: m, day: d, hour: h, minute: mi,
    gender: chart.gender,
    dayBoundary: chart.meta.school.dayDivide,
    timeSource,
  });
}

/** 某公历年的流年(以立春为界的年柱)及其十神、虚岁与所处大运 */
export function liuNianOf(bazi: BaZiChart, year: number): LiuNian {
  const [stem, branch] = yearGanzhi(year);
  const birthYear = Number(bazi.meta.localTime.slice(0, 4));
  const age = year - birthYear + 1;
  const dy = [...bazi.yun.daYun].reverse().find((d) => year >= d.startYear);
  return {
    year,
    stem,
    branch,
    stemTenGod: tenGodOf(bazi.dayMaster.stem, stem),
    branchMainTenGod: tenGodOf(bazi.dayMaster.stem, HIDDEN_STEMS[branch][0]!),
    age,
    daYunIndex: dy?.index ?? 0,
  };
}

const gz = (s: StemKey, b: BranchKey) => `${zh(s)}${zh(b)}`;

/** 八字 → 结构化事实文字(供 Prompt / 导出 / 智能体上下文) */
export function describeBaZi(bazi: BaZiChart, year?: number): string {
  const p = bazi.pillars;
  const lines: string[] = [];
  lines.push(
    `八字:${PILLAR_POSITIONS.map((k) => gz(p[k].stem, p[k].branch)).join(' ')}` +
      `(${zh(bazi.meta.gender)}命;${bazi.meta.timeSource === 'trueSolarTime' ? '真太阳时' : bazi.meta.timeSource === 'clock-dst' ? '已扣夏令时' : bazi.meta.timeSource === 'timeIndex' ? '按时辰中点' : '钟表时'} ${bazi.meta.localTime};晚子时${bazi.meta.dayBoundary === 'forward' ? '归次日' : '归当日'})`,
  );
  lines.push(
    `日主:${zh(bazi.dayMaster.stem)}${ELEMENT_ZH[bazi.dayMaster.element]}(${bazi.dayMaster.yinYang === 'yang' ? '阳' : '阴'});` +
      `十神:${(['year', 'month', 'hour'] as const).map((k) => `${PILLAR_ZH[k]}${TEN_GOD_ZH[p[k].stemTenGod!]}`).join('、')};` +
      `藏干:${PILLAR_POSITIONS.map((k) => `${zh(p[k].branch)}[${p[k].hidden.map((h) => `${zh(h.stem)}${TEN_GOD_ZH[h.tenGod]}`).join('/')}]`).join(' ')}`,
  );
  lines.push(
    `纳音:${PILLAR_POSITIONS.map((k) => p[k].naYin).join('、')};十二长生:${PILLAR_POSITIONS.map((k) => zh(p[k].changSheng)).join('、')};` +
      `日柱旬空${p.day.xunKong.map(zh).join('')}${bazi.shenSha.find((s) => s.key === 'kongWang') ? `(${bazi.shenSha.find((s) => s.key === 'kongWang')!.at.map((a) => PILLAR_ZH[a]).join('、')}落空)` : ''}`,
  );
  const fe = bazi.fiveElements;
  lines.push(
    `五行:${ELEMENTS.map((e) => `${ELEMENT_ZH[e]}${fe.visible[e]}(含藏${fe.weighted[e]})`).join(' ')}` +
      (fe.missing.length ? `;表面缺${fe.missing.map((e) => ELEMENT_ZH[e]).join('')}(仅为表面计数,不作吉凶)` : ''),
  );
  const s = bazi.strength;
  lines.push(
    `日主旺衰:${STRENGTH_ZH[s.level]}(${s.score}/100:得令${SEASON_STATE_ZH[s.breakdown.season.state]}${s.breakdown.season.score}、得地${s.breakdown.roots.score}、得势${s.breakdown.support.score});` +
      `格局:${bazi.pattern.name}(${bazi.pattern.basis})${bazi.pattern.special.length ? `;${bazi.pattern.special.join(';')}` : ''}`,
  );
  lines.push(
    `用神:喜${bazi.yongShen.favorable.map((e) => ELEMENT_ZH[e]).join('')}(${bazi.yongShen.favorableGroups.join('/')})` +
      (bazi.yongShen.unfavorable.length ? `,忌${bazi.yongShen.unfavorable.map((e) => ELEMENT_ZH[e]).join('')}` : '') +
      `;${bazi.yongShen.rationale}${bazi.yongShen.tiaoHou ? ` 调候:${bazi.yongShen.tiaoHou.note}。` : ''}`,
  );
  if (bazi.shenSha.length) {
    lines.push(`神煞:${bazi.shenSha.map((h) => `${h.name}(${h.at.map((a) => PILLAR_ZH[a]).join('、')})`).join('、')}`);
  }
  if (bazi.relations.length) {
    lines.push(`干支关系:${bazi.relations.map((r) => r.note ?? r.name).join('、')}`);
  }
  lines.push(`胎元${bazi.extras.taiYuan} 命宫${bazi.extras.mingGong} 身宫${bazi.extras.shenGong};出生前节${bazi.extras.prevJie.name}(${bazi.extras.prevJie.time}),后节${bazi.extras.nextJie.name}(${bazi.extras.nextJie.time})`);
  const y = bazi.yun;
  lines.push(
    `大运:${y.forward ? '顺行' : '逆行'},${y.startYears}岁${y.startMonths}月${y.startDays}天起运(${y.startDate},虚岁${y.startAge});` +
      y.daYun.filter((d) => d.index > 0).slice(0, 8).map((d) => `${gz(d.stem, d.branch)}${TEN_GOD_ZH[d.stemTenGod]}${d.startAge}-${d.endAge}`).join(' '),
  );
  if (year) {
    const ln = liuNianOf(bazi, year);
    const dy = bazi.yun.daYun.find((d) => d.index === ln.daYunIndex);
    lines.push(
      `${year} 流年${gz(ln.stem, ln.branch)}(${TEN_GOD_ZH[ln.stemTenGod]}/${TEN_GOD_ZH[ln.branchMainTenGod]},虚岁${ln.age})` +
        (dy && dy.index > 0 ? `,行${gz(dy.stem, dy.branch)}大运(${TEN_GOD_ZH[dy.stemTenGod]},${dy.startAge}-${dy.endAge}岁)` : ',尚在起运前'),
    );
  }
  return lines.join('\n');
}

/** 八字 → RAG 检索信号(与紫微信号同一契约) */
export function baziSignals(bazi: BaZiChart): Signal[] {
  const out: Signal[] = [];
  out.push({ entities: ['bazi', 'dayMaster', bazi.dayMaster.stem], weight: 85, kind: 'bazi', note: `日主${zh(bazi.dayMaster.stem)}` });
  out.push({ entities: ['bazi', 'strength', bazi.strength.level], weight: 88, kind: 'bazi', note: STRENGTH_ZH[bazi.strength.level] });
  out.push({ entities: ['bazi', 'pattern', bazi.pattern.key], weight: 90, kind: 'bazi', note: bazi.pattern.name });
  const month = bazi.pillars.month.stemTenGod;
  if (month) out.push({ entities: ['bazi', 'tenGod', month, 'month'], weight: 75, kind: 'bazi', note: `月干${TEN_GOD_ZH[month]}` });
  for (const [god, n] of Object.entries(bazi.tenGodCounts)) {
    if (n > 0) out.push({ entities: ['bazi', 'tenGod', god], weight: n >= 2 ? 70 : 60, kind: 'bazi', note: `${TEN_GOD_ZH[god as keyof typeof TEN_GOD_ZH]}×${n}` });
  }
  for (const e of bazi.yongShen.favorable) out.push({ entities: ['bazi', 'yongshen', e], weight: 72, kind: 'bazi', note: `喜${ELEMENT_ZH[e]}` });
  if (bazi.yongShen.tiaoHou) out.push({ entities: ['bazi', 'tiaohou', bazi.yongShen.tiaoHou.element], weight: 58, kind: 'bazi', note: '调候' });
  for (const h of bazi.shenSha) out.push({ entities: ['bazi', 'shensha', h.key], weight: 50, kind: 'bazi', note: h.name });
  for (const r of bazi.relations) out.push({ entities: ['bazi', 'relation', r.kind], weight: 48, kind: 'bazi', note: r.note ?? r.name });
  return out.sort((a, b) => b.weight - a.weight);
}

export const elementZh = (e: ElementKey): string => ELEMENT_ZH[e];
