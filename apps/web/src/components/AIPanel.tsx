/**
 * 智能体:多轮对话(可携带大限~流时运限上下文;可点选任意档案组合做群盘)
 * + 历史记录(按命盘/组合归档,本地存储)+ 对话/历史导出 + 命盘参数导出。
 * 命理体系:紫微 / 八字 / 星座(西洋占星)/ 紫微+八字 / 三系统互参。
 * 推理型模型的思考过程折叠展示、正文按 Markdown 渲染(表格/列表/标题)。
 * 通道与 Key 在「设置」页配置;Prompt 由本地知识库装配,与网关同源同规则。
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  analyze, astroSignals, baziSignals, describeAstro, describeBaZi, exportChartData, zh,
  type Astrolabe, type AstroChart, type BaZiChart, type BirthInput, type HoroscopeSnapshot, type ZiweiEngine,
} from '@ziwei/core';
import {
  ALL_ENTRIES, ALL_SKILLS, analyzeGroup, buildAstroPrompt, buildBaZiPrompt, buildGroupPrompt, buildSystemPrompt, describeChart,
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
import { deleteGroupPreset, loadGroupPresets, saveGroupPreset, type GroupPreset } from '../lib/groups.js';
import { horoscopeDigest } from '../lib/horoscope-text.js';
import { Markdown } from '../lib/markdown.js';
import type { Profile } from '../lib/profiles.js';
import { HOUR_NAMES, type HoroscopeMode } from './TimeNav.js';

export type { Channel } from '../lib/ai-channel.js';

interface Props {
  engine: ZiweiEngine;
  chart: Astrolabe;
  bazi: BaZiChart | null;
  astro: AstroChart | null;
  /** 当前盘的出生输入(用于识别其档案名) */
  lastInput: BirthInput | null;
  channel: Channel;
  /** 本地档案与人物组合选择(与档案页共用) */
  profiles: Profile[];
  groupIds: string[];
  onGroupIdsChange: (ids: string[]) => void;
  /** 当前盘是否参与组合(当前盘本身不是所选档案时) */
  includeCurrent: boolean;
  onIncludeCurrentChange: (v: boolean) => void;
  horoscope: HoroscopeSnapshot | null;
  /** 任意一张盘在当前运限设置下的快照(群盘各成员共用同一目标时刻) */
  horoscopeFor: (chart: Astrolabe) => HoroscopeSnapshot | null;
  mode: HoroscopeMode;
  onModeChange: (mode: HoroscopeMode) => void;
  /** 运限目标时刻(与星盘页共享) */
  year: number;
  month: number;
  day: number;
  hourIndex: number;
  onYearChange: (y: number) => void;
  onMonthChange: (m: number) => void;
  onDayChange: (d: number) => void;
  onHourChange: (h: number) => void;
}

export type SystemMode = 'ziwei' | 'bazi' | 'both' | 'astro' | 'all';
const SYSTEM_OPTIONS: { id: SystemMode; label: string; short: string }[] = [
  { id: 'ziwei', label: '紫微斗数', short: '紫微' },
  { id: 'bazi', label: '八字(四柱)', short: '八字' },
  { id: 'astro', label: '星座(西洋占星)', short: '星座' },
  { id: 'both', label: '紫微 + 八字互参', short: '紫微+八字' },
  { id: 'all', label: '紫微 + 八字 + 星座 三系统互参', short: '三系统' },
];
const systemShort = (id?: string) => SYSTEM_OPTIONS.find((s) => s.id === id)?.short ?? '';
const usesZiwei = (s: SystemMode) => s === 'ziwei' || s === 'both' || s === 'all';
const usesBazi = (s: SystemMode) => s === 'bazi' || s === 'both' || s === 'all';
const usesAstro = (s: SystemMode) => s === 'astro' || s === 'all';

const GROUP_SKILL_OPTIONS: { id: string; label: string }[] = [
  { id: 'group-couple', label: '伴侣合盘' }, { id: 'group-family', label: '家庭群盘' }, { id: 'group-team', label: '合伙团队' },
];

