import { useCallback, useMemo, useState } from 'react';
import { ZiweiEngine, type Astrolabe, type BirthInput } from '@ziwei/core';
import { MAX_GROUP_MEMBERS } from '@ziwei/knowledge';
import { ChartForm } from './components/ChartForm.js';
import { BrightnessLegend, ChartBoard } from './components/ChartBoard.js';
import { BaZiBoard } from './components/BaZiBoard.js';
import { AstroBoard } from './components/AstroBoard.js';
import { TimeNav, type HoroscopeMode } from './components/TimeNav.js';
import { AIPanel } from './components/AIPanel.js';
import { loadChannel, saveChannel, type Channel } from './lib/ai-channel.js';
import { ProfilesPanel } from './components/ProfilesPanel.js';
import { SynastryPanel } from './components/SynastryPanel.js';
import { SettingsView } from './components/SettingsView.js';
import { UnlockDialog } from './components/UnlockDialog.js';
import { Logo } from './components/Logo.js';
import { consumeUsage, isUnlocked, remainingToday } from './lib/usage-limit.js';
import { loadProfiles, type Profile } from './lib/profiles.js';

const NOW = new Date();

type View = 'profile' | 'chart' | 'agent' | 'settings';
type BoardView = 'ziwei' | 'bazi' | 'astro';

const NAV_ITEMS: { id: View; label: string; glyph: string }[] = [
  { id: 'profile', label: '档案', glyph: '档' },
  { id: 'chart', label: '星盘', glyph: '盘' },
  { id: 'agent', label: '智能体', glyph: '智' },
  { id: 'settings', label: '设置', glyph: '设' },
];
const BOARD_ITEMS: { id: BoardView; label: string }[] = [
  { id: 'ziwei', label: '紫微盘' },
  { id: 'bazi', label: '八字盘' },
  { id: 'astro', label: '星座盘' },
];

