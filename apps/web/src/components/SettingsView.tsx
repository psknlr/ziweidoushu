/**
 * 设置:模型 API Key、AI 通道、流派、防沉迷权限、关于。
 */
import { useRef, useState } from 'react';
import { PRESETS } from '@ziwei/core';
import {
  DEFAULT_PROVIDERS,
  loadDirectProviders,
  providerReady,
  saveDirectProviders,
  type Channel,
  type DirectProvider,
} from '../lib/ai-channel.js';
import { createBackup, parseBackup, restoreBackup, summarize, type BackupSummary } from '../lib/backup.js';
import { copyText } from '../lib/clipboard.js';
import { saveTextFile } from '../lib/export-file.js';
import { DAILY_LIMIT, isUnlocked, remainingToday, revokeUnlock, tryUnlock } from '../lib/usage-limit.js';

const APP_VERSION = (import.meta.env.VITE_APP_VERSION as string | undefined) ?? '0.1.0-dev';
const RELEASE_URL = 'https://github.com/psknlr/ziweidoushu/releases/tag/apk-latest';
const summaryText = (s: BackupSummary) =>
  `${s.profiles} 份档案、${s.conversations} 段对话${s.providersConfigured ? '、模型配置' : ''}${s.unlocked ? '、研究权限' : ''}`;

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

  // ---- 数据备份 / 恢复 ----
  const [backupMsg, setBackupMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const currentSummary = summarize(createBackup(localStorage));
  const backupName = () => `ziwei-backup-${new Date().toISOString().slice(0, 10)}.json`;

  const exportBackup = async () => {
    const text = JSON.stringify(createBackup(localStorage, APP_VERSION), null, 2);
    const result = await saveTextFile(backupName(), text, 'application/json');
    if (result === 'shared') setBackupMsg('已打开系统分享,可「保存到文件」或发到云盘/微信文件传输助手');
    else if (result === 'downloaded') setBackupMsg(`已保存 ${backupName()}`);
    else setBackupMsg((await copyText(text)) ? '设备不支持直接保存,备份 JSON 已复制到剪贴板' : '保存失败');
  };

  const copyBackup = async () => {
    const ok = await copyText(JSON.stringify(createBackup(localStorage, APP_VERSION)));
    setBackupMsg(ok ? '备份 JSON 已复制,可粘贴到备忘录/聊天窗口保存' : '复制失败');
  };

  const importFile = async (file: File) => {
    try {
      const b = parseBackup(await file.text());
      const s = summarize(b);
      const mode = window.confirm(
        `备份含:${summaryText(s)}(导出于 ${b.exportedAt.slice(0, 16).replace('T', ' ')}${b.appVersion ? `,版本 ${b.appVersion}` : ''})。\n\n` +
          `点「确定」= 合并到本机(按 id 去重,保留本机已有);\n点「取消」= 不导入。`,
      )
        ? 'merge'
        : null;
      if (!mode) {
        setBackupMsg('已取消导入');
        return;
      }
      const after = restoreBackup(localStorage, b, mode);
      setBackupMsg(`✓ 已合并:现有 ${summaryText(after)}。请重新打开「档案」页查看`);
      setProviders(loadDirectProviders());
      force((n) => n + 1);
    } catch (error) {
      setBackupMsg(`导入失败:${(error as Error).message}`);
    } finally {
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const replaceFromFile = async (file: File) => {
    try {
      const b = parseBackup(await file.text());
      const s = summarize(b);
      if (!window.confirm(`将用备份(${summaryText(s)})整体替换本机全部工作台数据,本机现有 ${summaryText(currentSummary)} 会被清除。确定?`)) {
        setBackupMsg('已取消');
        return;
      }
      restoreBackup(localStorage, b, 'replace');
      setBackupMsg('✓ 已整体恢复,建议重启 App 以刷新所有页面');
      setProviders(loadDirectProviders());
      force((n) => n + 1);
    } catch (error) {
      setBackupMsg(`恢复失败:${(error as Error).message}`);
    }
  };

  return (
    <div className="view-stack">
      <div className="panel">
        <h2>AI 通道</h2>
        <label className="settings-label">
          默认通道
          <select value={channel} onChange={(e) => onChannelChange(e.target.value as Channel)}>
            <option value="directA">直连 · {providers[0].label}(默认)</option>
            <option value="directB">直连 · {providers[1].label}</option>
            <option value="compare">双模型对比</option>
            <option value="gateway">网关(Key 在服务端)</option>
          </select>
        </label>
        {([0, 1] as const).map((i) => (
          <fieldset key={i} className="settings-fieldset">
            <legend>
              模型{i === 0 ? 'A' : 'B'} · {providers[i].label}{' '}
              {providerReady(providers[i]) ? '· 已配置' : i === 0 ? '· 填入 API Key 即可用' : '· 未配置'}
            </legend>
            <input
              placeholder="名称(如 MiniMax / DeepSeek / Qwen)"
              value={providers[i].label}
              onChange={(e) => updateProvider(i, { label: e.target.value })}
            />
            <input
              placeholder="Base URL(OpenAI 兼容,如 https://api.minimaxi.com/v1)"
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
            {i === 0 && (
              <button
                type="button"
                className="chip-btn"
                onClick={() => updateProvider(0, { ...DEFAULT_PROVIDERS[0], apiKey: providers[0].apiKey })}
              >
                恢复默认:MiniMax 国内版 · MiniMax-M3
              </button>
            )}
          </fieldset>
        ))}
        <p className="hint">
          默认通道为直连 · 模型A(MiniMax 国内版 api.minimaxi.com,模型 MiniMax-M3),只需填入 API Key。
          Key 仅保存在本设备;App 内直连无浏览器 CORS 限制,亦可指向局域网 LiteLLM/Ollama 网关。
        </p>
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
        <h2>数据备份</h2>
        <p className="settings-text">
          本机现有 {summaryText(currentSummary)}。所有数据只存本设备;升级 App(同签名覆盖安装)会自动保留,
          换机、重装或以防万一时,请在此导出备份。
        </p>
        <div className="export-actions">
          <button type="button" className="primary" onClick={() => void exportBackup()}>导出全部数据(JSON)</button>
          <button type="button" className="primary alt" onClick={() => void copyBackup()}>复制备份 JSON</button>
        </div>
        <div className="export-actions" style={{ marginTop: 8 }}>
          <label className="primary alt file-btn">
            从备份合并导入
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void importFile(f);
              }}
            />
          </label>
          <label className="primary alt file-btn danger">
            用备份整体替换
            <input
              type="file"
              accept="application/json,.json"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void replaceFromFile(f);
                e.target.value = '';
              }}
            />
          </label>
        </div>
        {backupMsg && <p className="hint">{backupMsg}</p>}
        <p className="hint">备份包含:本地档案、对话历史、模型配置(含 API Key,请妥善保管文件)、通道与流派选择、研究权限。</p>
      </div>

      <div className="panel">
        <h2>关于</h2>
        <p className="settings-text">
          紫微斗数工作台 v{APP_VERSION} · 医哲未来人工智能研究院(IMPF-AI)出品。
          确定性排盘引擎(iztro 紫微 + lunar-typescript 八字)+ 可溯源知识库(433 条,39 格局)+ 全星曜亮度/星性体系。
        </p>
        <p className="settings-text">
          <a className="link" href={RELEASE_URL} target="_blank" rel="noopener noreferrer">检查更新(APK 最新版)</a>
          <span className="hint"> · 同签名可直接覆盖安装,数据保留</span>
        </p>
        <p className="hint">命理内容仅供文化研究与自我认知参考,不构成医疗/投资/重大决策建议。</p>
      </div>
    </div>
  );
}
