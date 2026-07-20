/**
 * 防沉迷机制(本地):每日最多排盘 3 次;持特殊权限密钥(16 进制)可解锁。
 *
 * - 密钥不以明文出现在代码中,仅嵌入其 SHA-256 摘要做校验
 * - 解锁状态与当日计数均存于本机 localStorage(隐私默认,不上传)
 * - 定位:健康使用提醒,防止对命理产生依赖;研究/机构用户凭密钥解除
 */

export const DAILY_LIMIT = 3;

/** 特殊权限密钥的 SHA-256 摘要(密钥本体由 IMPF-AI 管理层持有) */
const UNLOCK_DIGEST = '9aa01f131cd6d400377a4185b11bc58dea94829550912ac08d69a7edfa75dee1';

const COUNT_KEY = 'ziwei.usage.v1';
const UNLOCK_KEY = 'ziwei.unlock.v1';

const today = (): string => new Date().toISOString().slice(0, 10);

interface UsageRecord {
  date: string;
  count: number;
}

function readUsage(): UsageRecord {
  try {
    const raw = JSON.parse(localStorage.getItem(COUNT_KEY) ?? 'null') as UsageRecord | null;
    if (raw && raw.date === today()) return raw;
  } catch {
    /* 损坏则重置 */
  }
  return { date: today(), count: 0 };
}

export function isUnlocked(): boolean {
  return localStorage.getItem(UNLOCK_KEY) === UNLOCK_DIGEST;
}

export function remainingToday(): number {
  if (isUnlocked()) return Infinity;
  return Math.max(0, DAILY_LIMIT - readUsage().count);
}

/** 消耗一次排盘额度;超限且未解锁时返回 false(不计数) */
export function consumeUsage(): boolean {
  if (isUnlocked()) return true;
  const usage = readUsage();
  if (usage.count >= DAILY_LIMIT) return false;
  localStorage.setItem(COUNT_KEY, JSON.stringify({ date: usage.date, count: usage.count + 1 }));
  return true;
}

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** 校验 16 进制密钥;正确则永久解锁本设备 */
export async function tryUnlock(key: string): Promise<boolean> {
  const normalized = key.trim().toLowerCase().replace(/[^0-9a-f]/g, '');
  if (normalized.length < 16) return false;
  const digest = await sha256Hex(normalized);
  if (digest !== UNLOCK_DIGEST) return false;
  localStorage.setItem(UNLOCK_KEY, digest);
  return true;
}

/** 撤销解锁(测试/移交设备用) */
export function revokeUnlock(): void {
  localStorage.removeItem(UNLOCK_KEY);
}
