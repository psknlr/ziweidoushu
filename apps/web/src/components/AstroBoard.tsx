/**
 * 星座盘(西洋占星):星盘轮(回归黄道 + 整宫制,上升在左)+ 行星表(落座/度分/宫位/逆行/庙旺陷弱)
 * + 元素/三方性质平衡 + 月相/命主星/星群 + 相位列表 + 流年(小限年主星与慢行星过境,与紫微流年共用 year)。
 */
import { useMemo } from 'react';
import {
  ASPECT_GLYPH, ASPECT_ZH, astroYear, DIGNITY_ZH, ELEMENT4_ZH, formatPosition, HOUSE_ZH, MODALITY_ZH, MOON_PHASES, PLANET_CLASS,
  POINT_GLYPH, POINT_ZH, SIGN_ELEMENT, SIGN_GLYPH, SIGN_ZH, SIGNS,
  type Aspect, type AstroChart, type Element4, type Modality, type PlanetPosition, type PointKey, type SignKey,
} from '@ziwei/core';

interface Props {
  astro: AstroChart;
  year: number;
  onYearChange: (year: number) => void;
}

const ELS: Element4[] = ['fire', 'earth', 'air', 'water'];
const MODS: Modality[] = ['cardinal', 'fixed', 'mutable'];
const ASPECT_COLOR: Record<Aspect['nature'], string> = { harmonious: '#7ea6f0', challenging: '#f87171', neutral: '#ecd9a8' };

const RAD = Math.PI / 180;
const CX = 200;
const CY = 200;

function Wheel({ astro }: { astro: AstroChart }) {
  const ascLon = astro.ascendant?.longitude ?? 0;
  /** 黄经 → 数学角(逆时针,上升在左 180°) */
  const phi = (lon: number) => (180 + (lon - ascLon)) * RAD;
  const pt = (lon: number, r: number) => ({ x: CX + r * Math.cos(phi(lon)), y: CY - r * Math.sin(phi(lon)) });
  const arc = (from: number, to: number, rOut: number, rIn: number) => {
    const a = pt(from, rOut), b = pt(to, rOut), c = pt(to, rIn), d = pt(from, rIn);
    // 逆时针绘制 30° 弧(sweep-flag 0 表示逆时针)
    return `M${a.x},${a.y} A${rOut},${rOut} 0 0 0 ${b.x},${b.y} L${c.x},${c.y} A${rIn},${rIn} 0 0 1 ${d.x},${d.y} Z`;
  };
  const firstSign = astro.ascendant?.sign ?? astro.bigThree.sun;
  const firstIdx = SIGNS.indexOf(firstSign);

  // 行星标签防重叠:按角度排序,间距不足 7° 时顺序推开
  const placed = useMemo(() => {
    const items = [
      ...astro.planets.map((p) => ({ key: p.key as PointKey, lon: p.longitude, retro: p.retrograde })),
      { key: 'northNode' as PointKey, lon: astro.northNode.longitude, retro: false },
    ].map((it) => ({ ...it, draw: ((it.lon - ascLon) % 360 + 360) % 360 }));
    items.sort((a, b) => a.draw - b.draw);
    for (let i = 1; i < items.length; i++) {
      const prev = items[i - 1]!;
      const cur = items[i]!;
      if (cur.draw - prev.draw < 7) cur.draw = prev.draw + 7;
    }
    return items.map((it) => ({ ...it, drawLon: ascLon + it.draw }));
  }, [astro, ascLon]);

  const lonOf = (k: PointKey): number | undefined =>
    k === 'ascendant' ? astro.ascendant?.longitude : k === 'midheaven' ? astro.midheaven?.longitude : k === 'northNode' ? astro.northNode.longitude : astro.planets.find((p) => p.key === k)?.longitude;

  return (
    <svg className="as-wheel-svg" viewBox="0 0 400 400" role="img" aria-label="星座盘">
      <circle cx={CX} cy={CY} r={192} className="as-ring-outer" />
      {SIGNS.map((s, i) => {
        const from = i * 30;
        const mid = pt(from + 15, 176);
        const houseNo = ((i - firstIdx + 12) % 12) + 1;
        const hp = pt(from + 15, 151);
        return (
          <g key={s}>
            <path d={arc(from, from + 30, 192, 160)} className={`as-seg as-${SIGN_ELEMENT[s]}`} />
            <text x={mid.x} y={mid.y} className="as-sign-glyph" textAnchor="middle" dominantBaseline="central">{SIGN_GLYPH[s]}</text>
            <text x={hp.x} y={hp.y} className="as-house-no" textAnchor="middle" dominantBaseline="central">{houseNo}</text>
          </g>
        );
      })}
      <circle cx={CX} cy={CY} r={160} className="as-ring" />
      <circle cx={CX} cy={CY} r={142} className="as-ring" />
      <circle cx={CX} cy={CY} r={104} className="as-ring-inner" />
      {/* 相位线 */}
      {astro.aspects.filter((a) => a.orb <= 6).map((a, i) => {
        const la = lonOf(a.a);
        const lb = lonOf(a.b);
        if (la === undefined || lb === undefined) return null;
        const p1 = pt(la, 104);
        const p2 = pt(lb, 104);
        return <line key={i} x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={ASPECT_COLOR[a.nature]} strokeWidth={a.orb < 2 ? 1.4 : 0.8} opacity={0.75} />;
      })}
      {/* 上升 / 天顶 轴 */}
      {astro.ascendant && astro.midheaven && (
        <>
          <line x1={pt(ascLon, 104).x} y1={pt(ascLon, 104).y} x2={pt(ascLon + 180, 104).x} y2={pt(ascLon + 180, 104).y} className="as-axis" />
          <line x1={pt(astro.midheaven.longitude, 104).x} y1={pt(astro.midheaven.longitude, 104).y} x2={pt(astro.midheaven.longitude + 180, 104).x} y2={pt(astro.midheaven.longitude + 180, 104).y} className="as-axis" />
          <text {...pt(ascLon, 200)} className="as-axis-label" textAnchor="middle" dominantBaseline="central">AC</text>
          <text {...pt(astro.midheaven.longitude, 200)} className="as-axis-label" textAnchor="middle" dominantBaseline="central">MC</text>
        </>
      )}
      {/* 行星 */}
      {placed.map((it) => {
        const tick1 = pt(it.lon, 142);
        const tick2 = pt(it.lon, 136);
        const g = pt(it.drawLon, 124);
        const d = pt(it.drawLon, 112);
        const lonInSign = Math.floor(it.lon % 30);
        return (
          <g key={it.key}>
            <line x1={tick1.x} y1={tick1.y} x2={tick2.x} y2={tick2.y} className="as-tick" />
            <text x={g.x} y={g.y} className={`as-planet-glyph${it.retro ? ' retro' : ''}`} textAnchor="middle" dominantBaseline="central">{POINT_GLYPH[it.key]}</text>
            <text x={d.x} y={d.y} className="as-planet-deg" textAnchor="middle" dominantBaseline="central">{lonInSign}°{it.retro ? 'r' : ''}</text>
          </g>
        );
      })}
      <text x={CX} y={CY - 10} className="as-center" textAnchor="middle">{POINT_GLYPH.sun}{SIGN_ZH[astro.bigThree.sun].slice(0, 2)} {POINT_GLYPH.moon}{SIGN_ZH[astro.bigThree.moon].slice(0, 2)}</text>
      <text x={CX} y={CY + 12} className="as-center-sub" textAnchor="middle">{astro.bigThree.ascendant ? `AC ${SIGN_ZH[astro.bigThree.ascendant].slice(0, 2)}` : '太阳整宫'}</text>
    </svg>
  );
}

