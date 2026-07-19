/**
 * 统一 LLM 流式适配:OpenAI 兼容 SSE → 异步文本增量流。
 * (借鉴紫微知道 lib/llm.ts 的多家 SSE 差异归一思路;此处四家皆走
 * OpenAI 兼容协议,归一点只剩 URL/鉴权,已在 providers.ts 处理。)
 */
import { upstreamRequest, type ProviderConfig } from './providers.js';

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
}

/** 调用上游并以异步生成器逐段产出文本增量 */
export async function* streamChat(provider: ProviderConfig, request: ChatRequest): AsyncGenerator<string> {
  const { url, headers } = upstreamRequest(provider);
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      model: provider.model,
      messages: request.messages,
      stream: true,
      ...(request.temperature !== undefined ? { temperature: request.temperature } : {}),
      ...(request.maxTokens !== undefined ? { max_tokens: request.maxTokens } : {}),
    }),
  });

  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => '');
    throw new Error(`[@ziwei/gateway] 上游 ${provider.name} 返回 ${response.status}: ${detail.slice(0, 500)}`);
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });
      // SSE 事件以空行分隔;逐事件切分,残段留在 buffer
      let sep: number;
      while ((sep = buffer.indexOf('\n\n')) !== -1) {
        const event = buffer.slice(0, sep);
        buffer = buffer.slice(sep + 2);
        const delta = parseSseEvent(event);
        if (delta === DONE) return;
        if (delta) yield delta;
      }
    }
    const tail = parseSseEvent(buffer);
    if (tail && tail !== DONE) yield tail;
  } finally {
    reader.releaseLock();
  }
}

const DONE = Symbol('done');

function parseSseEvent(event: string): string | typeof DONE | undefined {
  for (const line of event.split('\n')) {
    if (!line.startsWith('data:')) continue;
    const data = line.slice(5).trim();
    if (data === '[DONE]') return DONE;
    try {
      const parsed = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
      const content = parsed.choices?.[0]?.delta?.content;
      if (content) return content;
    } catch {
      // 非 JSON 的注释/心跳行,忽略
    }
  }
  return undefined;
}
