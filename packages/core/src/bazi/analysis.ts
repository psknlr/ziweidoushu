/**
 * 八字分析:十神、五行、日主旺衰、格局、用神、神煞、干支关系。
 * 旺衰采用通行「五行权重简化法」(月令 40 / 通根 30 / 天干生扶 30),
 * 格局按《子平真诠》月令取格,用神按扶抑法 + 《穷通宝鉴》调候简表,
 * 均为公开通行框架;结果附算法说明,供命理师复核。
 */
import { ZH_CN, type BranchKey, type StemKey } from '../keys.js';
import {
  BRANCH_ELEMENT, ELEMENTS, ELEMENT_ZH, GROUP_ZH, GU_CHEN, GUA_SU, HAI, HIDDEN_ROLE, HIDDEN_STEMS, HIDDEN_WEIGHT,
  HONG_YAN, HUA_GAI, JIANG_XING, JIE_SHA, KUI_GANG, LIU_CHONG, LIU_HE, LU_SHEN, PILLAR_POSITIONS, PILLAR_ZH, PO,
  RELATION_ZH, SAN_HE, SAN_HUI, SEASON_STATE_ZH, SHEN_SHA_ZH, STEM_CHONG, STEM_ELEMENT, STEM_HE, TAIJI, TAO_HUA,
  TEN_GOD_GROUP, TEN_GOD_ZH, TEN_GODS, TIAN_DE, TIANYI, WANG_SHEN, WENCHANG, XING_GROUPS, YANG_REN, YI_MA, YUE_DE,
  ZI_XING, branchFromZh, elementControlled, elementControlling, elementGenerated, elementGenerating, generates,
  groupElement, seasonState, stemFromZh, stemYinYang, tenGodOf,
  type ElementKey, type PillarPos, type ShenShaKey, type TenGodGroup, type TenGodKey,
} from './tables.js';
import type { RawPillar } from './calendar.js';
import type {
  BaZiPattern, BaZiPillar, BaZiStrength, HiddenStem, RelationHit, ShenShaHit, StrengthLevel, YongShen,
} from './types.js';

const zh = (k: string) => ZH_CN[k] ?? k;

// ---------------------------------------------------------------- 柱与藏干十神
export function buildPillar(raw: RawPillar, dayMaster: StemKey, dayXunKong: [BranchKey, BranchKey]): BaZiPillar {
  const hidden: HiddenStem[] = HIDDEN_STEMS[raw.branch].map((stem, i) => ({
    stem,
    role: HIDDEN_ROLE[i]!,
    element: STEM_ELEMENT[stem],
    tenGod: tenGodOf(dayMaster, stem),
  }));
  return {
    position: raw.position,
    stem: raw.stem,
    branch: raw.branch,
    stemElement: STEM_ELEMENT[raw.stem],
    branchElement: BRANCH_ELEMENT[raw.branch],
    stemTenGod: raw.position === 'day' ? null : tenGodOf(dayMaster, raw.stem),
    hidden,
    naYin: raw.naYin,
    changSheng: raw.changSheng,
    xunKong: raw.xunKong,
    isKongWang: raw.position !== 'day' && dayXunKong.includes(raw.branch),
  };
}

// ---------------------------------------------------------------- 五行与十神计数
export function countFiveElements(pillars: Record<PillarPos, BaZiPillar>) {
  const visible = Object.fromEntries(ELEMENTS.map((e) => [e, 0])) as Record<ElementKey, number>;
  const weighted = Object.fromEntries(ELEMENTS.map((e) => [e, 0])) as Record<ElementKey, number>;
  for (const pos of PILLAR_POSITIONS) {
    const p = pillars[pos];
    visible[p.stemElement] += 1;
    visible[p.branchElement] += 1;
    weighted[p.stemElement] += 1;
    for (const h of p.hidden) weighted[h.element] += HIDDEN_WEIGHT[h.role];
  }
  for (const e of ELEMENTS) weighted[e] = Math.round(weighted[e] * 100) / 100;
  return { visible, weighted, missing: ELEMENTS.filter((e) => visible[e] === 0) };
}

export function countTenGods(pillars: Record<PillarPos, BaZiPillar>): Record<TenGodKey, number> {
  const counts = Object.fromEntries(TEN_GODS.map((g) => [g, 0])) as Record<TenGodKey, number>;
  for (const pos of PILLAR_POSITIONS) {
    const p = pillars[pos];
    if (p.stemTenGod) counts[p.stemTenGod] += 1;
    const main = p.hidden[0];
    if (main) counts[main.tenGod] += 1;
  }
  return counts;
}

