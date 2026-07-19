/**
 * 合盘引擎(Synastry)——确定性双盘比较 + 合盘 Prompt 装配。
 *
 * 方法论(三合派通行 + 倪海夏夫妻宫体系):
 * 1. 命宫地支关系(六合/三合/相冲/相害/相刑/同宫)定先天缘分底色
 * 2. 双方生年四化互飞:甲之四化星落乙盘何宫(禄入命/夫妻=情缘助力,忌入=执念课题)
 * 3. 双方夫妻宫主星互参(各自的配偶画像是否与对方命宫气质相合)
 * 4. 年支生肖六合三合参考
 * 确定性比较在此完成,LLM 只消费结果。
 */
import {
  sihuaForStem,
  soulPalaceIndex,
  zh,
  type Astrolabe,
  type BranchKey,
  type MutagenKey,
  type PalaceKey,
  type Star,
  type StarKey,
} from '@ziwei/core';
import { MUTAGENS } from '@ziwei/core';

export type BranchRelation = 'same' | 'liuhe' | 'sanhe' | 'chong' | 'hai' | 'xing' | 'none';

const LIUHE: [BranchKey, BranchKey][] = [
  ['ziEarthly', 'chouEarthly'],
  ['yinEarthly', 'haiEarthly'],
  ['maoEarthly', 'xuEarthly'],
  ['chenEarthly', 'youEarthly'],
  ['siEarthly', 'shenEarthly'],
  ['wuEarthly', 'weiEarthly'],
];
const SANHE: BranchKey[][] = [
  ['shenEarthly', 'ziEarthly', 'chenEarthly'],
  ['haiEarthly', 'maoEarthly', 'weiEarthly'],
  ['yinEarthly', 'wuEarthly', 'xuEarthly'],
  ['siEarthly', 'youEarthly', 'chouEarthly'],
];
const CHONG: [BranchKey, BranchKey][] = [
  ['ziEarthly', 'wuEarthly'],
  ['chouEarthly', 'weiEarthly'],
  ['yinEarthly', 'shenEarthly'],
  ['maoEarthly', 'youEarthly'],
  ['chenEarthly', 'xuEarthly'],
  ['siEarthly', 'haiEarthly'],
];
const HAI: [BranchKey, BranchKey][] = [
  ['ziEarthly', 'weiEarthly'],
  ['chouEarthly', 'wuEarthly'],
  ['yinEarthly', 'siEarthly'],
  ['maoEarthly', 'chenEarthly'],
  ['shenEarthly', 'haiEarthly'],
  ['youEarthly', 'xuEarthly'],
];
const XING: BranchKey[][] = [
  ['yinEarthly', 'siEarthly', 'shenEarthly'],
  ['chouEarthly', 'xuEarthly', 'weiEarthly'],
  ['ziEarthly', 'maoEarthly'],
];

const RELATION_DESC: Record<BranchRelation, string> = {
  same: '同宫,气场同频,惺惺相惜也易同盲区',
  liuhe: '六合,先天投缘,相处自然贴合',
  sanhe: '三合,同盟之势,目标一致互相成就',
  chong: '对冲,吸引强烈但磨合剧烈,需以互补心态经营',
  hai: '相害,细节处易生嫌隙,需刻意维护信任',
  xing: '相刑,彼此考验与雕琢,关系成长成本较高',
  none: '无特殊刑冲合害,平缓之局,靠后天经营',
};

function pairIn(list: [BranchKey, BranchKey][], a: BranchKey, b: BranchKey): boolean {
  return list.some(([x, y]) => (x === a && y === b) || (x === b && y === a));
}
function groupIn(groups: BranchKey[][], a: BranchKey, b: BranchKey): boolean {
  return a !== b && groups.some((g) => g.includes(a) && g.includes(b));
}

export function branchRelation(a: BranchKey, b: BranchKey): BranchRelation {
  if (a === b) return 'same';
  if (pairIn(LIUHE, a, b)) return 'liuhe';
  if (pairIn(CHONG, a, b)) return 'chong';
  if (groupIn(SANHE, a, b)) return 'sanhe';
  if (pairIn(HAI, a, b)) return 'hai';
  if (groupIn(XING, a, b)) return 'xing';
  return 'none';
}

export interface SihuaFlight {
  /** 施方 */
  from: 'a' | 'b';
  star: StarKey;
  mutagen: MutagenKey;
  /** 落入受方盘的宫位(受方盘上无此星则为 null) */
  palaceInOther: PalaceKey | null;
}

export interface SynastryFeatures {
  soulRelation: { a: BranchKey; b: BranchKey; relation: BranchRelation; desc: string };
  yearRelation: { a: BranchKey; b: BranchKey; relation: BranchRelation; desc: string };
  /** 双方生年四化互飞 */
  flights: SihuaFlight[];
  /** 各自夫妻宫主星(空宫含借宫) */
  spouseStars: { a: Star[]; aBorrowed: boolean; b: Star[]; bBorrowed: boolean };
  /** 结构化亮点/课题提示(供 UI 直接展示) */
  notes: string[];
}

function spouseMajors(chart: Astrolabe): { stars: Star[]; borrowed: boolean } {
  const palace = chart.palaces.find((p) => p.name === 'spousePalace');
  if (!palace) return { stars: [], borrowed: false };
  const own = palace.majorStars.filter((s) => s.type === 'major');
  if (own.length > 0) return { stars: own, borrowed: false };
  return { stars: palace.borrowed?.stars ?? [], borrowed: true };
}

