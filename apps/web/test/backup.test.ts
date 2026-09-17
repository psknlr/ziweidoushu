/**
 * 备份/恢复:只打包 ziwei.* 键、格式校验、replace 与 merge 语义。
 */
import { describe, expect, test } from 'vitest';
import { createBackup, parseBackup, restoreBackup, summarize, type KeyValueStorage } from '../src/lib/backup.js';

function memStorage(init: Record<string, string> = {}): KeyValueStorage {
  const m = new Map(Object.entries(init));
  return {
    get length() { return m.size; },
    key: (i) => [...m.keys()][i] ?? null,
    getItem: (k) => m.get(k) ?? null,
    setItem: (k, v) => void m.set(k, v),
    removeItem: (k) => void m.delete(k),
  };
}

const profiles = (ids: string[]) => JSON.stringify(ids.map((id) => ({ id, name: id, input: {}, createdAt: '' })));

describe('createBackup / parseBackup', () => {
  test('只包含 ziwei.* 键,附格式与时间', () => {
    const s = memStorage({ 'ziwei.profiles.v1': profiles(['a']), 'other.key': 'x', 'ziwei.unlock.v1': 'digest' });
    const b = createBackup(s, '0.1.0.9', new Date('2026-09-17T00:00:00Z'));
    expect(Object.keys(b.data)).toEqual(['ziwei.profiles.v1', 'ziwei.unlock.v1']);
    expect(b.format).toBe('ziwei-workbench-backup');
    expect(b.appVersion).toBe('0.1.0.9');
    expect(summarize(b)).toMatchObject({ profiles: 1, conversations: 0, unlocked: true, keys: 2 });
  });

  test('往返序列化一致;非法文件被拒', () => {
    const s = memStorage({ 'ziwei.chats.v1': '[{"id":"c1"}]' });
    const text = JSON.stringify(createBackup(s));
    expect(parseBackup(text).data['ziwei.chats.v1']).toBe('[{"id":"c1"}]');
    expect(() => parseBackup('{not json')).toThrow(/JSON/);
    expect(() => parseBackup('{"format":"x","data":{}}')).toThrow(/备份文件/);
    expect(() => parseBackup(JSON.stringify({ format: 'ziwei-workbench-backup', version: 99, data: {} }))).toThrow(/升级/);
    // 非前缀键与非字符串值被丢弃
    const p = parseBackup(JSON.stringify({ format: 'ziwei-workbench-backup', version: 1, data: { 'evil.key': 'x', 'ziwei.a': 1, 'ziwei.b': 'ok' } }));
    expect(Object.keys(p.data)).toEqual(['ziwei.b']);
  });
});

describe('restoreBackup', () => {
  test('replace:清空本机 ziwei.* 后整体写入,其他键不动', () => {
    const s = memStorage({ 'ziwei.profiles.v1': profiles(['local']), 'ziwei.channel.v1': 'gateway', 'other.key': 'keep' });
    const b = parseBackup(JSON.stringify({ format: 'ziwei-workbench-backup', version: 1, data: { 'ziwei.profiles.v1': profiles(['bk']) } }));
    restoreBackup(s, b, 'replace');
    expect(s.getItem('ziwei.profiles.v1')).toBe(profiles(['bk']));
    expect(s.getItem('ziwei.channel.v1')).toBeNull();
    expect(s.getItem('other.key')).toBe('keep');
  });

  test('merge:档案/对话按 id 合并,当日计数保留本机,其余以备份覆盖', () => {
    const s = memStorage({
      'ziwei.profiles.v1': profiles(['a', 'b']),
      'ziwei.chats.v1': '[{"id":"c1"}]',
      'ziwei.usage.v1': '{"date":"2026-09-17","count":2}',
      'ziwei.channel.v1': 'gateway',
    });
    const b = parseBackup(JSON.stringify({
      format: 'ziwei-workbench-backup', version: 1,
      data: {
        'ziwei.profiles.v1': profiles(['b', 'c']),
        'ziwei.chats.v1': '[{"id":"c1"},{"id":"c2"}]',
        'ziwei.usage.v1': '{"date":"2026-01-01","count":0}',
        'ziwei.channel.v1': 'directA',
      },
    }));
    const sum = restoreBackup(s, b, 'merge');
    expect(JSON.parse(s.getItem('ziwei.profiles.v1')!).map((p: { id: string }) => p.id)).toEqual(['a', 'b', 'c']);
    expect(JSON.parse(s.getItem('ziwei.chats.v1')!).map((c: { id: string }) => c.id)).toEqual(['c1', 'c2']);
    expect(s.getItem('ziwei.usage.v1')).toContain('"count":2');
    expect(s.getItem('ziwei.channel.v1')).toBe('directA');
    expect(sum.profiles).toBe(3);
    expect(sum.conversations).toBe(2);
  });
});
