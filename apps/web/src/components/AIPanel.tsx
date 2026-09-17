/**
 * 智能体:多轮对话(可携带大限~流时运限上下文;可组合多份档案做群盘)
 * + 历史记录(按命盘/组合归档,本地存储)+ 对话/历史导出 + 命盘参数导出。
 * 推理型模型的思考过程折叠展示、正文按 Markdown 渲染(表格/列表/标题)。
 * 通道与 Key 在「设置」页配置;Prompt 由本地知识库装配,与网关同源同规则。
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  analyze, baziSignals, describeBaZi, exportChartData, zh,
  type Astrolabe, type BaZiChart, type BirthInput, type HoroscopeSnapshot, type ZiweiEngine,
} from '@ziwei/core';
import {
  ALL_ENTRIES, ALL_SKILLS, analyzeGroup, buildBaZiPrompt, buildGroupPrompt, buildSystemPrompt, describeChart,
  MAX_GROUP_MEMBERS, retrieveSignals, type GroupMember,
} from '@ziwei/knowledge';
import {
  loadDirectProviders,
  providerReady,
  streamDirect,
  streamGateway,
  type Channel,
  type ChatMessage,
  type StreamDelta,
} from '../lib/ai-channel.js';
import {
  ChatStore,
  conversationTitle,
  conversationToMarkdown,
  groupKey,
  historyFor,
  newConversation,
  type ChatTurn,
  type Conversation,
  type ConversationMember,
} from '../lib/chat-store.js';
import { copyText } from '../lib/clipboard.js';
import { saveTextFile } from '../lib/export-file.js';
import { horoscopeDigest } from '../lib/horoscope-text.js';
import { Markdown } from '../lib/markdown.js';
import { loadProfiles, type Profile } from '../lib/profiles.js';
import type { HoroscopeMode } from './TimeNav.js';

export type { Channel } from '../lib/ai-channel.js';

interface Props {
  engine: ZiweiEngine;
  chart: Astrolabe;
  bazi: BaZiChart | null;
  /** 当前盘的出生输入(用于识别其档案名) */
  lastInput: BirthInput | null;
  /** 当前关注的流年(与星盘页共享) */
  year: number;
  channel: Channel;
  horoscope: HoroscopeSnapshot | null;
  mode: HoroscopeMode;
  onModeChange: (mode: HoroscopeMode) => void;
}

type SystemMode = 'ziwei' | 'bazi' | 'both';
const SYSTEM_OPTIONS: { id: SystemMode; label: string }[] = [
  { id: 'ziwei', label: '紫微斗数' },
  { id: 'bazi', label: '八字(四柱)' },
  { id: 'both', label: '紫微 + 八字互参' },
];

const SKILL_OPTIONS: { id: string; label: string }[] = [
  { id: '', label: '通用解读' },
  { id: 'bazi', label: '八字命理' }, { id: 'bazi-dayun', label: '八字大运流年' },
  { id: 'overall', label: '整体命格' }, { id: 'marriage', label: '姻缘婚恋' },
  { id: 'career', label: '事业官禄' }, { id: 'business', label: '生意财运' },
  { id: 'wealth', label: '财帛理财' }, { id: 'education', label: '学业考运' },
  { id: 'health', label: '健康养生' }, { id: 'children', label: '子女亲缘' },
  { id: 'parents', label: '父母孝亲' }, { id: 'siblings', label: '兄弟手足' },
  { id: 'friends', label: '人际贵人' }, { id: 'relocation', label: '迁移发展' },
  { id: 'spirit', label: '福德精神' }, { id: 'decadal', label: '大限十年' },
  { id: 'annual', label: '流年吉凶' },
];

const MODE_OPTIONS: { id: HoroscopeMode; label: string }[] = [
  { id: 'origin', label: '本命' }, { id: 'decadal', label: '大限' }, { id: 'yearly', label: '流年' },
  { id: 'monthly', label: '流月' }, { id: 'daily', label: '流日' }, { id: 'hourly', label: '流时' },
];
const modeLabel = (id?: string) => MODE_OPTIONS.find((m) => m.id === id)?.label ?? '';

const today = () => new Date().toISOString().slice(0, 10);

