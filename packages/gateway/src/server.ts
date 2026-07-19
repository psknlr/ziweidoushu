/**
 * AI 解读网关 HTTP 服务(零外部依赖,node:http)。
 *
 * POST /api/interpret  { chart, topics?, question?, temperature? } → SSE 流
 *   - features 由服务端重算(不信任客户端分析结果)
 *   - RAG 检索 + 五要素 System Prompt 装配在服务端完成,Prompt 不出服务器
 * GET  /api/health     健康检查
 * GET  /api/providers  环境中已配置的供应商列表
 */
import { createServer, type IncomingMessage, type Server, type ServerResponse } from 'node:http';
import { analyze, type Astrolabe } from '@ziwei/core';
import { ALL_ENTRIES, buildSystemPrompt, retrieve, type Topic } from '@ziwei/knowledge';
import { availableProviders, type ProviderConfig } from './providers.js';
import { streamChat, type ChatMessage } from './stream.js';

export interface GatewayOptions {
  provider: ProviderConfig;
  /** 请求体上限,默认 2MB */
  maxBodyBytes?: number;
}

interface InterpretBody {
  chart: Astrolabe;
  topics?: Topic[];
  question?: string;
  temperature?: number;
}

const CORS_HEADERS = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
  'access-control-allow-headers': 'content-type',
};

export function createGatewayServer(options: GatewayOptions): Server {
  return createServer((req, res) => {
    void route(req, res, options).catch((error: unknown) => {
      if (!res.headersSent) {
        res.writeHead(500, { 'content-type': 'application/json', ...CORS_HEADERS });
        res.end(JSON.stringify({ error: String(error) }));
      } else {
        res.end();
      }
    });
  });
}

async function route(req: IncomingMessage, res: ServerResponse, options: GatewayOptions): Promise<void> {
  const url = new URL(req.url ?? '/', 'http://localhost');

  if (req.method === 'OPTIONS') {
    res.writeHead(204, CORS_HEADERS);
    res.end();
    return;
  }
  if (req.method === 'GET' && url.pathname === '/api/health') {
    json(res, 200, { ok: true, provider: options.provider.name, model: options.provider.model });
    return;
  }
  if (req.method === 'GET' && url.pathname === '/api/providers') {
    json(res, 200, { active: options.provider.name, configured: availableProviders() });
    return;
  }
  if (req.method === 'POST' && url.pathname === '/api/interpret') {
    await interpret(req, res, options);
    return;
  }
  json(res, 404, { error: 'not found' });
}

async function interpret(req: IncomingMessage, res: ServerResponse, options: GatewayOptions): Promise<void> {
  let body: InterpretBody;
  try {
    body = JSON.parse(await readBody(req, options.maxBodyBytes ?? 2 * 1024 * 1024)) as InterpretBody;
  } catch (error) {
    json(res, 400, { error: `请求体解析失败: ${String(error)}` });
    return;
  }
  const chart = body.chart;
  if (!chart?.palaces || chart.palaces.length !== 12 || !chart.meta?.school) {
    json(res, 400, { error: 'chart 字段缺失或不是合法星盘(需 12 宫与 meta.school)' });
    return;
  }

  // 服务端重算分析与检索:确定性部分不信任客户端
  const features = analyze(chart);
  const retrieved = retrieve(features, ALL_ENTRIES, { topics: body.topics });
  const system = buildSystemPrompt(chart, features, retrieved);
  const messages: ChatMessage[] = [
    { role: 'system', content: system },
    { role: 'user', content: body.question?.trim() || '请依照输出结构,为这张命盘做整体解读。' },
  ];

  res.writeHead(200, {
    'content-type': 'text/event-stream; charset=utf-8',
    'cache-control': 'no-cache',
    connection: 'keep-alive',
    ...CORS_HEADERS,
  });
  try {
    for await (const delta of streamChat(options.provider, { messages, temperature: body.temperature })) {
      res.write(`data: ${JSON.stringify({ delta })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
  } catch (error) {
    res.write(`data: ${JSON.stringify({ error: String(error) })}\n\n`);
  }
  res.end();
}

function readBody(req: IncomingMessage, limit: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    let size = 0;
    req.on('data', (chunk: Buffer) => {
      size += chunk.length;
      if (size > limit) {
        reject(new Error(`请求体超过 ${limit} 字节上限`));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf-8')));
    req.on('error', reject);
  });
}

function json(res: ServerResponse, status: number, payload: unknown): void {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', ...CORS_HEADERS });
  res.end(JSON.stringify(payload));
}
