/**
 * 八字(四柱)古法数据表。全部为通行公开的经典表格,来源标注于各表注释:
 * 藏干/十神/纳音/长生 —《渊海子平》《三命通会》通行表;神煞 —《三命通会·神煞》通行歌诀;
 * 干支合冲刑害 — 通行表。lunar-typescript 提供的同类表在测试中做交叉核对。
 */
import { EARTHLY_BRANCHES, HEAVENLY_STEMS, ZH_CN, type BranchKey, type StemKey } from '../keys.js';

export type ElementKey = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
export type YinYang = 'yang' | 'yin';
export type TenGodKey =
  | 'biJian' | 'jieCai' | 'shiShen' | 'shangGuan' | 'pianCai'
  | 'zhengCai' | 'qiSha' | 'zhengGuan' | 'pianYin' | 'zhengYin';
export type PillarPos = 'year' | 'month' | 'day' | 'hour';
export type HiddenRole = 'main' | 'middle' | 'residual';

export const ELEMENTS: readonly ElementKey[] = ['wood', 'fire', 'earth', 'metal', 'water'];
export const TEN_GODS: readonly TenGodKey[] = [
  'biJian', 'jieCai', 'shiShen', 'shangGuan', 'pianCai', 'zhengCai', 'qiSha', 'zhengGuan', 'pianYin', 'zhengYin',
];
export const PILLAR_POSITIONS: readonly PillarPos[] = ['year', 'month', 'day', 'hour'];

// ---------------------------------------------------------------- 干支 ↔ 中文
const STEM_ZH = HEAVENLY_STEMS.map((k) => ZH_CN[k]!);
const BRANCH_ZH = EARTHLY_BRANCHES.map((k) => ZH_CN[k]!);
export const stemFromZh = (zh: string): StemKey => {
  const i = STEM_ZH.indexOf(zh);
  if (i < 0) throw new Error(`[@ziwei/core/bazi] 未知天干: ${zh}`);
  return HEAVENLY_STEMS[i]!;
};
export const branchFromZh = (zh: string): BranchKey => {
  const i = BRANCH_ZH.indexOf(zh);
  if (i < 0) throw new Error(`[@ziwei/core/bazi] 未知地支: ${zh}`);
  return EARTHLY_BRANCHES[i]!;
};
export const stemIndex = (s: StemKey): number => HEAVENLY_STEMS.indexOf(s);
export const branchIndex = (b: BranchKey): number => EARTHLY_BRANCHES.indexOf(b);

// ---------------------------------------------------------------- 五行 / 阴阳
/** 甲乙木 丙丁火 戊己土 庚辛金 壬癸水 */
export const STEM_ELEMENT: Record<StemKey, ElementKey> = {
  jiaHeavenly: 'wood', yiHeavenly: 'wood', bingHeavenly: 'fire', dingHeavenly: 'fire',
  wuHeavenly: 'earth', jiHeavenly: 'earth', gengHeavenly: 'metal', xinHeavenly: 'metal',
  renHeavenly: 'water', guiHeavenly: 'water',
};
/** 天干奇数位为阳(甲丙戊庚壬) */
export const stemYinYang = (s: StemKey): YinYang => (stemIndex(s) % 2 === 0 ? 'yang' : 'yin');
/** 子阳丑阴…按序交替 */
export const branchYinYang = (b: BranchKey): YinYang => (branchIndex(b) % 2 === 0 ? 'yang' : 'yin');
/** 寅卯木 巳午火 申酉金 亥子水 辰戌丑未土 */
export const BRANCH_ELEMENT: Record<BranchKey, ElementKey> = {
  ziEarthly: 'water', chouEarthly: 'earth', yinEarthly: 'wood', maoEarthly: 'wood',
  chenEarthly: 'earth', siEarthly: 'fire', wuEarthly: 'fire', weiEarthly: 'earth',
  shenEarthly: 'metal', youEarthly: 'metal', xuEarthly: 'earth', haiEarthly: 'water',
};