// ---------------------------------------------------------------- 日主旺衰
const SEASON_SCORE = { wang: 40, xiang: 28, xiu: 14, qiu: 7, si: 0 } as const;
const POS_WEIGHT: Record<PillarPos, number> = { year: 1, month: 1.5, day: 1.2, hour: 1 };
const ROOT_MAX_RAW = 1 + 1.5 + 1.2 + 1; // 四支皆本气通根
const SUPPORT_VALUE: Record<TenGodGroup, number> = { self: 8, resource: 6, output: -3, wealth: -4, officer: -6 };

export function assessStrength(pillars: Record<PillarPos, BaZiPillar>, dayMaster: StemKey): BaZiStrength {
  const dm = STEM_ELEMENT[dayMaster];
  const state = seasonState(dm, pillars.month.branch);
  const season = { state, score: SEASON_SCORE[state], max: 40 };

  const rootDetail: BaZiStrength['breakdown']['roots']['detail'] = [];
  let raw = 0;
  for (const pos of PILLAR_POSITIONS) {
    for (const h of pillars[pos].hidden) {
      const kind: 'self' | 'resource' | null = h.element === dm ? 'self' : generates(h.element, dm) ? 'resource' : null;
      if (!kind) continue;
      const value = HIDDEN_WEIGHT[h.role] * POS_WEIGHT[pos] * (kind === 'self' ? 1 : 0.5);
      raw += value;
      rootDetail.push({ position: pos, stem: h.stem, role: h.role, kind, value: Math.round(value * 100) / 100 });
    }
  }
  const roots = { score: Math.round(Math.min(30, (raw / ROOT_MAX_RAW) * 30) * 10) / 10, max: 30, detail: rootDetail };

  const supportDetail: BaZiStrength['breakdown']['support']['detail'] = [];
  let sup = 12;
  for (const pos of ['year', 'month', 'hour'] as const) {
    const p = pillars[pos];
    if (!p.stemTenGod) continue;
    const value = SUPPORT_VALUE[TEN_GOD_GROUP[p.stemTenGod]];
    sup += value;
    supportDetail.push({ position: pos, stem: p.stem, tenGod: p.stemTenGod, value });
  }
  const support = { score: Math.max(0, Math.min(30, sup)), max: 30, detail: supportDetail };

  const score = Math.round((season.score + roots.score + support.score) * 10) / 10;
  const level: StrengthLevel =
    score >= 72 ? 'veryStrong' : score >= 56 ? 'strong' : score >= 44 ? 'balanced' : score >= 28 ? 'weak' : 'veryWeak';
  return {
    score,
    level,
    breakdown: { season, roots, support },
    method:
      '通行五行权重简化法:得令(月令旺相休囚死,40 分)+ 得地(四支藏干通根,按本气/中气/余气与柱位加权,30 分)+ 得势(年月时干比劫印星生扶、官杀财食伤克泄耗,30 分);阈值 72/56/44/28。仅为参考,须结合合冲会局与调候复核。',
  };
}

export const STRENGTH_ZH: Record<StrengthLevel, string> = {
  veryStrong: '极旺', strong: '身强', balanced: '中和', weak: '身弱', veryWeak: '极弱',
};

// ---------------------------------------------------------------- 格局(月令取格)
export function detectPattern(pillars: Record<PillarPos, BaZiPillar>, dayMaster: StemKey, strength: BaZiStrength, counts: Record<TenGodKey, number>): BaZiPattern {
  const month = pillars.month;
  const visibleStems = (['year', 'month', 'hour'] as const).map((p) => pillars[p].stem);
  // 本气 → 中气 → 余气,首个透干者取格;皆不透取本气
  let chosen = month.hidden[0]!;
  let basis = `月支${zh(month.branch)}藏干皆不透,以本气${zh(chosen.stem)}取格`;
  for (const h of month.hidden) {
    if (visibleStems.includes(h.stem)) {
      chosen = h;
      basis = `月支${zh(month.branch)}${h.role === 'main' ? '本气' : h.role === 'middle' ? '中气' : '余气'}${zh(h.stem)}透出于天干,以其十神取格`;
      break;
    }
  }
  const god = chosen.tenGod;
  let key: BaZiPattern['key'] = god;
  let name = `${TEN_GOD_ZH[god]}格`;
  if (god === 'biJian') {
    key = 'jianLu';
    name = '建禄格';
    basis = `月支${zh(month.branch)}为日干${zh(dayMaster)}之禄(比肩当令),依《子平真诠》以建禄论`;
  } else if (god === 'jieCai') {
    const yang = stemYinYang(dayMaster) === 'yang';
    key = yang ? 'yangRen' : 'yueJie';
    name = yang ? '羊刃格' : '月劫格';
    basis = `月支${zh(month.branch)}劫财当令,${yang ? '阳干以羊刃格论' : '阴干以月劫格论'}`;
  }

  const special: string[] = [];
  const officerWealth = counts.zhengGuan + counts.qiSha + counts.zhengCai + counts.pianCai;
  const selfResource = counts.biJian + counts.jieCai + counts.zhengYin + counts.pianYin;
  if (strength.level === 'veryStrong' && officerWealth === 0) special.push('从强/专旺格候选:日主极旺而官杀财星全无,顺其旺势论之(需人工复核)');
  if (strength.level === 'veryWeak' && selfResource <= 1 && strength.breakdown.roots.score < 5) special.push('从弱格候选:日主极弱且印比无根,或可从财官食伤之势(需人工复核)');
  return { key, name, basis, stem: chosen.stem, special };
}