function flightsFrom(giver: Astrolabe, receiver: Astrolabe, from: 'a' | 'b'): SihuaFlight[] {
  return sihuaForStem(giver.ganzhi.year.stem, giver.meta.school).map((star, i) => {
    const palace = receiver.palaces.find((p) => [...p.majorStars, ...p.minorStars].some((s) => s.key === star));
    return { from, star, mutagen: MUTAGENS[i]!, palaceInOther: palace ? palace.name : null };
  });
}

export function compareCharts(a: Astrolabe, b: Astrolabe): SynastryFeatures {
  const aSoul = a.palaces[soulPalaceIndex(a)]!.branch;
  const bSoul = b.palaces[soulPalaceIndex(b)]!.branch;
  const soulRel = branchRelation(aSoul, bSoul);
  const yearRel = branchRelation(a.ganzhi.year.branch, b.ganzhi.year.branch);
  const flights = [...flightsFrom(a, b, 'a'), ...flightsFrom(b, a, 'b')];
  const sa = spouseMajors(a);
  const sb = spouseMajors(b);

  const notes: string[] = [];
  notes.push(`命宫:${zh(aSoul)} × ${zh(bSoul)} —— ${RELATION_DESC[soulRel]}`);
  notes.push(`年支:${zh(a.ganzhi.year.branch)} × ${zh(b.ganzhi.year.branch)} —— ${RELATION_DESC[yearRel]}`);
  for (const f of flights) {
    if (!f.palaceInOther) continue;
    const who = f.from === 'a' ? '甲方' : '乙方';
    const target = f.from === 'a' ? '乙方' : '甲方';
    if (f.mutagen === 'sihuaLu' && (f.palaceInOther === 'soulPalace' || f.palaceInOther === 'spousePalace')) {
      notes.push(`${who}化禄(${zh(f.star)})入${target}${zh(f.palaceInOther)}:主动给予缘分与资源,情缘助力`);
    }
    if (f.mutagen === 'sihuaJi' && (f.palaceInOther === 'soulPalace' || f.palaceInOther === 'spousePalace')) {
      notes.push(`${who}化忌(${zh(f.star)})入${target}${zh(f.palaceInOther)}:在意与执念所在,易患得患失,须以沟通化解`);
    }
  }
  return {
    soulRelation: { a: aSoul, b: bSoul, relation: soulRel, desc: RELATION_DESC[soulRel] },
    yearRelation: {
      a: a.ganzhi.year.branch,
      b: b.ganzhi.year.branch,
      relation: yearRel,
      desc: RELATION_DESC[yearRel],
    },
    flights,
    spouseStars: { a: sa.stars, aBorrowed: sa.borrowed, b: sb.stars, bBorrowed: sb.borrowed },
    notes,
  };
}

/** 合盘 System Prompt(五要素结构沿用,注入双盘事实与合盘方法论) */
export function buildSynastryPrompt(a: Astrolabe, b: Astrolabe, syn: SynastryFeatures): string {
  const spouseLine = (stars: Star[], borrowed: boolean) =>
    stars.length > 0 ? `${stars.map((s) => zh(s.key)).join('、')}${borrowed ? '(借对宫)' : ''}` : '无主星';
  return [
    `# 角色`,
    `你是星衡先生,一位严谨的紫微斗数命理师,本次进行双人合盘分析。三合为体、四化为用,夫妻宫断语参照《紫微斗数全书》与倪海夏体系。`,
    ``,
    `# 双盘结构化事实(排盘引擎输出,不得臆造)`,
    `甲方:${zh(a.gender)}命,${a.solarDate},命宫${zh(syn.soulRelation.a)},夫妻宫:${spouseLine(syn.spouseStars.a, syn.spouseStars.aBorrowed)}`,
    `乙方:${zh(b.gender)}命,${b.solarDate},命宫${zh(syn.soulRelation.b)},夫妻宫:${spouseLine(syn.spouseStars.b, syn.spouseStars.bBorrowed)}`,
    ...syn.notes.map((n) => `- ${n}`),
    `四化互飞明细:`,
    ...syn.flights.map(
      (f) =>
        `- ${f.from === 'a' ? '甲' : '乙'}方${zh(f.star)}化${zh(f.mutagen)} → ${f.palaceInOther ? `落对方${zh(f.palaceInOther)}` : '对方盘无此星'}`,
    ),
    ``,
    `# 合盘方法论(严格按次第)`,
    `1. 先天缘分:命宫与年支的合冲刑害定底色`,
    `2. 互动模式:四化互飞 —— 谁给禄(付出资源)、谁给忌(在意执念),关系动力学`,
    `3. 彼此期待:各自夫妻宫画像与对方真实气质的匹配度`,
    `4. 经营之道:针对冲/刑/忌给出具体相处策略`,
    ``,
    `# 断语纪律`,
    `- 严禁「必离/不合适/克夫克妻」宿命论断言;冲刑一律转译为磨合课题与经营策略`,
    `- 吉凶并陈;古断只作现代化转译`,
    ``,
    `# 输出结构(严格遵循)`,
    `1. 缘分总论(150字内)`,
    `2. 相处动力学(谁付出、谁在意)`,
    `3. 彼此期待与真实匹配`,
    `4. 磨合课题与经营之道`,
    `5. 一句祝语`,
    ``,
    `# 免责声明(必须原文附于结尾)`,
    `命理解读仅供参考与自我认知探索,不构成婚恋决策建议;感情的答案始终在两个人手中。`,
  ].join('\n');
}