/** 五行相生:木→火→土→金→水→木 */
const GEN_ORDER: ElementKey[] = ['wood', 'fire', 'earth', 'metal', 'water'];
export const generates = (a: ElementKey, b: ElementKey): boolean => GEN_ORDER[(GEN_ORDER.indexOf(a) + 1) % 5] === b;
export const controls = (a: ElementKey, b: ElementKey): boolean => GEN_ORDER[(GEN_ORDER.indexOf(a) + 2) % 5] === b;
export const elementGenerating = (e: ElementKey): ElementKey => GEN_ORDER[(GEN_ORDER.indexOf(e) + 4) % 5]!; // 生我者
export const elementGenerated = (e: ElementKey): ElementKey => GEN_ORDER[(GEN_ORDER.indexOf(e) + 1) % 5]!; // 我生者
export const elementControlled = (e: ElementKey): ElementKey => GEN_ORDER[(GEN_ORDER.indexOf(e) + 2) % 5]!; // 我克者
export const elementControlling = (e: ElementKey): ElementKey => GEN_ORDER[(GEN_ORDER.indexOf(e) + 3) % 5]!; // 克我者

// ---------------------------------------------------------------- 藏干(本气/中气/余气)
/** 通行藏干表(《渊海子平》) */
export const HIDDEN_STEMS: Record<BranchKey, StemKey[]> = {
  ziEarthly: ['guiHeavenly'],
  chouEarthly: ['jiHeavenly', 'guiHeavenly', 'xinHeavenly'],
  yinEarthly: ['jiaHeavenly', 'bingHeavenly', 'wuHeavenly'],
  maoEarthly: ['yiHeavenly'],
  chenEarthly: ['wuHeavenly', 'yiHeavenly', 'guiHeavenly'],
  siEarthly: ['bingHeavenly', 'gengHeavenly', 'wuHeavenly'],
  wuEarthly: ['dingHeavenly', 'jiHeavenly'],
  weiEarthly: ['jiHeavenly', 'dingHeavenly', 'yiHeavenly'],
  shenEarthly: ['gengHeavenly', 'renHeavenly', 'wuHeavenly'],
  youEarthly: ['xinHeavenly'],
  xuEarthly: ['wuHeavenly', 'xinHeavenly', 'dingHeavenly'],
  haiEarthly: ['renHeavenly', 'jiaHeavenly'],
};
export const HIDDEN_ROLE: readonly HiddenRole[] = ['main', 'middle', 'residual'];
/** 藏干力量权重(本气/中气/余气),通行简化 */
export const HIDDEN_WEIGHT: Record<HiddenRole, number> = { main: 1, middle: 0.6, residual: 0.3 };

// ---------------------------------------------------------------- 十神
/** 以日干为我:同我/我生/我克/克我/生我 × 同性(偏)/异性(正) */
export function tenGodOf(dayMaster: StemKey, other: StemKey): TenGodKey {
  const me = STEM_ELEMENT[dayMaster];
  const it = STEM_ELEMENT[other];
  const same = stemYinYang(dayMaster) === stemYinYang(other);
  if (me === it) return same ? 'biJian' : 'jieCai';
  if (generates(me, it)) return same ? 'shiShen' : 'shangGuan';
  if (controls(me, it)) return same ? 'pianCai' : 'zhengCai';
  if (controls(it, me)) return same ? 'qiSha' : 'zhengGuan';
  return same ? 'pianYin' : 'zhengYin';
}
/** 十神所属五行关系组 */
export type TenGodGroup = 'self' | 'output' | 'wealth' | 'officer' | 'resource';
export const TEN_GOD_GROUP: Record<TenGodKey, TenGodGroup> = {
  biJian: 'self', jieCai: 'self', shiShen: 'output', shangGuan: 'output',
  pianCai: 'wealth', zhengCai: 'wealth', qiSha: 'officer', zhengGuan: 'officer',
  pianYin: 'resource', zhengYin: 'resource',
};
export const GROUP_ZH: Record<TenGodGroup, string> = {
  self: '比劫', output: '食伤', wealth: '财星', officer: '官杀', resource: '印星',
};
export function groupElement(dm: ElementKey, group: TenGodGroup): ElementKey {
  switch (group) {
    case 'self': return dm;
    case 'output': return elementGenerated(dm);
    case 'wealth': return elementControlled(dm);
    case 'officer': return elementControlling(dm);
    case 'resource': return elementGenerating(dm);
  }
}

