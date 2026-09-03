/**
 * AI 通道:网关模式(Key 在服务端)与直连模式(用户自带 Key)。
 *
 * 直连模式说明:
 * - Key 仅存于本设备 localStorage,请求由浏览器直发 OpenAI 兼容端点;
 *   公网页面上自担 Key 泄露与端点 CORS 限制的风险(App/自部署场景推荐)。
 * - Prompt 在本地用 @ziwei/knowledge 装配,与网关同一套技法与知识库,
 *   便于对不同智能体(模型)做同题对比。
 * - 默认预置 MiniMax 国内版(api.minimaxi.com)+ MiniMax-M3,用户只需填 Key。
 */

export interface DirectProvider {
  label: string;
  baseUrl: string;
  model: string;
  apiKey: string;
}

export type Channel = 'gateway' | 'directA' | 'directB' | 'compare';

const PROVIDERS_KEY = 'ziwei.direct-providers.v1';
const CHANNEL_KEY = 'ziwei.channel.v1';

/** 默认直连配置:模型A = MiniMax 国内版 M3(Key 留空);模型B 留待用户自配 */
export const DEFAULT_PROVIDERS: readonly [DirectProvider, DirectProvider] = [
  { label: 'MiniMax', baseUrl: 'https://api.minimaxi.com/v1', model: 'MiniMax-M3', apiKey: '' },
  { label: '模型B', baseUrl: '', model: '', apiKey: '' },
];

function mergeProvider(stored: Partial<DirectProvider> | undefined, fallback: DirectProvider): DirectProvider {
  if (!stored) return { ...fallback };
  // 旧版本的空占位配置 → 迁移到新的默认值
  const blank = !stored.baseUrl && !stored.model && !stored.apiKey;
  if (blank) return { ...fallback };
  return {
    label: stored.label || fallback.label,
    baseUrl: stored.baseUrl ?? '',
    model: stored.model ?? '',
    apiKey: stored.apiKey ?? '',
  };
}

export function loadDirectProviders(): [DirectProvider, DirectProvider] {
  try {
    const arr = JSON.parse(localStorage.getItem(PROVIDERS_KEY) ?? '[]') as Partial<DirectProvider>[];
    return [mergeProvider(arr[0], DEFAULT_PROVIDERS[0]), mergeProvider(arr[1], DEFAULT_PROVIDERS[1])];
  } catch {
    return [{ ...DEFAULT_PROVIDERS[0] }, { ...DEFAULT_PROVIDERS[1] }];
  }
}

export function saveDirectProviders(providers: [DirectProvider, DirectProvider]): void {
  localStorage.setItem(PROVIDERS_KEY, JSON.stringify(providers));
}

export function providerReady(p: DirectProvider): boolean {
  return !!(p.baseUrl && p.model && p.apiKey);
}

/** 默认通道:直连 · 模型A(MiniMax) */
export function loadChannel(): Channel {
  const v = localStorage.getItem(CHANNEL_KEY);
  return v === 'gateway' || v === 'directB' || v === 'compare' ? v : 'directA';
}

export function saveChannel(channel: Channel): void {
  localStorage.setItem(CHANNEL_KEY, channel);
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant';
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
