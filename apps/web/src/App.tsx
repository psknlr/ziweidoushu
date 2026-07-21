import { useMemo, useState } from 'react';
import { ZiweiEngine, type Astrolabe, type BirthInput } from '@ziwei/core';
import { ChartForm } from './components/ChartForm.js';
import { BrightnessLegend, ChartBoard } from './components/ChartBoard.js';
import { TimeNav, type HoroscopeMode } from './components/TimeNav.js';
import { AIPanel, type Channel } from './components/AIPanel.js';
import { ProfilesPanel } from './components/ProfilesPanel.js';
import { SynastryPanel } from './components/SynastryPanel.js';
import { SettingsView } from './components/SettingsView.js';
import { UnlockDialog } from './components/UnlockDialog.js';
import { Logo } from './components/Logo.js';
import { consumeUsage, isUnlocked, remainingToday } from './lib/usage-limit.js';
import type { Profile } from './lib/profiles.js';

const NOW = new Date();

type View = 'profile' | 'chart' | 'agent' | 'settings';

const NAV_ITEMS: { id: View; label: string; glyph: string }[] = [
  { id: 'profile', label: '档案', glyph: '档' },
  { id: 'chart', label: '星盘', glyph: '盘' },
  { id: 'agent', label: '智能体', glyph: '智' },
  { id: 'settings', label: '设置', glyph: '设' },
];

export function App() {
  const [view, setView] = useState<View>('profile');
  const [preset, setPreset] = useState<string>('wenmo-zhongzhou');
  const [channel, setChannel] = useState<Channel>('gateway');
  const [chart, setChart] = useState<Astrolabe | null>(null);
  const [lastInput, setLastInput] = useState<BirthInput | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [mode, setMode] = useState<HoroscopeMode>('origin');
  const [year, setYear] = useState<number>(NOW.getFullYear());
  const [month, setMonth] = useState<number>(NOW.getMonth() + 1);
  const [day, setDay] = useState<number>(NOW.getDate());
  const [hourIndex, setHourIndex] = useState<number>(6);
  const [synastry, setSynastry] = useState<{ a: Profile; b: Profile } | null>(null);
  const [limitOpen, setLimitOpen] = useState(false);
  const [usageTick, setUsageTick] = useState(0);

  const engine = useMemo(() => new ZiweiEngine(preset), [preset]);
  const features = useMemo(() => (chart ? engine.features(chart) : null), [engine, chart]);
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
    return { a: engine.fromBirth(synastry.a.input), b: engine.fromBirth(synastry.b.input) };
  }, [engine, synastry]);

  const handleSubmit = (input: BirthInput) => {
    if (!consumeUsage()) {
      setLimitOpen(true);
      return;
    }
    setUsageTick((t) => t + 1);
    setChart(engine.fromBirth(input));
    setLastInput(input);
    setSelected(null);
    setView('chart');
  };
  void usageTick;

  const needChart = (label: string) => (
    <div className="empty-state">
      <div className="empty-glyph">☯</div>
      <p>{label}</p>
      <p className="hint">先到「档案」页输入出生信息排盘</p>
    </div>
  );

  return (
    <div className="app">
      <header className="app-header">
        <div className="brand">
          <Logo size={38} />
          <div className="brand-text">
            <h1>紫微斗数工作台</h1>
            <span className="brand-sub">医哲未来人工智能研究院 · IMPF-AI</span>
          </div>
        </div>
        <nav className="nav-top">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={view === item.id ? 'nav-item active' : 'nav-item'}
              onClick={() => setView(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="view-area">
        {view === 'profile' && (
          <div className="view-stack">
            <ChartForm onSubmit={handleSubmit} remaining={isUnlocked() ? null : remainingToday()} />
            <ProfilesPanel
              currentInput={lastInput}
              onLoad={handleSubmit}
              onSynastry={(a, b) => {
                setSynastry({ a, b });
                setView('chart');
              }}
            />
          </div>
        )}

        {view === 'chart' &&
          (chart && features ? (
            <div className="view-stack">
              <TimeNav
                mode={mode} year={year} month={month} day={day} hourIndex={hourIndex}
                horoscope={horoscope} chart={chart}
                onModeChange={setMode} onYearChange={setYear} onMonthChange={setMonth}
                onDayChange={setDay} onHourChange={setHourIndex}
              />
              <ChartBoard
                chart={chart} features={features} selected={selected}
                onSelect={(i) => setSelected((cur) => (cur === i ? null : i))}
                mode={mode} horoscope={horoscope}
              />
              <BrightnessLegend />
              {synastry && synastryCharts && (
                <SynastryPanel
                  nameA={synastry.a.name} nameB={synastry.b.name}
                  chartA={synastryCharts.a} chartB={synastryCharts.b}
                  onClose={() => setSynastry(null)}
                />
              )}
            </div>
          ) : (
            needChart('尚未排盘')
          ))}

        {view === 'agent' &&
          (chart ? (
            <AIPanel chart={chart} channel={channel} horoscope={horoscope} mode={mode} onModeChange={setMode} />
          ) : (
            needChart('智能体需要一张命盘')
          ))}

        {view === 'settings' && (
          <SettingsView preset={preset} onPresetChange={setPreset} channel={channel} onChannelChange={setChannel} />
        )}
      </main>

      <nav className="nav-bottom">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={view === item.id ? 'nav-item active' : 'nav-item'}
            onClick={() => setView(item.id)}
          >
            <span className="nav-glyph">{item.glyph}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {limitOpen && (
        <UnlockDialog
          onClose={() => setLimitOpen(false)}
          onUnlocked={() => {
            setLimitOpen(false);
            setUsageTick((t) => t + 1);
          }}
        />
      )}
      <footer className="app-footer">
        <span className="footer-brand">
          医哲未来人工智能研究院<small>IMPF-AI · Institute of Medical-Philosophy Future AI</small>
        </span>
        <span className="footer-note">命理内容仅供文化研究与自我认知参考,不构成医疗/投资/重大决策建议</span>
      </footer>
    </div>
  );
}
