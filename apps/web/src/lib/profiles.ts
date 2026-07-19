/**
 * 本地档案库:多位用户出生资料存于 localStorage(隐私默认:数据不出设备)。
 * Android 封装(Capacitor WebView)下同样生效,即为 App 的本地档案存储。
 */
import type { BirthInput } from '@ziwei/core';

export interface Profile {
  id: string;
  name: string;
  input: BirthInput;
  createdAt: string;
}

const KEY = 'ziwei.profiles.v1';

export function loadProfiles(): Profile[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as Profile[];
  } catch {
    return [];
  }
}

export function saveProfile(name: string, input: BirthInput): Profile[] {
  const profiles = loadProfiles();
  const profile: Profile = {
    id: `p_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
    name: name.trim() || `档案${profiles.length + 1}`,
    input,
    createdAt: new Date().toISOString().slice(0, 10),
  };
  const next = [...profiles, profile];
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function deleteProfile(id: string): Profile[] {
  const next = loadProfiles().filter((p) => p.id !== id);
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}
