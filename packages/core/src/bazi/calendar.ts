/**
 * 历法适配层:基于 lunar-typescript(6tail,MIT)—— 业界通行的开源历法/八字库。
 * 年柱以立春、月柱以十二节为界,时柱五鼠遁;晚子时日柱归属由 sect 控制
 * (sect=2 当日/子正换日,sect=1 次日/子初换日)。
 */
import { LunarUtil, Solar } from 'lunar-typescript';
import { CHANGSHENG_12, ZH_CN, type BranchKey, type Changsheng12Key, type Gender, type StemKey } from '../keys.js';
import { branchFromZh, stemFromZh, type PillarPos } from './tables.js';

export const BAZI_KERNEL = 'lunar-typescript@1.8.6';

export interface CalendarInput {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  gender: Gender;
  dayBoundary: 'current' | 'forward';
}

export interface RawPillar {
  position: PillarPos;
  stem: StemKey;
  branch: BranchKey;
  naYin: string;
  changSheng: Changsheng12Key;
  xunKong: [BranchKey, BranchKey];
}

export interface RawYun {
  startYears: number;
  startMonths: number;
  startDays: number;
  startDate: string;
  forward: boolean;
  daYun: { index: number; stem: StemKey; branch: BranchKey; startAge: number; endAge: number; startYear: number; endYear: number; naYin: string }[];
}

export interface CalendarResult {
  pillars: Record<PillarPos, RawPillar>;
  taiYuan: string;
  mingGong: string;
  shenGong: string;
  prevJie: { name: string; time: string };
  nextJie: { name: string; time: string };
  yun: RawYun;
}

const CS_BY_ZH = new Map<string, Changsheng12Key>(CHANGSHENG_12.map((k) => [ZH_CN[k]!, k]));

function splitGanzhi(gz: string): [StemKey, BranchKey] {
  return [stemFromZh(gz[0]!), branchFromZh(gz[1]!)];
}
function splitKong(kong: string): [BranchKey, BranchKey] {
  return [branchFromZh(kong[0]!), branchFromZh(kong[1]!)];
}
function toChangSheng(zh: string): Changsheng12Key {
  const key = CS_BY_ZH.get(zh);
  if (!key) throw new Error(`[@ziwei/core/bazi] 未知长生状态: ${zh}`);
  return key;
}

export function computeCalendar(input: CalendarInput): CalendarResult {
  const solar = Solar.fromYmdHms(input.year, input.month, input.day, input.hour, input.minute, 0);
  const lunar = solar.getLunar();
  const ec = lunar.getEightChar();
  const sect = input.dayBoundary === 'forward' ? 1 : 2;
  ec.setSect(sect);

  const pillar = (
    position: PillarPos,
    gz: string,
    naYin: string,
    diShi: string,
    kong: string,
  ): RawPillar => {
    const [stem, branch] = splitGanzhi(gz);
    return { position, stem, branch, naYin, changSheng: toChangSheng(diShi), xunKong: splitKong(kong) };
  };

  const pillars: Record<PillarPos, RawPillar> = {
    year: pillar('year', ec.getYear(), ec.getYearNaYin(), ec.getYearDiShi(), ec.getYearXunKong()),
    month: pillar('month', ec.getMonth(), ec.getMonthNaYin(), ec.getMonthDiShi(), ec.getMonthXunKong()),
    day: pillar('day', ec.getDay(), ec.getDayNaYin(), ec.getDayDiShi(), ec.getDayXunKong()),
    hour: pillar('hour', ec.getTime(), ec.getTimeNaYin(), ec.getTimeDiShi(), ec.getTimeXunKong()),
  };

  const prev = lunar.getPrevJie(true);
  const next = lunar.getNextJie(true);
  const yun = ec.getYun(input.gender === 'male' ? 1 : 0, sect);
  const daYun = yun.getDaYun(10).map((d) => {
    const gz = d.getGanZhi();
    const [stem, branch] = gz ? splitGanzhi(gz) : (['jiaHeavenly', 'ziEarthly'] as [StemKey, BranchKey]);
    return {
      index: d.getIndex(),
      stem,
      branch,
      startAge: d.getStartAge(),
      endAge: d.getEndAge(),
      startYear: d.getStartYear(),
      endYear: d.getEndYear(),
      naYin: gz ? (lunarNaYin(gz) ?? '') : '',
    };
  });

  return {
    pillars,
    taiYuan: ec.getTaiYuan(),
    mingGong: ec.getMingGong(),
    shenGong: ec.getShenGong(),
    prevJie: { name: prev.getName(), time: prev.getSolar().toYmdHms() },
    nextJie: { name: next.getName(), time: next.getSolar().toYmdHms() },
    yun: {
      startYears: yun.getStartYear(),
      startMonths: yun.getStartMonth(),
      startDays: yun.getStartDay(),
      startDate: yun.getStartSolar().toYmd(),
      forward: yun.isForward(),
      daYun,
    },
  };
}

/** 干支 → 纳音(库表;LunarUtil.NAYIN 为普通对象) */
export function lunarNaYin(gz: string): string | undefined {
  return (LunarUtil as unknown as { NAYIN: Record<string, string> }).NAYIN[gz];
}

/** 某公历年的年柱干支(立春为界的年份标签即公历年) */
export function yearGanzhi(year: number): [StemKey, BranchKey] {
  const gz = Solar.fromYmdHms(year, 6, 1, 12, 0, 0).getLunar().getYearInGanZhiExact();
  return splitGanzhi(gz);
}
