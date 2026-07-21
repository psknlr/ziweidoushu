/**
 * 智能体面板:模型提问(支持携带大限/流年/流月/流日/流时运限上下文)
 * + 命盘参数导出(一键复制 JSON / 精简文本,桌面另可下载)。
 * 通道与 Key 在「设置」页配置;Prompt 由本地知识库装配,与网关同源同规则。
 */
import { useMemo, useRef, useState } from 'react';
import { analyze, exportChartData, zh, type Astrolabe, type HoroscopeSnapshot } from '@ziwei/core';
import { ALL_ENTRIES, ALL_SKILLS, buildSystemPrompt, retrieve } from '@ziwei/knowledge';
import { loadDirectProviders, providerReady, streamDirect, streamGateway } from '../lib/ai-channel.js';
import { copyText } from '../lib/clipboard.js';
import { horoscopeDigest } from '../lib/horoscope-text.js';
import type { HoroscopeMode } from './TimeNav.js';

export type Channel = 'gateway' | 'directA' | 'directB' | 'compare';

interface Props {
  chart: Astrolabe;
  channel: Channel;
  horoscope: HoroscopeSnapshot | null;
  mode: HoroscopeMode;
  onModeChange: (mode: HoroscopeMode) => void;
}

const SKILL_OPTIONS: { id: string; label: string }[] = [
  { id: '', label: '通用解读' },
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

export function AIPanel({ chart, channel, horoscope, mode, onModeChange }: Props) {
  const [skillId, setSkillId] = useState('');
  const [question, setQuestion] = useState('');
  const [outputs, setOutputs] = useState<{ label: string; text: string; error?: boolean }[]>([]);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  const skill = skillId ? ALL_SKILLS[skillId] : undefined;
  const features = useMemo(() => analyze(chart), [chart]);

  const exportJson = useMemo(() => JSON.stringify(exportChartData(chart, features), null, 2), [chart, features]);
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
    return lines.join('\n');
  }, [chart, features, horoscope, mode]);

  const doCopy = async (text: string, label: string) => {
    const ok = await copyText(text);
    setCopied(ok ? `已复制${label}` : '复制失败,请手动全选文本框复制');
    setTimeout(() => setCopied(''), 2500);
  };

  const run = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);

    const context = horoscope && mode !== 'origin' ? `\n\n${horoscopeDigest(chart, horoscope, mode)}` : '';
    const userQuestion = (question.trim() || '请依照输出结构,为这张命盘做解读。') + context;
    const retrieved = retrieve(features, ALL_ENTRIES, { topics: skill?.topics });
    const system = buildSystemPrompt(chart, features, retrieved, { skill });

    const providers = loadDirectProviders();
    const targets: { label: string; gen: () => AsyncGenerator<string> }[] = [];
    if (channel === 'gateway') {
      targets.push({
        label: '网关',
        gen: () => streamGateway({ chart, skill: skillId || undefined, question: userQuestion }, controller.signal),
      });
    } else {
      const picks = channel === 'compare' ? [0, 1] : channel === 'directA' ? [0] : [1];
      for (const i of picks) {
        const p = providers[i as 0 | 1];
        if (!providerReady(p)) {
          setOutputs([{ label: p.label, text: `请先到「设置」页配置 ${p.label} 的 Base URL / 模型 / API Key`, error: true }]);
          setBusy(false);
          return;
        }
        targets.push({
          label: `${p.label}(${p.model})`,
          gen: () => streamDirect(p, [{ role: 'system', content: system }, { role: 'user', content: userQuestion }], controller.signal),
        });
      }
    }

    setOutputs(targets.map((t) => ({ label: t.label, text: '' })));
    await Promise.all(
      targets.map(async (t, idx) => {
        try {
          for await (const delta of t.gen()) {
            setOutputs((prev) => prev.map((o, i) => (i === idx ? { ...o, text: o.text + delta } : o)));
          }
        } catch (error) {
          if ((error as Error).name === 'AbortError') return;
          setOutputs((prev) => prev.map((o, i) => (i === idx ? { ...o, text: String(error), error: true } : o)));
        }
      }),
    );
    setBusy(false);
  };

  return (
    <div className="view-stack">
      <div className="panel ai-panel">
        <h2>智能体提问</h2>
        <div className="row">
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
        {mode !== 'origin' && horoscope && (
          <p className="hint">将随问题携带:{horoscope.solarDate} 的{MODE_OPTIONS.find((m) => m.id === mode)?.label}四化上下文(在「星盘」页调整具体年月日时)。</p>
        )}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="想问什么?留空按所选技法做完整解读(通道在「设置」页切换)"
          rows={3}
        />
        <button type="button" className="primary" onClick={() => void run()} disabled={busy}>
          {busy ? '生成中…' : channel === 'compare' ? '双模型对比解读' : '生成解读'}
        </button>
        {outputs.length > 0 && (
          <div className={outputs.length > 1 ? 'ai-columns' : ''}>
            {outputs.map((o) => (
              <div key={o.label} className="ai-column">
                {outputs.length > 1 && <div className="ai-col-title">{o.label}</div>}
                <div className={`ai-output${o.error ? ' error' : ''}`}>{o.text || '…'}</div>
                {!o.error && o.text && (
                  <button type="button" className="pick copy-btn" onClick={() => void doCopy(o.text, '解读')}>
                    复制解读
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        <p className="hint">解读仅供参考,不构成医疗/投资/重大决策建议。</p>
      </div>

      <div className="panel">
        <h2>参数导出</h2>
        <div className="export-actions">
          <button type="button" className="primary" onClick={() => void doCopy(exportDigest, '精简文本')}>
            复制精简文本(贴给任意 AI)
          </button>
          <button type="button" className="primary alt" onClick={() => void doCopy(exportJson, ' JSON')}>
            复制完整 JSON
          </button>
        </div>
        {copied && <p className="copied-toast">{copied}</p>}
        <textarea className="export-preview" readOnly value={exportDigest} rows={9} onFocus={(e) => e.target.select()} />
        <p className="hint">精简文本含十二宫全星曜(亮度/四化)与当前运限上下文;JSON 为全量结构化参数(含星性能量、格局、亮度汇总)。</p>
      </div>
    </div>
  );
}
