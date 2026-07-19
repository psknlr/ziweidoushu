import { useMemo, useState } from 'react';
import { ZiweiEngine, type Astrolabe, type BirthInput } from '@ziwei/core';
import { ChartForm } from './components/ChartForm.js';
import { ChartBoard } from './components/ChartBoard.js';
import { TimeNav, type HoroscopeMode } from './components/TimeNav.js';
import { AIPanel } from './components/AIPanel.js';

const CURRENT_YEAR = new Date().getFullYear();

export function App() {
  const [preset, setPreset] = useState<string>('wenmo-zhongzhou');
  const [chart, setChart] = useState<Astrolabe | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [mode, setMode] = useState<HoroscopeMode>('origin');
  const [year, setYear] = useState<number>(CURRENT_YEAR);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [day, setDay] = useState<number>(new Date().getDate());

  const engine = useMemo(() => new ZiweiEngine(preset), [preset]);

  const features = useMemo(() => (chart ? engine.features(chart) : null), [engine, chart]);
  // 运限快照按盘上配置推算(可复现)。
  // 大限/流年以年中为目标日(年语义稳定);流月/流日用具体日期(日截断到当月天数)。
  const horoscope = useMemo(() => {
    if (!chart || mode === 'origin') return null;
    const target =
      mode === 'monthly' || mode === 'daily'
        ? `${year}-${month}-${Math.min(day, new Date(year, month, 0).getDate())} 12:00`
        : `${year}-6-15 12:00`;
    return engine.horoscope(chart, target);
  }, [engine, chart, mode, year, month, day]);

  const handleSubmit = (input: BirthInput) => {
    setChart(engine.fromBirth(input));
    setSelected(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>
          紫微斗数工作台 <span className="tagline">确定性排盘 · 可溯源解读</span>
        </h1>
        <span className="kernel-tag">{chart ? `${chart.meta.school.preset} · ${chart.meta.kernel}` : ''}</span>
      </header>
      <div className="layout">
        <aside className="sidebar">
          <ChartForm preset={preset} onPresetChange={setPreset} onSubmit={handleSubmit} />
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
                horoscope={horoscope}
                chart={chart}
                onModeChange={setMode}
                onYearChange={setYear}
                onMonthChange={setMonth}
                onDayChange={setDay}
              />
              <ChartBoard
                chart={chart}
                features={features}
                selected={selected}
                onSelect={(i) => setSelected((cur) => (cur === i ? null : i))}
                mode={mode}
                horoscope={horoscope}
              />
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-glyph">☯</div>
              <p>输入出生信息开始排盘</p>
              <p className="hint">支持真太阳时校正 · 全书/中州双流派 · 点击宫位联动三方四正</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
