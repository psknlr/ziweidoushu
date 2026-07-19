/**
 * AI 通道:网关模式(推荐,Key 在服务端)与直连模式(用户自带 Key)。
 *
 * 直连模式说明:
 * - Key 仅存于本设备 localStorage,请求由浏览器直发 OpenAI 兼容端点;
 *   公网页面上自担 Key 泄露与端点 CORS 限制的风险(App/自部署场景推荐)。
 * - Prompt 在本地用 @ziwei/knowledge 装配,与网关同一套技法与知识库,
 *   便于对不同智能体(模型)做同题对比。
 */

export interface DirectProvider {
  label: string;
  baseUrl: string;
  model: string;
  apiKey: string;
}

const KEY = 'ziwei.direct-providers.v1';

export function loadDirectProviders(): [DirectProvider, DirectProvider] {
  const empty = (label: string): DirectProvider => ({ label, baseUrl: '', model: '', apiKey: '' });
  try {
    const arr = JSON.parse(localStorage.getItem(KEY) ?? '[]') as DirectProvider[];
    return [arr[0] ?? empty('模型A'), arr[1] ?? empty('模型B')];
  } catch {
    return [empty('模型A'), empty('模型B')];
  }
}

export function saveDirectProviders(providers: [DirectProvider, DirectProvider]): void {
  localStorage.setItem(KEY, JSON.stringify(providers));
}

export function providerReady(p: DirectProvider): boolean {
  return !!(p.baseUrl && p.model && p.apiKey);
}

export interface ChatMessage {
  role: 'system' | 'user';
  content: string;
}

/** 浏览器直连 OpenAI 兼容端点的流式调用(SSE) */
export async function* streamDirect(
  provider: DirectProvider,
  messages: ChatMessage[],
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const response = await fetch(`${provider.baseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: { authorization: `Bearer ${provider.apiKey}`, 'content-type': 'application/json' },
    body: JSON.stringify({ model: provider.model, messages, stream: true }),
    signal,
  });
  if (!response.ok || !response.body) {
    const detail = await response.text().catch(() => '');
    throw new Error(`${provider.label} 返回 ${response.status}:${detail.slice(0, 300) || '(可能是端点不允许浏览器 CORS 直连)'}`);
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
      for (const line of event.split('\n')) {
        if (!line.startsWith('data:')) continue;
        const data = line.slice(5).trim();
        if (data === '[DONE]') return;
        try {
          const parsed = JSON.parse(data) as { choices?: { delta?: { content?: string } }[] };
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) yield content;
        } catch {
          /* 心跳行忽略 */
        }
      }
    }
  }
}

/** 网关流式调用 */
export async function* streamGateway(body: unknown, signal?: AbortSignal): AsyncGenerator<string> {
  const base = (import.meta.env.VITE_GATEWAY_URL as string | undefined)?.replace(/\/$/, '') ?? '';
  const response = await fetch(`${base}/api/interpret`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal,
  });
  if (!response.ok || !response.body) {
    throw new Error(`网关返回 ${response.status}(网关模式需先启动 npm run gateway,或切换到直连模式自带 Key)`);
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
      if (data === '[DONE]') return;
      const parsed = JSON.parse(data) as { delta?: string; error?: string };
      if (parsed.error) throw new Error(parsed.error);
      if (parsed.delta) yield parsed.delta;
    }
  }
}
