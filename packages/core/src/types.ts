/**
 * 可序列化星盘数据模型 —— 全系统唯一事实源。
 *
 * UI 渲染、RAG 检索、Prompt 装配全部消费这里定义的结构,
 * 禁止任何下游"自己再算一遍"(参见设计文档 §4.2)。
 * 所有名称字段一律使用 keys.ts 中的语言无关 key。
 */
import type {
  BranchKey,
  BrightnessKey,
  Changsheng12Key,
  Boshi12Key,
  FiveElementsClassKey,
  Gender,
  Jiangqian12Key,
  MutagenKey,
  PalaceKey,
  StarKey,
  StemKey,
  Suiqian12Key,
} from './keys.js';
import type { SchoolConfig } from './config.js';

export type StarScope = 'origin' | 'decadal' | 'yearly' | 'monthly' | 'daily' | 'hourly';
export type StarType = 'major' | 'soft' | 'tough' | 'adjective' | 'flower' | 'helper' | 'lucun' | 'tianma';

export interface Star {
  key: StarKey;
  type: StarType;
  scope: StarScope;
  /** 庙旺得利平不陷;iztro 空串归一化为 undefined */
  brightness?: BrightnessKey;
  /** 生年四化(禄权科忌) */
  mutagen?: MutagenKey;
}

export interface GanzhiPillar {
  stem: StemKey;
  branch: BranchKey;
}

export interface Decadal {
  /** 起止虚岁(含) */
  range: [number, number];
  stem: StemKey;
  branch: BranchKey;
}

export interface Palace {
  /** 0-11,寅宫起 */
  index: number;
  name: PalaceKey;
  isBodyPalace: boolean;
  /** 来因宫 */
  isOriginalPalace: boolean;
  stem: StemKey;
  branch: BranchKey;
  majorStars: Star[];
  minorStars: Star[];
  adjectiveStars: Star[];
  changsheng12: Changsheng12Key;
  boshi12: Boshi12Key;
  jiangqian12: Jiangqian12Key;
  suiqian12: Suiqian12Key;
  decadal: Decadal;
  /** 小限虚岁 */
  ages: number[];
  /** 借宫(空宫借对宫主星),由 Analyzer 填充 —— 结构化提供,勿让下游自推 */
  borrowed?: { fromBranch: BranchKey; fromIndex: number; stars: Star[] };
}

/** 真太阳时校正记录:校正过程必须可追溯、可呈现给用户 */
export interface TrueSolarTimeRecord {
  enabled: boolean;
  longitude?: number;
  /** 均时差,分钟 */
  eotMinutes?: number;
  /** 经度差修正,分钟 */
  longitudeMinutes?: number;
  /** 校正总偏移,分钟 */
  totalOffsetMinutes?: number;
  /** 校正前/后的本地时间(ISO 字符串) */
  originalLocal?: string;
  correctedLocal?: string;
  /** 校正是否改变了时辰(UI 必须显著提示) */
  timeIndexChanged?: boolean;
}

/** 归一化输入:引擎实际用于排盘的最终输入及其来历 */
export interface NormalizedInput {
  solarDate: string;
  /** 0-12;0 为早子时,12 为晚子时 */
  timeIndex: number;
  gender: Gender;
  fixLeap: boolean;
  trueSolarTime: TrueSolarTimeRecord;
}

export interface Astrolabe {
  meta: {
    /** 内核标识与版本;命盘存档必带,算法修正后可识别旧盘 */
    engine: string;
    kernel: string;
    /** 完整流派配置快照,保证任何时候可复现 */
    school: SchoolConfig;
    input: NormalizedInput;
    /** 归一化输入+配置 的稳定哈希,用于缓存与档案去重 */
    chartHash: string;
    generatedAt?: string;
  };
  gender: Gender;
  solarDate: string;
  lunarDate: string;
  /** 干支四柱 */
  ganzhi: { year: GanzhiPillar; month: GanzhiPillar; day: GanzhiPillar; hour: GanzhiPillar };
  timeIndex: number;
  sign: string;
  zodiac: string;
  soulPalaceBranch: BranchKey;
  bodyPalaceBranch: BranchKey;
  /** 命主 */
  soul: StarKey;
  /** 身主 */
  body: StarKey;
  fiveElementsClass: FiveElementsClassKey;
  /** 十二宫,palaces[i].index === i,寅宫起 */
  palaces: Palace[];
}

// ------------------------------------------------------------------ 运限

export interface HoroscopeScopeItem {
  /** 该运限所在宫位索引 */
  index: number;
  stem: StemKey;
  branch: BranchKey;
  /** 该运限视角下、按盘面索引 0-11 排布的宫名 */
  palaceNames: PalaceKey[];
  /** 该运干四化星,[禄,权,科,忌] */
  mutagen: StarKey[];
  /** 流耀,按盘面索引分组 */
  stars?: Star[][];
}

export interface HoroscopeSnapshot {
  solarDate: string;
  lunarDate: string;
  decadal: HoroscopeScopeItem;
  age: HoroscopeScopeItem & { nominalAge: number };
  yearly: HoroscopeScopeItem;
  monthly: HoroscopeScopeItem;
  daily: HoroscopeScopeItem;
  hourly: HoroscopeScopeItem;
}

// ------------------------------------------------------- 分析结果(Features)

export interface SurroundedPalaces {
  /** 本宫 */
  target: number;
  /** 对宫(四正) */
  opposite: number;
  /** 三合之一(财帛位) */
  wealth: number;
  /** 三合之一(官禄位) */
  career: number;
}

export interface MatchedPattern {
  id: string;
  name: string;
  /** 必要条件是否全部满足 */
  satisfied: boolean;
  /** 命中的加分条件描述 */
  bonusHits: string[];
  /** 命中的破格条件描述(非空即破格) */
  brokenBy: string[];
  source: string;
}

export interface Signal {
  /** 供检索匹配的实体 key 组合,如 ['ziweiMaj','soulPalace'] */
  entities: string[];
  /** 0-100 */
  weight: number;
  kind: 'star-palace' | 'star-mutagen-palace' | 'combo' | 'pattern' | 'borrowed' | 'brightness';
  note?: string;
}

export interface ChartFeatures {
  /** 命宫三方四正 */
  soulSurround: SurroundedPalaces;
  /** 每宫三方四正索引 */
  surroundByPalace: SurroundedPalaces[];
  /** 匹配到的格局(含成格与破格) */
  patterns: MatchedPattern[];
  /** 亮度体系汇总(庙旺/落陷清单、解救与加重、各宫强弱分) */
  brightness: import('./analyzer/brightness.js').BrightnessSummary;
  /** RAG 加权信号 */
  signals: Signal[];
}