// ---------------------------------------------------------------- 旺相休囚死(月令)
export type SeasonState = 'wang' | 'xiang' | 'xiu' | 'qiu' | 'si';
export const SEASON_STATE_ZH: Record<SeasonState, string> = { wang: '旺', xiang: '相', xiu: '休', qiu: '囚', si: '死' };
/** 月支 → 当令五行(寅卯木、巳午火、申酉金、亥子水、辰戌丑未土) */
export const seasonElementOf = (monthBranch: BranchKey): ElementKey => BRANCH_ELEMENT[monthBranch];
/** 某五行在月令下的状态:当令旺、令生者相、生令者休、克令者囚、令克者死 */
export function seasonState(element: ElementKey, monthBranch: BranchKey): SeasonState {
  const s = seasonElementOf(monthBranch);
  if (element === s) return 'wang';
  if (generates(s, element)) return 'xiang';
  if (generates(element, s)) return 'xiu';
  if (controls(element, s)) return 'qiu';
  return 'si';
}

// ---------------------------------------------------------------- 神煞(通行歌诀)
export type ShenShaKey =
  | 'tianyiGuiren' | 'taijiGuiren' | 'wenchangGuiren' | 'luShen' | 'yangRen' | 'taoHua' | 'yiMa'
  | 'huaGai' | 'jiangXing' | 'jieSha' | 'wangShen' | 'guChen' | 'guaSu' | 'kuiGang' | 'tianDe'
  | 'yueDe' | 'hongYan' | 'kongWang';

const B = branchFromZh;
const S = stemFromZh;
const stemMap = (spec: string): Record<StemKey, BranchKey[]> => {
  // spec: "甲:丑未;乙:子申;…"
  const out = {} as Record<StemKey, BranchKey[]>;
  for (const part of spec.split(';')) {
    const [stems, branches] = part.split(':') as [string, string];
    for (const s of stems) out[S(s)] = [...branches].map(B);
  }
  return out;
};
const triadMap = (spec: string): Record<BranchKey, BranchKey> => {
  // spec: "申子辰:酉;亥卯未:子;…" → 每支查得目标支
  const out = {} as Record<BranchKey, BranchKey>;
  for (const part of spec.split(';')) {
    const [members, target] = part.split(':') as [string, string];
    for (const m of members) out[B(m)] = B(target);
  }
  return out;
};