export const PATTERN_ZH = (key: BaZiPattern['key']): string =>
  key === 'jianLu' ? '建禄格' : key === 'yangRen' ? '羊刃格' : key === 'yueJie' ? '月劫格' : `${TEN_GOD_ZH[key]}格`;

// ---------------------------------------------------------------- 用神(扶抑 + 调候)
export function chooseYongShen(pillars: Record<PillarPos, BaZiPillar>, dayMaster: StemKey, strength: BaZiStrength, weighted: Record<ElementKey, number>): YongShen {
  const dm = STEM_ELEMENT[dayMaster];
  const byPresence = (els: ElementKey[]) => [...els].sort((a, b) => weighted[b] - weighted[a]);
  const groupsOf = (els: ElementKey[]) =>
    els.map((e) => (Object.keys(GROUP_ZH) as TenGodGroup[]).find((g) => groupElement(dm, g) === e)).filter(Boolean).map((g) => GROUP_ZH[g!]);

  let favorable: ElementKey[];
  let unfavorable: ElementKey[];
  let rationale: string;
  if (strength.level === 'strong' || strength.level === 'veryStrong') {
    favorable = byPresence([elementControlling(dm), elementGenerated(dm), elementControlled(dm)]);
    unfavorable = [dm, elementGenerating(dm)];
    rationale = `日主${ELEMENT_ZH[dm]}${STRENGTH_ZH[strength.level]}(${strength.score} 分),扶抑法取克泄耗:官杀制之、食伤泄之、财星耗之;忌比劫印星再助旺。`;
  } else if (strength.level === 'weak' || strength.level === 'veryWeak') {
    favorable = byPresence([elementGenerating(dm), dm]);
    unfavorable = [elementControlling(dm), elementControlled(dm), elementGenerated(dm)];
    rationale = `日主${ELEMENT_ZH[dm]}${STRENGTH_ZH[strength.level]}(${strength.score} 分),扶抑法取生扶:印星生之、比劫助之;忌官杀克、财星耗、食伤泄。`;
  } else {
    const least = byPresence([...ELEMENTS]).reverse()[0]!;
    favorable = [least];
    unfavorable = [];
    rationale = `日主${ELEMENT_ZH[dm]}中和(${strength.score} 分),以流通为要,先补最弱之${ELEMENT_ZH[least]}使五行周流;再看调候与大运引动。`;
  }

  const mb = pillars.month.branch;
  let tiaoHou: YongShen['tiaoHou'];
  if (['haiEarthly', 'ziEarthly', 'chouEarthly'].includes(mb)) {
    tiaoHou = { element: 'fire', note: `生于${zh(mb)}月寒冬,《穷通宝鉴》调候首重丙火暖局` };
  } else if (['siEarthly', 'wuEarthly', 'weiEarthly'].includes(mb)) {
    tiaoHou = { element: 'water', note: `生于${zh(mb)}月盛夏,《穷通宝鉴》调候首重壬癸水润局` };
  }

  return {
    method: '扶抑法为主,调候为辅(通行简化,非唯一标准)',
    favorable,
    unfavorable,
    favorableGroups: groupsOf(favorable),
    ...(tiaoHou ? { tiaoHou } : {}),
    rationale,
  };
}

