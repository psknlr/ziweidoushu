/**
 * 防沉迷提示与特殊权限解锁弹窗。
 */
import { useState } from 'react';
import { DAILY_LIMIT, tryUnlock } from '../lib/usage-limit.js';

interface Props {
  onClose: () => void;
  onUnlocked: () => void;
}

export function UnlockDialog({ onClose, onUnlocked }: Props) {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setBusy(true);
    setError('');
    const ok = await tryUnlock(key);
    setBusy(false);
    if (ok) {
      onUnlocked();
    } else {
      setError('密钥无效,请核对 16 进制密钥后重试。');
    }
  };

  return (
    <div className="modal-mask" role="dialog" aria-modal="true">
      <div className="modal panel">
        <h2>今日排盘次数已用完</h2>
        <p className="modal-text">
          为倡导健康理性地看待命理,工作台每日限排 {DAILY_LIMIT} 张盘。
          命盘不会因多算而改变——不妨明天再来,或先深读今日之盘。
        </p>
        <p className="modal-text dim">研究机构/专业用户可输入特殊权限密钥(16 进制)解除限制:</p>
        <input
          className="modal-input"
          type="password"
          placeholder="输入 32 位 16 进制密钥"
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !busy && void submit()}
        />
        {error && <p className="modal-error">{error}</p>}
        <div className="modal-actions">
          <button type="button" className="primary alt" onClick={onClose}>
            明日再来
          </button>
          <button type="button" className="primary" onClick={() => void submit()} disabled={busy || !key.trim()}>
            {busy ? '校验中…' : '解锁'}
          </button>
        </div>
      </div>
    </div>
  );
}
