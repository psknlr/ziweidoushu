/**
 * 组合方案存储:保存/载入/删除、损坏数据容错。
 */
import { beforeEach, describe, expect, test } from 'vitest';
import { deleteGroupPreset, loadGroupPresets, saveGroupPreset } from '../src/lib/groups.js';

const mem = new Map<string, string>();
beforeEach(() => {
  mem.clear();
  (globalThis as unknown as { localStorage: Storage }).localStorage = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, v),
    removeItem: (k: string) => void mem.delete(k),
    clear: () => mem.clear(),
    key: (i: number) => [...mem.keys()][i] ?? null,
    get length() { return mem.size; },
  } as Storage;
});

describe('group presets', () => {
  test('保存并载入,默认命名,删除', () => {
    expect(loadGroupPresets()).toEqual([]);
    const list = saveGroupPreset('  ', 'p3', ['p1', 'p2']);
    expect(list).toHaveLength(1);
    expect(list[0]!.name).toBe('方案1');
    expect(list[0]!.memberIds).toEqual(['p1', 'p2']);
    saveGroupPreset('全家', 'current', ['p1']);
    expect(loadGroupPresets().map((g) => g.name)).toEqual(['方案1', '全家']);
    const after = deleteGroupPreset(list[0]!.id);
    expect(after.map((g) => g.name)).toEqual(['全家']);
  });

  test('损坏数据返回空', () => {
    mem.set('ziwei.groups.v1', '{bad');
    expect(loadGroupPresets()).toEqual([]);
    mem.set('ziwei.groups.v1', JSON.stringify([{ id: 'x' }, { id: 'y', memberIds: [] }]));
    expect(loadGroupPresets().map((g) => g.id)).toEqual(['y']);
  });
});
