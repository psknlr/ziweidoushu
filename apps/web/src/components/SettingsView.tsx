/**
 * 设置:模型 API Key、AI 通道、流派、防沉迷权限、关于。
 */
import { useState } from 'react';
import { PRESETS } from '@ziwei/core';
import {
  loadDirectProviders,
  providerReady,
  saveDirectProviders,
  type DirectProvider,
} from '../lib/ai-channel.js';
import { DAILY_LIMIT, isUnlocked, remainingToday, revokeUnlock, tryUnlock } from '../lib/usage-limit.js';
import type { Channel } from './AIPanel.js';

interface Props {
  preset: string;
  onPresetChange: (preset: string) => void;
  channel: Channel;
  onChannelChange: (channel: Channel) => void;
}

export function SettingsView({ preset, onPresetChange, channel, onChannelChange }: Props) {
  const [providers, setProviders] = useState<[DirectProvider, DirectProvider]>(() => loadDirectProviders());
  const [key, setKey] = useState('');
  const [unlockMsg, setUnlockMsg] = useState('');
  const [, force] = useState(0);

  const updateProvider = (i: 0 | 1, patch: Partial<DirectProvider>) => {
    const next: [DirectProvider, DirectProvider] = [...providers] as [DirectProvider, DirectProvider];
    next[i] = { ...next[i], ...patch };
    setProviders(next);
    saveDirectProviders(next);
  };

  const unlock = async () => {
    const ok = await tryUnlock(key);
    setUnlockMsg(ok ? '✓ 研究权限已解锁' : '密钥无效,请核对后重试');
    if (ok) setKey('');
    force((n) => n + 1);
  };

  return (
    <div className="view-stack">
      <div className="panel">
        <h2>AI 通道</h2>
        <label className="settings-label">
          默认通道
          <select value={channel} onChange={(e) => onChannelChange(e.target.value as Channel)}>
            <option value="gateway">网关(Key 在服务端)</option>
            <option value="directA">直连 · 模型A</option>
            <option value="directB">直连 · 模型B</option>
            <option value="compare">双模型对比</option>
          </select>
        </label>
        {([0, 1] as const).map((i) => (
          <fieldset key={i} className="settings-fieldset">
            <legend>
              {providers[i].label} {providerReady(providers[i]) ? '· 已配置' : '· 未配置'}
            </legend>
            <input
              placeholder="Base URL(OpenAI 兼容,如 https://api.deepseek.com/v1)"
              value={providers[i].baseUrl}
              onChange={(e) => updateProvider(i, { baseUrl: e.target.value })}
            />
            <input
              placeholder="模型名(如 deepseek-chat / MiniMax-Text-01)"
              value={providers[i].model}
              onChange={(e) => updateProvider(i, { model: e.target.value })}
            />
            <input
              type="password"
              placeholder="API Key(仅存本机)"
              value={providers[i].apiKey}
              onChange={(e) => updateProvider(i, { apiKey: e.target.value })}
            />
          </fieldset>
        ))}
        <p className="hint">Key 仅保存在本设备;App 内直连无浏览器 CORS 限制,亦可指向局域网 LiteLLM/Ollama 网关。</p>
      </div>

      <div className="panel">
        <h2>排盘流派</h2>
        <label className="settings-label">
          安星与分界体系
          <select value={preset} onChange={(e) => onPresetChange(e.target.value)}>
            {Object.keys(PRESETS).map((k) => (
              <option key={k} value={k}>
                {k === 'wenmo-zhongzhou' ? '中州派(文墨对齐)' : '全书通行版'}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="panel">
        <h2>防沉迷与权限</h2>
        {isUnlocked() ? (
          <>
            <p className="settings-text">✓ 研究权限已解锁,排盘不限次。</p>
            <button
              type="button"
              className="primary alt"
              onClick={() => {
                revokeUnlock();
                force((n) => n + 1);
              }}
            >
              撤销本机解锁
            </button>
          </>
        ) : (
          <>
            <p className="settings-text">
              每日限排 {DAILY_LIMIT} 张盘(今日剩余 {remainingToday()} 次)。研究机构/专业用户可输入 16 进制密钥解锁:
            </p>
            <div className="settings-row">
              <input
                className="modal-input"
                type="password"
                placeholder="32 位 16 进制密钥"
                value={key}
                onChange={(e) => setKey(e.target.value)}
              />
              <button type="button" className="primary settings-unlock" onClick={() => void unlock()} disabled={!key.trim()}>
                解锁
              </button>
            </div>
            {unlockMsg && <p className="hint">{unlockMsg}</p>}
          </>
        )}
      </div>

      <div className="panel">
        <h2>关于</h2>
        <p className="settings-text">
          紫微斗数工作台 · 医哲未来人工智能研究院(IMPF-AI)出品。
          确定性排盘引擎(iztro 内核)+ 可溯源知识库(376 条,34 格局)+ 全星曜亮度/星性体系。
        </p>
        <p className="hint">命理内容仅供文化研究与自我认知参考,不构成医疗/投资/重大决策建议。</p>
      </div>
    </div>
  );
}