// ---------------------------------------------------------------- 神煞
export function detectShenSha(pillars: Record<PillarPos, BaZiPillar>, dayMaster: StemKey): ShenShaHit[] {
  const hits: ShenShaHit[] = [];
  const dayBranch = pillars.day.branch;
  const yearBranch = pillars.year.branch;
  const yearStem = pillars.year.stem;
  const branchesAt = (b: BranchKey, exclude?: PillarPos): PillarPos[] =>
    PILLAR_POSITIONS.filter((p) => p !== exclude && pillars[p].branch === b);
  const stemsAt = (s: StemKey, exclude?: PillarPos): PillarPos[] =>
    PILLAR_POSITIONS.filter((p) => p !== exclude && pillars[p].stem === s);
  const push = (key: ShenShaKey, basis: string, at: PillarPos[]) => {
    if (at.length === 0) return;
    const existing = hits.find((h) => h.key === key);
    if (existing) {
      for (const p of at) if (!existing.at.includes(p)) existing.at.push(p);
      if (!existing.basis.includes(basis)) existing.basis += `;${basis}`;
      return;
    }
    hits.push({ key, name: SHEN_SHA_ZH[key], basis, at: [...at] });
  };

  // 日干 / 年干 查
  for (const [stem, label] of [[dayMaster, '日干'], [yearStem, '年干']] as const) {
    for (const b of TIANYI[stem]) push('tianyiGuiren', `${label}${zh(stem)}见${zh(b)}`, branchesAt(b));
  }
  for (const b of TAIJI[dayMaster]) push('taijiGuiren', `日干${zh(dayMaster)}见${zh(b)}`, branchesAt(b));
  for (const b of WENCHANG[dayMaster]) push('wenchangGuiren', `日干${zh(dayMaster)}见${zh(b)}`, branchesAt(b));
  for (const b of LU_SHEN[dayMaster]) push('luShen', `日干${zh(dayMaster)}禄在${zh(b)}`, branchesAt(b));
  for (const b of YANG_REN[dayMaster] ?? []) push('yangRen', `阳干${zh(dayMaster)}帝旺${zh(b)}为刃`, branchesAt(b));
  for (const b of HONG_YAN[dayMaster]) push('hongYan', `日干${zh(dayMaster)}见${zh(b)}`, branchesAt(b));

  // 年支 / 日支 查(三合局起例)
  for (const [base, label] of [[yearBranch, '年支'], [dayBranch, '日支']] as const) {
    const basePos: PillarPos = label === '年支' ? 'year' : 'day';
    push('taoHua', `${label}${zh(base)}见${zh(TAO_HUA[base])}`, branchesAt(TAO_HUA[base], basePos));
    push('yiMa', `${label}${zh(base)}见${zh(YI_MA[base])}`, branchesAt(YI_MA[base], basePos));
    push('huaGai', `${label}${zh(base)}见${zh(HUA_GAI[base])}`, branchesAt(HUA_GAI[base], basePos));
    push('jiangXing', `${label}${zh(base)}见${zh(JIANG_XING[base])}`, branchesAt(JIANG_XING[base], basePos));
    push('jieSha', `${label}${zh(base)}见${zh(JIE_SHA[base])}`, branchesAt(JIE_SHA[base], basePos));
    push('wangShen', `${label}${zh(base)}见${zh(WANG_SHEN[base])}`, branchesAt(WANG_SHEN[base], basePos));
  }
  push('guChen', `年支${zh(yearBranch)}见${zh(GU_CHEN[yearBranch])}`, branchesAt(GU_CHEN[yearBranch], 'year'));
  push('guaSu', `年支${zh(yearBranch)}见${zh(GUA_SU[yearBranch])}`, branchesAt(GUA_SU[yearBranch], 'year'));

  // 日柱魁罡
  if (KUI_GANG.some(([s, b]) => s === dayMaster && b === dayBranch)) {
    push('kuiGang', `日柱${zh(dayMaster)}${zh(dayBranch)}为魁罡`, ['day']);
  }

  // 月支查天德/月德
  const td = TIAN_DE[pillars.month.branch];
  const tdAt = '甲乙丙丁戊己庚辛壬癸'.includes(td) ? stemsAt(stemFromZh(td)) : branchesAt(branchFromZh(td));
  push('tianDe', `${zh(pillars.month.branch)}月天德在${td}`, tdAt);
  const yd = YUE_DE[pillars.month.branch];
  push('yueDe', `${zh(pillars.month.branch)}月月德在${zh(yd)}`, stemsAt(yd));

  // 空亡(日柱旬空落年/月/时支)
  const kong = PILLAR_POSITIONS.filter((p) => pillars[p].isKongWang);
  push('kongWang', `日柱旬空${pillars.day.xunKong.map(zh).join('')}`, kong);

  return hits;
}

