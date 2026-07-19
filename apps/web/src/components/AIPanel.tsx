/**
 * AI 解读面板:经本地网关(/api/interpret)流式获取解读。
 * 前端只发送星盘结构与问题;Prompt 装配、知识检索、API Key 全在服务端。
 */
import { useRef, useState } from 'react';
import type { Astrolabe } from '@ziwei/core';

interface Props {
  chart: Astrolabe;
}

export function AIPanel({ chart }: Props) {
  const [question, setQuestion] = useState('');
  const [output, setOutput] = useState('');
  const [status, setStatus] = useState<'idle' | 'streaming' | 'error'>('idle');
  const abortRef = useRef<AbortController | null>(null);

  const run = async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setOutput('');
    setStatus('streaming');
    try {
      const response = await fetch('/api/interpret', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chart, question: question || undefined }),
        signal: controller.signal,
      });
      if (!response.ok || !response.body) {
        throw new Error(`网关返回 ${response.status}(请先启动:npm run gateway)`);
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let sep: number;
        while ((sep = buffer.indexOf('\n\n')) !== -1) {
          const event = buffer.slice(0, sep);
          buffer = buffer.slice(sep + 2);
          const data = event.replace(/^data: /, '').trim();
          if (data === '[DONE]') continue;
          const parsed = JSON.parse(data) as { delta?: string; error?: string };
          if (parsed.error) throw new Error(parsed.error);
          if (parsed.delta) setOutput((prev) => prev + parsed.delta);
        }
      }
      setStatus('idle');
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      setOutput(String(error));
      setStatus('error');
    }
  };

  return (
    <div className="panel ai-panel">
      <h2>AI 解读</h2>
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="想问什么?留空则做整体解读(需启动本地网关)"
        rows={3}
      />
      <button type="button" className="primary" onClick={run} disabled={status === 'streaming'}>
        {status === 'streaming' ? '生成中…' : '生成解读'}
      </button>
      {output && <div className={`ai-output${status === 'error' ? ' error' : ''}`}>{output}</div>}
      <p className="hint">解读仅供参考,不构成医疗/投资/重大决策建议。</p>
    </div>
  );
}
