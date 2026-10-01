/**
 * 本地档案面板:保存多位用户出生资料(localStorage,数据不出设备),一键载入排盘;
 * 点选任意多位档案组成人物组合:恰好两人可做合盘比较,任意组合可进入智能体群盘(与智能体页共用同一选择)。
 */
import { useState } from 'react';
import type { BirthInput } from '@ziwei/core';
import { deleteProfile, saveProfile, type Profile } from '../lib/profiles.js';

interface Props {
  profiles: Profile[];
  onProfilesChange: (profiles: Profile[]) => void;
  currentInput: BirthInput | null;
  onLoad: (input: BirthInput) => void;
  /** 已点选的档案 id(有序) */
  selectedIds: string[];
  onToggleSelect: (id: string) => void;
  onClearSelect: () => void;
  onSynastry: (a: Profile, b: Profile) => void;
  /** 以当前点选的组合进入智能体群盘 */
  onGroup: () => void;
  maxGroup: number;
}

export function ProfilesPanel({
  profiles, onProfilesChange, currentInput, onLoad, selectedIds, onToggleSelect, onClearSelect, onSynastry, onGroup, maxGroup,
}: Props) {
  const [name, setName] = useState('');

  const save = () => {
    if (!currentInput) return;
    onProfilesChange(saveProfile(name, currentInput));
    setName('');
  };
  const remove = (id: string) => {
    onProfilesChange(deleteProfile(id));
    if (selectedIds.includes(id)) onToggleSelect(id);
  };
  const selected = selectedIds.map((id) => profiles.find((p) => p.id === id)).filter((p): p is Profile => !!p);
  const canGroup = selected.length >= 2 || (selected.length === 1 && !!currentInput);

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
      {profiles.length > 0 && <p className="hint">点「选」勾选任意多人组成组合:两人可合盘比较,任意组合可进入智能体做群盘多轮解读。</p>}
      <ul className="profile-list">
        {profiles.map((p) => {
          const order = selectedIds.indexOf(p.id);
          return (
            <li key={p.id} className={order >= 0 ? 'selected' : ''}>
              <button
                type="button"
                className={order >= 0 ? 'pick active' : 'pick'}
                onClick={() => onToggleSelect(p.id)}
                disabled={order < 0 && selectedIds.length >= maxGroup}
                title={order >= 0 ? '取消选择' : '加入组合'}
                aria-pressed={order >= 0}
              >
                {order >= 0 ? `${order + 1}` : '选'}
              </button>
              <button type="button" className="profile-name" onClick={() => onLoad(p.input)} title="载入排盘">
                {p.name}
              </button>
              <span className="profile-meta">
                {p.input.year}-{p.input.month}-{p.input.day} {p.input.gender === 'male' ? '男' : '女'}{p.input.city ? ` · ${p.input.city}` : ''}
              </span>
              <span className="profile-actions">
                <button type="button" className="pick danger" onClick={() => remove(p.id)} aria-label={`删除 ${p.name}`}>
                  ✕
                </button>
              </span>
            </li>
          );
        })}
      </ul>
      {selected.length > 0 && (
        <div className="profile-combo">
          <div className="profile-combo-names">
            已选 {selected.length} 人:{selected.map((p) => p.name).join(' × ')}
            <button type="button" className="chip-btn" onClick={onClearSelect}>清空</button>
          </div>
          <div className="profile-combo-actions">
            {selected.length === 2 && (
              <button type="button" className="primary alt" onClick={() => onSynastry(selected[0]!, selected[1]!)}>
                合盘比较
              </button>
            )}
            <button type="button" className="primary" onClick={onGroup} disabled={!canGroup} title={canGroup ? '' : '再选一位,或先排一张当前盘'}>
              {selected.length >= 2 ? `群盘解读(${selected.length}人)→ 智能体` : '与当前盘组合 → 智能体'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
