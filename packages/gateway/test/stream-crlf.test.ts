/**
 * SSE 解析鲁棒性:CRLF 分行、分块切割、单事件多 data 行。
 */
import { afterEach, describe, expect, test, vi } from 'vitest';
import { streamChat } from '../src/stream.js';
import type { ProviderConfig } from '../src/providers.js';

const provider: ProviderConfig = {
  name: 'test',
  kind: 'openai-compatible',
  baseUrl: 'https://example.invalid/v1',
  apiKey: 'k',
  model: 'm',
};

const chunk = (content: string) => `data: ${JSON.stringify({ choices: [{ delta: { content } }] })}`;

function fakeFetch(parts: string[]) {
  return vi.fn(async () => {
    const encoder = new TextEncoder();
    const body = new ReadableStream<Uint8Array>({
      start(controller) {
        for (const p of parts) controller.enqueue(encoder.encode(p));
        controller.close();
      },
    });
    return new Response(body, { status: 200 });
  });
}

async function collect(): Promise<string> {
  let out = '';
  for await (const d of streamChat(provider, { messages: [{ role: 'user', content: 'hi' }] })) out += d;
  return out;
}

afterEach(() => vi.unstubAllGlobals());

describe('streamChat SSE 解析', () => {
  test('LF 分行基础用例', async () => {
    vi.stubGlobal('fetch', fakeFetch([`${chunk('甲')}\n\n${chunk('乙')}\n\ndata: [DONE]\n\n`]));
    expect(await collect()).toBe('甲乙');
  });

  test('CRLF 分行的端点同样逐事件切分(此前会整段缓冲并丢失后续增量)', async () => {
    vi.stubGlobal('fetch', fakeFetch([`${chunk('甲')}\r\n\r\n${chunk('乙')}\r\n\r\n${chunk('丙')}\r\n\r\ndata: [DONE]\r\n\r\n`]));
    expect(await collect()).toBe('甲乙丙');
  });

  test('事件跨网络分块切割仍完整', async () => {
    const full = `${chunk('甲')}\n\n${chunk('乙丙')}\n\ndata: [DONE]\n\n`;
    const parts = [full.slice(0, 20), full.slice(20, 47), full.slice(47)];
    vi.stubGlobal('fetch', fakeFetch(parts));
    expect(await collect()).toBe('甲乙丙');
  });

  test('单事件多 data 行按序拼接;心跳注释行忽略', async () => {
    vi.stubGlobal('fetch', fakeFetch([`: keep-alive\n${chunk('甲')}\n${chunk('乙')}\n\n${chunk('丙')}\n\n`]));
    expect(await collect()).toBe('甲乙丙');
  });
});
