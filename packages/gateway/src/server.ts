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
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize } from 'node:path';
import { analyze, type Astrolabe } from '@ziwei/core';
import {
  ALL_ENTRIES,
  ALL_SKILLS,
  buildSynastryPrompt,
  buildSystemPrompt,
  compareCharts,
  PROMPT_VERSION,
  retrieve,
  type Topic,
} from '@ziwei/knowledge';
import { availableProviders, type ProviderConfig } from './providers.js';
import { streamChat, type ChatMessage } from './stream.js';
import { InterpretCache } from './cache.js';

export interface GatewayOptions {
  provider: ProviderConfig;
  /** 请求体上限,默认 2MB */
  maxBodyBytes?: number;
  /** 解读缓存;默认启用(500 条 / 24h TTL),传 null 关闭 */
  cache?: InterpretCache | null;
  /** 静态文件目录(工作台构建产物);设置后网关同时托管前端,单进程部署 */
  staticDir?: string;
}

interface InterpretBody {
  chart: Astrolabe;
  /** 传入第二张盘即为合盘模式 */
  chartB?: Astrolabe;
  /** 解读技法(单盘模式),15 技法之一,见 @ziwei/knowledge ALL_SKILLS */
  skill?: string;
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
  if (options.cache === undefined) options = { ...options, cache: new InterpretCache() };
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
  if (req.method === 'GET' && url.pathname === '/api/cache/stats') {
    json(res, 200, options.cache ? options.cache.stats() : { disabled: true });
    return;
  }
  if (req.method === 'POST' && url.pathname === '/api/interpret') {
    await interpret(req, res, options);
    return;
  }
  if (req.method === 'GET' && options.staticDir && !url.pathname.startsWith('/api/')) {
    serveStatic(url.pathname, options.staticDir, res);
    return;
  }
  json(res, 404, { error: 'not found' });
}

// ------------------------------------------------------------ 静态文件托管

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
};

function serveStatic(pathname: string, staticDir: string, res: ServerResponse): void {
  // normalize 后拒绝越界,防路径穿越
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '');
  let filePath = join(staticDir, safe);
  if (!filePath.startsWith(normalize(staticDir))) {
    json(res, 403, { error: 'forbidden' });
    return;
  }
  if (!existsSync(filePath) || statSync(filePath).isDirectory()) {
    // SPA 回退:未知路径交给前端路由
    filePath = join(staticDir, 'index.html');
    if (!existsSync(filePath)) {
      json(res, 404, { error: 'not found' });
      return;
    }
  }
  const type = MIME[extname(filePath)] ?? 'application/octet-stream';
  res.writeHead(200, { 'content-type': type, ...CORS_HEADERS });
  createReadStream(filePath).pipe(res);
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

  if (body.chartB && (!body.chartB.palaces || body.chartB.palaces.length !== 12)) {
    json(res, 400, { error: 'chartB 不是合法星盘' });
    return;
  }
  const skill = body.skill ? ALL_SKILLS[body.skill] : undefined;
  if (body.skill && !skill) {
    json(res, 400, { error: `未知技法: ${body.skill}(可用: ${Object.keys(ALL_SKILLS).join(', ')})` });
    return;
  }

  const question =
    body.question?.trim() ||
    (body.chartB ? '请依照输出结构,为两张命盘做合盘分析。' : '请依照输出结构,为这张命盘做整体解读。');

  // 缓存键用 chart 全量内容计算(不信任客户端 meta.chartHash,防跨用户投毒)
  const cacheKey = options.cache
    ? InterpretCache.key({
        chart: { a: chart, b: body.chartB, skill: body.skill },
        topics: body.topics,
        question,
        provider: options.provider.name,
        model: options.provider.model,
        promptVersion: PROMPT_VERSION,
      })
    : null;
  const cached = cacheKey && options.cache ? options.cache.get(cacheKey) : undefined;

  const sseHead = (hit: boolean) =>
    res.writeHead(200, {
      'content-type': 'text/event-stream; charset=utf-8',
      'cache-control': 'no-cache',
      connection: 'keep-alive',
      'x-cache': hit ? 'hit' : 'miss',
      ...CORS_HEADERS,
    });

  if (cached !== undefined) {
    sseHead(true);
    res.write(`data: ${JSON.stringify({ delta: cached, cached: true })}\n\n`);
    res.write('data: [DONE]\n\n');
    res.end();
    return;
  }

  // 服务端重算分析与检索:确定性部分不信任客户端
  let system: string;
  if (body.chartB) {
    system = buildSynastryPrompt(chart, body.chartB, compareCharts(chart, body.chartB));
  } else {
    const features = analyze(chart);
    const topics = body.topics ?? skill?.topics;
    const retrieved = retrieve(features, ALL_ENTRIES, { topics });
    system = buildSystemPrompt(chart, features, retrieved, { skill });
  }
  const messages: ChatMessage[] = [
    { role: 'system', content: system },
    { role: 'user', content: question },
  ];

  sseHead(false);
  const parts: string[] = [];
  try {
    for await (const delta of streamChat(options.provider, { messages, temperature: body.temperature })) {
      parts.push(delta);
      res.write(`data: ${JSON.stringify({ delta })}\n\n`);
    }
    res.write('data: [DONE]\n\n');
    // 仅完整成功的流才入缓存
    if (cacheKey && options.cache && parts.length > 0) {
      options.cache.set(cacheKey, parts.join(''));
    }
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