export function App() {
  const [view, setView] = useState<View>('profile');
  const [preset, setPreset] = useState<string>('wenmo-zhongzhou');
  const [channel, setChannel] = useState<Channel>(() => loadChannel());
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
  const [boardView, setBoardView] = useState<BoardView>('ziwei');
  // 档案与人物组合选择:档案页与智能体页共用(点选任意组合)
  const [profiles, setProfiles] = useState<Profile[]>(() => loadProfiles());
  const [groupIds, setGroupIds] = useState<string[]>([]);
  const [includeCurrent, setIncludeCurrent] = useState(true);

  const engine = useMemo(() => new ZiweiEngine(preset), [preset]);
  const features = useMemo(() => (chart ? engine.features(chart) : null), [engine, chart]);
  const bazi = useMemo(() => (chart ? engine.bazi(chart) : null), [engine, chart]);
  const astro = useMemo(() => (chart ? engine.astro(chart) : null), [engine, chart]);
  // 运限目标时刻:大限/流年取该年 12-31(虚岁按「当年所达之岁」计,生日分界流派下不受生日前后影响,
  // 且 12-31 必在该流年之内);流月/流日/流时取具体日期
  const horoscopeTarget = useMemo(() => {
    const safeDay = Math.min(day, new Date(year, month, 0).getDate());
    return mode === 'monthly' || mode === 'daily' || mode === 'hourly'
      ? `${year}-${month}-${safeDay} 12:00`
      : `${year}-12-31 12:00`;
  }, [mode, year, month, day]);
  /** 任意一张盘在当前运限设置下的快照(群盘各成员共用同一目标时刻) */
  const horoscopeFor = useCallback(
    (c: Astrolabe) => (mode === 'origin' ? null : engine.horoscope(c, horoscopeTarget, mode === 'hourly' ? hourIndex : undefined)),
    [engine, mode, horoscopeTarget, hourIndex],
  );
  const horoscope = useMemo(() => (chart ? horoscopeFor(chart) : null), [chart, horoscopeFor]);

  const synastryCharts = useMemo(() => {
    if (!synastry) return null;
    return { a: engine.fromBirth(synastry.a.input), b: engine.fromBirth(synastry.b.input) };
  }, [engine, synastry]);

  /** 打开一张盘(不计防沉迷次数:档案重开/合盘属回看) */
  const openChart = (input: BirthInput) => {
    setChart(engine.fromBirth(input));
    setLastInput(input);
    setSelected(null);
    setView('chart');
  };

  /** 新排盘:计入每日次数 */
  const handleSubmit = (input: BirthInput) => {
    if (!consumeUsage()) {
      setLimitOpen(true);
      return;
    }
    setUsageTick((t) => t + 1);
    openChart(input);
  };
  void usageTick;

  const toggleGroupId = (id: string) =>
    setGroupIds((ids) => (ids.includes(id) ? ids.filter((x) => x !== id) : ids.length >= MAX_GROUP_MEMBERS ? ids : [...ids, id]));

  /** 档案页「→ 智能体」:没有当前盘时以组合中第一位为当前盘 */
  const enterGroupAgent = () => {
    if (!chart) {
      const first = groupIds.map((id) => profiles.find((p) => p.id === id)).find((p): p is Profile => !!p);
      if (first) {
        setChart(engine.fromBirth(first.input));
        setLastInput(first.input);
        setSelected(null);
      }
    }
    setView('agent');
  };

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
              profiles={profiles}
              onProfilesChange={setProfiles}
              currentInput={lastInput}
              onLoad={openChart}
              selectedIds={groupIds}
              onToggleSelect={toggleGroupId}
              onClearSelect={() => setGroupIds([])}
              onSynastry={(a, b) => {
                setSynastry({ a, b });
                if (!chart) openChart(a.input);
                else setView('chart');
              }}
              onGroup={enterGroupAgent}
              maxGroup={MAX_GROUP_MEMBERS}
            />
          </div>
        )}

        {view === 'chart' &&
          (chart && features ? (
            <div className="view-stack">
              <div className="seg" role="tablist">
                {BOARD_ITEMS.map((b) => (
                  <button key={b.id} type="button" role="tab" aria-selected={boardView === b.id} className={boardView === b.id ? 'seg-btn active' : 'seg-btn'} onClick={() => setBoardView(b.id)}>
                    {b.label}
                  </button>
                ))}
              </div>
              {boardView === 'bazi' && bazi ? (
                <BaZiBoard bazi={bazi} year={year} onYearChange={setYear} />
              ) : boardView === 'astro' && astro ? (
                <AstroBoard astro={astro} year={year} onYearChange={setYear} />
              ) : (
                <>
                  <TimeNav
                    mode={mode} year={year} month={month} day={day} hourIndex={hourIndex}
                    horoscope={horoscope} chart={chart}
                    onModeChange={setMode} onYearChange={setYear} onMonthChange={setMonth}
                    onDayChange={setDay} onHourChange={setHourIndex}
                  />
                  <ChartBoard
                    chart={chart} features={features} selected={selected}
                    onSelect={(i) => setSelected((cur) => (cur === i ? null : i))}
                    mode={mode} horoscope={horoscope} bazi={bazi}
                  />
                  <BrightnessLegend />
                </>
              )}
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
            <AIPanel
              engine={engine} chart={chart} bazi={bazi} astro={astro} channel={channel} lastInput={lastInput}
              profiles={profiles} groupIds={groupIds} onGroupIdsChange={setGroupIds}
              includeCurrent={includeCurrent} onIncludeCurrentChange={setIncludeCurrent}
              horoscope={horoscope} horoscopeFor={horoscopeFor}
              mode={mode} onModeChange={setMode}
              year={year} month={month} day={day} hourIndex={hourIndex}
              onYearChange={setYear} onMonthChange={setMonth} onDayChange={setDay} onHourChange={setHourIndex}
            />
          ) : (
            needChart('智能体需要一张命盘')
          ))}

        {view === 'settings' && (
          <SettingsView
            preset={preset}
            onPresetChange={setPreset}
            channel={channel}
            onChannelChange={(c) => {
              setChannel(c);
              saveChannel(c);
            }}
          />
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
