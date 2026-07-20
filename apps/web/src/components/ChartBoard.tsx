/**
 * 星盘 4×4 宫格:外圈 12 宫 + 中央 2×2 信息区。
 * - 点击宫位 → SVG 叠加层绘制三方四正(对宫直线 + 三合三角)
 * - 运限模式 → 叠加运限宫名与运限天干四化角标(限禄/年忌…)
 */
import { useMemo } from 'react';
import {
  sihuaOverlay,
  starNature,
  surroundedIndexes,
  zh,
  type Astrolabe,
  type ChartFeatures,
  type HoroscopeSnapshot,
  type MutagenKey,
  type Palace,
  type Star,
} from '@ziwei/core';
import type { HoroscopeMode } from './TimeNav.js';

/** 盘面索引(寅=0)→ 4×4 网格 [row, col] 传统布局:巳午未申在上 */
const GRID_POS: Record<number, [number, number]> = {
  3: [1, 1], 4: [1, 2], 5: [1, 3], 6: [1, 4],
  2: [2, 1], 7: [2, 4],
  1: [3, 1], 8: [3, 4],
  0: [4, 1], 11: [4, 2], 10: [4, 3], 9: [4, 4],
};

const MUTAGEN_SHORT: Record<MutagenKey, string> = {
  sihuaLu: '禄', sihuaQuan: '权', sihuaKe: '科', sihuaJi: '忌',
};

interface Props {
  chart: Astrolabe;
  features: ChartFeatures;
  selected: number | null;
  onSelect: (index: number) => void;
  mode: HoroscopeMode;
  horoscope: HoroscopeSnapshot | null;
}

export function ChartBoard({ chart, features, selected, onSelect, mode, horoscope }: Props) {
  // 运限四化叠加:取运限天干 → 四化星落宫(限/年/月/日前缀)
  const scope =
    mode !== 'origin' && horoscope
      ? {
          decadal: horoscope.decadal,
          yearly: horoscope.yearly,
          monthly: horoscope.monthly,
          daily: horoscope.daily,
          hourly: horoscope.hourly,
        }[mode]
      : null;
  const prefix = { decadal: '限', yearly: '年', monthly: '月', daily: '日', hourly: '时' }[
    mode as Exclude<HoroscopeMode, 'origin'>
  ];

  const overlay = useMemo(() => {
    const map = new Map<number, { label: string; mutagen: MutagenKey }[]>();
    if (!scope) return map;
    for (const hit of sihuaOverlay(chart, scope.stem)) {
      if (hit.palaceIndex === null) continue;
      const list = map.get(hit.palaceIndex) ?? [];
      list.push({ label: `${prefix}${MUTAGEN_SHORT[hit.mutagen]}`, mutagen: hit.mutagen });
      map.set(hit.palaceIndex, list);
    }
    return map;
  }, [chart, scope, prefix]);

  const scopeNames = scope?.palaceNames ?? null;

  return (
    <div className="board-scroll">
      <div className="board">
      {chart.palaces.map((palace) => (
        <PalaceCell
          key={palace.index}
          palace={palace}
          pos={GRID_POS[palace.index]!}
          selected={selected === palace.index}
          inTrine={selected !== null && trineSet(selected).has(palace.index)}
          onClick={() => onSelect(palace.index)}
          overlayBadges={overlay.get(palace.index) ?? []}
          scopeName={scopeNames ? scopeNames[palace.index]! : null}
        />
      ))}
      <CenterInfo chart={chart} features={features} />
      {selected !== null && <TrineOverlay selected={selected} />}
      </div>
    </div>
  );
}

function trineSet(index: number): Set<number> {
  const s = surroundedIndexes(index);
  return new Set([s.target, s.opposite, s.wealth, s.career]);
}

// ------------------------------------------------------------------ 宫位卡

function PalaceCell({
  palace, pos, selected, inTrine, onClick, overlayBadges, scopeName,
}: {
  palace: Palace;
  pos: [number, number];
  selected: boolean;
  inTrine: boolean;
  onClick: () => void;
  overlayBadges: { label: string; mutagen: MutagenKey }[];
  scopeName: string | null;
}) {
  const adjectives = palace.adjectiveStars.slice(0, 6);
  const more = palace.adjectiveStars.length - adjectives.length;
  return (
    <button
      type="button"
      className={`cell${selected ? ' selected' : ''}${inTrine && !selected ? ' in-trine' : ''}`}
      style={{ gridRow: pos[0], gridColumn: pos[1] }}
      onClick={onClick}
    >
      <div className="cell-head">
        <span className="palace-name">
          {zh(palace.name)}
          {palace.isBodyPalace && <em className="body-mark">身</em>}
        </span>
        {scopeName && <span className="scope-name">{zh(scopeName)}</span>}
        <span className="stem-branch">
          {zh(palace.stem)}
          {zh(palace.branch)}
        </span>
      </div>
      {overlayBadges.length > 0 && (
        <div className="overlay-badges">
          {overlayBadges.map((b) => (
            <span key={b.label} className={`badge m-${b.mutagen}`}>
              {b.label}
            </span>
          ))}
        </div>
      )}
      <div className="stars-major">
        {palace.majorStars.map((s) => (
          <StarChip key={s.key} star={s} major />
        ))}
        {palace.borrowed && palace.majorStars.every((s) => s.type !== 'major') && (
          <span className="borrowed" title={`借对宫(${zh(palace.borrowed.fromBranch)})主星`}>
            借{palace.borrowed.stars.map((s) => zh(s.key)).join('·')}
          </span>
        )}
      </div>
      <div className="stars-minor">
        {palace.minorStars.map((s) => (
          <StarChip key={s.key} star={s} />
        ))}
      </div>
      <div className="stars-adj">
        {adjectives.map((s) => {
          const nature = starNature(s.key);
          return (
            <span key={s.key} className={nature ? `n-${nature.kind}` : ''} title={nature?.note ?? ''}>
              {zh(s.key)}
            </span>
          );
        })}
        {more > 0 && <span className="more">+{more}</span>}
      </div>
      <div className="cell-foot">
        <span>{zh(palace.changsheng12)}</span>
        <span className="decadal">
          {palace.decadal.range[0]}-{palace.decadal.range[1]}
        </span>
      </div>
    </button>
  );
}

