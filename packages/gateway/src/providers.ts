/**
 * LLM 供应商配置(L4 多模型网关)。
 *
 * 统一走 OpenAI 兼容 chat/completions 流式协议 ——
 * MiniMax、Poe、LiteLLM 均提供 OpenAI 兼容端点;Azure OpenAI 仅
 * URL 形态(deployments/{model} + api-version)与鉴权头(api-key)不同,
 * 单独建模为 kind: 'azure'。
 *
 * API Key 一律来自服务端环境变量,绝不进前端(设计文档 §7.1)。
 */

export type ProviderName = 'minimax' | 'azure' | 'poe' | 'litellm' | 'custom';

export interface ProviderConfig {
  name: string;
  kind: 'openai-compatible' | 'azure';
  /** openai-compatible:形如 https://host/v1;azure:资源端点 https://<res>.openai.azure.com */
  baseUrl: string;
  apiKey: string;
  /** azure 下为 deployment 名 */
  model: string;
  /** 仅 azure */
  apiVersion?: string;
  extraHeaders?: Record<string, string>;
}

type Env = Record<string, string | undefined>;

/** 各供应商的环境变量约定与默认值 */
export function resolveProvider(name: ProviderName, env: Env = process.env): ProviderConfig {
  switch (name) {
    case 'minimax':
      return openaiCompatible(name, env, {
        keyVar: 'MINIMAX_API_KEY',
        baseVar: 'MINIMAX_BASE_URL',
        modelVar: 'MINIMAX_MODEL',
        defaultBase: 'https://api.minimaxi.com/v1',
        defaultModel: 'MiniMax-Text-01',
      });
    case 'poe':
      return openaiCompatible(name, env, {
        keyVar: 'POE_API_KEY',
        baseVar: 'POE_BASE_URL',
        modelVar: 'POE_MODEL',
        defaultBase: 'https://api.poe.com/v1',
        defaultModel: 'Claude-Sonnet-4.5',
      });
    case 'litellm':
      return openaiCompatible(name, env, {
        keyVar: 'LITELLM_API_KEY',
        baseVar: 'LITELLM_BASE_URL',
        modelVar: 'LITELLM_MODEL',
        defaultBase: 'http://127.0.0.1:4000/v1',
        defaultModel: 'gpt-4o',
      });
    case 'custom':
      return openaiCompatible(name, env, {
        keyVar: 'OPENAI_API_KEY',
        baseVar: 'OPENAI_BASE_URL',
        modelVar: 'OPENAI_MODEL',
        defaultBase: 'https://api.openai.com/v1',
        defaultModel: 'gpt-4o',
      });
    case 'azure': {
      const endpoint = required(env, 'AZURE_OPENAI_ENDPOINT');
      return {
        name,
        kind: 'azure',
        baseUrl: endpoint.replace(/\/$/, ''),
        apiKey: required(env, 'AZURE_OPENAI_API_KEY'),
        model: required(env, 'AZURE_OPENAI_DEPLOYMENT'),
        apiVersion: env['AZURE_OPENAI_API_VERSION'] ?? '2024-10-21',
      };
    }
  }
}

/** 返回环境中已配置齐全的供应商列表(用于 /api/providers 与启动自检) */
export function availableProviders(env: Env = process.env): ProviderName[] {
  const names: ProviderName[] = ['minimax', 'azure', 'poe', 'litellm', 'custom'];
  return names.filter((n) => {
    try {
      resolveProvider(n, env);
      return true;
    } catch {
      return false;
    }
  });
}

/** 上游 chat/completions 请求 URL 与鉴权头 */
export function upstreamRequest(p: ProviderConfig): { url: string; headers: Record<string, string> } {
  if (p.kind === 'azure') {
    return {
      url: `${p.baseUrl}/openai/deployments/${encodeURIComponent(p.model)}/chat/completions?api-version=${p.apiVersion}`,
      headers: { 'api-key': p.apiKey, 'content-type': 'application/json', ...p.extraHeaders },
    };
  }
  return {
    url: `${p.baseUrl.replace(/\/$/, '')}/chat/completions`,
    headers: { authorization: `Bearer ${p.apiKey}`, 'content-type': 'application/json', ...p.extraHeaders },
  };
}

function openaiCompatible(
  name: string,
  env: Env,
  spec: { keyVar: string; baseVar: string; modelVar: string; defaultBase: string; defaultModel: string },
): ProviderConfig {
  return {
    name,
    kind: 'openai-compatible',
    baseUrl: env[spec.baseVar] ?? spec.defaultBase,
    apiKey: required(env, spec.keyVar),
    model: env[spec.modelVar] ?? spec.defaultModel,
  };
}

function required(env: Env, key: string): string {
  const value = env[key];
  if (!value) throw new Error(`[@ziwei/gateway] 缺少环境变量 ${key}`);
  return value;
}
