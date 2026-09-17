/**
 * 全量数据备份/恢复:把本机所有工作台数据(档案、对话历史、直连配置、通道、
 * 解锁状态、防沉迷计数)打包为一份 JSON,可导出到文件、跨设备/跨版本恢复。
 * 只处理本应用自己的 localStorage 键(前缀 ziwei.),不触碰其他数据。
 */

export const BACKUP_FORMAT = 'ziwei-workbench-backup';
export const BACKUP_VERSION = 1;
const PREFIX = 'ziwei.';

export interface KeyValueStorage {
  length: number;
  key(i: number): string | null;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface BackupFile {
  format: typeof BACKUP_FORMAT;
  version: number;
  exportedAt: string;
  appVersion?: string;
  /** 键 → 原始字符串值(保持各模块自己的序列化格式,不解析) */
  data: Record<string, string>;
}

/** 人类可读的摘要,用于 UI 与确认框 */
export interface BackupSummary {
  profiles: number;
  conversations: number;
  providersConfigured: boolean;
  unlocked: boolean;
  keys: number;
}

function ownKeys(storage: KeyValueStorage): string[] {
  const keys: string[] = [];
  for (let i = 0; i < storage.length; i++) {
    const k = storage.key(i);
    if (k && k.startsWith(PREFIX)) keys.push(k);
  }
  return keys.sort();
}

export function createBackup(storage: KeyValueStorage, appVersion?: string, now = new Date()): BackupFile {
  const data: Record<string, string> = {};
  for (const k of ownKeys(storage)) {
    const v = storage.getItem(k);
    if (v !== null) data[k] = v;
  }
  return { format: BACKUP_FORMAT, version: BACKUP_VERSION, exportedAt: now.toISOString(), ...(appVersion ? { appVersion } : {}), data };
}

export function parseBackup(text: string): BackupFile {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    throw new Error('不是有效的 JSON 文件');
  }
  const b = raw as Partial<BackupFile>;
  if (!b || b.format !== BACKUP_FORMAT || typeof b.data !== 'object' || b.data === null) {
    throw new Error('不是紫微斗数工作台的备份文件');
  }
  if (typeof b.version !== 'number' || b.version > BACKUP_VERSION) {
    throw new Error(`备份版本 ${String(b.version)} 高于当前支持的 ${BACKUP_VERSION},请先升级 App`);
  }
  const data: Record<string, string> = {};
  for (const [k, v] of Object.entries(b.data)) {
    if (k.startsWith(PREFIX) && typeof v === 'string') data[k] = v;
  }
  return { format: BACKUP_FORMAT, version: b.version, exportedAt: String(b.exportedAt ?? ''), ...(b.appVersion ? { appVersion: b.appVersion } : {}), data };
}

const countArray = (json: string | undefined): number => {
  if (!json) return 0;
  try {
    const v = JSON.parse(json) as unknown;
    return Array.isArray(v) ? v.length : 0;
  } catch {
    return 0;
  }
};

export function summarize(b: BackupFile): BackupSummary {
  let providersConfigured = false;
  try {
    const p = JSON.parse(b.data['ziwei.direct-providers.v1'] ?? '[]') as { apiKey?: string }[];
    providersConfigured = Array.isArray(p) && p.some((x) => !!x?.apiKey);
  } catch {
    /* ignore */
  }
  return {
    profiles: countArray(b.data['ziwei.profiles.v1']),
    conversations: countArray(b.data['ziwei.chats.v1']),
    providersConfigured,
    unlocked: !!b.data['ziwei.unlock.v1'],
    keys: Object.keys(b.data).length,
  };
}

export type RestoreMode = 'replace' | 'merge';

/**
 * 恢复:
 * - replace:先清空本机 ziwei.* 键,再整体写入
 * - merge:档案/对话按 id 去重合并(备份优先补齐缺失项),其余键以备份覆盖
 */
export function restoreBackup(storage: KeyValueStorage, b: BackupFile, mode: RestoreMode): BackupSummary {
  if (mode === 'replace') {
    for (const k of ownKeys(storage)) storage.removeItem(k);
    for (const [k, v] of Object.entries(b.data)) storage.setItem(k, v);
    return summarize(b);
  }
  for (const [k, v] of Object.entries(b.data)) {
    if (k === 'ziwei.profiles.v1' || k === 'ziwei.chats.v1') {
      storage.setItem(k, mergeById(storage.getItem(k), v));
    } else if (k === 'ziwei.usage.v1') {
      // 当日计数以本机为准,不用备份覆盖
      if (storage.getItem(k) === null) storage.setItem(k, v);
    } else {
      storage.setItem(k, v);
    }
  }
  return summarize(createBackup(storage));
}

function mergeById(currentJson: string | null, incomingJson: string): string {
  const parse = (s: string | null): { id?: string }[] => {
    try {
      const v = JSON.parse(s ?? '[]') as unknown;
      return Array.isArray(v) ? (v as { id?: string }[]) : [];
    } catch {
      return [];
    }
  };
  const current = parse(currentJson);
  const incoming = parse(incomingJson);
  const ids = new Set(current.map((x) => x.id).filter(Boolean));
  const merged = [...current, ...incoming.filter((x) => !x.id || !ids.has(x.id))];
  return JSON.stringify(merged);
}
