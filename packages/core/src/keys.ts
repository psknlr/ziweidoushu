/**
 * 语言无关的键位注册表(canonical key registry)。
 *
 * 内核所有输出一律使用这里定义的 key(与 iztro 内部 i18n key 对齐),
 * 展示层再按 locale 翻译。ZH_CN 表既是默认展示词表,
 * 也是适配层校验 iztro 输出完整性的依据(kot 反查失败会被 assertKey 捕获)。
 */

// ---------------------------------------------------------------- 天干地支

export const HEAVENLY_STEMS = [
  'jiaHeavenly',
  'yiHeavenly',
  'bingHeavenly',
  'dingHeavenly',
  'wuHeavenly',
  'jiHeavenly',
  'gengHeavenly',
  'xinHeavenly',
  'renHeavenly',
  'guiHeavenly',
] as const;
export type StemKey = (typeof HEAVENLY_STEMS)[number];

export const EARTHLY_BRANCHES = [
  'ziEarthly',
  'chouEarthly',
  'yinEarthly',
  'maoEarthly',
  'chenEarthly',
  'siEarthly',
  'wuEarthly',
  'weiEarthly',
  'shenEarthly',
  'youEarthly',
  'xuEarthly',
  'haiEarthly',
] as const;
export type BranchKey = (typeof EARTHLY_BRANCHES)[number];

// ------------------------------------------------------------------ 宫位

/** 十二宫(palaces[i].name 的取值范围,不含身宫/来因这类标记) */
export const PALACES = [
  'soulPalace',
  'siblingsPalace',
  'spousePalace',
  'childrenPalace',
  'wealthPalace',
  'healthPalace',
  'surfacePalace',
  'friendsPalace',
  'careerPalace',
  'propertyPalace',
  'spiritPalace',
  'parentsPalace',
] as const;
export type PalaceKey = (typeof PALACES)[number];

// ------------------------------------------------------------------ 星曜

export const MAJOR_STARS = [
  'ziweiMaj',
  'tianjiMaj',
  'taiyangMaj',
  'wuquMaj',
  'tiantongMaj',
  'lianzhenMaj',
  'tianfuMaj',
  'taiyinMaj',
  'tanlangMaj',
  'jumenMaj',
  'tianxiangMaj',
  'tianliangMaj',
  'qishaMaj',
  'pojunMaj',
] as const;
export type MajorStarKey = (typeof MAJOR_STARS)[number];

export const MINOR_STARS = [
  'zuofuMin',
  'youbiMin',
  'wenchangMin',
  'wenquMin',
  'lucunMin',
  'tianmaMin',
  'qingyangMin',
  'tuoluoMin',
  'huoxingMin',
  'lingxingMin',
  'tiankuiMin',
  'tianyueMin',
  'dikongMin',
  'dijieMin',
] as const;
export type MinorStarKey = (typeof MINOR_STARS)[number];

export const ADJECTIVE_STARS = [
  'jieshaAdj',
  'tiankong',
  'tianxing',
  'tianyao',
  'jieshen',
  'yinsha',
  'tianxi',
  'tianguan',
  'tianfu',
  'tianku',
  'tianxu',
  'longchi',
  'fengge',
  'hongluan',
  'guchen',
  'guasu',
  'feilian',
  'posui',
  'taifu',
  'fenggao',
  'tianwu',
  'tianyue',
  'santai',
  'bazuo',
  'engguang',
  'tiangui',
  'tiancai',
  'tianshou',
  'jiekong',
  'xunzhong',
  'xunkong',
  'kongwang',
  'jielu',
  'yuede',
  'tianshang',
  'tianshi',
  'tianchu',
] as const;
export type AdjectiveStarKey = (typeof ADJECTIVE_STARS)[number];

/** 长生十二神 */
export const CHANGSHENG_12 = [
  'changsheng',
  'muyu',
  'guandai',
  'linguan',
  'diwang',
  'shuai',
  'bing',
  'si',
  'mu',
  'jue',
  'tai',
  'yang',
] as const;
export type Changsheng12Key = (typeof CHANGSHENG_12)[number];

