/**
 * 运限时间轴:本命 / 大限 / 流年 / 流月 / 流日 五级下钻。
 * - 大限:12 段大限胶囊(取自各宫 decadal.range),点选联动大限盘宫名与限四化
 * - 流年/流月/流日:逐级步进;流月流日显示解析出的农历定位
 * 切换后 ChartBoard 在宫格上叠加该运限天干的四化角标与运限宫名。
 */
import { sihuaForStem, zh, type Astrolabe, type HoroscopeSnapshot } from '@ziwei/core';

export type HoroscopeMode = 'origin' | 'decadal' | 'yearly' | 'monthly' | 'daily' | 'hourly';

interface Props {
  mode: HoroscopeMode;
  year: number;
  month: number;
  day: number;
  hourIndex: number;
  chart: Astrolabe;
  horoscope: HoroscopeSnapshot | null;
  onModeChange: (mode: HoroscopeMode) => void;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  onDayChange: (day: number) => void;
  onHourChange: (hourIndex: number) => void;
}

const MUTAGEN_NAMES = ['禄', '权', '科', '忌'];
/** 时辰序 0-12(0 早子,12 晚子),与 iztro timeIndex 约定一致 */
export const HOUR_NAMES = ['早子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '晚子'];
const MODE_LABELS: [HoroscopeMode, string][] = [
  ['origin', '本命'],
  ['decadal', '大限'],
  ['yearly', '流年'],
  ['monthly', '流月'],
  ['daily', '流日'],
  ['hourly', '流时'],
];

export function TimeNav({ mode, year, month, day, hourIndex, chart, horoscope, onModeChange, onYearChange, onMonthChange, onDayChange, onHourChange }: Props) {
  const scope =
    horoscope && mode !== 'origin'
      ? {
          decadal: horoscope.decadal,
          yearly: horoscope.yearly,
          monthly: horoscope.monthly,
          daily: horoscope.daily,
          hourly: horoscope.hourly,
        }[mode]
      : null;
  const sihua = scope ? sihuaForStem(scope.stem, chart.meta.school) : null;

  const birthYear = Number(chart.solarDate.split('-')[0]);
  // 大限段:各宫 range 升序;当前选中段 = horoscope.decadal 所在宫
  const decades = [...chart.palaces].sort((a, b) => a.decadal.range[0] - b.decadal.range[0]);

  const daysInMonth = new Date(year, month, 0).getDate();
  const stepMonth = (delta: number) => {
    const next = month + delta;
    if (next < 1) {
      onYearChange(year - 1);
      onMonthChange(12);
    } else if (next > 12) {
      onYearChange(year + 1);
      onMonthChange(1);
    } else {
      onMonthChange(next);
    }
  };
  const stepDay = (delta: number) => {
    const date = new Date(year, month - 1, day + delta);
    onYearChange(date.getFullYear());
    onMonthChange(date.getMonth() + 1);
    onDayChange(date.getDate());
  };

  return (
    <div className="time-nav panel">
      <div className="tabs">
        {MODE_LABELS.map(([value, label]) => (
          <button key={value} type="button" className={mode === value ? 'tab active' : 'tab'} onClick={() => onModeChange(value)}>
            {label}
          </button>
        ))}
        {mode === 'yearly' && (
          <div className="year-stepper">
            <button type="button" onClick={() => onYearChange(year - 1)}>‹</button>
            <span>{year}</span>
            <button type="button" onClick={() => onYearChange(year + 1)}>›</button>
          </div>
        )}
        {mode === 'monthly' && (
          <div className="year-stepper">
            <button type="button" onClick={() => stepMonth(-1)}>‹</button>
            <span>{year}·{month}月</span>
            <button type="button" onClick={() => stepMonth(1)}>›</button>
          </div>
        )}
        {mode === 'daily' && (
          <div className="year-stepper">
            <button type="button" onClick={() => stepDay(-1)}>‹</button>
            <span>{year}·{month}·{Math.min(day, daysInMonth)}</span>
            <button type="button" onClick={() => stepDay(1)}>›</button>
          </div>
        )}
        {mode === 'hourly' && (
          <div className="year-stepper wide">
            <button type="button" onClick={() => onHourChange((hourIndex + 12) % 13)}>‹</button>
            <span>
              {month}·{Math.min(day, daysInMonth)} {HOUR_NAMES[hourIndex]}时
            </span>
            <button type="button" onClick={() => onHourChange((hourIndex + 1) % 13)}>›</button>
          </div>
        )}
      </div>

      {mode === 'decadal' && (
        <div className="decade-row">
          {decades.map((p) => {
            const active = horoscope?.decadal.index === p.index;
            const midYear = birthYear + p.decadal.range[0] + 3;
            return (
              <button
                key={p.index}
                type="button"
                className={active ? 'decade active' : 'decade'}
                title={`${zh(p.decadal.stem)}${zh(p.decadal.branch)}大限(点选联动大限盘)`}
                onClick={() => onYearChange(midYear)}
              >
                {p.decadal.range[0]}-{p.decadal.range[1]}
              </button>
            );
          })}
        </div>
      )}

      {scope && sihua && (
        <div className="sihua-line">
          <span className="scope-tag">
            {mode === 'decadal' && horoscope
              ? `大限 ${zh(scope.stem)}${zh(scope.branch)} · 虚岁 ${horoscope.age.nominalAge}`
              : mode === 'yearly'
                ? `${year} 流年 ${zh(scope.stem)}${zh(scope.branch)}`
                : mode === 'monthly' && horoscope
                  ? `流月 ${zh(scope.stem)}${zh(scope.branch)} · ${horoscope.lunarDate}`
                  : mode === 'daily' && horoscope
                    ? `流日 ${zh(scope.stem)}${zh(scope.branch)} · ${horoscope.lunarDate}`
                    : horoscope
                      ? `流时 ${zh(scope.stem)}${zh(scope.branch)}(${HOUR_NAMES[hourIndex]}时)· ${horoscope.lunarDate}`
                      : ''}
          </span>
          {sihua.map((star, i) => (
            <span key={star} className={`sihua-item m-${['sihuaLu', 'sihuaQuan', 'sihuaKe', 'sihuaJi'][i]}`}>
              {zh(star)}化{MUTAGEN_NAMES[i]}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
