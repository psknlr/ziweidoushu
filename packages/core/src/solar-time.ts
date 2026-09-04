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

/**
 * 中国夏令时(1986-1991):每年四月中旬首个周日 02:00 拨快一小时,
 * 九月中旬首个周日 02:00(夏令时)拨回;1986 年首年自 5 月 4 日起。
 * 区间内的钟表时间比北京标准时快 1 小时,排盘须先扣回。
 * 依据:国务院 1986 年夏时制通知及历年实施日期(公开档案)。
 */
const CHINA_DST: Record<number, [[number, number], [number, number]]> = {
  1986: [[5, 4], [9, 14]],
  1987: [[4, 12], [9, 13]],
  1988: [[4, 10], [9, 11]],
  1989: [[4, 16], [9, 17]],
  1990: [[4, 15], [9, 16]],
  1991: [[4, 14], [9, 15]],
};

/** 该钟表时刻是否处于中国夏令时区间;是则返回 60(分钟),否则 0 */
export function chinaDstMinutes(year: number, month: number, day: number, hour: number, minute = 0): number {
  const range = CHINA_DST[year];
  if (!range) return 0;
  const [[sm, sd], [em, ed]] = range;
  const t = Date.UTC(year, month - 1, day, hour, minute);
  const start = Date.UTC(year, sm - 1, sd, 2, 0);
  const end = Date.UTC(year, em - 1, ed, 2, 0);
  return t >= start && t < end ? 60 : 0;
}

export interface NormalizeBirthInput {
  /** 本地(钟表)出生时刻 */
  year: number;
  month: number;
  day: number;
  hour: number;
  minute?: number;
  /** 出生地经度;缺省则不做真太阳时校正 */
  longitude?: number;
  standardMeridian?: number;
  /** 是否扣除中国 1986-1991 夏令时(默认 true;仅对区间内时刻生效) */
  applyChinaDst?: boolean;
}

export interface NormalizedBirth {
  solarDate: string;
  timeIndex: number;
  record: TrueSolarTimeRecord;
}

const pad = (n: number) => String(n).padStart(2, '0');
const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * 出生时刻归一化:钟表时 → (扣夏令时)标准时 → (可选)真太阳时 → 排盘输入。
 * 校正过程完整记录在 record 中;若时辰/日期因此改变,UI 必须显著提示用户。
 */
export function normalizeBirth(input: NormalizeBirthInput): NormalizedBirth {
  const minute = input.minute ?? 0;
  const original = `${input.year}-${pad(input.month)}-${pad(input.day)} ${pad(input.hour)}:${pad(minute)}`;
  const beforeIndex = timeIndexFromHour(input.hour);

  // ① 夏令时:钟表时比标准时快 1 小时,先扣回
  const dst = input.applyChinaDst === false ? 0 : chinaDstMinutes(input.year, input.month, input.day, input.hour, minute);
  const std = new Date(Date.UTC(input.year, input.month - 1, input.day, input.hour, minute) - dst * 60_000);
  const s = {
    year: std.getUTCFullYear(),
    month: std.getUTCMonth() + 1,
    day: std.getUTCDate(),
    hour: std.getUTCHours(),
    minute: std.getUTCMinutes(),
  };

  if (input.longitude === undefined) {
    const afterIndex = timeIndexFromHour(s.hour);
    return {
      solarDate: `${s.year}-${s.month}-${s.day}`,
      timeIndex: afterIndex,
      record: {
        enabled: false,
        originalLocal: original,
        ...(dst
          ? {
              dstMinutes: dst,
              correctedLocal: `${s.year}-${pad(s.month)}-${pad(s.day)} ${pad(s.hour)}:${pad(s.minute)}`,
              timeIndexChanged: beforeIndex !== afterIndex || s.day !== input.day,
            }
          : {}),
      },
    };
  }

  // ② 真太阳时
  const t = toTrueSolarTime({ ...s, longitude: input.longitude, standardMeridian: input.standardMeridian });
  const afterIndex = timeIndexFromHour(t.hour);
  return {
    solarDate: `${t.year}-${t.month}-${t.day}`,
    timeIndex: afterIndex,
    record: {
      enabled: true,
      longitude: input.longitude,
      eotMinutes: t.eotMinutes,
      longitudeMinutes: t.longitudeMinutes,
      totalOffsetMinutes: round2(t.totalOffsetMinutes - dst),
      ...(dst ? { dstMinutes: dst } : {}),
      originalLocal: original,
      correctedLocal: `${t.year}-${pad(t.month)}-${pad(t.day)} ${pad(t.hour)}:${pad(t.minute)}`,
      timeIndexChanged:
        beforeIndex !== afterIndex || input.day !== t.day || input.month !== t.month || input.year !== t.year,
    },
  };
}