/** 博士十二神 */
export const BOSHI_12 = [
  'boshi',
  'lishi',
  'qinglong',
  'xiaohao',
  'jiangjun',
  'zhoushu',
  'faylian',
  'xishen',
  'bingfu',
  'dahao',
  'fubing',
  'guanfu',
] as const;
export type Boshi12Key = (typeof BOSHI_12)[number];

/** 将前十二神 */
export const JIANGQIAN_12 = [
  'jiangxing',
  'panan',
  'suiyi',
  'xiishen',
  'huagai',
  'jiesha',
  'zhaisha',
  'tiansha',
  'zhibei',
  'xianchi',
  'yuesha',
  'wangshen',
] as const;
export type Jiangqian12Key = (typeof JIANGQIAN_12)[number];

/** 岁前十二神 */
export const SUIQIAN_12 = [
  'suijian',
  'huiqi',
  'sangmen',
  'guansuo',
  'gwanfu',
  'xiaohao',
  'suipo',
  'longde',
  'baihu',
  'tiande',
  'diaoke',
  'bingfu',
] as const;
export type Suiqian12Key = (typeof SUIQIAN_12)[number];

/** 运限流耀(运昌/流昌/月昌…) */
export const HOROSCOPE_STARS = [
  'yunkui',
  'yunyue',
  'yunchang',
  'yunqu',
  'yunluan',
  'yunxi',
  'yunlu',
  'yunyang',
  'yuntuo',
  'yunma',
  'liukui',
  'liuyue',
  'liuchang',
  'liuqu',
  'liuluan',
  'liuxi',
  'liulu',
  'liuyang',
  'liutuo',
  'liuma',
  'nianjie',
  'yuekui',
  'yueyue',
  'yuechang',
  'yuequ',
  'yueluan',
  'yuexi',
  'yuelu',
  'yueyang',
  'yuetuo',
  'yuema',
  'rikui',
  'riyue',
  'richang',
  'riqu',
  'riluan',
  'rixi',
  'rilu',
  'riyang',
  'rituo',
  'rima',
  'shikui',
  'shiyue',
  'shichang',
  'shiqu',
  'shiluan',
  'shixi',
  'shilu',
  'shiyang',
  'shituo',
  'shima',
] as const;
export type HoroscopeStarKey = (typeof HOROSCOPE_STARS)[number];

export type StarKey =
  | MajorStarKey
  | MinorStarKey
  | AdjectiveStarKey
  | Changsheng12Key
  | Boshi12Key
  | Jiangqian12Key
  | Suiqian12Key
  | HoroscopeStarKey;

// ------------------------------------------------------------ 亮度与四化

export const BRIGHTNESS = ['miao', 'wang', 'de', 'li', 'ping', 'bu', 'xian'] as const;
export type BrightnessKey = (typeof BRIGHTNESS)[number];

export const MUTAGENS = ['sihuaLu', 'sihuaQuan', 'sihuaKe', 'sihuaJi'] as const;
export type MutagenKey = (typeof MUTAGENS)[number];

export const FIVE_ELEMENTS_CLASSES = ['water2nd', 'wood3rd', 'metal4th', 'earth5th', 'fire6th'] as const;
export type FiveElementsClassKey = (typeof FIVE_ELEMENTS_CLASSES)[number];

export type Gender = 'male' | 'female';

// ------------------------------------------------------------ zh-CN 词表
// 与 iztro zh-CN locale 逐字对齐;作为默认展示词表与适配层校验依据。