const SKILL_OPTIONS: { id: string; label: string }[] = [
  { id: '', label: '通用解读' },
  ...GROUP_SKILL_OPTIONS,
  { id: 'bazi', label: '八字命理' }, { id: 'bazi-dayun', label: '八字大运流年' },
  { id: 'astro', label: '星座命盘' }, { id: 'astro-year', label: '星座流年' },
  { id: 'overall', label: '整体命格' }, { id: 'marriage', label: '姻缘婚恋' },
  { id: 'career', label: '事业官禄' }, { id: 'business', label: '生意财运' },
  { id: 'wealth', label: '财帛理财' }, { id: 'education', label: '学业考运' },
  { id: 'health', label: '健康养生' }, { id: 'children', label: '子女亲缘' },
  { id: 'parents', label: '父母孝亲' }, { id: 'siblings', label: '兄弟手足' },
  { id: 'friends', label: '人际贵人' }, { id: 'relocation', label: '迁移发展' },
  { id: 'spirit', label: '福德精神' }, { id: 'decadal', label: '大限十年' },
  { id: 'annual', label: '流年吉凶' },
];
const SINGLE_SKILLS = SKILL_OPTIONS.filter((s) => s.id && !s.id.startsWith('group-'));

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

interface Member {
  /** 档案 id;当前盘(非档案)为 'current' */
  id: string;
  label: string;
  chart: Astrolabe;
  isCurrent: boolean;
}