const sameInput = (a: BirthInput, b: BirthInput) =>
  a.year === b.year && a.month === b.month && a.day === b.day && a.hour === b.hour &&
  (a.minute ?? 0) === (b.minute ?? 0) && a.gender === b.gender && (a.city ?? '') === (b.city ?? '');

/** 思考过程折叠块:流式时展开并显示动态省略号,正文开始后自动收起一次 */
function ThinkingBlock({ reasoning, streaming, hasText }: { reasoning: string; streaming: boolean; hasText: boolean }) {
  const [open, setOpen] = useState(streaming && !hasText);
  const collapsedRef = useRef(false);
  useEffect(() => {
    if (hasText && !collapsedRef.current) {
      collapsedRef.current = true;
      setOpen(false);
    }
  }, [hasText]);
  const thinking = streaming && !hasText;
  return (
    <details className="think" open={open} onToggle={(e) => setOpen((e.target as HTMLDetailsElement).open)}>
      <summary className="think-summary">
        {thinking ? <span>思考中<span className="think-dots" /></span> : <span>思考过程</span>}
        <small>{reasoning.length} 字</small>
      </summary>
      <div className="think-body">{reasoning}</div>
    </details>
  );
}

export function AIPanel({ engine, chart, bazi, lastInput, year, channel, horoscope, mode, onModeChange }: Props) {
  const store = useMemo(() => new ChatStore(), []);
  const [system, setSystem] = useState<SystemMode>('ziwei');
  const chartHash = chart.meta.chartHash;

  // ---- 群盘成员(档案组合) ----
  const [profiles, setProfiles] = useState<Profile[]>(() => loadProfiles());
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const primaryProfile = lastInput ? profiles.find((p) => sameInput(p.input, lastInput)) : undefined;
  const primaryLabel = primaryProfile?.name ?? '当前盘';
  const chartLabel = `${zh(chart.gender)}命 ${chart.solarDate}`;
  const memberCharts = useMemo(
    () =>
      memberIds
        .map((id) => profiles.find((p) => p.id === id))
        .filter((p): p is Profile => !!p)
        .map((p) => ({ profile: p, chart: engine.fromBirth(p.input) }))
        .filter((m) => m.chart.meta.chartHash !== chartHash),
    [memberIds, profiles, engine, chartHash],
  );
  const isGroup = memberCharts.length > 0;
  const convKey = groupKey(chartHash, memberCharts.map((m) => m.chart.meta.chartHash));
  const convLabel = isGroup ? [primaryLabel, ...memberCharts.map((m) => m.profile.name)].join(' × ') : chartLabel;
  const convMembers: ConversationMember[] | undefined = isGroup
    ? [
        { id: primaryProfile?.id ?? 'current', name: primaryLabel, chartHash },
        ...memberCharts.map((m) => ({ id: m.profile.id, name: m.profile.name, chartHash: m.chart.meta.chartHash })),
      ]
    : undefined;
  const addable = profiles.filter(
    (p) => !memberIds.includes(p.id) && p.id !== primaryProfile?.id && (!lastInput || !sameInput(p.input, lastInput)),
  );

  const [conv, setConvState] = useState<Conversation | null>(null);
  const convRef = useRef<Conversation | null>(null);
  const setConv = (next: Conversation | null) => {
    convRef.current = next;
    setConvState(next);
  };
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyAll, setHistoryAll] = useState(false);
  const [historyTick, setHistoryTick] = useState(0);
  const [skillId, setSkillId] = useState('');
  const [question, setQuestion] = useState('');
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const logRef = useRef<HTMLDivElement>(null);

  // 换盘/换组合 → 当前对话归零(仍可在「历史」中打开)
  useEffect(() => {
    if (convRef.current && convRef.current.chartHash !== convKey) setConv(null);
  }, [convKey]);

  // 流式输出时贴底
  const last = conv ? conv.turns[conv.turns.length - 1] : undefined;
  const lastLen = (last?.content.length ?? 0) + (last?.reasoning?.length ?? 0);
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conv?.turns.length, lastLen]);

  const skill = skillId ? ALL_SKILLS[skillId] : undefined;
  const features = useMemo(() => analyze(chart), [chart]);
  const history = useMemo(
    () => store.list(historyAll ? undefined : convKey),
    // historyTick / conv.updatedAt 变化时刷新列表
    [store, historyAll, convKey, historyTick, conv?.updatedAt],
  );

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2800);
  };

  const patchTurn = (index: number, fn: (t: ChatTurn) => ChatTurn) => {
    const cur = convRef.current;
    if (!cur) return;
    const turns = cur.turns.slice();
    const t = turns[index];
    if (!t) return;
    turns[index] = fn(t);
    setConv({ ...cur, turns, updatedAt: new Date().toISOString() });
  };

  /** 群盘成员(含主盘)与八字 */
  const groupMembers = (withBazi: boolean): GroupMember[] => [
    { label: primaryLabel, chart, features, ...(withBazi && bazi ? { bazi } : {}) },
    ...memberCharts.map((m) => ({
      label: m.profile.name,
      chart: m.chart,
      ...(withBazi ? { bazi: engine.bazi(m.chart) } : {}),
    })),
  ];

  const send = async () => {
    if (busy) return;
    const skillLabel = SKILL_OPTIONS.find((s) => s.id === skillId)?.label ?? '通用解读';
    const useBazi = system !== 'ziwei' && bazi !== null;
    const sys: SystemMode = useBazi ? system : 'ziwei';
    const q =
      question.trim() ||
      (isGroup
        ? `请依照输出结构,为 ${convLabel} 这组人物做${skillId ? skillLabel : '群盘解读'}。`
        : `请依照输出结构,为这张${sys === 'bazi' ? '八字' : sys === 'both' ? '紫微与八字' : '命盘'}做${skillId ? skillLabel : '解读'}。`);
    // 紫微运限上下文只在含紫微的单盘体系下附带;八字流年由 year 参数在 Prompt 内定位
    const context = !isGroup && sys !== 'bazi' && horoscope && mode !== 'origin' ? horoscopeDigest(chart, horoscope, mode) : '';
    const sent = context ? `${q}\n\n${context}` : q;

    const controller = new AbortController();
    abortRef.current = controller;
    const providers = loadDirectProviders();
    const targets: { label: string; run: (hist: ChatMessage[]) => AsyncGenerator<StreamDelta> }[] = [];
    if (channel === 'gateway') {
      targets.push({
        label: '网关',
        run: (hist) =>
          streamGateway(
            {
              chart, skill: skillId || undefined, question: sent, history: hist, system: sys, year,
              ...(isGroup ? { label: primaryLabel, members: memberCharts.map((m) => ({ label: m.profile.name, chart: m.chart })) } : {}),
            },
            controller.signal,
          ),
      });
    } else {
      const picks = channel === 'compare' ? [0, 1] : channel === 'directA' ? [0] : [1];
      for (const i of picks) {
        const p = providers[i as 0 | 1];
        if (!providerReady(p)) {
          showToast(`请先到「设置」页为 ${p.label} 填写 API Key(Base URL 与模型已预置)`);
          return;
        }
        targets.push({
          label: p.label,
          run: (hist) => {
            let systemPrompt: string;
            if (isGroup) {
              const facts = analyzeGroup(groupMembers(sys !== 'ziwei'));
              const retrieved = retrieveSignals(facts.signals, ALL_ENTRIES, { topics: skill?.topics, limit: 12 });
              systemPrompt = buildGroupPrompt(facts, retrieved, { skill, withBazi: sys !== 'ziwei', year });
            } else {
              const signals =
                sys === 'bazi' ? baziSignals(bazi!) : sys === 'both' ? [...features.signals, ...baziSignals(bazi!)] : features.signals;
              const retrieved = retrieveSignals(signals, ALL_ENTRIES, { topics: skill?.topics, limit: sys === 'both' ? 12 : 8 });
              systemPrompt =
                sys === 'bazi'
                  ? buildBaZiPrompt(bazi!, retrieved, { skill, year })
                  : buildSystemPrompt(chart, features, retrieved, { skill, ...(sys === 'both' ? { bazi: bazi!, year } : {}) });
            }
            return streamDirect(p, [{ role: 'system', content: systemPrompt }, ...hist, { role: 'user', content: sent }], controller.signal);
          },
        });
      }
    }

    const now = new Date().toISOString();
    const base = convRef.current ?? newConversation(convKey, convLabel, new Date(), convMembers);
    const userTurn: ChatTurn = {
      role: 'user', content: q, at: now,
      ...(context ? { context } : {}), ...(skillId ? { skill: skillId } : {}), mode, system: sys,
    };
    const startIndex = base.turns.length + 1;
    const next: Conversation = {
      ...base,
      title: base.title || conversationTitle(question, isGroup ? `${convLabel} 群盘` : skillLabel),
      turns: [...base.turns, userTurn, ...targets.map((t): ChatTurn => ({ role: 'assistant', content: '', at: now, label: t.label }))],
      updatedAt: now,
    };
    setConv(next);
    store.save(next);
    setQuestion('');
    setBusy(true);

    await Promise.all(
      targets.map(async (t, i) => {
        const idx = startIndex + i;
        try {
          for await (const d of t.run(historyFor(base, t.label))) {
            if (d.reasoning) patchTurn(idx, (turn) => ({ ...turn, reasoning: (turn.reasoning ?? '') + d.reasoning }));
            if (d.text) patchTurn(idx, (turn) => ({ ...turn, content: turn.content + d.text }));
          }
        } catch (error) {
          if ((error as Error).name === 'AbortError') {
            patchTurn(idx, (turn) => (turn.content ? turn : { ...turn, content: '(已停止)', error: true }));
            return;
          }
          patchTurn(idx, (turn) => ({ ...turn, content: String(error), error: true }));
        }
      }),
    );
    setBusy(false);
    if (convRef.current) store.save(convRef.current);
    setHistoryTick((n) => n + 1);
  };

  const stop = () => abortRef.current?.abort();

  const newChat = () => {
    stop();
    setConv(null);
  };

  const openConv = (c: Conversation) => {
    stop();
    // 恢复群盘成员选择(档案仍在时)
    if (c.members?.length) {
      const ids = c.members.filter((m) => m.id !== 'current' && m.chartHash !== chartHash).map((m) => m.id);
      setMemberIds(ids.filter((id) => profiles.some((p) => p.id === id)));
    } else {
      setMemberIds([]);
    }
    setConv(c);
    setHistoryOpen(false);
  };

  const deleteConv = (id: string) => {
    store.remove(id);
    if (convRef.current?.id === id) setConv(null);
    setHistoryTick((n) => n + 1);
  };

  const clearHistory = () => {
    const scopeText = historyAll ? '全部' : isGroup ? '当前组合的' : '当前命盘的';
    if (!window.confirm(`确定清空${scopeText}对话历史?此操作不可恢复。`)) return;
    store.clear(historyAll ? undefined : convKey);
    if (!historyAll ? convRef.current?.chartHash === convKey : true) setConv(null);
    setHistoryTick((n) => n + 1);
  };

  const saveWithFeedback = async (name: string, text: string, mime: string) => {
    const result = await saveTextFile(name, text, mime);
    if (result === 'shared') showToast('已打开系统分享,可选「保存到文件」或发送到云盘');
    else if (result === 'downloaded') showToast(`已保存:${name}`);
    else {
      const ok = await copyText(text);
      showToast(ok ? '设备不支持直接保存,已复制到剪贴板' : '保存失败');
    }
  };

  const exportConv = () => {
    if (!conv) return;
    void saveWithFeedback(`ziwei-chat-${today()}.md`, conversationToMarkdown(conv), 'text/markdown');
  };
  const exportAll = () => {
    void saveWithFeedback(`ziwei-chat-history-${today()}.json`, store.exportJson(historyAll ? undefined : convKey), 'application/json');
  };
  const copyConv = async () => {
    if (!conv) return;
    const ok = await copyText(conversationToMarkdown(conv));
    showToast(ok ? '已复制本次对话(Markdown)' : '复制失败');
  };
  const copyOne = async (text: string) => {
    const ok = await copyText(text);
    showToast(ok ? '已复制' : '复制失败');
  };

  const addMember = (id: string) => {
    if (!id) return;
    if (memberIds.length >= MAX_GROUP_MEMBERS - 1) {
      showToast(`最多 ${MAX_GROUP_MEMBERS} 人(含当前盘)`);
      return;
    }
    setMemberIds((ids) => [...ids, id]);
  };
  const removeMember = (id: string) => setMemberIds((ids) => ids.filter((x) => x !== id));

  // ---- 命盘参数导出 ----
  const exportJson = useMemo(
    () =>
      JSON.stringify(
        {
          ...exportChartData(chart, features, undefined, bazi ?? undefined),
          ...(isGroup
            ? {
                group: {
                  primary: primaryLabel,
                  members: memberCharts.map((m) => ({
                    name: m.profile.name,
                    ...exportChartData(m.chart, analyze(m.chart), undefined, engine.bazi(m.chart)),
                  })),
                },
              }
            : {}),
        },
        null,
        2,
      ),
    [chart, features, bazi, isGroup, primaryLabel, memberCharts, engine],
  );
  const exportDigest = useMemo(() => {
    const lines = [
      `【紫微斗数命盘 · IMPF-AI】${isGroup ? `${primaryLabel}:` : ''}${zh(chart.gender)}命 ${chart.solarDate}(${chart.lunarDate})`,
      `五行局:${zh(chart.fiveElementsClass)} 命主:${zh(chart.soul)} 身主:${zh(chart.body)}`,
      ...chart.palaces.map((p) => {
        const stars = [...p.majorStars, ...p.minorStars]
          .map((s) => `${zh(s.key)}${s.brightness ? `(${zh(s.brightness)})` : ''}${s.mutagen ? `化${zh(s.mutagen)}` : ''}`)
          .join(' ');
        return `${zh(p.branch)}·${zh(p.name)}${p.isBodyPalace ? '(身)' : ''}:${stars || (p.borrowed ? `借${p.borrowed.stars.map((s) => zh(s.key)).join('/')}` : '空')} | 限${p.decadal.range[0]}-${p.decadal.range[1]}`;
      }),
      `格局:${features.patterns.map((p) => p.name + (p.brokenBy.length > 0 ? '(破)' : '')).join('、') || '无'}`,
    ];
    if (horoscope && mode !== 'origin') lines.push(horoscopeDigest(chart, horoscope, mode));
    if (bazi) lines.push('', describeBaZi(bazi, year));
    if (isGroup) {
      const facts = analyzeGroup(groupMembers(false));
      for (const m of memberCharts) {
        lines.push('', `【${m.profile.name}】`, describeChart(m.chart, analyze(m.chart)));
      }
      lines.push('', '【两两关系】');
      for (const p of facts.pairs) lines.push(`${p.a} × ${p.b}:`, ...p.features.notes.map((n) => `  - ${n}`));
    }
    return lines.join('\n');
    // groupMembers 依赖的值均在依赖列表中
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chart, features, horoscope, mode, bazi, year, isGroup, primaryLabel, memberCharts]);

  const channelText =
    channel === 'gateway' ? '网关' : channel === 'compare' ? '双模型对比' : `直连 · ${loadDirectProviders()[channel === 'directA' ? 0 : 1].label}`;

  return (
    <div className="view-stack">
      <div className="panel ai-panel">
        <h2>智能体对话</h2>

        <div className="chat-toolbar">
          <button type="button" className="chip-btn" onClick={newChat}>新对话</button>
          <button type="button" className={historyOpen ? 'chip-btn active' : 'chip-btn'} onClick={() => setHistoryOpen((v) => !v)}>
            历史({history.length})
          </button>
          <span className="chat-title">{conv?.title || `${convLabel} · ${channelText}`}</span>
          <button type="button" className="chip-btn" onClick={exportConv} disabled={!conv}>导出本次</button>
          <button type="button" className="chip-btn" onClick={() => void copyConv()} disabled={!conv}>复制本次</button>
        </div>

        <div className="members-row">
          <span className="members-label">人物</span>
          <span className="member-chip primary" title={chartLabel}>
            {primaryLabel}<small>{chart.solarDate}</small>
          </span>
          {memberCharts.map((m) => (
            <span key={m.profile.id} className="member-chip" title={`${m.chart.solarDate} ${zh(m.chart.gender)}`}>
              {m.profile.name}<small>{m.chart.solarDate}</small>
              <button type="button" onClick={() => removeMember(m.profile.id)} aria-label="移除" disabled={busy}>✕</button>
            </span>
          ))}
          {addable.length > 0 && memberIds.length < MAX_GROUP_MEMBERS - 1 && (
            <select
              className="members-add"
              value=""
              disabled={busy}
              onChange={(e) => addMember(e.target.value)}
              onFocus={() => setProfiles(loadProfiles())}
            >
              <option value="">+ 加入档案(群盘)</option>
              {addable.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} · {p.input.year}-{p.input.month}-{p.input.day}
                </option>
              ))}
            </select>
          )}
          {profiles.length === 0 && <span className="hint">到「档案」页保存人物后,可在此组合多人群盘</span>}
        </div>

        {historyOpen && (
          <div className="history-panel">
            <div className="history-head">
              <span>对话历史 · 仅存本机</span>
              <button type="button" className={historyAll ? 'chip-btn' : 'chip-btn active'} onClick={() => setHistoryAll(false)}>
                {isGroup ? '当前组合' : '当前盘'}
              </button>
              <button type="button" className={historyAll ? 'chip-btn active' : 'chip-btn'} onClick={() => setHistoryAll(true)}>全部</button>
            </div>
            {history.length === 0 ? (
              <p className="hint">暂无记录。发起提问后,对话会自动保存在这里。</p>
            ) : (
              <div className="history-list">
                {history.map((c) => (
                  <div key={c.id} className={conv?.id === c.id ? 'history-item active' : 'history-item'}>
                    <span className="h-title" title={c.title}>{c.title || '(无标题)'}</span>
                    <span className="h-meta">
                      {historyAll ? `${c.chartLabel} · ` : ''}{c.updatedAt.slice(5, 16).replace('T', ' ')} · {c.turns.length}轮
                    </span>
                    <button type="button" className="chip-btn" onClick={() => openConv(c)}>打开</button>
                    <button type="button" className="chip-btn danger" onClick={() => deleteConv(c.id)}>删除</button>
                  </div>
                ))}
              </div>
            )}
            <div className="history-foot">
              <button type="button" className="chip-btn" onClick={exportAll} disabled={history.length === 0}>
                导出{historyAll ? '全部' : '本盘'}历史(JSON)
              </button>
              <button type="button" className="chip-btn danger" onClick={clearHistory} disabled={history.length === 0}>
                清空{historyAll ? '全部' : '本盘'}历史
              </button>
            </div>
          </div>
        )}

        <div className="chat-log" ref={logRef}>
          {!conv || conv.turns.length === 0 ? (
            <div className="chat-empty">
              {isGroup ? (
                <>基于 {convLabel} 的群盘开始多轮对话。<br />逐人定位 → 两两关系矩阵 → 群体动力 → 经营建议;追问会自动带上前文。</>
              ) : (
                <>基于这张命盘开始多轮对话。<br />可选技法聚焦主题,选择运限上下文让 AI 结合流年/流月/流日/流时四化作答;追问会自动带上前文。</>
              )}
            </div>
          ) : (
            conv.turns.map((t, i) => {
              const streaming = busy && i >= conv.turns.length - (conv.turns.filter((x) => x.role === 'assistant' && x.at === last?.at).length);
              return (
                <div key={i} className={`msg ${t.role}${t.error ? ' error' : ''}`}>
                  <div className="msg-meta">
                    {t.role === 'user' ? '问' : `答 · ${t.label ?? ''}`} · {t.at.slice(11, 16)}
                    {t.role === 'user' && t.system && t.system !== 'ziwei' ? ` · ${t.system === 'bazi' ? '八字' : '紫微+八字'}` : ''}
                    {t.role === 'user' && t.mode && t.mode !== 'origin' && t.system !== 'bazi' && t.context ? ` · 携${modeLabel(t.mode)}上下文` : ''}
                    {t.role === 'user' && t.skill ? ` · ${SKILL_OPTIONS.find((s) => s.id === t.skill)?.label ?? ''}` : ''}
                  </div>
                  {t.role === 'assistant' && t.reasoning && (
                    <ThinkingBlock reasoning={t.reasoning} streaming={streaming && t.role === 'assistant'} hasText={t.content.length > 0} />
                  )}
                  {t.role === 'assistant' && !t.error ? (
                    <div className="msg-body">{t.content ? <Markdown text={t.content} /> : busy && !t.reasoning ? '…' : ''}</div>
                  ) : (
                    <div className="msg-body">{t.content || (busy ? '…' : '')}</div>
                  )}
                  {t.role === 'assistant' && t.content && !t.error && (
                    <div className="msg-actions">
                      <button type="button" className="chip-btn" onClick={() => void copyOne(t.content)}>复制</button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="chat-composer">
          <div className="row">
            <label>
              命理体系
              <select value={system} onChange={(e) => setSystem(e.target.value as SystemMode)}>
                {SYSTEM_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
            <label>
              技法
              <select value={skillId} onChange={(e) => setSkillId(e.target.value)}>
                {SKILL_OPTIONS.map((s) => (
                  <option key={s.id} value={s.id}>{s.label}</option>
                ))}
              </select>
            </label>
            <label>
              运限上下文
              <select value={mode} onChange={(e) => onModeChange(e.target.value as HoroscopeMode)} disabled={isGroup}>
                {MODE_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </label>
          </div>
          {isGroup && (
            <p className="hint">群盘模式:{convLabel}。Prompt 含逐人结构化事实与两两关系矩阵{system !== 'ziwei' ? '(附各人八字)' : ''};运限上下文在群盘下不附带。</p>
          )}
          {!isGroup && system !== 'bazi' && mode !== 'origin' && horoscope && (
            <p className="hint">将随问题携带 {horoscope.solarDate} 的{modeLabel(mode)}四化上下文(在「星盘」页调整具体年月日时)。</p>
          )}
          {!isGroup && system !== 'ziwei' && bazi && (
            <p className="hint">八字事实(四柱十神、旺衰格局用神、大运)随 Prompt 注入,流年定位 {year} 年(在「星盘 › 八字盘」页点选大运/流年调整)。</p>
          )}
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={conv?.turns.length ? '继续追问…' : isGroup ? '想问这组人物什么?留空做完整群盘解读' : '想问什么?留空按所选技法做完整解读'}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void send();
            }}
          />
          <div className="chat-send-row">
            <button type="button" className="primary" onClick={() => void send()} disabled={busy}>
              {busy ? '生成中…' : conv?.turns.length ? '发送追问' : isGroup ? '生成群盘解读' : channel === 'compare' ? '双模型对比解读' : '生成解读'}
            </button>
            {busy && (
              <button type="button" className="primary alt stop" onClick={stop}>停止</button>
            )}
          </div>
          {toast && <p className="toast">{toast}</p>}
          <p className="hint">通道:{channelText}(在「设置」页切换)。解读仅供参考,不构成医疗/投资/重大决策建议。</p>
        </div>
      </div>

      <div className="panel">
        <h2>参数导出{isGroup ? `(${convLabel})` : ''}</h2>
        <div className="export-actions">
          <button type="button" className="primary" onClick={() => void copyOne(exportDigest)}>
            复制精简文本(贴给任意 AI)
          </button>
          <button type="button" className="primary alt" onClick={() => void copyOne(exportJson)}>
            复制完整 JSON
          </button>
          <button
            type="button"
            className="primary alt"
            onClick={() => void saveWithFeedback(`ziwei-chart-${isGroup ? 'group-' : ''}${chart.meta.chartHash}.json`, exportJson, 'application/json')}
          >
            保存 JSON 到本地
          </button>
        </div>
        <textarea className="export-preview" readOnly value={exportDigest} rows={9} onFocus={(e) => e.target.select()} />
        <p className="hint">
          精简文本含十二宫全星曜(亮度/四化)与当前运限上下文{isGroup ? ',以及各成员盘面与两两关系' : ''};JSON 为全量结构化参数(含星性能量、格局、亮度汇总{isGroup ? '、群盘成员' : ''})。
        </p>
      </div>
    </div>
  );
}
