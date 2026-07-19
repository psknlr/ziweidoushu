/**
 * AI 解读面板 v2:
 * - 通道:网关(Key 在服务端) / 直连(UI 置入 Key,存本地) / 双模型对比
 * - 技法:整体/姻缘/事业/生意/学业/健康/财帛(注入方法论)
 * 直连模式的 Prompt 由本地 @ziwei/knowledge 装配,与网关同源同规则,
 * 便于对不同智能体做同题比对。
 */
import { useMemo, useRef, useState } from 'react';
import { analyze, type Astrolabe } from '@ziwei/core';
import { ALL_ENTRIES, buildSystemPrompt, READING_SKILLS, retrieve, type SkillId } from '@ziwei/knowledge';
import {
  loadDirectProviders,
  providerReady,
  saveDirectProviders,
  streamDirect,
  streamGateway,
  type DirectProvider,
} from '../lib/ai-channel.js';

type Channel = 'gateway' | 'directA' | 'directB' | 'compare';

interface Props {
  chart: Astrolabe;
}

const SKILL_OPTIONS: { id: SkillId | ''; label: string }[] = [
  { id: '', label: '通用解读' },
  { id: 'overall', label: '整体命格' },
  { id: 'marriage', label: '姻缘婚恋' },
  { id: 'career', label: '事业官禄' },
  { id: 'business', label: '生意财运' },
  { id: 'wealth', label: '财帛理财' },
  { id: 'education', label: '学业考运' },
  { id: 'health', label: '健康养生' },
];

export function AIPanel({ chart }: Props) {
  const [channel, setChannel] = useState<Channel>('gateway');
  const [skillId, setSkillId] = useState<SkillId | ''>('');
  const [question, setQuestion] = useState('');
  const [providers, setProviders] = useState<[DirectProvider, DirectProvider]>(() => loadDirectProviders());
  const [showConfig, setShowConfig] = useState(false);
  const [outputs, setOutputs] = useState<{ label: string; text: string; error?: boolean }[]>([]);
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const skill = skillId ? READING_SKILLS[skillId] : undefined;

  /** 直连模式在本地装配 System Prompt(与网关同一套知识库与技法) */
  const localSystem = useMemo(() => {
    const features = analyze(chart);
    const retrieved = retrieve(features, ALL_ENTRIES, { topics: skill?.topics });
    return buildSystemPrompt(chart, features, retrieved, { skill });
  }, [chart, skill]);

  const updateProvider = (i: 0 | 1, patch: Partial<DirectProvider>) => {
    const next: [DirectProvider, DirectProvider] = [...providers] as [DirectProvider, DirectProvider];
    next[i] = { ...next[i], ...patch };
    setProviders(next);
    saveDirectProviders(next);
  };

  const run = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);

    const userQuestion = question.trim() || '请依照输出结构,为这张命盘做解读。';
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
          setOutputs([{ label: p.label, text: `请先在「模型配置」中填入 ${p.label} 的 Base URL / 模型 / API Key`, error: true }]);
          setBusy(false);
          return;
        }
        targets.push({
          label: `${p.label}(${p.model})`,
          gen: () =>
            streamDirect(p, [{ role: 'system', content: localSystem }, { role: 'user', content: userQuestion }], controller.signal),
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
    <div className="panel ai-panel">
      <h2>AI 解读</h2>
      <div className="row">
        <label>
          通道
          <select value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
            <option value="gateway">网关(推荐)</option>
            <option value="directA">直连·模型A</option>
            <option value="directB">直连·模型B</option>
            <option value="compare">双模型对比</option>
          </select>
        </label>
        <label>
          技法
          <select value={skillId} onChange={(e) => setSkillId(e.target.value as SkillId | '')}>
            {SKILL_OPTIONS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      {channel !== 'gateway' && (
        <button type="button" className="link-btn" onClick={() => setShowConfig((v) => !v)}>
          {showConfig ? '收起模型配置 ▲' : '模型配置(API Key)▼'}
        </button>
      )}
      {channel !== 'gateway' && showConfig && (
        <div className="provider-config">
          {([0, 1] as const).map((i) => (
            <fieldset key={i}>
              <legend>{providers[i].label}</legend>
              <input
                placeholder="Base URL(OpenAI 兼容,如 https://api.deepseek.com/v1)"
                value={providers[i].baseUrl}
                onChange={(e) => updateProvider(i, { baseUrl: e.target.value })}
              />
              <input
                placeholder="模型名(如 deepseek-chat / MiniMax-Text-01)"
                value={providers[i].model}
                onChange={(e) => updateProvider(i, { model: e.target.value })}
              />
              <input
                type="password"
                placeholder="API Key(仅存本机 localStorage)"
                value={providers[i].apiKey}
                onChange={(e) => updateProvider(i, { apiKey: e.target.value })}
              />
            </fieldset>
          ))}
          <p className="hint">Key 仅保存在本设备;浏览器直连需端点允许 CORS(App 内与桌面端无此限制更稳)。</p>
        </div>
      )}

      <textarea value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="想问什么?留空按所选技法做完整解读" rows={3} />
      <button type="button" className="primary" onClick={run} disabled={busy}>
        {busy ? '生成中…' : channel === 'compare' ? '双模型对比解读' : '生成解读'}
      </button>

      {outputs.length > 0 && (
        <div className={outputs.length > 1 ? 'ai-columns' : ''}>
          {outputs.map((o) => (
            <div key={o.label} className="ai-column">
              {outputs.length > 1 && <div className="ai-col-title">{o.label}</div>}
              <div className={`ai-output${o.error ? ' error' : ''}`}>{o.text || '…'}</div>
            </div>
          ))}
        </div>
      )}
      <p className="hint">解读仅供参考,不构成医疗/投资/重大决策建议。</p>
    </div>
  );
}