/** 天乙贵人(日干/年干查):甲戊庚牛羊,乙己鼠猴乡,丙丁猪鸡位,壬癸兔蛇藏,六辛逢马虎 */
export const TIANYI: Record<StemKey, BranchKey[]> = stemMap('甲戊庚:丑未;乙己:子申;丙丁:亥酉;壬癸:卯巳;辛:午寅');
/** 太极贵人(日干查):甲乙子午,丙丁卯酉,戊己辰戌丑未,庚辛寅亥,壬癸巳申 */
export const TAIJI: Record<StemKey, BranchKey[]> = stemMap('甲乙:子午;丙丁:卯酉;戊己:辰戌丑未;庚辛:寅亥;壬癸:巳申');
/** 文昌贵人(日干查):甲巳乙午丙申丁酉戊申己酉庚亥辛子壬寅癸卯 */
export const WENCHANG: Record<StemKey, BranchKey[]> = stemMap('甲:巳;乙:午;丙:申;丁:酉;戊:申;己:酉;庚:亥;辛:子;壬:寅;癸:卯');
/** 禄神(日干查):甲寅乙卯丙戊巳丁己午庚申辛酉壬亥癸子 */
export const LU_SHEN: Record<StemKey, BranchKey[]> = stemMap('甲:寅;乙:卯;丙:巳;丁:午;戊:巳;己:午;庚:申;辛:酉;壬:亥;癸:子');
/** 羊刃(阳干查帝旺之支):甲卯丙午戊午庚酉壬子;阴干有争议,本库不列 */
export const YANG_REN: Partial<Record<StemKey, BranchKey[]>> = stemMap('甲:卯;丙:午;戊:午;庚:酉;壬:子');
/** 红艳煞(日干查):甲午乙申丙寅丁未戊辰己辰庚戌辛酉壬子癸申 */
export const HONG_YAN: Record<StemKey, BranchKey[]> = stemMap('甲:午;乙:申;丙:寅;丁:未;戊:辰;己:辰;庚:戌;辛:酉;壬:子;癸:申');
/** 桃花/咸池(年支、日支查):申子辰在酉,亥卯未在子,寅午戌在卯,巳酉丑在午 */
export const TAO_HUA: Record<BranchKey, BranchKey> = triadMap('申子辰:酉;亥卯未:子;寅午戌:卯;巳酉丑:午');
/** 驿马:申子辰在寅,亥卯未在巳,寅午戌在申,巳酉丑在亥 */
export const YI_MA: Record<BranchKey, BranchKey> = triadMap('申子辰:寅;亥卯未:巳;寅午戌:申;巳酉丑:亥');
/** 华盖:申子辰在辰,亥卯未在未,寅午戌在戌,巳酉丑在丑 */
export const HUA_GAI: Record<BranchKey, BranchKey> = triadMap('申子辰:辰;亥卯未:未;寅午戌:戌;巳酉丑:丑');
/** 将星:申子辰在子,亥卯未在卯,寅午戌在午,巳酉丑在酉 */
export const JIANG_XING: Record<BranchKey, BranchKey> = triadMap('申子辰:子;亥卯未:卯;寅午戌:午;巳酉丑:酉');
/** 劫煞:申子辰在巳,亥卯未在申,寅午戌在亥,巳酉丑在寅 */
export const JIE_SHA: Record<BranchKey, BranchKey> = triadMap('申子辰:巳;亥卯未:申;寅午戌:亥;巳酉丑:寅');
/** 亡神:申子辰在亥,亥卯未在寅,寅午戌在巳,巳酉丑在申 */
export const WANG_SHEN: Record<BranchKey, BranchKey> = triadMap('申子辰:亥;亥卯未:寅;寅午戌:巳;巳酉丑:申');
/** 孤辰(年支查):亥子丑见寅,寅卯辰见巳,巳午未见申,申酉戌见亥 */
export const GU_CHEN: Record<BranchKey, BranchKey> = triadMap('亥子丑:寅;寅卯辰:巳;巳午未:申;申酉戌:亥');
/** 寡宿(年支查):亥子丑见戌,寅卯辰见丑,巳午未见辰,申酉戌见未 */
export const GUA_SU: Record<BranchKey, BranchKey> = triadMap('亥子丑:戌;寅卯辰:丑;巳午未:辰;申酉戌:未');
/** 魁罡(日柱):庚辰 壬辰 戊戌 庚戌 */
export const KUI_GANG: readonly [StemKey, BranchKey][] = [
  ['gengHeavenly', 'chenEarthly'], ['renHeavenly', 'chenEarthly'], ['wuHeavenly', 'xuEarthly'], ['gengHeavenly', 'xuEarthly'],
];
/** 天德贵人(月支查,所得为干或支):正丁二申三壬四辛五亥六甲七癸八寅九丙十乙冬巳腊庚 */
export const TIAN_DE: Record<BranchKey, string> = {
  yinEarthly: '丁', maoEarthly: '申', chenEarthly: '壬', siEarthly: '辛', wuEarthly: '亥', weiEarthly: '甲',
  shenEarthly: '癸', youEarthly: '寅', xuEarthly: '丙', haiEarthly: '乙', ziEarthly: '巳', chouEarthly: '庚',
};
/** 月德贵人(月支查天干):寅午戌月丙,申子辰月壬,亥卯未月甲,巳酉丑月庚 */
export const YUE_DE: Record<BranchKey, StemKey> = (() => {
  const out = {} as Record<BranchKey, StemKey>;
  for (const [members, stem] of [['寅午戌', '丙'], ['申子辰', '壬'], ['亥卯未', '甲'], ['巳酉丑', '庚']] as const) {
    for (const m of members) out[B(m)] = S(stem);
  }
  return out;
})();

export const SHEN_SHA_ZH: Record<ShenShaKey, string> = {
  tianyiGuiren: '天乙贵人', taijiGuiren: '太极贵人', wenchangGuiren: '文昌贵人', luShen: '禄神', yangRen: '羊刃',
  taoHua: '桃花', yiMa: '驿马', huaGai: '华盖', jiangXing: '将星', jieSha: '劫煞', wangShen: '亡神',
  guChen: '孤辰', guaSu: '寡宿', kuiGang: '魁罡', tianDe: '天德贵人', yueDe: '月德贵人', hongYan: '红艳煞', kongWang: '空亡',
};

