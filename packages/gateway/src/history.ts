/**
 * 多轮对话历史:校验客户端传入的历史轮次并装配为模型消息。
 * - 只接受 user/assistant 两种角色与非空字符串内容(system 始终由服务端装配,客户端无法注入)
 * - 最多保留最近 MAX_HISTORY_TURNS 轮、合计 MAX_HISTORY_CHARS 字,超出从最早处截断
 */
import type { ChatMessage } from './stream.js';

export const MAX_HISTORY_TURNS = 20;
export const MAX_HISTORY_CHARS = 24_000;

export interface HistoryTurn {
  role: 'user' | 'assistant';
  content: string;
}

export function sanitizeHistory(raw: unknown): HistoryTurn[] {
  if (!Array.isArray(raw)) return [];
  const turns: HistoryTurn[] = [];
  for (const item of raw) {
    if (!item || typeof item !== 'object') continue;
    const { role, content } = item as { role?: unknown; content?: unknown };
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') continue;
    const text = content.trim();
    if (!text) continue;
    turns.push({ role, content: text });
  }
  let kept = turns.slice(-MAX_HISTORY_TURNS);
  let total = kept.reduce((n, t) => n + t.content.length, 0);
  while (kept.length > 0 && total > MAX_HISTORY_CHARS) {
    total -= kept[0]!.content.length;
    kept = kept.slice(1);
  }
  return kept;
}

export function buildMessages(system: string, history: HistoryTurn[], question: string): ChatMessage[] {
  return [{ role: 'system', content: system }, ...history, { role: 'user', content: question }];
}
