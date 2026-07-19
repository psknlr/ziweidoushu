/**
 * 网关测试:mock 上游(OpenAI 兼容 SSE)驱动,无需真实 API Key。
 * 覆盖:URL/鉴权构造、SSE 解析、端到端 /api/interpret(服务端 RAG+Prompt 装配)。
 */
import { createServer, type Server } from 'node:http';
import type { AddressInfo } from 'node:net';
import { afterAll, beforeAll, describe, expect, test } from 'vitest';
import { ZiweiEngine } from '@ziwei/core';
import { DISCLAIMER } from '@ziwei/knowledge';
import { createGatewayServer } from '../src/server.js';
import { resolveProvider, upstreamRequest, type ProviderConfig } from '../src/providers.js';
import { streamChat } from '../src/stream.js';

// ---------------------------------------------------------------- mock 上游

interface CapturedRequest {
  auth?: string;
  apiKey?: string;
  url?: string;
  body?: { model: string; stream: boolean; messages: { role: string; content: string }[] };
}

const captured: CapturedRequest = {};
let upstream: Server;
let upstreamPort = 0;

const SSE_CHUNKS = ['命宫廉贞破军,', '主开创与变革,', '行运喜化禄引动。'];

beforeAll(async () => {
  upstream = createServer((req, res) => {
    captured.auth = req.headers.authorization;
    captured.apiKey = req.headers['api-key'] as string | undefined;
    captured.url = req.url;
    const chunks: Buffer[] = [];
    req.on('data', (c: Buffer) => chunks.push(c));
    req.on('end', () => {
      captured.body = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
      res.writeHead(200, { 'content-type': 'text/event-stream' });
      for (const text of SSE_CHUNKS) {
        res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: text } }] })}\n\n`);
      }
      res.write('data: [DONE]\n\n');
      res.end();
    });
  });
  await new Promise<void>((resolve) => upstream.listen(0, '127.0.0.1', resolve));
  upstreamPort = (upstream.address() as AddressInfo).port;
});

afterAll(() => {
  upstream.close();
});

const mockProvider = (): ProviderConfig => ({
  name: 'mock',
  kind: 'openai-compatible',
  baseUrl: `http://127.0.0.1:${upstreamPort}/v1`,
  apiKey: 'test-key-123',
  model: 'mock-model',
});

// ------------------------------------------------------------------- 单元

describe('供应商配置', () => {
  test('minimax/poe/litellm/custom 走 OpenAI 兼容,Bearer 鉴权', () => {
    const p = resolveProvider('minimax', { MINIMAX_API_KEY: 'k1' });
    expect(p.baseUrl).toBe('https://api.minimaxi.com/v1');
    const { url, headers } = upstreamRequest(p);
    expect(url).toBe('https://api.minimaxi.com/v1/chat/completions');
    expect(headers.authorization).toBe('Bearer k1');

    const poe = resolveProvider('poe', { POE_API_KEY: 'k2', POE_MODEL: 'GPT-5' });
    expect(upstreamRequest(poe).url).toBe('https://api.poe.com/v1/chat/completions');
    expect(poe.model).toBe('GPT-5');

    const lite = resolveProvider('litellm', { LITELLM_API_KEY: 'k3', LITELLM_BASE_URL: 'http://gw:4000/v1' });
    expect(upstreamRequest(lite).url).toBe('http://gw:4000/v1/chat/completions');
  });

  test('azure:deployments URL + api-version + api-key 头', () => {
    const p = resolveProvider('azure', {
      AZURE_OPENAI_ENDPOINT: 'https://res.openai.azure.com/',
      AZURE_OPENAI_API_KEY: 'ak',
      AZURE_OPENAI_DEPLOYMENT: 'gpt-4o-prod',
    });
    const { url, headers } = upstreamRequest(p);
    expect(url).toBe(
      'https://res.openai.azure.com/openai/deployments/gpt-4o-prod/chat/completions?api-version=2024-10-21',
    );
    expect(headers['api-key']).toBe('ak');
    expect(headers.authorization).toBeUndefined();
  });

  test('缺 Key 抛出明确错误', () => {
    expect(() => resolveProvider('minimax', {})).toThrow(/MINIMAX_API_KEY/);
  });
});

describe('流式适配', () => {
  test('SSE 增量完整还原,鉴权头正确送达上游', async () => {
    const parts: string[] = [];
    for await (const delta of streamChat(mockProvider(), {
      messages: [{ role: 'user', content: 'hi' }],
    })) {
      parts.push(delta);
    }
    expect(parts).toEqual(SSE_CHUNKS);
    expect(captured.auth).toBe('Bearer test-key-123');
    expect(captured.url).toBe('/v1/chat/completions');
    expect(captured.body?.stream).toBe(true);
    expect(captured.body?.model).toBe('mock-model');
  });
});

// ---------------------------------------------------------------- 端到端

describe('端到端 /api/interpret', () => {
  test('真实命盘 → 服务端装配 Prompt → SSE 输出', async () => {
    const gateway = createGatewayServer({ provider: mockProvider() });
    await new Promise<void>((resolve) => gateway.listen(0, '127.0.0.1', resolve));
    const port = (gateway.address() as AddressInfo).port;

    try {
      const chart = new ZiweiEngine().bySolar('2000-8-16', 2, 'female');
      const response = await fetch(`http://127.0.0.1:${port}/api/interpret`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chart, topics: ['career'], question: '事业方向如何?' }),
      });
      expect(response.status).toBe(200);
      expect(response.headers.get('content-type')).toContain('text/event-stream');

      const raw = await response.text();
      const deltas = [...raw.matchAll(/data: (\{.*\})\n/g)].map(
        (m) => (JSON.parse(m[1]!) as { delta?: string }).delta ?? '',
      );
      expect(deltas.join('')).toBe(SSE_CHUNKS.join(''));
      expect(raw).toContain('data: [DONE]');

      // 服务端装配的 system prompt 送达上游:含免责声明与盘面事实;用户问题在 user 消息
      const system = captured.body?.messages.find((m) => m.role === 'system')?.content ?? '';
      expect(system).toContain(DISCLAIMER);
      expect(system).toContain('命宫在午');
      expect(captured.body?.messages.find((m) => m.role === 'user')?.content).toBe('事业方向如何?');
    } finally {
      gateway.close();
    }
  });

  test('非法请求体返回 400', async () => {
    const gateway = createGatewayServer({ provider: mockProvider() });
    await new Promise<void>((resolve) => gateway.listen(0, '127.0.0.1', resolve));
    const port = (gateway.address() as AddressInfo).port;
    try {
      const bad = await fetch(`http://127.0.0.1:${port}/api/interpret`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ chart: { palaces: [] } }),
      });
      expect(bad.status).toBe(400);
      const health = await fetch(`http://127.0.0.1:${port}/api/health`);
      expect(((await health.json()) as { ok: boolean }).ok).toBe(true);
    } finally {
      gateway.close();
    }
  });
});
