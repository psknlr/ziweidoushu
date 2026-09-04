/**
 * 智能体:多轮对话(可携带大限~流时运限上下文)+ 历史记录(按命盘归档,本地存储)
 * + 对话/历史导出(分享或下载到本地、复制)+ 命盘参数导出。
 * 通道与 Key 在「设置」页配置;Prompt 由本地知识库装配,与网关同源同规则。
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  analyze, baziSignals, describeBaZi, exportChartData, zh,
  type Astrolabe, type BaZiChart, type HoroscopeSnapshot,
} from '@ziwei/core';
import { ALL_ENTRIES, ALL_SKILLS, buildBaZiPrompt, buildSystemPrompt, retrieveSignals } from '@ziwei/knowledge';
import {
  loadDirectProviders,
  providerReady,
  streamDirect,
  streamGateway,
  type Channel,
  type ChatMessage,
} from '../lib/ai-channel.js';
import {
  ChatStore,
  conversationTitle,
  conversationToMarkdown,
  historyFor,
  newConversation,
  type ChatTurn,
  type Conversation,
} from '../lib/chat-store.js';
import { copyText } from '../lib/clipboard.js';
import { saveTextFile } from '../lib/export-file.js';
import { horoscopeDigest } from '../lib/horoscope-text.js';
import type { HoroscopeMode } from './TimeNav.js';

export type { Channel } from '../lib/ai-channel.js';

interface Props {
  chart: Astrolabe;
  bazi: BaZiChart | null;
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

export function AIPanel({ chart, bazi, year, channel, horoscope, mode, onModeChange }: Props) {
  const store = useMemo(() => new ChatStore(), []);
  const [system, setSystem] = useState<SystemMode>('ziwei');
  const chartHash = chart.meta.chartHash;
  const chartLabel = `${zh(chart.gender)}命 ${chart.solarDate}`;

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

  // 换盘 → 当前对话归零(仍可在「历史」中打开)
  useEffect(() => {
    if (convRef.current && convRef.current.chartHash !== chartHash) setConv(null);
  }, [chartHash]);

  // 流式输出时贴底
  const lastLen = conv ? (conv.turns[conv.turns.length - 1]?.content.length ?? 0) : 0;
  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conv?.turns.length, lastLen]);

  const skill = skillId ? ALL_SKILLS[skillId] : undefined;
  const features = useMemo(() => analyze(chart), [chart]);
  const history = useMemo(
    () => store.list(historyAll ? undefined : chartHash),
    // historyTick / conv.updatedAt 变化时刷新列表
    [store, historyAll, chartHash, historyTick, conv?.updatedAt],
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

  const send = async () => {
    if (busy) return;
    const skillLabel = SKILL_OPTIONS.find((s) => s.id === skillId)?.label ?? '通用解读';
    const useBazi = system !== 'ziwei' && bazi !== null;
    const sys: SystemMode = useBazi ? system : 'ziwei';
    const q = question.trim() || `请依照输出结构,为这张${sys === 'bazi' ? '八字' : sys === 'both' ? '紫微与八字' : '命盘'}做${skillId ? skillLabel : '解读'}。`;
    // 紫微运限上下文只在含紫微的体系下附带;八字流年由 year 参数在 Prompt 内定位
    const context = sys !== 'bazi' && horoscope && mode !== 'origin' ? horoscopeDigest(chart, horoscope, mode) : '';
    const sent = context ? `${q}\n\n${context}` : q;

    const controller = new AbortController();
    abortRef.current = controller;
    const providers = loadDirectProviders();
    const targets: { label: string; run: (hist: ChatMessage[]) => AsyncGenerator<string> }[] = [];
    if (channel === 'gateway') {
      targets.push({
        label: '网关',
        run: (hist) => streamGateway({ chart, skill: skillId || undefined, question: sent, history: hist, system: sys, year }, controller.signal),
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
            const signals =
              sys === 'bazi' ? baziSignals(bazi!) : sys === 'both' ? [...features.signals, ...baziSignals(bazi!)] : features.signals;
            const retrieved = retrieveSignals(signals, ALL_ENTRIES, { topics: skill?.topics, limit: sys === 'both' ? 12 : 8 });
            const systemPrompt =
              sys === 'bazi'
                ? buildBaZiPrompt(bazi!, retrieved, { skill, year })
                : buildSystemPrompt(chart, features, retrieved, { skill, ...(sys === 'both' ? { bazi: bazi!, year } : {}) });
            return streamDirect(p, [{ role: 'system', content: systemPrompt }, ...hist, { role: 'user', content: sent }], controller.signal);
          },
        });
      }
    }

    const now = new Date().toISOString();
    const base = convRef.current ?? newConversation(chartHash, chartLabel);
    const userTurn: ChatTurn = {
      role: 'user', content: q, at: now,
      ...(context ? { context } : {}), ...(skillId ? { skill: skillId } : {}), mode, system: sys,
    };
    const startIndex = base.turns.length + 1;
    const next: Conversation = {
      ...base,
      title: base.title || conversationTitle(question, skillLabel),
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
          for await (const delta of t.run(historyFor(base, t.label))) {
            patchTurn(idx, (turn) => ({ ...turn, content: turn.content + delta }));
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
    setConv(c);
    setHistoryOpen(false);
  };

  const deleteConv = (id: string) => {
    store.remove(id);
    if (convRef.current?.id === id) setConv(null);
    setHistoryTick((n) => n + 1);
  };

  const clearHistory = () => {
    const scopeText = historyAll ? '全部' : '当前命盘的';
    if (!window.confirm(`确定清空${scopeText}对话历史?此操作不可恢复。`)) return;
    store.clear(historyAll ? undefined : chartHash);
    if (!historyAll ? convRef.current?.chartHash === chartHash : true) setConv(null);
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
    void saveWithFeedback(`ziwei-chat-history-${today()}.json`, store.exportJson(historyAll ? undefined : chartHash), 'application/json');
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

  // ---- 命盘参数导出 ----
  const exportJson = useMemo(
    () => JSON.stringify(exportChartData(chart, features, undefined, bazi ?? undefined), null, 2),
    [chart, features, bazi],
  );
  const exportDigest = useMemo(() => {
    const lines = [
      `【紫微斗数命盘 · IMPF-AI】${zh(chart.gender)}命 ${chart.solarDate}(${chart.lunarDate})`,
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
    return lines.join('\n');
  }, [chart, features, horoscope, mode, bazi, year]);

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
          <span className="chat-title">{conv?.title || `${chartLabel} · ${channelText}`}</span>
          <button type="button" className="chip-btn" onClick={exportConv} disabled={!conv}>导出本次</button>
          <button type="button" className="chip-btn" onClick={() => void copyConv()} disabled={!conv}>复制本次</button>
        </div>

        {historyOpen && (
          <div className="history-panel">
            <div className="history-head">
              <span>对话历史 · 仅存本机</span>
              <button type="button" className={historyAll ? 'chip-btn' : 'chip-btn active'} onClick={() => setHistoryAll(false)}>当前盘</button>
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
              基于这张命盘开始多轮对话。<br />
              可选技法聚焦主题,选择运限上下文让 AI 结合流年/流月/流日/流时四化作答;
              追问会自动带上前文。
            </div>
          ) : (
            conv.turns.map((t, i) => (
              <div key={i} className={`msg ${t.role}${t.error ? ' error' : ''}`}>
                <div className="msg-meta">
                  {t.role === 'user' ? '问' : `答 · ${t.label ?? ''}`} · {t.at.slice(11, 16)}
                  {t.role === 'user' && t.system && t.system !== 'ziwei' ? ` · ${t.system === 'bazi' ? '八字' : '紫微+八字'}` : ''}
                  {t.role === 'user' && t.mode && t.mode !== 'origin' && t.system !== 'bazi' ? ` · 携${modeLabel(t.mode)}上下文` : ''}
                  {t.role === 'user' && t.skill ? ` · ${SKILL_OPTIONS.find((s) => s.id === t.skill)?.label ?? ''}` : ''}
                </div>
                <div className="msg-body">{t.content || (busy ? '…' : '')}</div>
                {t.role === 'assistant' && t.content && !t.error && (
                  <div className="msg-actions">
                    <button type="button" className="chip-btn" onClick={() => void copyOne(t.content)}>复制</button>
                  </div>
                )}
              </div>
            ))
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
              <select value={mode} onChange={(e) => onModeChange(e.target.value as HoroscopeMode)}>
                {MODE_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </label>
          </div>
          {system !== 'bazi' && mode !== 'origin' && horoscope && (
            <p className="hint">将随问题携带 {horoscope.solarDate} 的{modeLabel(mode)}四化上下文(在「星盘」页调整具体年月日时)。</p>
          )}
          {system !== 'ziwei' && bazi && (
            <p className="hint">八字事实(四柱十神、旺衰格局用神、大运)随 Prompt 注入,流年定位 {year} 年(在「星盘 › 八字盘」页点选大运/流年调整)。</p>
          )}
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={conv?.turns.length ? '继续追问…' : '想问什么?留空按所选技法做完整解读'}
            rows={3}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) void send();
            }}
          />
          <div className="chat-send-row">
            <button type="button" className="primary" onClick={() => void send()} disabled={busy}>
              {busy ? '生成中…' : conv?.turns.length ? '发送追问' : channel === 'compare' ? '双模型对比解读' : '生成解读'}
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
        <h2>参数导出</h2>
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
            onClick={() => void saveWithFeedback(`ziwei-chart-${chart.meta.chartHash}.json`, exportJson, 'application/json')}
          >
            保存 JSON 到本地
          </button>
        </div>
        <textarea className="export-preview" readOnly value={exportDigest} rows={9} onFocus={(e) => e.target.select()} />
        <p className="hint">精简文本含十二宫全星曜(亮度/四化)与当前运限上下文;JSON 为全量结构化参数(含星性能量、格局、亮度汇总)。</p>
      </div>
    </div>
  );
}