export const ZH_CN: Record<string, string> = {
  // 天干
  jiaHeavenly: '甲',
  yiHeavenly: '乙',
  bingHeavenly: '丙',
  dingHeavenly: '丁',
  wuHeavenly: '戊',
  jiHeavenly: '己',
  gengHeavenly: '庚',
  xinHeavenly: '辛',
  renHeavenly: '壬',
  guiHeavenly: '癸',
  // 地支
  ziEarthly: '子',
  chouEarthly: '丑',
  yinEarthly: '寅',
  maoEarthly: '卯',
  chenEarthly: '辰',
  siEarthly: '巳',
  wuEarthly: '午',
  weiEarthly: '未',
  shenEarthly: '申',
  youEarthly: '酉',
  xuEarthly: '戌',
  haiEarthly: '亥',
  // 宫位
  soulPalace: '命宫',
  bodyPalace: '身宫',
  siblingsPalace: '兄弟',
  spousePalace: '夫妻',
  childrenPalace: '子女',
  wealthPalace: '财帛',
  healthPalace: '疾厄',
  surfacePalace: '迁移',
  friendsPalace: '仆役',
  careerPalace: '官禄',
  propertyPalace: '田宅',
  spiritPalace: '福德',
  parentsPalace: '父母',
  originalPalace: '来因',
  // 主星
  ziweiMaj: '紫微',
  tianjiMaj: '天机',
  taiyangMaj: '太阳',
  wuquMaj: '武曲',
  tiantongMaj: '天同',
  lianzhenMaj: '廉贞',
  tianfuMaj: '天府',
  taiyinMaj: '太阴',
  tanlangMaj: '贪狼',
  jumenMaj: '巨门',
  tianxiangMaj: '天相',
  tianliangMaj: '天梁',
  qishaMaj: '七杀',
  pojunMaj: '破军',
  // 辅星
  zuofuMin: '左辅',
  youbiMin: '右弼',
  wenchangMin: '文昌',
  wenquMin: '文曲',
  lucunMin: '禄存',
  tianmaMin: '天马',
  qingyangMin: '擎羊',
  tuoluoMin: '陀罗',
  huoxingMin: '火星',
  lingxingMin: '铃星',
  tiankuiMin: '天魁',
  tianyueMin: '天钺',
  dikongMin: '地空',
  dijieMin: '地劫',
  // 杂曜
  jieshaAdj: '劫杀',
  tiankong: '天空',
  tianxing: '天刑',
  tianyao: '天姚',
  jieshen: '解神',
  yinsha: '阴煞',
  tianxi: '天喜',
  tianguan: '天官',
  tianfu: '天福',
  tianku: '天哭',
  tianxu: '天虚',
  longchi: '龙池',
  fengge: '凤阁',
  hongluan: '红鸾',
  guchen: '孤辰',
  guasu: '寡宿',
  feilian: '蜚廉',
  posui: '破碎',
  taifu: '台辅',
  fenggao: '封诰',
  tianwu: '天巫',
  tianyue: '天月',
  santai: '三台',
  bazuo: '八座',
  engguang: '恩光',
  tiangui: '天贵',
  tiancai: '天才',
  tianshou: '天寿',
  jiekong: '截空',
  xunzhong: '旬中',
  xunkong: '旬空',
  kongwang: '空亡',
  jielu: '截路',
  yuede: '月德',
  tianshang: '天伤',
  tianshi: '天使',
  tianchu: '天厨',
  // 长生十二神
  changsheng: '长生',
  muyu: '沐浴',
  guandai: '冠带',
  linguan: '临官',
  diwang: '帝旺',
  shuai: '衰',
  bing: '病',
  si: '死',
  mu: '墓',
  jue: '绝',
  tai: '胎',
  yang: '养',
  // 博士十二神
  boshi: '博士',
  lishi: '力士',
  qinglong: '青龙',
  xiaohao: '小耗',
  jiangjun: '将军',
  zhoushu: '奏书',
  faylian: '飞廉',
  xishen: '喜神',
  bingfu: '病符',
  dahao: '大耗',
  fubing: '伏兵',
  guanfu: '官府',
  // 岁前十二神(与博士十二神重名者共用 key)
  suijian: '岁建',
  huiqi: '晦气',
  sangmen: '丧门',
  guansuo: '贯索',
  gwanfu: '官符',
  suipo: '岁破',
  longde: '龙德',
  baihu: '白虎',
  tiande: '天德',
  diaoke: '吊客',
  // 将前十二神
  jiangxing: '将星',
  panan: '攀鞍',
  suiyi: '岁驿',
  xiishen: '息神',
  huagai: '华盖',
  jiesha: '劫煞',
  zhaisha: '灾煞',
  tiansha: '天煞',
  zhibei: '指背',
  xianchi: '咸池',
  yuesha: '月煞',
  wangshen: '亡神',
  // 流耀
  yunkui: '运魁',
  yunyue: '运钺',
  yunchang: '运昌',
  yunqu: '运曲',
  yunluan: '运鸾',
  yunxi: '运喜',
  yunlu: '运禄',
  yunyang: '运羊',
  yuntuo: '运陀',
  yunma: '运马',
  liukui: '流魁',
  liuyue: '流钺',
  liuchang: '流昌',
  liuqu: '流曲',
  liuluan: '流鸾',
  liuxi: '流喜',
  liulu: '流禄',
  liuyang: '流羊',
  liutuo: '流陀',
  liuma: '流马',
  nianjie: '年解',
  yuekui: '月魁',
  yueyue: '月钺',
  yuechang: '月昌',
  yuequ: '月曲',
  yueluan: '月鸾',
  yuexi: '月喜',
  yuelu: '月禄',
  yueyang: '月羊',
  yuetuo: '月陀',
  yuema: '月马',
  rikui: '日魁',
  riyue: '日钺',
  richang: '日昌',
  riqu: '日曲',
  riluan: '日鸾',
  rixi: '日喜',
  rilu: '日禄',
  riyang: '日羊',
  rituo: '日陀',
  rima: '日马',
  shikui: '时魁',
  shiyue: '时钺',
  shichang: '时昌',
  shiqu: '时曲',
  shiluan: '时鸾',
  shixi: '时喜',
  shilu: '时禄',
  shiyang: '时羊',
  shituo: '时陀',
  shima: '时马',
  // 亮度
  miao: '庙',
  wang: '旺',
  de: '得',
  li: '利',
  ping: '平',
  bu: '不',
  xian: '陷',
  // 四化
  sihuaLu: '禄',
  sihuaQuan: '权',
  sihuaKe: '科',
  sihuaJi: '忌',
  // 五行局
  water2nd: '水二局',
  wood3rd: '木三局',
  metal4th: '金四局',
  earth5th: '土五局',
  fire6th: '火六局',
  // 性别
  male: '男',
  female: '女',
};

