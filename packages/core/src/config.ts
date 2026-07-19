/**
 * 流派即配置(School-as-Configuration)。
 *
 * 紫微斗数不存在唯一"正确"算法 —— 所有流派分歧点在此显式建模,
 * 默认值标注依据流派,绝不隐式硬编码(设计文档 §2.2)。
 */
import type { BrightnessKey, MutagenKey, StarKey, StemKey } from './keys.js';

export interface SchoolConfig {
  /** 预设名,仅作标识与展示 */
  preset: string;
  /** 安星体系:通行版(《紫微斗数全书》) | 中州派 */
  algorithm: 'default' | 'zhongzhou';
  /** 年分界:normal=正月初一 | exact=立春 */
  yearDivide: 'normal' | 'exact';
  /** 运限分界 */
  horoscopeDivide: 'normal' | 'exact';
  /** 小限/虚岁分界:normal=自然年 | birthday=生日 */
  ageDivide: 'normal' | 'birthday';
  /** 晚子时归属:current=当日 | forward=次日(子初换日) */
  dayDivide: 'current' | 'forward';
  /** 自定义四化表(飞星派等),按天干覆盖,[禄,权,科,忌] */
  mutagens?: Partial<Record<StemKey, [StarKey, StarKey, StarKey, StarKey]>>;
  /** 自定义星曜亮度表,按星覆盖(12 地支序,寅起) */
  brightness?: Partial<Record<StarKey, BrightnessKey[]>>;
}

/**
 * 预设一:iztro 通行默认。
 * 依据:《紫微斗数全书》安星;iztro 2.5.8 出厂默认分界。
 */
export const PRESET_QUANSHU: SchoolConfig = Object.freeze({
  preset: 'quanshu-default',
  algorithm: 'default',
  yearDivide: 'normal',
  horoscopeDivide: 'normal',
  ageDivide: 'normal',
  dayDivide: 'current',
});

/**
 * 预设二:对齐文墨天机/中州派。
 * 依据:紫微知道(ziwei-main)`lib/astro.ts` 的生产配置 ——
 * 正月初一分界、子初(23:00)换日、中州派安星。
 */
export const PRESET_WENMO_ZHONGZHOU: SchoolConfig = Object.freeze({
  preset: 'wenmo-zhongzhou',
  algorithm: 'zhongzhou',
  yearDivide: 'normal',
  horoscopeDivide: 'normal',
  ageDivide: 'birthday',
  dayDivide: 'forward',
});

export const PRESETS: Record<string, SchoolConfig> = {
  [PRESET_QUANSHU.preset]: PRESET_QUANSHU,
  [PRESET_WENMO_ZHONGZHOU.preset]: PRESET_WENMO_ZHONGZHOU,
};

export function resolveSchool(config?: Partial<SchoolConfig> | string): SchoolConfig {
  if (typeof config === 'string') {
    const preset = PRESETS[config];
    if (!preset) {
      throw new Error(`[@ziwei/core] 未知流派预设: "${config}"(可用: ${Object.keys(PRESETS).join(', ')})`);
    }
    return preset;
  }
  return Object.freeze({ ...PRESET_QUANSHU, ...(config ?? {}), preset: config?.preset ?? (config ? 'custom' : PRESET_QUANSHU.preset) });
}