export function AIPanel({
  engine, chart, bazi, astro, lastInput, channel, profiles, groupIds, onGroupIdsChange, includeCurrent, onIncludeCurrentChange,
  horoscope, horoscopeFor, mode, onModeChange,
  year, month, day, hourIndex, onYearChange, onMonthChange, onDayChange, onHourChange,
}: Props) {
  const store = useMemo(() => new ChatStore(), []);
  const [system, setSystem] = useState<SystemMode>('ziwei');
  const chartHash = chart.meta.chartHash;

  // ---- 人物组合(任意档案点选)与组合方案 ----
  const [presets, setPresets] = useState<GroupPreset[]>(() => loadGroupPresets());
  const [presetName, setPresetName] = useState('');
  const currentProfile = lastInput ? profiles.find((p) => sameInput(p.input, lastInput)) : undefined;
  const currentLabel = currentProfile?.name ?? '当前盘';
  const chartLabel = `${zh(chart.gender)}命 ${chart.solarDate}`;

  /** 组合成员(有序):当前盘(若参与且不在所选档案中)+ 所选档案;去重同一张盘 */
  const members = useMemo((): Member[] => {
    const picked = groupIds
      .map((id) => profiles.find((p) => p.id === id))
      .filter((p): p is Profile => !!p)
      .map((p): Member => {
        const c = engine.fromBirth(p.input);
        return { id: p.id, label: p.name, chart: c, isCurrent: c.meta.chartHash === chartHash };
      });
    const currentPicked = picked.some((m) => m.isCurrent);
    const list: Member[] = [];
    if (includeCurrent && !currentPicked) list.push({ id: currentProfile?.id ?? 'current', label: currentLabel, chart, isCurrent: true });
    const seen = new Set(list.map((m) => m.chart.meta.chartHash));
    for (const m of picked) {
      if (seen.has(m.chart.meta.chartHash)) continue;
      seen.add(m.chart.meta.chartHash);
      list.push(m);
    }
    return list;
  }, [groupIds, profiles, engine, chartHash, includeCurrent, currentProfile, currentLabel, chart]);

  const isGroup = members.length >= 2;
  const primary = members[0] ?? { id: 'current', label: currentLabel, chart, isCurrent: true };
  const others = isGroup ? members.slice(1) : [];
  const convKey = isGroup ? groupKey(members.map((m) => m.chart.meta.chartHash)) : chartHash;
  const convLabel = isGroup ? members.map((m) => m.label).join(' × ') : chartLabel;
  const convMembers: ConversationMember[] | undefined = isGroup
    ? members.map((m) => ({ id: m.id, name: m.label, chartHash: m.chart.meta.chartHash }))
    : undefined;
  const currentInPicked = members.some((m) => m.isCurrent && m.id !== 'current' && groupIds.includes(m.id));

  const [conv, setConvState] = useState<Conversation | null>(null);
  const convRef = useRef<Conversation | null>(null);
  const setConv = (next: Conversation | null) => {
    convRef.current = next;
    setConvState(next);
  };
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyAll, setHistoryAll] = useState(false);
  const [historyTick, setHistoryTick] = useState(0);
  const [pickerOpen, setPickerOpen] = useState(false);
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

  /** 群盘成员(含主盘)与八字/星座 */
  const groupMembers = (sys: SystemMode): GroupMember[] =>
    members.map((m) => ({
      label: m.label,
      chart: m.chart,
      ...(m.chart.meta.chartHash === chartHash ? { features } : {}),
      ...(usesBazi(sys) ? { bazi: m.chart.meta.chartHash === chartHash && bazi ? bazi : engine.bazi(m.chart) } : {}),
      ...(usesAstro(sys) ? { astro: m.chart.meta.chartHash === chartHash && astro ? astro : engine.astro(m.chart) } : {}),
    }));

  /** 运限上下文:单盘为当前盘摘要;群盘为各成员在同一目标时刻的摘要(便于看四化互相引动) */
  const buildContext = (sys: SystemMode): string => {
    if (!usesZiwei(sys) || mode === 'origin') return '';
    if (!isGroup) return horoscope ? horoscopeDigest(chart, horoscope, mode) : '';
    const blocks: string[] = [];
    for (const m of members) {
      const h = horoscopeFor(m.chart);
      if (!h) continue;
      blocks.push(`【${m.label}】\n${horoscopeDigest(m.chart, h, mode).replace(/\n请结合以上运限四化对本命盘的引动作答。$/, '')}`);
    }
    if (blocks.length === 0) return '';
    return `${blocks.join('\n')}\n请结合各人同一时段的运限四化,分析彼此的引动、共振与错位后作答。`;
  };

  /** 本地装配 system prompt(直连通道;与网关同源同规则) */
  const buildLocalPrompt = (sys: SystemMode): string => {
    if (isGroup) {
      const facts = analyzeGroup(groupMembers(sys));
      const extra = usesAstro(sys) ? facts.members.flatMap((m) => (m.astro ? astroSignals(m.astro) : [])) : [];
      const retrieved = retrieveSignals([...facts.signals, ...extra], ALL_ENTRIES, { topics: skill?.topics, limit: usesAstro(sys) ? 16 : 12 });
      return buildGroupPrompt(facts, retrieved, { skill, withBazi: usesBazi(sys), withAstro: usesAstro(sys), year });
    }
    const a = astro ?? engine.astro(chart);
    const b = bazi ?? engine.bazi(chart);
    if (sys === 'bazi') return buildBaZiPrompt(b, retrieveSignals(baziSignals(b), ALL_ENTRIES, { topics: skill?.topics }), { skill, year });
    if (sys === 'astro') return buildAstroPrompt(a, retrieveSignals(astroSignals(a), ALL_ENTRIES, { topics: skill?.topics, limit: 10 }), { skill, year });
    const signals = [...features.signals, ...(usesBazi(sys) ? baziSignals(b) : []), ...(usesAstro(sys) ? astroSignals(a) : [])];
    const retrieved = retrieveSignals(signals, ALL_ENTRIES, { topics: skill?.topics, limit: sys === 'ziwei' ? 8 : sys === 'both' ? 12 : 16 });
    return buildSystemPrompt(chart, features, retrieved, {
      skill, ...(usesBazi(sys) ? { bazi: b, year } : {}), ...(usesAstro(sys) ? { astro: a, year } : {}),
    });
  };

  const send = async () => {
    if (busy) return;
    const skillLabel = SKILL_OPTIONS.find((s) => s.id === skillId)?.label ?? '通用解读';
    const sys = system;
    const sysText = sys === 'ziwei' ? '命盘' : sys === 'bazi' ? '八字' : sys === 'astro' ? '星座盘' : sys === 'both' ? '紫微与八字' : '紫微、八字与星座';
    const q =
      question.trim() ||
      (isGroup
        ? `请依照输出结构,为 ${convLabel} 这组人物做${skillId ? skillLabel : '群盘解读'}。`
        : `请依照输出结构,为这张${sysText}做${skillId ? skillLabel : '解读'}。`);
    const context = buildContext(sys);
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
              chart: primary.chart, skill: skillId || undefined, question: sent, history: hist, system: sys, year,
              ...(isGroup ? { label: primary.label, members: others.map((m) => ({ label: m.label, chart: m.chart })) } : {}),
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
          run: (hist) => streamDirect(p, [{ role: 'system', content: buildLocalPrompt(sys) }, ...hist, { role: 'user', content: sent }], controller.signal),
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
    // 恢复组合选择(档案仍在时)
    if (c.members?.length) {
      const ids = c.members.map((m) => m.id).filter((id) => id !== 'current' && profiles.some((p) => p.id === id));
      onGroupIdsChange(ids);
      onIncludeCurrentChange(c.members.some((m) => m.id === 'current' || m.chartHash === chartHash));
    } else {
      onGroupIdsChange([]);
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

  const toggleMember = (id: string) => {
    if (groupIds.includes(id)) {
      onGroupIdsChange(groupIds.filter((x) => x !== id));
      return;
    }
    if (groupIds.length >= MAX_GROUP_MEMBERS) {
      showToast(`最多 ${MAX_GROUP_MEMBERS} 人`);
      return;
    }
    onGroupIdsChange([...groupIds, id]);
  };

  const savePreset = () => {
    if (!isGroup) return;
    const primaryId = primary.id;
    const memberIds = members.slice(1).map((m) => m.id).filter((id) => id !== 'current');
    setPresets(saveGroupPreset(presetName || convLabel, primaryId, memberIds));
    setPresetName('');
    showToast('组合方案已保存');
  };
  const applyPreset = (id: string) => {
    const g = presets.find((p) => p.id === id);
    if (!g) return;
    const ids = [...(g.primaryId !== 'current' ? [g.primaryId] : []), ...g.memberIds]
      .filter((x, i, arr) => arr.indexOf(x) === i)
      .filter((x) => profiles.some((p) => p.id === x))
      .slice(0, MAX_GROUP_MEMBERS);
    if (ids.length === 0) {
      showToast('方案中的档案已不存在');
      return;
    }
    stop();
    setConv(null);
    onGroupIdsChange(ids);
    onIncludeCurrentChange(g.primaryId === 'current');
    showToast(`已载入方案「${g.name}」`);
  };
  const removePreset = (id: string) => setPresets(deleteGroupPreset(id));

  const daysInMonth = new Date(year, month, 0).getDate();
  const withTime = usesZiwei(system);

  // ---- 命盘参数导出 ----
  const exportJson = useMemo(
    () =>
      JSON.stringify(
        {
          ...exportChartData(primary.chart, primary.isCurrent ? features : analyze(primary.chart), undefined, primary.isCurrent && bazi ? bazi : engine.bazi(primary.chart), primary.isCurrent && astro ? astro : engine.astro(primary.chart)),
          ...(isGroup
            ? {
                group: {
                  primary: primary.label,
                  members: others.map((m) => ({
                    name: m.label,
                    ...exportChartData(m.chart, analyze(m.chart), undefined, engine.bazi(m.chart), engine.astro(m.chart)),
                  })),
                },
              }
            : {}),
        },
        null,
        2,
      ),
    [primary, others, features, bazi, astro, isGroup, engine],
  );
  const exportDigest = useMemo(() => {
    const c = primary.chart;
    const f = primary.isCurrent ? features : analyze(c);
    const b = primary.isCurrent && bazi ? bazi : engine.bazi(c);
    const a = primary.isCurrent && astro ? astro : engine.astro(c);
    const lines = [
      `【紫微斗数命盘 · IMPF-AI】${isGroup ? `${primary.label}:` : ''}${zh(c.gender)}命 ${c.solarDate}(${c.lunarDate})`,
      `五行局:${zh(c.fiveElementsClass)} 命主:${zh(c.soul)} 身主:${zh(c.body)}`,
      ...c.palaces.map((p) => {
        const stars = [...p.majorStars, ...p.minorStars]
          .map((s) => `${zh(s.key)}${s.brightness ? `(${zh(s.brightness)})` : ''}${s.mutagen ? `化${zh(s.mutagen)}` : ''}`)
          .join(' ');
        return `${zh(p.branch)}·${zh(p.name)}${p.isBodyPalace ? '(身)' : ''}:${stars || (p.borrowed ? `借${p.borrowed.stars.map((s) => zh(s.key)).join('/')}` : '空')} | 限${p.decadal.range[0]}-${p.decadal.range[1]}`;
      }),
      `格局:${f.patterns.map((p) => p.name + (p.brokenBy.length > 0 ? '(破)' : '')).join('、') || '无'}`,
    ];
    if (!isGroup && horoscope && mode !== 'origin') lines.push(horoscopeDigest(c, horoscope, mode));
    lines.push('', describeBaZi(b, year));
    lines.push('', describeAstro(a, year));
    if (isGroup) {
      const facts = analyzeGroup(groupMembers('all'));
      for (const m of others) {
        lines.push('', `【${m.label}】`, describeChart(m.chart, analyze(m.chart)), describeBaZi(engine.bazi(m.chart), year), describeAstro(engine.astro(m.chart), year));
      }
      lines.push('', '【两两关系】');
      for (const p of facts.pairs) {
        lines.push(`${p.a} × ${p.b}:`, ...p.features.notes.map((n) => `  - ${n}`), ...(p.astro ? p.astro.notes.map((n) => `  - 星座:${n}`) : []));
      }
      const ctx = buildContext('ziwei');
      if (ctx) lines.push('', '【各人运限上下文】', ctx);
    }
    return lines.join('\n');
    // groupMembers / buildContext 依赖的值均在依赖列表中
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [primary, others, features, horoscope, horoscopeFor, mode, bazi, astro, year, isGroup, engine]);

  const channelText =
    channel === 'gateway' ? '网关' : channel === 'compare' ? '双模型对比' : `直连 · ${loadDirectProviders()[channel === 'directA' ? 0 : 1].label}`;
  const sysHint = (() => {
    const parts: string[] = [];
    if (usesBazi(system)) parts.push('八字事实(四柱十神、旺衰格局用神、大运)');
    if (usesAstro(system)) parts.push(`星座事实(日月升、行星落座落宫、相位、元素平衡,小限与过境${astro && !astro.ascendant ? ';本盘缺出生地,无上升' : ''})`);
    return parts.length ? `${parts.join('与')}随 Prompt 注入,流年定位 ${year} 年(在「星盘」页对应盘面点选调整)。` : '';
  })();

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
          {!currentInPicked && (
            <button
              type="button"
              className={`member-chip primary${includeCurrent ? '' : ' off'}`}
              title={includeCurrent ? `${chartLabel} · 点击从组合中移出当前盘` : `${chartLabel} · 点击让当前盘加入组合`}
              onClick={() => onIncludeCurrentChange(!includeCurrent)}
              disabled={busy || groupIds.length === 0}
              aria-pressed={includeCurrent}
            >
              {currentLabel}<small>{chart.solarDate}</small>
              {groupIds.length > 0 && <i>{includeCurrent ? '✓' : '○'}</i>}
            </button>
          )}
          {members.filter((m) => !(m.isCurrent && !currentInPicked)).map((m) => (
            <span key={m.id} className={`member-chip${m.isCurrent ? ' primary' : ''}`} title={`${m.chart.solarDate} ${zh(m.chart.gender)}`}>
              {m.label}<small>{m.chart.solarDate}</small>
              <button type="button" onClick={() => toggleMember(m.id)} aria-label="移除" disabled={busy}>✕</button>
            </span>
          ))}
          {profiles.length > 0 && (
            <button type="button" className={pickerOpen ? 'members-add active' : 'members-add'} disabled={busy} onClick={() => setPickerOpen((v) => !v)}>
              {pickerOpen ? '收起' : `+ 点选档案组合(${groupIds.length}/${MAX_GROUP_MEMBERS})`}
            </button>
          )}
          {profiles.length === 0 && <span className="hint">到「档案」页保存人物后,可在此点选任意组合做群盘</span>}
        </div>
        {pickerOpen && profiles.length > 0 && (
          <div className="members-picker">
            {profiles.map((p) => {
              const order = groupIds.indexOf(p.id);
              const isCur = lastInput ? sameInput(p.input, lastInput) : false;
              return (
                <label key={p.id} className={order >= 0 ? 'picker-item on' : 'picker-item'}>
                  <input type="checkbox" checked={order >= 0} onChange={() => toggleMember(p.id)} disabled={busy || (order < 0 && groupIds.length >= MAX_GROUP_MEMBERS)} />
                  <span className="picker-name">{p.name}{isCur ? '(当前盘)' : ''}</span>
                  <small>{p.input.year}-{p.input.month}-{p.input.day} {p.input.gender === 'male' ? '男' : '女'}</small>
                  {order >= 0 && <b>{order + 1}</b>}
                </label>
              );
            })}
            <div className="picker-foot">
              <span className="hint">勾选任意 2~{MAX_GROUP_MEMBERS} 人;当前盘可点芯片切换是否参与。</span>
              <button type="button" className="chip-btn" onClick={() => onGroupIdsChange([])} disabled={groupIds.length === 0}>清空</button>
            </div>
          </div>
        )}
        {(isGroup || presets.length > 0) && (
          <div className="members-row presets-row">
            <span className="members-label">方案</span>
            {presets.length > 0 && (
              <select className="members-add" value="" disabled={busy} onChange={(e) => applyPreset(e.target.value)}>
                <option value="">载入组合方案…</option>
                {presets.map((g) => (
                  <option key={g.id} value={g.id}>{g.name}({g.memberIds.length + 1}人)</option>
                ))}
              </select>
            )}
            {isGroup && (
              <>
                <input
                  className="preset-name"
                  placeholder={`方案名(默认:${convLabel})`}
                  value={presetName}
                  onChange={(e) => setPresetName(e.target.value)}
                />
                <button type="button" className="chip-btn" onClick={savePreset}>存为方案</button>
              </>
            )}
            {presets.length > 0 && (
              <details className="presets-manage">
                <summary className="chip-btn">管理</summary>
                <ul>
                  {presets.map((g) => (
                    <li key={g.id}>
                      <span>{g.name}</span>
                      <small>{[g.primaryId, ...g.memberIds].map((id) => (id === 'current' ? '当前盘' : profiles.find((p) => p.id === id)?.name ?? '?')).join('、')}</small>
                      <button type="button" className="chip-btn danger" onClick={() => removePreset(g.id)}>删除</button>
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}

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
                <>基于这张命盘开始多轮对话。<br />可选命理体系(紫微 / 八字 / 星座 / 互参)与技法聚焦主题,选择运限上下文让 AI 结合流年/流月/流日/流时四化作答;追问会自动带上前文。</>
              )}
            </div>
          ) : (
            conv.turns.map((t, i) => {
              const streaming = busy && i >= conv.turns.length - (conv.turns.filter((x) => x.role === 'assistant' && x.at === last?.at).length);
              return (
                <div key={i} className={`msg ${t.role}${t.error ? ' error' : ''}`}>
                  <div className="msg-meta">
                    {t.role === 'user' ? '问' : `答 · ${t.label ?? ''}`} · {t.at.slice(11, 16)}
                    {t.role === 'user' && t.system && t.system !== 'ziwei' ? ` · ${systemShort(t.system)}` : ''}
                    {t.role === 'user' && t.mode && t.mode !== 'origin' && t.context ? ` · 携${modeLabel(t.mode)}上下文${conv.members ? '(各人)' : ''}` : ''}
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
                {isGroup ? (
                  <>
                    <option value="">通用群盘解读</option>
                    <optgroup label="群盘技法">
                      {GROUP_SKILL_OPTIONS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </optgroup>
                    <optgroup label="单盘技法(逐人套用)">
                      {SINGLE_SKILLS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
                    </optgroup>
                  </>
                ) : (
                  SKILL_OPTIONS.filter((s) => !s.id.startsWith('group-')).map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))
                )}
              </select>
            </label>
            <label>
              运限上下文
              <select value={mode} onChange={(e) => onModeChange(e.target.value as HoroscopeMode)} disabled={!withTime}>
                {MODE_OPTIONS.map((m) => (
                  <option key={m.id} value={m.id}>{m.label}</option>
                ))}
              </select>
            </label>
          </div>
          {mode !== 'origin' && withTime && (
            <div className="row time-row">
              <label>
                年
                <input type="number" value={year} min={1900} max={2100} onChange={(e) => onYearChange(Number(e.target.value) || year)} />
              </label>
              {(mode === 'monthly' || mode === 'daily' || mode === 'hourly') && (
                <label>
                  月
                  <select value={month} onChange={(e) => onMonthChange(Number(e.target.value))}>
                    {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                  </select>
                </label>
              )}
              {(mode === 'daily' || mode === 'hourly') && (
                <label>
                  日
                  <select value={Math.min(day, daysInMonth)} onChange={(e) => onDayChange(Number(e.target.value))}>
                    {Array.from({ length: daysInMonth }, (_, i) => <option key={i + 1} value={i + 1}>{i + 1}</option>)}
                  </select>
                </label>
              )}
              {mode === 'hourly' && (
                <label>
                  时辰
                  <select value={hourIndex} onChange={(e) => onHourChange(Number(e.target.value))}>
                    {HOUR_NAMES.map((h, i) => <option key={i} value={i}>{h}时</option>)}
                  </select>
                </label>
              )}
            </div>
          )}
          {!withTime && (
            <div className="row time-row">
              <label>
                流年
                <input type="number" value={year} min={1900} max={2100} onChange={(e) => onYearChange(Number(e.target.value) || year)} />
              </label>
            </div>
          )}
          {isGroup && (
            <p className="hint">
              群盘模式:{convLabel}。Prompt 含逐人结构化事实与两两关系矩阵{usesBazi(system) ? '(附各人八字)' : ''}{usesAstro(system) ? '(附各人星座与跨盘相位)' : ''}
              {mode !== 'origin' && withTime ? `;各成员 ${horoscope?.solarDate ?? ''} 的${modeLabel(mode)}四化摘要随问题携带` : ''}。
            </p>
          )}
          {!isGroup && groupIds.length > 0 && !includeCurrent && (
            <p className="hint">已点选 1 位档案但当前盘未参与,仍按当前盘单人解读;点亮当前盘芯片或再选一位即可组成群盘。</p>
          )}
          {!isGroup && withTime && mode !== 'origin' && horoscope && (
            <p className="hint">将随问题携带 {horoscope.solarDate} 的{modeLabel(mode)}四化上下文。</p>
          )}
          {!isGroup && sysHint && <p className="hint">{sysHint}</p>}
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder={conv?.turns.length ? '继续追问…' : isGroup ? '想问这组人物什么?留空做完整群盘解读' : '想问什么?留空按所选体系与技法做完整解读'}
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
            onClick={() => void saveWithFeedback(`ziwei-chart-${isGroup ? 'group-' : ''}${primary.chart.meta.chartHash}.json`, exportJson, 'application/json')}
          >
            保存 JSON 到本地
          </button>
        </div>
        <textarea className="export-preview" readOnly value={exportDigest} rows={9} onFocus={(e) => e.target.select()} />
        <p className="hint">
          精简文本含十二宫全星曜(亮度/四化)、八字与星座事实及当前运限上下文{isGroup ? ',以及各成员盘面与两两关系(含星座比较)' : ''};JSON 为全量结构化参数(含星性能量、格局、亮度汇总、八字、星座{isGroup ? '、群盘成员' : ''})。
        </p>
      </div>
    </div>
  );
}