function PlanetRow({ p }: { p: PlanetPosition }) {
  return (
    <tr className={`as-row cls-${PLANET_CLASS[p.key as keyof typeof PLANET_CLASS] ?? 'point'}`}>
      <td><span className="as-glyph">{POINT_GLYPH[p.key]}</span>{POINT_ZH[p.key]}</td>
      <td className={`as-${SIGN_ELEMENT[p.sign]}`}>{SIGN_GLYPH[p.sign]} {formatPosition(p)}</td>
      <td>{p.house}宫</td>
      <td>
        {p.retrograde && <span className="as-tag retro">逆</span>}
        {p.dignity && <span className={`as-tag dig-${p.dignity}`}>{DIGNITY_ZH[p.dignity]}</span>}
      </td>
    </tr>
  );
}

export function AstroBoard({ astro, year, onYearChange }: Props) {
  const el = astro.elements;
  const mo = astro.modalities;
  const maxEl = Math.max(1, ...ELS.map((e) => el.weights[e]));
  const maxMo = Math.max(1, ...MODS.map((m) => mo.weights[m]));
  const phase = MOON_PHASES.find((p) => p.key === astro.moonPhase.key)!;
  const y = useMemo(() => astroYear(astro, year), [astro, year]);
  const birthYear = Number(astro.meta.localTime.slice(0, 4));
  const major = astro.aspects.filter((a) => a.orb <= 6);
  const b = astro.bigThree;

  return (
    <div className="as-board">
      <div className="as-head">
        <div className="as-bigthree">
          <span className={`as-chip as-${SIGN_ELEMENT[b.sun]}`}>{POINT_GLYPH.sun} 太阳 {SIGN_ZH[b.sun]}</span>
          <span className={`as-chip as-${SIGN_ELEMENT[b.moon]}`}>{POINT_GLYPH.moon} 月亮 {SIGN_ZH[b.moon]}</span>
          {b.ascendant ? (
            <span className={`as-chip as-${SIGN_ELEMENT[b.ascendant]}`}>AC 上升 {SIGN_ZH[b.ascendant]}</span>
          ) : (
            <span className="as-chip dim" title="在档案页填写出生城市后可得上升与天顶">无上升(缺出生地)</span>
          )}
        </div>
        <div className="as-time">
          回归黄道 · {astro.meta.houseSystem === 'whole-sign' ? '整宫制' : '太阳整宫制'} · 标准时 {astro.meta.localTime}(UTC{astro.meta.utcOffsetMinutes >= 0 ? '+' : ''}{astro.meta.utcOffsetMinutes / 60})
          {astro.meta.timeSource === 'clock-dst' ? ' · 已扣夏令时' : astro.meta.timeSource === 'timeIndex' ? ' · 时辰中点' : ''}
          {astro.meta.location ? ` · ${astro.meta.location.latitude.toFixed(2)}°N ${astro.meta.location.longitude.toFixed(2)}°E` : ''}
        </div>
      </div>

      <div className="as-grid">
        <section className="as-card as-wheel-card">
          <Wheel astro={astro} />
          <p className="hint">外环星座(按元素着色),数字为整宫制宫位;内圈相位线:蓝=三分/六分,红=四分/对分,金=合相。</p>
        </section>

        <section className="as-card">
          <h3>行星落座</h3>
          <table className="as-table">
            <thead><tr><th>行星</th><th>星座 · 度数</th><th>宫位</th><th>状态</th></tr></thead>
            <tbody>
              {astro.planets.map((p) => <PlanetRow key={p.key} p={p} />)}
              {astro.ascendant && (
                <tr className="as-row cls-point"><td><span className="as-glyph">AC</span>上升</td><td className={`as-${SIGN_ELEMENT[astro.ascendant.sign]}`}>{SIGN_GLYPH[astro.ascendant.sign]} {formatPosition(astro.ascendant)}</td><td>1宫</td><td /></tr>
              )}
              {astro.midheaven && (
                <tr className="as-row cls-point"><td><span className="as-glyph">MC</span>天顶</td><td className={`as-${SIGN_ELEMENT[astro.midheaven.sign]}`}>{SIGN_GLYPH[astro.midheaven.sign]} {formatPosition(astro.midheaven)}</td><td>{astro.ascendant ? `${((SIGNS.indexOf(astro.midheaven.sign) - SIGNS.indexOf(astro.ascendant.sign) + 12) % 12) + 1}宫` : ''}</td><td /></tr>
              )}
              <tr className="as-row cls-point"><td><span className="as-glyph">☊</span>北交点</td><td className={`as-${SIGN_ELEMENT[astro.northNode.sign]}`}>{SIGN_GLYPH[astro.northNode.sign]} {formatPosition(astro.northNode)}</td><td>{astro.planets.length ? `${((SIGNS.indexOf(astro.northNode.sign) - SIGNS.indexOf((astro.ascendant?.sign ?? b.sun) as SignKey) + 12) % 12) + 1}宫` : ''}</td><td /></tr>
            </tbody>
          </table>
          <p className="hint">庙/旺/陷/弱为托勒密传统庙旺表(外行星仅现代庙位);逆行表示该行星视运动倒退。</p>
        </section>

        <section className="as-card">
          <h3>元素 · 三方性质</h3>
          <div className="bz-bars">
            {ELS.map((e) => (
              <div key={e} className="bz-bar-row">
                <span className={`bz-bar-label as-${e}`}>{ELEMENT4_ZH[e]}</span>
                <div className="bz-bar"><div className={`bz-bar-fill as-bg-${e}`} style={{ width: `${(el.weights[e] / maxEl) * 100}%` }} /></div>
                <span className="bz-bar-num">{el.weights[e]}</span>
              </div>
            ))}
          </div>
          <div className="bz-bars" style={{ marginTop: 8 }}>
            {MODS.map((m) => (
              <div key={m} className="bz-bar-row">
                <span className="bz-bar-label">{MODALITY_ZH[m]}</span>
                <div className="bz-bar"><div className="bz-bar-fill as-bg-mod" style={{ width: `${(mo.weights[m] / maxMo) * 100}%` }} /></div>
                <span className="bz-bar-num">{mo.weights[m]}</span>
              </div>
            ))}
          </div>
          <p className="bz-text">
            偏重 {el.dominant.map((e) => ELEMENT4_ZH[e]).join('/')}元素{el.lacking.length ? `,缺${el.lacking.map((e) => ELEMENT4_ZH[e]).join('')}(后天补课方向)` : ''};
            节奏偏{mo.dominant.map((m) => MODALITY_ZH[m]).join('/')}。
          </p>
          <div className="bz-chips">
            <span className="bz-chip">月相 {phase.zh}<small>{astro.moonPhase.elongation}°</small></span>
            {astro.chartRuler && (
              <span className="bz-chip">命主星 {POINT_ZH[astro.chartRuler.traditional]}{astro.chartRuler.modern !== astro.chartRuler.traditional ? `/${POINT_ZH[astro.chartRuler.modern]}` : ''}<small>{formatPosition(astro.chartRuler.position)} {astro.chartRuler.position.house}宫</small></span>
            )}
            {astro.stelliums.map((s) => (
              <span key={s.sign} className={`bz-chip as-${SIGN_ELEMENT[s.sign]}`}>星群 {SIGN_ZH[s.sign]}<small>{s.planets.map((p) => POINT_GLYPH[p]).join('')}</small></span>
            ))}
          </div>
          <p className="hint">权重:日月上升 2,水金火木土 1,天海冥 0.5(通行作法)。</p>
        </section>

        <section className="as-card">
          <h3>主要相位 <small>容许度 ≤ 6°,共 {major.length}</small></h3>
          <div className="as-aspects">
            {major.length === 0 && <span className="hint">无</span>}
            {major.map((a, i) => (
              <span key={i} className={`as-aspect ${a.nature}`} title={`${ASPECT_ZH[a.type]},差 ${a.orb}°`}>
                {POINT_GLYPH[a.a]} {ASPECT_GLYPH[a.type]} {POINT_GLYPH[a.b]}<small>{POINT_ZH[a.a]}{ASPECT_ZH[a.type].slice(0, 2)}{POINT_ZH[a.b]} {a.orb}°</small>
              </span>
            ))}
          </div>
          <p className="hint">合相聚焦、三分/六分顺畅、四分/对分为张力与成长动力;容许度越小越显著。</p>
        </section>
      </div>

      <section className="as-card as-year">
        <h3>
          流年 <small>小限法(Annual Profection)+ 生日时刻慢行星过境</small>
          <span className="as-year-nav">
            <button type="button" className="chip-btn" onClick={() => onYearChange(year - 1)}>‹</button>
            <input type="number" value={year} min={birthYear} max={birthYear + 120} onChange={(e) => onYearChange(Number(e.target.value) || year)} />
            <button type="button" className="chip-btn" onClick={() => onYearChange(year + 1)}>›</button>
          </span>
        </h3>
        <div className="as-year-grid">
          <div className="as-year-block">
            <div className="as-year-title">{year} 年 · 周岁 {y.age}</div>
            <div className="bz-pattern">第 {y.profection.house} 宫 · {SIGN_ZH[y.profection.sign]}</div>
            <p className="bz-text">年度主题:{HOUSE_ZH[y.profection.house]};年主星 {POINT_ZH[y.profection.timeLord]},本命落 {formatPosition(y.profection.timeLordNatal)} {y.profection.timeLordNatal.house}宫{y.profection.timeLordNatal.dignity ? `(${DIGNITY_ZH[y.profection.timeLordNatal.dignity]})` : ''}{y.profection.timeLordNatal.retrograde ? '(逆)' : ''}。</p>
          </div>
          <div className="as-year-block">
            <div className="as-year-title">过境 @ {y.transits.at}</div>
            <ul className="bz-list">
              {y.transits.positions.map((p) => (
                <li key={p.key}>{POINT_GLYPH[p.key]} {POINT_ZH[p.key]} {formatPosition(p)}{p.retrograde ? '(逆)' : ''} → 本命 {p.house} 宫({HOUSE_ZH[p.house]})</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="as-aspects">
          {y.transits.aspects.length === 0 && <span className="hint">生日时刻慢行星与本命日月升、命主要点无紧密相位</span>}
          {y.transits.aspects.map((a, i) => (
            <span key={i} className={`as-aspect ${a.nature}`}>
              过境{POINT_GLYPH[a.transit]} {ASPECT_GLYPH[a.type]} 本命{POINT_GLYPH[a.natal]}<small>{POINT_ZH[a.transit]}{ASPECT_ZH[a.type].slice(0, 2)}{POINT_ZH[a.natal]} {a.orb}°</small>
            </span>
          ))}
        </div>
        <p className="hint">小限:周岁 0 为第一宫,每岁推进一宫,年主星为该宫守护星;过境为年度概览快照,不作具体日期事件推断。</p>
      </section>
    </div>
  );
}