const ALL_STAR_KEYS: ReadonlySet<string> = new Set<string>([
  ...MAJOR_STARS,
  ...MINOR_STARS,
  ...ADJECTIVE_STARS,
  ...CHANGSHENG_12,
  ...BOSHI_12,
  ...JIANGQIAN_12,
  ...SUIQIAN_12,
  ...HOROSCOPE_STARS,
]);

/** 将 key 翻译为 zh-CN 文本(展示用);未知 key 原样返回 */
export function zh(key: string): string {
  return ZH_CN[key] ?? key;
}

/**
 * 适配层校验:断言 kot 反查得到的值确实是注册表内的 key。
 * iztro 升级导致词表漂移时,这里会第一时间大声失败,而不是让脏数据流入下游。
 */
export function assertKey<T extends string>(value: string, domain: ReadonlySet<string> | readonly string[], what: string): T {
  const set = Array.isArray(domain) ? new Set<string>(domain as readonly string[]) : (domain as ReadonlySet<string>);
  if (!set.has(value)) {
    throw new Error(`[@ziwei/core] 无法将 ${what} 映射为注册表 key: "${value}" (iztro 词表可能已漂移,请检查内核版本)`);
  }
  return value as T;
}

export const STAR_KEY_SET = ALL_STAR_KEYS;
export const STEM_KEY_SET: ReadonlySet<string> = new Set(HEAVENLY_STEMS);
export const BRANCH_KEY_SET: ReadonlySet<string> = new Set(EARTHLY_BRANCHES);
export const PALACE_KEY_SET: ReadonlySet<string> = new Set(PALACES);
export const BRIGHTNESS_KEY_SET: ReadonlySet<string> = new Set(BRIGHTNESS);
export const MUTAGEN_KEY_SET: ReadonlySet<string> = new Set(MUTAGENS);
export const FIVE_ELEMENTS_KEY_SET: ReadonlySet<string> = new Set(FIVE_ELEMENTS_CLASSES);
