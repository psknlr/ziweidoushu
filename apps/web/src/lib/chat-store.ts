/**
 * 智能体对话存储(本地):多轮对话按命盘归档,支持历史查看、删除与导出。
 * 存储后端可注入(测试 / 非浏览器环境),默认 localStorage;数据不上传。
 */

export interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
  /** ISO 时间 */
  at: string;
  /** 回答方标签(模型名 / 网关);用于双模型对比时分流历史 */
  label?: string;
  /** 随问题携带的运限上下文(仅送模型,不在气泡中展示) */
  context?: string;
  skill?: string;
  mode?: string;
  error?: boolean;
}

export interface Conversation {
  id: string;
  chartHash: string;
  /** 命盘可读标签,如「男命 1990-1-15」 */
  chartLabel: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  turns: ChatTurn[];
}

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const STORAGE_KEY = 'ziwei.chats.v1';
export const MAX_CONVERSATIONS = 200;

export function createMemoryStorage(): KeyValueStorage {
  const map = new Map<string, string>();
  return {
    getItem: (k) => map.get(k) ?? null,
    setItem: (k, v) => void map.set(k, v),
    removeItem: (k) => void map.delete(k),
  };
}

function defaultStorage(): KeyValueStorage {
  return typeof localStorage !== 'undefined' ? localStorage : createMemoryStorage();
}

export function newConversation(chartHash: string, chartLabel: string, now = new Date()): Conversation {
  const at = now.toISOString();
  return {
    id: `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
    chartHash,
    chartLabel,
    title: '',
    createdAt: at,
    updatedAt: at,
    turns: [],
  };
}

/** 对话标题:取首问前 24 字;空问题用技法名兜底 */
export function conversationTitle(question: string, fallback: string): string {
  const q = question.replace(/\s+/g, ' ').trim();
  if (!q) return fallback;
  return q.length > 24 ? `${q.slice(0, 24)}…` : q;
}

/**
 * 供模型使用的历史消息:全部用户轮(含运限上下文)+ 指定回答方的有效回答。
 * 双模型对比时各模型只看到自己的既往回答,避免串流。
 */
export function historyFor(conv: Conversation, label: string): { role: 'user' | 'assistant'; content: string }[] {
  const out: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const t of conv.turns) {
    if (t.role === 'user') {
      out.push({ role: 'user', content: t.content + (t.context ? `\n\n${t.context}` : '') });
    } else if (t.label === label && !t.error && t.content.trim()) {
      out.push({ role: 'assistant', content: t.content });
    }
  }
  // 末尾若是未获回答的用户轮(刚发出的问题),交由调用方追加,这里去掉
  while (out.length > 0 && out[out.length - 1]!.role === 'user') out.pop();
  return out;
}

export function conversationToMarkdown(conv: Conversation): string {
  const lines = [
    `# ${conv.title || '紫微斗数对话'}`,
    '',
    `- 命盘:${conv.chartLabel}(hash ${conv.chartHash})`,
    `- 时间:${conv.createdAt.slice(0, 19).replace('T', ' ')} ~ ${conv.updatedAt.slice(0, 19).replace('T', ' ')}`,
    '- 出品:紫微斗数工作台 · 医哲未来人工智能研究院(IMPF-AI)',
    '',
  ];
  for (const t of conv.turns) {
    const who = t.role === 'user' ? '**问**' : `**答${t.label ? `(${t.label})` : ''}**`;
    lines.push(`${who}:`, '', t.content.trim(), '');
    if (t.role === 'user' && t.context) lines.push('> ' + t.context.split('\n').join('\n> '), '');
  }
  lines.push('---', '命理内容仅供文化研究与自我认知参考,不构成医疗/投资/重大决策建议。');
  return lines.join('\n');
}

export class ChatStore {
  constructor(
    private readonly storage: KeyValueStorage = defaultStorage(),
    private readonly maxConversations = MAX_CONVERSATIONS,
  ) {}

  private readAll(): Conversation[] {
    try {
      const raw = JSON.parse(this.storage.getItem(STORAGE_KEY) ?? '[]') as unknown;
      return Array.isArray(raw) ? (raw as Conversation[]).filter((c) => c && typeof c.id === 'string') : [];
    } catch {
      return [];
    }
  }

  private writeAll(list: Conversation[]): void {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  /** 按最近更新倒序;传 chartHash 仅取该盘的对话 */
  list(chartHash?: string): Conversation[] {
    return this.readAll()
      .filter((c) => !chartHash || c.chartHash === chartHash)
      .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  }

  get(id: string): Conversation | undefined {
    return this.readAll().find((c) => c.id === id);
  }

  /** 新增或覆盖;超过上限时淘汰最久未更新的对话 */
  save(conv: Conversation): void {
    const rest = this.readAll().filter((c) => c.id !== conv.id);
    rest.push(conv);
    rest.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
    this.writeAll(rest.slice(0, this.maxConversations));
  }

  remove(id: string): void {
    this.writeAll(this.readAll().filter((c) => c.id !== id));
  }

  /** 清空(可限定某张盘) */
  clear(chartHash?: string): void {
    this.writeAll(chartHash ? this.readAll().filter((c) => c.chartHash !== chartHash) : []);
  }

  exportJson(chartHash?: string): string {
    return JSON.stringify(
      {
        generator: '紫微斗数工作台 · IMPF-AI',
        exportedAt: new Date().toISOString(),
        conversations: this.list(chartHash),
      },
      null,
      2,
    );
  }
}
