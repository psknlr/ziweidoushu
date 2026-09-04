/**
 * 防沉迷计日键:按设备本地日期而非 UTC。
 */
import { describe, expect, test } from 'vitest';
import { localDateKey } from '../src/lib/usage-limit.js';

describe('localDateKey', () => {
  test('使用本地日历日期,零填充', () => {
    const d = new Date(2026, 0, 5, 7, 30); // 本地 2026-01-05 07:30
    expect(localDateKey(d)).toBe('2026-01-05');
  });

  test('本地跨日即刷新(与 UTC 日期可能不同)', () => {
    const late = new Date(2026, 2, 31, 23, 59);
    const next = new Date(2026, 3, 1, 0, 1);
    expect(localDateKey(late)).toBe('2026-03-31');
    expect(localDateKey(next)).toBe('2026-04-01');
    expect(localDateKey(late)).not.toBe(localDateKey(next));
  });
});