// ---------------------------------------------------------------- 干支关系
export type RelationKind =
  | 'stemHe' | 'stemChong' | 'liuHe' | 'sanHe' | 'banHe' | 'sanHui' | 'liuChong' | 'xing' | 'ziXing' | 'hai' | 'po';
export const RELATION_ZH: Record<RelationKind, string> = {
  stemHe: '天干五合', stemChong: '天干相冲', liuHe: '地支六合', sanHe: '三合局', banHe: '半合', sanHui: '三会方',
  liuChong: '六冲', xing: '相刑', ziXing: '自刑', hai: '相害', po: '相破',
};
/** 天干五合及化气:甲己土 乙庚金 丙辛水 丁壬木 戊癸火 */
export const STEM_HE: readonly [StemKey, StemKey, ElementKey][] = [
  ['jiaHeavenly', 'jiHeavenly', 'earth'], ['yiHeavenly', 'gengHeavenly', 'metal'], ['bingHeavenly', 'xinHeavenly', 'water'],
  ['dingHeavenly', 'renHeavenly', 'wood'], ['wuHeavenly', 'guiHeavenly', 'fire'],
];
/** 天干四冲:甲庚 乙辛 丙壬 丁癸 */
export const STEM_CHONG: readonly [StemKey, StemKey][] = [
  ['jiaHeavenly', 'gengHeavenly'], ['yiHeavenly', 'xinHeavenly'], ['bingHeavenly', 'renHeavenly'], ['dingHeavenly', 'guiHeavenly'],
];
const pairs = (spec: string): [BranchKey, BranchKey][] => spec.split(' ').map((p) => [B(p[0]!), B(p[1]!)]);
export const LIU_HE = pairs('子丑 寅亥 卯戌 辰酉 巳申 午未');
export const LIU_CHONG = pairs('子午 丑未 寅申 卯酉 辰戌 巳亥');
export const HAI = pairs('子未 丑午 寅巳 卯辰 申亥 酉戌');
export const PO = pairs('子酉 丑辰 寅亥 卯午 巳申 未戌');
/** 三合局(中神居中):申子辰水 亥卯未木 寅午戌火 巳酉丑金 */
export const SAN_HE: readonly { members: [BranchKey, BranchKey, BranchKey]; element: ElementKey }[] = [
  { members: [B('申'), B('子'), B('辰')], element: 'water' },
  { members: [B('亥'), B('卯'), B('未')], element: 'wood' },
  { members: [B('寅'), B('午'), B('戌')], element: 'fire' },
  { members: [B('巳'), B('酉'), B('丑')], element: 'metal' },
];
/** 三会方:寅卯辰木 巳午未火 申酉戌金 亥子丑水 */
export const SAN_HUI: readonly { members: [BranchKey, BranchKey, BranchKey]; element: ElementKey }[] = [
  { members: [B('寅'), B('卯'), B('辰')], element: 'wood' },
  { members: [B('巳'), B('午'), B('未')], element: 'fire' },
  { members: [B('申'), B('酉'), B('戌')], element: 'metal' },
  { members: [B('亥'), B('子'), B('丑')], element: 'water' },
];
/** 相刑:寅巳申(无恩)、丑戌未(恃势)、子卯(无礼);自刑辰午酉亥 */
export const XING_GROUPS: readonly BranchKey[][] = [[B('寅'), B('巳'), B('申')], [B('丑'), B('戌'), B('未')], [B('子'), B('卯')]];
export const ZI_XING: ReadonlySet<BranchKey> = new Set([B('辰'), B('午'), B('酉'), B('亥')]);

// ---------------------------------------------------------------- 中文词表
export const ELEMENT_ZH: Record<ElementKey, string> = { wood: '木', fire: '火', earth: '土', metal: '金', water: '水' };
export const TEN_GOD_ZH: Record<TenGodKey, string> = {
  biJian: '比肩', jieCai: '劫财', shiShen: '食神', shangGuan: '伤官', pianCai: '偏财',
  zhengCai: '正财', qiSha: '七杀', zhengGuan: '正官', pianYin: '偏印', zhengYin: '正印',
};
export const PILLAR_ZH: Record<PillarPos, string> = { year: '年柱', month: '月柱', day: '日柱', hour: '时柱' };
export const HIDDEN_ROLE_ZH: Record<HiddenRole, string> = { main: '本气', middle: '中气', residual: '余气' };
