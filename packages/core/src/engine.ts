/**
 * ZiweiEngine —— 实例化排盘引擎。
 *
 * 修正 iztro 最大的架构隐患:模块级全局可变配置。
 * 每个引擎实例持有一份冻结的 SchoolConfig 快照;每次公开方法调用前,
 * 先「清空并重放」iztro 全局配置(applySchool),使多实例、多流派
 * 并存互不污染(JS 单线程内调用序列化即等价于实例隔离)。
 *
 * 注意:iztro 的 config() 对 mutagens/brightness 只增不清,
 * 因此必须先删除全局残留再应用本实例配置,否则跨实例泄漏。
 */
import { astro } from 'iztro';
import { setLanguage } from 'iztro/lib/i18n';
import { adaptAstrolabe, adaptHoroscope } from './adapter.js';
import { resolveSchool, type SchoolConfig } from './config.js';
import { ZH_CN, type Gender } from './keys.js';
import { analyze } from './analyzer/index.js';
import { fillBorrowedStars } from './analyzer/borrow.js';
import { normalizeBirth, timeIndexFromHour } from './solar-time.js';
import { lookupCity } from './cities.js';
import type { Astrolabe, ChartFeatures, HoroscopeSnapshot, NormalizedInput } from './types.js';
import type { PatternDef } from './analyzer/patterns.js';

export interface BirthInput {
  /** 公历出生时刻(本地时区标准时) */
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  gender: Gender;
  /** 出生城市(离线库查询;查不到且未给经度则不做真太阳时校正) */
  city?: string;
  /** 出生地东经,显式给出时优先于 city */
  longitude?: number;
  /** 是否做真太阳时校正,默认在能取得经度时开启 */
  useTrueSolarTime?: boolean;
  /** 闰月修正(闰月十五之后算下月),默认 true */
  fixLeap?: boolean;
}

export class ZiweiEngine {
  readonly school: SchoolConfig;

  constructor(config?: Partial<SchoolConfig> | string) {
    this.school = resolveSchool(config);
  }

  /**
   * 低层入口:直接以「阳历日期 + 时辰索引」排盘(不做真太阳时处理)。
   * @param solarDate 'YYYY-M-D'
   * @param timeIndex 0-12(0 早子时,12 晚子时)
   */
  bySolar(solarDate: string, timeIndex: number, gender: Gender, fixLeap = true): Astrolabe {
    const input: NormalizedInput = {
      solarDate,
      timeIndex,
      gender,
      fixLeap,
      trueSolarTime: { enabled: false },
    };
    return this.computeChart(input, gender);
  }

  /**
   * 高层入口:出生时刻 + 出生地 → 归一化(可选真太阳时校正) → 排盘。
   * 校正记录随盘返回(meta.input.trueSolarTime);
   * 若校正改变了时辰,UI 必须显著提示(record.timeIndexChanged)。
   */
  fromBirth(input: BirthInput): Astrolabe {
    const longitude =
      input.longitude ?? (input.city !== undefined ? lookupCity(input.city)?.longitude : undefined);
    const useTst = input.useTrueSolarTime ?? longitude !== undefined;

    const normalized = useTst
      ? normalizeBirth({
          year: input.year,
          month: input.month,
          day: input.day,
          hour: input.hour,
          minute: input.minute,
          longitude,
        })
      : {
          solarDate: `${input.year}-${input.month}-${input.day}`,
          timeIndex: timeIndexFromHour(input.hour),
          record: { enabled: false as const },
        };

    const normalizedInput: NormalizedInput = {
      solarDate: normalized.solarDate,
      timeIndex: normalized.timeIndex,
      gender: input.gender,
      fixLeap: input.fixLeap ?? true,
      trueSolarTime: normalized.record,
    };
    return this.computeChart(normalizedInput, input.gender);
  }

  /**
   * 运限快照:大限/小限/流年/流月/流日/流时。
   * 使用**盘上记录的配置快照**(chart.meta.school)而非引擎当前配置,
   * 保证任何时候对同一张盘的运限推算可复现。
   */
  horoscope(chart: Astrolabe, targetDate: string | Date, timeIndexOfTarget?: number): HoroscopeSnapshot {
    applySchool(chart.meta.school);
    const raw = astro.bySolar(
      chart.meta.input.solarDate,
      chart.meta.input.timeIndex,
      genderZh(chart.gender),
      chart.meta.input.fixLeap,
      'zh-CN',
    );
    return adaptHoroscope(raw.horoscope(targetDate, timeIndexOfTarget));
  }

  /** 盘面分析:三方四正 + 格局 + RAG 信号(可注入扩展格局库) */
  features(chart: Astrolabe, patternDefs?: readonly PatternDef[]): ChartFeatures {
    return analyze(chart, patternDefs);
  }

  private computeChart(input: NormalizedInput, gender: Gender): Astrolabe {
    applySchool(this.school);
    const raw = astro.bySolar(input.solarDate, input.timeIndex, genderZh(gender), input.fixLeap, 'zh-CN');
    const chart = adaptAstrolabe(raw, input, this.school, gender);
    return fillBorrowedStars(chart);
  }
}

function genderZh(gender: Gender): '男' | '女' {
  return ZH_CN[gender] as '男' | '女';
}

/** 清空 iztro 全局残留并重放本实例配置(实例隔离的关键) */
function applySchool(school: SchoolConfig): void {
  setLanguage('zh-CN');
  const live = astro.getConfig();
  for (const key of Object.keys(live.mutagens)) {
    delete (live.mutagens as Record<string, unknown>)[key];
  }
  for (const key of Object.keys(live.brightness)) {
    delete (live.brightness as Record<string, unknown>)[key];
  }
  astro.config({
    // key 直接传入:iztro config() 会 kot 归一化,注册表 key 原样通过
    mutagens: school.mutagens as never,
    brightness: school.brightness as never,
    yearDivide: school.yearDivide,
    horoscopeDivide: school.horoscopeDivide,
    ageDivide: school.ageDivide,
    dayDivide: school.dayDivide,
    algorithm: school.algorithm,
  });
}
