/**
 * 八字命盘数据模型(可序列化、key-based)。
 */
import type { BranchKey, Changsheng12Key, Gender, StemKey } from '../keys.js';
import type {
  ElementKey, HiddenRole, PillarPos, RelationKind, SeasonState, ShenShaKey, TenGodKey, YinYang,
} from './tables.js';

export interface HiddenStem {
  stem: StemKey;
  role: HiddenRole;
  element: ElementKey;
  /** 相对日主的十神(日柱本气即日主本身时为 biJian) */
  tenGod: TenGodKey;
}

export interface BaZiPillar {
  position: PillarPos;
  stem: StemKey;
  branch: BranchKey;
  stemElement: ElementKey;
  branchElement: ElementKey;
  /** 天干十神(日干本身为 null) */
  stemTenGod: TenGodKey | null;
  hidden: HiddenStem[];
  /** 纳音(中文,如「白蜡金」) */
  naYin: string;
  /** 日主在此支的十二长生 */
  changSheng: Changsheng12Key;
  /** 该柱所在旬的空亡二支 */
  xunKong: [BranchKey, BranchKey];
  /** 该支是否为日柱旬空(年/月/时柱适用) */
  isKongWang: boolean;
}

export type StrengthLevel = 'veryStrong' | 'strong' | 'balanced' | 'weak' | 'veryWeak';

export interface StrengthBreakdown {
  /** 得令:日主五行在月令的旺相休囚死 */
  season: { state: SeasonState; score: number; max: number };
  /** 得地:地支通根(藏干含日主同气/印气) */
  roots: { score: number; max: number; detail: { position: PillarPos; stem: StemKey; role: HiddenRole; kind: 'self' | 'resource'; value: number }[] };
  /** 得势:天干生扶与克泄耗 */
  support: { score: number; max: number; detail: { position: PillarPos; stem: StemKey; tenGod: TenGodKey; value: number }[] };
}

export interface BaZiStrength {
  /** 0-100 */
  score: number;
  level: StrengthLevel;
  breakdown: StrengthBreakdown;
  /** 算法说明(通行简化法,非唯一标准) */
  method: string;
}

export type PatternKey = TenGodKey | 'jianLu' | 'yangRen' | 'yueJie';

export interface BaZiPattern {
  key: PatternKey;
  name: string;
  /** 取格依据(《子平真诠》月令取格) */
  basis: string;
  /** 用以取格的月支藏干 */
  stem: StemKey;
  /** 特殊格局候选(从强/从弱等,需人工复核) */
  special: string[];
}

export interface YongShen {
  method: string;
  favorable: ElementKey[];
  unfavorable: ElementKey[];
  /** 喜用对应的十神组(如 官杀/食伤) */
  favorableGroups: string[];
  /** 调候(《穷通宝鉴》简化):冬宜火暖、夏宜水润 */
  tiaoHou?: { element: ElementKey; note: string };
  rationale: string;
}

export interface ShenShaHit {
  key: ShenShaKey;
  name: string;
  /** 查法依据,如「日干庚→亥」 */
  basis: string;
  /** 命中的柱位 */
  at: PillarPos[];
}

export interface RelationHit {
  kind: RelationKind;
  name: string;
  members: { position: PillarPos; stem?: StemKey; branch?: BranchKey }[];
  /** 合化/合局五行 */
  element?: ElementKey;
  note?: string;
}

export interface DaYun {
  index: number;
  stem: StemKey;
  branch: BranchKey;
  stemTenGod: TenGodKey;
  branchMainTenGod: TenGodKey;
  startAge: number;
  endAge: number;
  startYear: number;
  endYear: number;
  naYin: string;
}

export interface LiuNian {
  year: number;
  stem: StemKey;
  branch: BranchKey;
  stemTenGod: TenGodKey;
  branchMainTenGod: TenGodKey;
  /** 虚岁 */
  age: number;
  /** 所处大运序号(0 = 起运前) */
  daYunIndex: number;
}

export interface BaZiChart {
  meta: {
    engine: string;
    kernel: string;
    /** 用于排八字的本地时刻(已含夏令时/真太阳时处理) */
    localTime: string;
    timeSource: 'trueSolarTime' | 'clock' | 'clock-dst' | 'timeIndex';
    /** 晚子时日柱归属:current=当日(子正换日) forward=次日(子初换日) */
    dayBoundary: 'current' | 'forward';
    gender: Gender;
  };
  pillars: Record<PillarPos, BaZiPillar>;
  dayMaster: { stem: StemKey; element: ElementKey; yinYang: YinYang };
  fiveElements: {
    /** 八字表面(四干四支本气)计数 */
    visible: Record<ElementKey, number>;
    /** 含藏干加权计数 */
    weighted: Record<ElementKey, number>;
    /** 表面所缺五行 */
    missing: ElementKey[];
  };
  /** 十神出现(天干 + 藏干本气)计数 */
  tenGodCounts: Record<TenGodKey, number>;
  strength: BaZiStrength;
  pattern: BaZiPattern;
  yongShen: YongShen;
  shenSha: ShenShaHit[];
  relations: RelationHit[];
  extras: {
    taiYuan: string;
    mingGong: string;
    shenGong: string;
    prevJie: { name: string; time: string };
    nextJie: { name: string; time: string };
  };
  yun: {
    /** 起运虚岁 */
    startAge: number;
    startYears: number;
    startMonths: number;
    startDays: number;
    startDate: string;
    forward: boolean;
    daYun: DaYun[];
  };
}
