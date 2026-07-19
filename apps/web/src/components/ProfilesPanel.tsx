/**
 * 本地档案面板:保存多位用户出生资料(localStorage,数据不出设备),
 * 一键载入排盘;勾选两人进入合盘比较(智能体本地配对)。
 */
import { useState } from 'react';
import type { BirthInput } from '@ziwei/core';
import { deleteProfile, loadProfiles, saveProfile, type Profile } from '../lib/profiles.js';

interface Props {
  currentInput: BirthInput | null;
  onLoad: (input: BirthInput) => void;
  onSynastry: (a: Profile, b: Profile) => void;
}

export function ProfilesPanel({ currentInput, onLoad, onSynastry }: Props) {
  const [profiles, setProfiles] = useState<Profile[]>(() => loadProfiles());
  const [name, setName] = useState('');
  const [pickA, setPickA] = useState<string | null>(null);
  const [pickB, setPickB] = useState<string | null>(null);

  const save = () => {
    if (!currentInput) return;
    setProfiles(saveProfile(name, currentInput));
    setName('');
  };
  const remove = (id: string) => {
    setProfiles(deleteProfile(id));
    if (pickA === id) setPickA(null);
    if (pickB === id) setPickB(null);
  };
  const a = profiles.find((p) => p.id === pickA);
  const b = profiles.find((p) => p.id === pickB);

  return (
    <div className="panel profiles-panel">
      <h2>本地档案({profiles.length})</h2>
      <div className="profile-save">
        <input placeholder="姓名/备注" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="button" onClick={save} disabled={!currentInput} title={currentInput ? '' : '先排一张盘'}>
          存当前盘
        </button>
      </div>
      {profiles.length === 0 && <p className="hint">排盘后点「存当前盘」,即可保存多位用户资料到本机。</p>}
      <ul className="profile-list">
        {profiles.map((p) => (
          <li key={p.id}>
            <button type="button" className="profile-name" onClick={() => onLoad(p.input)} title="载入排盘">
              {p.name}
            </button>
            <span className="profile-meta">
              {p.input.year}-{p.input.month}-{p.input.day} {p.input.gender === 'male' ? '男' : '女'}
            </span>
            <span className="profile-actions">
              <button type="button" className={pickA === p.id ? 'pick active' : 'pick'} onClick={() => setPickA(pickA === p.id ? null : p.id)}>
                甲
              </button>
              <button type="button" className={pickB === p.id ? 'pick active' : 'pick'} onClick={() => setPickB(pickB === p.id ? null : p.id)}>
                乙
              </button>
              <button type="button" className="pick danger" onClick={() => remove(p.id)}>
                ✕
              </button>
            </span>
          </li>
        ))}
      </ul>
      {a && b && a.id !== b.id && (
        <button type="button" className="primary" onClick={() => onSynastry(a, b)}>
          合盘比较:{a.name} × {b.name}
        </button>
      )}
    </div>
  );
}
