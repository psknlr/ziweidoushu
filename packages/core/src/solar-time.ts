/**
 * 真太阳时校正(L2 历法与时空层)。
 *
 * 真太阳时 = 地方标准时 + 经度差修正 + 均时差(Equation of Time)
 * - 经度差修正:(当地经度 − 时区中央经线) × 4 分钟/度;中国以东八区 120°E 为准
 * - 均时差:Spencer(1971) 傅里叶级数,精度约 ±0.6 分钟,排盘定时辰绰绰有余
 *
 * 参考实现:dart_iztro `solar_time_calculator.dart`、紫微知道 `true-solar-time.ts`。
 */
import type { TrueSolarTimeRecord } from './types.js';

/** 一年中的第几天(1-366),按公历本地日期 */
export function dayOfYear(year: number, month: number, day: number): number {
  const cum = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  const leap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const base = cum[month - 1];
  if (base === undefined) throw new Error(`[@ziwei/core] 非法月份: ${month}`);
  return base + day + (leap && month > 2 ? 1 : 0);
}

/**
 * 均时差(分钟)。正值表示真太阳时快于平太阳时。
 * Spencer (1971): EoT = 229.18 × (0.000075 + 0.001868·cosB − 0.032077·sinB
 *                                − 0.014615·cos2B − 0.040849·sin2B),B = 2π(n−1)/365
 */
export function equationOfTimeMinutes(year: number, month: number, day: number): number {
  const n = dayOfYear(year, month, day);
  const b = (2 * Math.PI * (n - 1)) / 365;
  return (
    229.18 *
    (0.000075 + 0.001868 * Math.cos(b) - 0.032077 * Math.sin(b) - 0.014615 * Math.cos(2 * b) - 0.040849 * Math.sin(2 * b))
  );
}

export interface TrueSolarTimeInput {
  /** 本地(时区标准时)出生时刻 */
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  /** 出生地经度,东经为正 */
  longitude: number;
  /** 时区中央经线,默认东八区 120°E */
  standardMeridian?: number;
}

export interface TrueSolarTimeOutput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  eotMinutes: number;
  longitudeMinutes: number;
  totalOffsetMinutes: number;
}

/** 计算真太阳时(返回校正后的本地时刻,可能跨日) */
export function toTrueSolarTime(input: TrueSolarTimeInput): TrueSolarTimeOutput {
  const meridian = input.standardMeridian ?? 120;
  const eot = equationOfTimeMinutes(input.year, input.month, input.day);
  const lonMin = (input.longitude - meridian) * 4;
  const total = eot + lonMin;

  const base = Date.UTC(input.year, input.month - 1, input.day, input.hour, input.minute);
  const corrected = new Date(base + Math.round(total * 60_000));
  return {
    year: corrected.getUTCFullYear(),
    month: corrected.getUTCMonth() + 1,
    day: corrected.getUTCDate(),
    hour: corrected.getUTCHours(),
    minute: corrected.getUTCMinutes(),
    eotMinutes: round2(eot),
    longitudeMinutes: round2(lonMin),
    totalOffsetMinutes: round2(total),
  };
}

/**
 * 时辰索引(iztro 约定):0=早子时(00:00-00:59)…12=晚子时(23:00-23:59)。
 */
export function timeIndexFromHour(hour: number): number {
  if (hour < 0 || hour > 23) throw new Error(`[@ziwei/core] 非法小时: ${hour}`);
  return hour === 23 ? 12 : Math.floor((hour + 1) / 2);
}

export interface NormalizeBirthInput {
  /** 本地出生时刻 */
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  /** 出生地经度;缺省则不做真太阳时校正 */
  longitude?: number;
  standardMeridian?: number;
}

export interface NormalizedBirth {
  solarDate: string;
  timeIndex: number;
  record: TrueSolarTimeRecord;
}

const pad = (n: number) => String(n).padStart(2, '0');
const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * 出生时刻归一化:可选真太阳时校正 → 排盘输入(solarDate + timeIndex)。
 * 校正过程完整记录在 record 中;若时辰因此改变,UI 必须显著提示用户。
 */
export function normalizeBirth(input: NormalizeBirthInput): NormalizedBirth {
  const minute = input.minute ?? 0;
  const original = `${input.year}-${pad(input.month)}-${pad(input.day)} ${pad(input.hour)}:${pad(minute)}`;

  if (input.longitude === undefined) {
    return {
      solarDate: `${input.year}-${input.month}-${input.day}`,
      timeIndex: timeIndexFromHour(input.hour),
      record: { enabled: false, originalLocal: original },
    };
  }

  const t = toTrueSolarTime({
    year: input.year,
    month: input.month,
    day: input.day,
    hour: input.hour,
    minute,
    longitude: input.longitude,
    standardMeridian: input.standardMeridian,
  });
  const beforeIndex = timeIndexFromHour(input.hour);
  const afterIndex = timeIndexFromHour(t.hour);
  return {
    solarDate: `${t.year}-${t.month}-${t.day}`,
    timeIndex: afterIndex,
    record: {
      enabled: true,
      longitude: input.longitude,
      eotMinutes: t.eotMinutes,
      longitudeMinutes: t.longitudeMinutes,
      totalOffsetMinutes: t.totalOffsetMinutes,
      originalLocal: original,
      correctedLocal: `${t.year}-${pad(t.month)}-${pad(t.day)} ${pad(t.hour)}:${pad(t.minute)}`,
      timeIndexChanged:
        beforeIndex !== afterIndex || input.day !== t.day || input.month !== t.month || input.year !== t.year,
    },
  };
}
