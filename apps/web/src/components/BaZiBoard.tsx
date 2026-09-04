/**
 * 八字盘:四柱表(十神/干支/藏干/纳音/长生/空亡)+ 日主旺衰 + 五行 + 格局用神
 * + 神煞与干支关系 + 大运流年时间轴(与紫微流年共用 year 状态)。
 */
import {
  ELEMENT_ZH, HIDDEN_ROLE_ZH, liuNianOf, PILLAR_ZH, SEASON_STATE_ZH, STRENGTH_ZH, TEN_GOD_ZH, zh,
  type BaZiChart, type BaZiPillar, type ElementKey, type PillarPos,
} from '@ziwei/core';

interface Props {
  bazi: BaZiChart;
  year: number;
  onYearChange: (year: number) => void;
}

const POS: PillarPos[] = ['year', 'month', 'day', 'hour'];
const ELS: ElementKey[] = ['wood', 'fire', 'earth', 'metal', 'water'];

function Pillar({ p, isDay }: { p: BaZiPillar; isDay: boolean }) {
  return (
    <div className={`bz-pillar${isDay ? ' day' : ''}`}>
      <div className="bz-pos">{PILLAR_ZH[p.position]}</div>
      <div className="bz-god">{p.stemTenGod ? TEN_GOD_ZH[p.stemTenGod] : '日主'}</div>
      <div className={`bz-stem el-${p.stemElement}`}>{zh(p.stem)}</div>
      <div className={`bz-branch el-${p.branchElement}`}>
        {zh(p.branch)}
        {p.isKongWang && <sup className="bz-kong">空</sup>}
      </div>
      <div className="bz-hidden">
        {p.hidden.map((h) => (
          <span key={h.stem} className={`el-${h.element}`} title={`${HIDDEN_ROLE_ZH[h.role]}`}>
            {zh(h.stem)}<small>{TEN_GOD_ZH[h.tenGod]}</small>
          </span>
        ))}
      </div>
      <div className="bz-meta">{p.naYin}</div>
      <div className="bz-meta">{zh(p.changSheng)}</div>
    </div>
  );
}

