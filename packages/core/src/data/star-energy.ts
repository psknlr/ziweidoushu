/**
 * 星性能量表:为**没有十二宫庙陷表**的星曜提供古籍属性规则与星性分类。
 *
 * 调研依据(与《紫微斗数全书》体例一致):
 * - 左辅、右弼、天魁、天钺:无庙陷之分,入诸宫恒作吉论
 * - 禄存:无论落于何宫,均作入庙论(由引擎直接赋 brightness='miao')
 * - 天马:不论庙陷,以所会为断(逢禄存/化禄为「禄马交驰」方显其力)
 * - 地空、地劫:空耗之曜,以同会星曜论轻重
 * - 杂曜与四套十二神:古籍无亮度,只论星性吉凶(桃花/科文/刑耗/贵吉…)
 * 主星与昌曲羊陀火铃已有庙陷表(iztro 数据),不在此表。
 */
import type { StarKey } from '../keys.js';

export type StarEnergyKind = 'auspicious' | 'inauspicious' | 'flower' | 'literary' | 'neutral';

export interface StarNature {
  kind: StarEnergyKind;
  /** 展示用单字:吉/煞/桃/文/中 */
  tag: string;
  /** 规则备注(有古籍规则者注明) */
  note?: string;
}

const A = (note?: string): StarNature => ({ kind: 'auspicious', tag: '吉', ...(note ? { note } : {}) });
const X = (note?: string): StarNature => ({ kind: 'inauspicious', tag: '煞', ...(note ? { note } : {}) });
const F = (note?: string): StarNature => ({ kind: 'flower', tag: '桃', ...(note ? { note } : {}) });
const L = (note?: string): StarNature => ({ kind: 'literary', tag: '文', ...(note ? { note } : {}) });
const N = (note?: string): StarNature => ({ kind: 'neutral', tag: '中', ...(note ? { note } : {}) });

export const STAR_NATURE: Partial<Record<StarKey, StarNature>> = {
  // ---- 辅佐诸曜(无庙陷者按古籍规则) ----
  zuofuMin: A('无庙陷之分,入诸宫恒作吉论(全书)'),
  youbiMin: A('无庙陷之分,入诸宫恒作吉论(全书)'),
  tiankuiMin: A('天乙贵人,无庙陷,恒吉'),
  tianyueMin: A('玉堂贵人,无庙陷,恒吉'),
  lucunMin: A('禄存无落陷,均作入庙论(全书)'),
  tianmaMin: N('不论庙陷,以所会为断;逢禄为禄马交驰'),
  dikongMin: X('空曜,以同会星曜论轻重'),
  dijieMin: X('耗曜,以同会星曜论轻重'),
  qingyangMin: X('有庙陷表;入庙化煞为权'),
  tuoluoMin: X('有庙陷表;入庙主沉毅'),
  huoxingMin: X('有庙陷表;入庙化煞为权'),
  lingxingMin: X('有庙陷表;入庙主坚韧'),
  wenchangMin: L('有庙陷表;科甲文书之星'),
  wenquMin: L('有庙陷表;口才才艺之星'),
  // ---- 杂曜 ----
  tianguan: A(), tianfu: A(), santai: A(), bazuo: A(), engguang: A(), tiangui: A(),
  taifu: A(), fenggao: A(), longchi: L(), fengge: L(), tiancai: L(), tianshou: A(),
  jieshen: A('解厄制化'), tianchu: A('食禄'), yuede: A(), tianwu: A('升迁之应'),
  nianjie: A('年解,解厄之星(按年支安,列于杂曜)'),
  hongluan: F('正缘婚庆'), tianxi: F('喜庆添丁'), tianyao: F('风流情欲'),
  tianxing: X('刑曜,亦主自律医道'), tianku: X(), tianxu: X(), guchen: X('孤'), guasu: X('寡'),
  feilian: X('小人是非'), posui: X(), yinsha: X(), tianyue: X('病符之曜'),
  tianshang: X(), tianshi: X(), jiekong: X('截空'), xunzhong: X(), xunkong: X('旬空'),
  kongwang: X(), jielu: X(), jieshaAdj: X(), tiankong: X('半天折翅之曜'),
  // ---- 长生十二神 ----
  changsheng: A(), muyu: F('沐浴主桃花'), guandai: A(), linguan: A(), diwang: A(),
  shuai: X(), bing: X(), si: X(), mu: N('入库'), jue: X(), tai: N(), yang: A(),
  // ---- 博士十二神 ----
  boshi: A('聪明'), lishi: N('权令'), qinglong: A('喜气'), xiaohao: X('耗财'),
  jiangjun: N('威武'), zhoushu: A('文书吉'), faylian: X('小人'), xishen: A(),
  bingfu: X('病灾'), dahao: X('大耗'), fubing: X('暗损'), guanfu: X('官非'),
  // ---- 岁前十二神 ----
  suijian: N('太岁当值'), huiqi: X(), sangmen: X(), guansuo: X(), gwanfu: X('官符'),
  suipo: X('岁破'), longde: A('逢凶化吉'), baihu: X('刑伤'), tiande: A('化解'), diaoke: X(),
  // ---- 将前十二神 ----
  jiangxing: A('武贵'), panan: A('攀鞍进禄'), suiyi: N('驿动迁移'), xiishen: X('消沉'),
  huagai: N('孤高才艺'), jiesha: X(), zhaisha: X(), tiansha: X(), zhibei: X('背后是非'),
  xianchi: F('咸池桃花'), yuesha: X(), wangshen: X(),
};

/** 查星性;主星返回 undefined(主星以庙陷表与星情论,不用简单吉凶标签) */
export function starNature(key: StarKey): StarNature | undefined {
  return STAR_NATURE[key];
}
