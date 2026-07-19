/**
 * 合盘面板:确定性比较结果(命宫/年支关系、四化互飞、夫妻宫互参)+ AI 合盘解读。
 * 全部计算在本机完成;AI 部分可走网关或直连(本地 Key)。
 */
import { useMemo, useRef, useState } from 'react';
import { zh, type Astrolabe } from '@ziwei/core';
import { buildSynastryPrompt, compareCharts } from '@ziwei/knowledge';
import {
  loadDirectProviders,
  providerReady,
  streamDirect,
  streamGateway,
} from '../lib/ai-channel.js';

interface Props {
  nameA: string;
  nameB: string;
  chartA: Astrolabe;
  chartB: Astrolabe;
  onClose: () => void;
}

export function SynastryPanel({ nameA, nameB, chartA, chartB, onClose }: Props) {
  const syn = useMemo(() => compareCharts(chartA, chartB), [chartA, chartB]);
  const [output, setOutput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const runAI = async (mode: 'gateway' | 'direct') => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setBusy(true);
    setError(false);
    setOutput('');
    try {
      const gen =
        mode === 'gateway'
          ? streamGateway({ chart: chartA, chartB }, controller.signal)
          : (() => {
              const provider = loadDirectProviders().find(providerReady);
              if (!provider) throw new Error('直连模式需先在 AI 面板「模型配置」中填入至少一个模型的 Key');
              const system = buildSynastryPrompt(chartA, chartB, syn);
              return streamDirect(provider, [
                { role: 'system', content: system },
                { role: 'user', content: '请依照输出结构,为两张命盘做合盘分析。' },
              ], controller.signal);
            })();
      for await (const delta of gen) setOutput((prev) => prev + delta);
    } catch (e) {
      if ((e as Error).name !== 'AbortError') {
        setOutput(String(e));
        setError(true);
      }
    }
    setBusy(false);
  };

  return (
    <div className="panel synastry-panel">
      <div className="synastry-head">
        <h2>
          合盘比较:{nameA} × {nameB}
        </h2>
        <button type="button" className="pick" onClick={onClose}>
          关闭 ✕
        </button>
      </div>

      <div className="synastry-notes">
        {syn.notes.map((n, i) => (
          <div key={i} className="synastry-note">
            {n}
          </div>
        ))}
      </div>

      <div className="synastry-grid">
        <div>
          <h3>{nameA} 夫妻宫</h3>
          <p>
            {syn.spouseStars.a.length > 0
              ? syn.spouseStars.a.map((s) => zh(s.key)).join('、') + (syn.spouseStars.aBorrowed ? '(借对宫)' : '')
              : '无主星'}
          </p>
        </div>
        <div>
          <h3>{nameB} 夫妻宫</h3>
          <p>
            {syn.spouseStars.b.length > 0
              ? syn.spouseStars.b.map((s) => zh(s.key)).join('、') + (syn.spouseStars.bBorrowed ? '(借对宫)' : '')
              : '无主星'}
          </p>
        </div>
      </div>

      <details>
        <summary>四化互飞明细(8 条)</summary>
        <ul className="flight-list">
          {syn.flights.map((f, i) => (
            <li key={i}>
              {f.from === 'a' ? nameA : nameB} {zh(f.star)}化{zh(f.mutagen)} →{' '}
              {f.palaceInOther ? `对方${zh(f.palaceInOther)}` : '对方盘无此星'}
            </li>
          ))}
        </ul>
      </details>

      <div className="synastry-actions">
        <button type="button" className="primary" onClick={() => runAI('gateway')} disabled={busy}>
          {busy ? '生成中…' : 'AI 合盘(网关)'}
        </button>
        <button type="button" className="primary alt" onClick={() => runAI('direct')} disabled={busy}>
          AI 合盘(直连)
        </button>
      </div>
      {output && <div className={`ai-output${error ? ' error' : ''}`}>{output}</div>}
      <p className="hint">合盘解读仅供参考,不构成婚恋决策建议。</p>
    </div>
  );
}
