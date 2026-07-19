/**
 * 运限时间轴:本命 / 大限 / 流年 切换 + 流年年份步进。
 * 切换后 ChartBoard 在宫格上叠加该运限天干的四化角标。
 */
import { sihuaForStem, zh, type Astrolabe, type HoroscopeSnapshot } from '@ziwei/core';

export type HoroscopeMode = 'origin' | 'decadal' | 'yearly';

interface Props {
  mode: HoroscopeMode;
  year: number;
  chart: Astrolabe;
  horoscope: HoroscopeSnapshot | null;
  onModeChange: (mode: HoroscopeMode) => void;
  onYearChange: (year: number) => void;
}

const MUTAGEN_NAMES = ['禄', '权', '科', '忌'];

export function TimeNav({ mode, year, chart, horoscope, onModeChange, onYearChange }: Props) {
  const scope = horoscope && mode !== 'origin' ? (mode === 'decadal' ? horoscope.decadal : horoscope.yearly) : null;
  const sihua = scope ? sihuaForStem(scope.stem, chart.meta.school) : null;

  return (
    <div className="time-nav panel">
      <div className="tabs">
        {(
          [
            ['origin', '本命'],
            ['decadal', '大限'],
            ['yearly', '流年'],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            type="button"
            className={mode === value ? 'tab active' : 'tab'}
            onClick={() => onModeChange(value)}
          >
            {label}
          </button>
        ))}
        {mode === 'yearly' && (
          <div className="year-stepper">
            <button type="button" onClick={() => onYearChange(year - 1)}>
              ‹
            </button>
            <span>{year}</span>
            <button type="button" onClick={() => onYearChange(year + 1)}>
              ›
            </button>
          </div>
        )}
      </div>
      {scope && sihua && (
        <div className="sihua-line">
          <span className="scope-tag">
            {mode === 'decadal' ? '大限' : `${year} 流年`} {zh(scope.stem)}
            {zh(scope.branch)}
            {mode === 'decadal' && horoscope ? ` · 虚岁 ${horoscope.age.nominalAge}` : ''}
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
