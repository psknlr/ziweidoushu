/**
 * 人物组合方案:把一组档案 id 存为命名方案,便于在智能体页一键复用
 * (如「全家」「合伙人」)。localStorage,随数据备份一并导出。
 */
export interface GroupPreset {
  id: string;
  name: string;
  /** 主盘档案 id('current' 表示当时的当前盘)+ 成员档案 id */
  primaryId: string;
  memberIds: string[];
  createdAt: string;
}

const KEY = 'ziwei.groups.v1';

export function loadGroupPresets(): GroupPreset[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]') as unknown;
    return Array.isArray(raw) ? (raw as GroupPreset[]).filter((g) => g && typeof g.id === 'string' && Array.isArray(g.memberIds)) : [];
  } catch {
    return [];
  }
}

export function saveGroupPreset(name: string, primaryId: string, memberIds: string[]): GroupPreset[] {
  const list = loadGroupPresets();
  const preset: GroupPreset = {
    id: `g_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim() || `方案${list.length + 1}`,
    primaryId,
    memberIds: [...memberIds],
    createdAt: new Date().toISOString().slice(0, 10),
  };
  const next = [...list, preset];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function deleteGroupPreset(id: string): GroupPreset[] {
  const next = loadGroupPresets().filter((g) => g.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