export function BaZiBoard({ bazi, year, onYearChange }: Props) {
  const s = bazi.strength;
  const fe = bazi.fiveElements;
  const maxW = Math.max(1, ...ELS.map((e) => fe.weighted[e]));
  const daYun = bazi.yun.daYun.filter((d) => d.index > 0);
  const active = [...daYun].reverse().find((d) => year >= d.startYear) ?? null;
  const ln = liuNianOf(bazi, year);
  const flowYears = active ? Array.from({ length: 10 }, (_, i) => active.startYear + i) : [];

  return (
    <div className="bz-board">
      <div className="bz-head">
        <div className="bz-dm">
          <span className={`bz-dm-stem el-${bazi.dayMaster.element}`}>{zh(bazi.dayMaster.stem)}</span>
          <span className="bz-dm-text">
            {ELEMENT_ZH[bazi.dayMaster.element]}日主 · {bazi.dayMaster.yinYang === 'yang' ? '阳' : '阴'} · {STRENGTH_ZH[s.level]}
          </span>
        </div>
        <div className="bz-time">
          {bazi.meta.timeSource === 'trueSolarTime' ? '真太阳时' : bazi.meta.timeSource === 'clock-dst' ? '已扣夏令时' : bazi.meta.timeSource === 'timeIndex' ? '时辰中点' : '钟表时'}{' '}
          {bazi.meta.localTime} · 晚子时{bazi.meta.dayBoundary === 'forward' ? '归次日' : '归当日'}
        </div>
      </div>

      <div className="bz-pillars">
        {POS.map((k) => (
          <Pillar key={k} p={bazi.pillars[k]} isDay={k === 'day'} />
        ))}
      </div>

      <div className="bz-grid">
        <section className="bz-card">
          <h3>日主旺衰 <span className="bz-score">{s.score}</span></h3>
          <div className="bz-gauge"><div className="bz-gauge-fill" style={{ width: `${Math.min(100, s.score)}%` }} /></div>
          <div className="bz-chips">
            <span className="bz-chip">得令 {SEASON_STATE_ZH[s.breakdown.season.state]} {s.breakdown.season.score}/40</span>
            <span className="bz-chip">得地 {s.breakdown.roots.score}/30</span>
            <span className="bz-chip">得势 {s.breakdown.support.score}/30</span>
          </div>
          <p className="hint">{s.method}</p>
        </section>

        <section className="bz-card">
          <h3>五行</h3>
          <div className="bz-bars">
            {ELS.map((e) => (
              <div key={e} className="bz-bar-row">
                <span className={`bz-bar-label el-${e}`}>{ELEMENT_ZH[e]}</span>
                <div className="bz-bar"><div className={`bz-bar-fill bg-${e}`} style={{ width: `${(fe.weighted[e] / maxW) * 100}%` }} /></div>
                <span className="bz-bar-num">{fe.visible[e]}<small>/{fe.weighted[e]}</small></span>
              </div>
            ))}
          </div>
          <p className="hint">表面计数 / 含藏干加权{fe.missing.length ? `;表面缺${fe.missing.map((e) => ELEMENT_ZH[e]).join('')}(仅计数,不作吉凶)` : ''}</p>
        </section>

        <section className="bz-card">
          <h3>格局与用神</h3>
          <div className="bz-pattern">{bazi.pattern.name}</div>
          <p className="bz-text">{bazi.pattern.basis}</p>
          {bazi.pattern.special.map((t) => <p key={t} className="bz-text warn">{t}</p>)}
          <div className="bz-chips">
            {bazi.yongShen.favorable.map((e) => <span key={e} className={`bz-chip bg-${e}`}>喜 {ELEMENT_ZH[e]}</span>)}
            {bazi.yongShen.unfavorable.map((e) => <span key={e} className="bz-chip dim">忌 {ELEMENT_ZH[e]}</span>)}
          </div>
          <p className="bz-text">{bazi.yongShen.rationale}</p>
          {bazi.yongShen.tiaoHou && <p className="bz-text">调候:{bazi.yongShen.tiaoHou.note}</p>}
        </section>

        <section className="bz-card">
          <h3>神煞 · 干支关系</h3>
          <div className="bz-chips">
            {bazi.shenSha.length === 0 && <span className="hint">无</span>}
            {bazi.shenSha.map((h) => (
              <span key={h.key} className="bz-chip" title={h.basis}>
                {h.name}<small>{h.at.map((a) => PILLAR_ZH[a][0]).join('')}</small>
              </span>
            ))}
          </div>
          <ul className="bz-list">
            {bazi.relations.map((r, i) => <li key={i}>{r.note ?? r.name}</li>)}
          </ul>
          <p className="hint">胎元 {bazi.extras.taiYuan} · 命宫 {bazi.extras.mingGong} · 身宫 {bazi.extras.shenGong}</p>
        </section>
      </div>

      <section className="bz-card bz-yun">
        <h3>
          大运 <small>{bazi.yun.forward ? '顺行' : '逆行'} · {bazi.yun.startYears}岁{bazi.yun.startMonths}月{bazi.yun.startDays}天起运({bazi.yun.startDate})</small>
        </h3>
        <div className="bz-dayun">
          {daYun.map((d) => (
            <button
              key={d.index}
              type="button"
              className={active?.index === d.index ? 'bz-dy active' : 'bz-dy'}
              onClick={() => onYearChange(d.startYear + 4)}
              title={`${d.startYear}-${d.endYear} ${TEN_GOD_ZH[d.stemTenGod]}/${TEN_GOD_ZH[d.branchMainTenGod]}`}
            >
              <b>{zh(d.stem)}{zh(d.branch)}</b>
              <small>{d.startAge}-{d.endAge}</small>
              <i>{TEN_GOD_ZH[d.stemTenGod]}</i>
            </button>
          ))}
        </div>
        {active && (
          <div className="bz-liunian">
            {flowYears.map((y) => {
              const l = liuNianOf(bazi, y);
              return (
                <button key={y} type="button" className={y === year ? 'bz-ln active' : 'bz-ln'} onClick={() => onYearChange(y)}>
                  <small>{y}</small>
                  <b>{zh(l.stem)}{zh(l.branch)}</b>
                </button>
              );
            })}
          </div>
        )}
        <p className="bz-text">
          {year} 流年 {zh(ln.stem)}{zh(ln.branch)}(干{TEN_GOD_ZH[ln.stemTenGod]} / 支{TEN_GOD_ZH[ln.branchMainTenGod]},虚岁 {ln.age})
          {active ? `,行 ${zh(active.stem)}${zh(active.branch)} 大运(${TEN_GOD_ZH[active.stemTenGod]},${active.startAge}-${active.endAge} 岁)` : ',尚在起运前'}
        </p>
      </section>
    </div>
  );
}
