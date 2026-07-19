import { useMemo, useState } from 'react';
import { ZiweiEngine, type Astrolabe, type BirthInput } from '@ziwei/core';
import { ChartForm } from './components/ChartForm.js';
import { BrightnessLegend, ChartBoard } from './components/ChartBoard.js';
import { TimeNav, type HoroscopeMode } from './components/TimeNav.js';
import { AIPanel } from './components/AIPanel.js';
import { ProfilesPanel } from './components/ProfilesPanel.js';
import { SynastryPanel } from './components/SynastryPanel.js';
import type { Profile } from './lib/profiles.js';

const NOW = new Date();

export function App() {
  const [preset, setPreset] = useState<string>('wenmo-zhongzhou');
  const [chart, setChart] = useState<Astrolabe | null>(null);
  const [lastInput, setLastInput] = useState<BirthInput | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [mode, setMode] = useState<HoroscopeMode>('origin');
  const [year, setYear] = useState<number>(NOW.getFullYear());
  const [month, setMonth] = useState<number>(NOW.getMonth() + 1);
  const [day, setDay] = useState<number>(NOW.getDate());
  const [hourIndex, setHourIndex] = useState<number>(6);
  const [synastry, setSynastry] = useState<{ a: Profile; b: Profile } | null>(null);

  const engine = useMemo(() => new ZiweiEngine(preset), [preset]);

  const features = useMemo(() => (chart ? engine.features(chart) : null), [engine, chart]);
  // 运限快照按盘上配置推算(可复现)。
  // 大限/流年取年中(年语义稳定);流月/流日/流时用具体日期,流时另传时辰序。
  const horoscope = useMemo(() => {
    if (!chart || mode === 'origin') return null;
    const safeDay = Math.min(day, new Date(year, month, 0).getDate());
    const target =
      mode === 'monthly' || mode === 'daily' || mode === 'hourly'
        ? `${year}-${month}-${safeDay} 12:00`
        : `${year}-6-15 12:00`;
    return engine.horoscope(chart, target, mode === 'hourly' ? hourIndex : undefined);
  }, [engine, chart, mode, year, month, day, hourIndex]);

  const synastryCharts = useMemo(() => {
    if (!synastry) return null;
    return {
      a: engine.fromBirth(synastry.a.input),
      b: engine.fromBirth(synastry.b.input),
    };
  }, [engine, synastry]);

  const handleSubmit = (input: BirthInput) => {
    setChart(engine.fromBirth(input));
    setLastInput(input);
    setSelected(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          紫微斗数工作台<span className="tagline">确定性排盘 · 可溯源解读</span>
        </h1>
        <span className="kernel-tag">
          {chart ? `${chart.meta.school.preset} · ${chart.meta.kernel}` : 'IMPF-AI 医哲未来人工智能研究院'}
        </span>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <ChartForm preset={preset} onPresetChange={setPreset} onSubmit={handleSubmit} />
          <ProfilesPanel currentInput={lastInput} onLoad={handleSubmit} onSynastry={(a, b) => setSynastry({ a, b })} />
          {chart && features && <AIPanel chart={chart} />}
        </aside>
        <main className="board-area">
          {chart && features ? (
            <>
              <TimeNav
                mode={mode}
                year={year}
                month={month}
                day={day}
                hourIndex={hourIndex}
                horoscope={horoscope}
                chart={chart}
                onModeChange={setMode}
                onYearChange={setYear}
                onMonthChange={setMonth}
                onDayChange={setDay}
                onHourChange={setHourIndex}
              />
              <ChartBoard
                chart={chart}
                features={features}
                selected={selected}
                onSelect={(i) => setSelected((cur) => (cur === i ? null : i))}
                mode={mode}
                horoscope={horoscope}
              />
              <BrightnessLegend />
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-glyph">☯</div>
              <p>输入出生信息开始排盘</p>
              <p className="hint">全国城市真太阳时 · 全书/中州双流派 · 大限至流时六级下钻 · 本地档案与合盘</p>
            </div>
          )}
          {synastry && synastryCharts && (
            <SynastryPanel
              nameA={synastry.a.name}
              nameB={synastry.b.name}
              chartA={synastryCharts.a}
              chartB={synastryCharts.b}
              onClose={() => setSynastry(null)}
            />
          )}
        </main>
      </div>
      <footer className="app-footer">
        <span className="footer-brand">
          医哲未来人工智能研究院<small>IMPF-AI · Institute of Medical-Philosophy Future AI</small>
        </span>
        <span className="footer-note">命理内容仅供文化研究与自我认知参考,不构成医疗/投资/重大决策建议</span>
      </footer>
    </div>
  );
}