function StarChip({ star, major = false }: { star: Star; major?: boolean }) {
  // 有庙陷表者显示亮度;无庙陷表者显示古籍星性标签(恒吉/煞/驿等)
  const nature = !star.brightness ? starNature(star.key) : undefined;
  return (
    <span className={major ? 'star major' : 'star minor'}>
      {zh(star.key)}
      {star.brightness && <sub className={`b-${star.brightness}`}>{zh(star.brightness)}</sub>}
      {!star.brightness && nature && (
        <sub className={`n-${nature.kind}`} title={nature.note ?? ''}>
          {nature.tag}
        </sub>
      )}
      {star.mutagen && <i className={`mutagen m-${star.mutagen}`}>{zh(star.mutagen)}</i>}
    </span>
  );
}

/** 亮度图例(庙旺得利平不陷七级) */
export function BrightnessLegend() {
  const levels: [string, string][] = [
    ['miao', '庙'], ['wang', '旺'], ['de', '得'], ['li', '利'], ['ping', '平'], ['bu', '不'], ['xian', '陷'],
  ];
  return (
    <div className="brightness-legend">
      <span className="legend-title">星曜亮度</span>
      {levels.map(([key, label]) => (
        <span key={key} className={`legend-item b-${key}`}>
          {label}
        </span>
      ))}
      <span className="legend-sep">|</span>
      <span className="legend-item n-auspicious">吉</span>
      <span className="legend-item n-inauspicious">煞</span>
      <span className="legend-item n-flower">桃</span>
      <span className="legend-item n-literary">文</span>
      <span className="legend-note">庙旺力宏 · 落陷保守断 · 煞星入庙化煞为权 · 无庙陷者标星性(禄存恒庙,辅弼魁钺恒吉)</span>
    </div>
  );
}

// ---------------------------------------------------------------- 中央信息

function CenterInfo({ chart, features }: { chart: Astrolabe; features: ChartFeatures }) {
  const tst = chart.meta.input.trueSolarTime;
  const g = chart.ganzhi;
  return (
    <div className="center">
      <div className="center-title">{zh(chart.gender)}命 · {chart.solarDate}</div>
      <div className="center-lunar">{chart.lunarDate}</div>
      <div className="center-ganzhi">
        {[g.year, g.month, g.day, g.hour].map((p, i) => (
          <span key={i}>
            {zh(p.stem)}
            {zh(p.branch)}
          </span>
        ))}
      </div>
      <div className="center-grid">
        <span>五行局</span><b>{zh(chart.fiveElementsClass)}</b>
        <span>命主</span><b>{zh(chart.soul)}</b>
        <span>身主</span><b>{zh(chart.body)}</b>
        <span>生肖</span><b>{chart.zodiac}</b>
      </div>
      {tst.enabled && (
        <div className={`tst-note${tst.timeIndexChanged ? ' changed' : ''}`}>
          真太阳时 {tst.totalOffsetMinutes! > 0 ? '+' : ''}
          {tst.totalOffsetMinutes} 分{tst.timeIndexChanged ? ' · 时辰已改变' : ''}
        </div>
      )}
      <div className="center-bright">
        <span className="bright-chip up">庙旺 {features.brightness.exalted.length}</span>
        <span className="bright-chip down">落陷 {features.brightness.fallen.length}</span>
        {features.brightness.fallen.some((f) => f.rescuedBy?.length) && (
          <span className="bright-chip rescue">陷而有救</span>
        )}
      </div>
      {features.patterns.length > 0 && (
        <div className="center-patterns">
          {features.patterns.map((p) => (
            <span key={p.id} className={p.brokenBy.length > 0 ? 'pattern broken' : 'pattern'} title={p.source}>
              {p.name}
              {p.brokenBy.length > 0 ? '(破)' : ''}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------- 三方四正 SVG

function TrineOverlay({ selected }: { selected: number }) {
  const s = surroundedIndexes(selected);
  const center = (i: number): [number, number] => {
    const [row, col] = GRID_POS[i]!;
    return [(col - 0.5) * 100, (row - 0.5) * 100];
  };
  const [tx, ty] = center(s.target);
  const [ox, oy] = center(s.opposite);
  const [wx, wy] = center(s.wealth);
  const [cx, cy] = center(s.career);
  return (
    <svg className="trine-overlay" viewBox="0 0 400 400" preserveAspectRatio="none">
      {/* 对宫直线 */}
      <line x1={tx} y1={ty} x2={ox} y2={oy} className="line-opposite" />
      {/* 三合三角 */}
      <polygon points={`${tx},${ty} ${wx},${wy} ${cx},${cy}`} className="line-trine" />
      {[s.target, s.opposite, s.wealth, s.career].map((i) => {
        const [x, y] = center(i);
        return <circle key={i} cx={x} cy={y} r={4} className={i === s.target ? 'dot main' : 'dot'} />;
      })}
    </svg>
  );
}