// ---------------------------------------------------------------- 干支关系
export function detectRelations(pillars: Record<PillarPos, BaZiPillar>): RelationHit[] {
  const out: RelationHit[] = [];
  const pos = PILLAR_POSITIONS;
  const pairOf = (a: PillarPos, b: PillarPos) => `${PILLAR_ZH[a]}${PILLAR_ZH[b]}`;

  // 天干
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      const a = pillars[pos[i]!]; const b = pillars[pos[j]!];
      const he = STEM_HE.find(([x, y]) => (x === a.stem && y === b.stem) || (x === b.stem && y === a.stem));
      if (he) out.push({ kind: 'stemHe', name: RELATION_ZH.stemHe, members: [{ position: a.position, stem: a.stem }, { position: b.position, stem: b.stem }], element: he[2], note: `${zh(a.stem)}${zh(b.stem)}合化${ELEMENT_ZH[he[2]]}(${pairOf(a.position, b.position)}${i + 1 === j ? '相邻' : '隔位'})` });
      const chong = STEM_CHONG.some(([x, y]) => (x === a.stem && y === b.stem) || (x === b.stem && y === a.stem));
      if (chong) out.push({ kind: 'stemChong', name: RELATION_ZH.stemChong, members: [{ position: a.position, stem: a.stem }, { position: b.position, stem: b.stem }], note: `${zh(a.stem)}${zh(b.stem)}相冲` });
    }
  }
  // 地支两两
  const has = (list: readonly [BranchKey, BranchKey][], x: BranchKey, y: BranchKey) => list.some(([p, q]) => (p === x && q === y) || (p === y && q === x));
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 4; j++) {
      const a = pillars[pos[i]!]; const b = pillars[pos[j]!];
      const members = [{ position: a.position, branch: a.branch }, { position: b.position, branch: b.branch }];
      const label = `${zh(a.branch)}${zh(b.branch)}`;
      if (has(LIU_HE, a.branch, b.branch)) out.push({ kind: 'liuHe', name: RELATION_ZH.liuHe, members, note: `${label}六合` });
      if (has(LIU_CHONG, a.branch, b.branch)) out.push({ kind: 'liuChong', name: RELATION_ZH.liuChong, members, note: `${label}相冲${pos[j] === 'month' || pos[i] === 'month' ? '(冲提纲)' : ''}` });
      if (has(HAI, a.branch, b.branch)) out.push({ kind: 'hai', name: RELATION_ZH.hai, members, note: `${label}相害` });
      if (has(PO, a.branch, b.branch)) out.push({ kind: 'po', name: RELATION_ZH.po, members, note: `${label}相破` });
      if (a.branch === b.branch && ZI_XING.has(a.branch)) out.push({ kind: 'ziXing', name: RELATION_ZH.ziXing, members, note: `${zh(a.branch)}${zh(b.branch)}自刑` });
      if (a.branch !== b.branch && XING_GROUPS.some((g) => g.includes(a.branch) && g.includes(b.branch))) {
        out.push({ kind: 'xing', name: RELATION_ZH.xing, members, note: `${label}相刑` });
      }
      // 半合(含中神)
      for (const s of SAN_HE) {
        const mid = s.members[1];
        const inGroup = s.members.includes(a.branch) && s.members.includes(b.branch);
        if (inGroup && a.branch !== b.branch && (a.branch === mid || b.branch === mid)) {
          const full = pos.some((p) => p !== a.position && p !== b.position && s.members.includes(pillars[p].branch) && pillars[p].branch !== a.branch && pillars[p].branch !== b.branch);
          if (!full) out.push({ kind: 'banHe', name: RELATION_ZH.banHe, members, element: s.element, note: `${label}半合${ELEMENT_ZH[s.element]}` });
        }
      }
    }
  }
  // 三合 / 三会(全)
  const branches = pos.map((p) => pillars[p].branch);
  for (const s of SAN_HE) {
    if (s.members.every((m) => branches.includes(m))) {
      out.push({ kind: 'sanHe', name: RELATION_ZH.sanHe, members: s.members.map((m) => ({ position: pos[branches.indexOf(m)]!, branch: m })), element: s.element, note: `${s.members.map(zh).join('')}三合${ELEMENT_ZH[s.element]}局` });
    }
  }
  for (const s of SAN_HUI) {
    if (s.members.every((m) => branches.includes(m))) {
      out.push({ kind: 'sanHui', name: RELATION_ZH.sanHui, members: s.members.map((m) => ({ position: pos[branches.indexOf(m)]!, branch: m })), element: s.element, note: `${s.members.map(zh).join('')}三会${ELEMENT_ZH[s.element]}方` });
    }
  }
  return out;
}

export { SEASON_STATE_ZH };
