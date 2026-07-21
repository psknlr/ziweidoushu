/**
 * 品牌 Logo(国风 · 蓝紫):
 * 罗盘外环(十二宫刻度)+ 北斗七星连线 + 篆意「紫」印。
 * 纯 SVG,随处内嵌;PWA/App 图标由同一设计导出。
 */
export function Logo({ size = 34 }: { size?: number }) {
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const a = (i * Math.PI) / 6;
    const r1 = 27, r2 = 24;
    return { x1: 32 + r1 * Math.sin(a), y1: 32 - r1 * Math.cos(a), x2: 32 + r2 * Math.sin(a), y2: 32 - r2 * Math.cos(a) };
  });
  // 北斗七星(勺形),落于盘面左上
  const dipper = [
    [15, 24], [20, 19], [26, 17], [32, 18], [36, 23], [43, 25], [48, 30],
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" aria-label="紫微斗数工作台" role="img">
      <defs>
        <radialGradient id="lg-disc" cx="38%" cy="30%" r="85%">
          <stop offset="0%" stopColor="#3d3f9e" />
          <stop offset="55%" stopColor="#232463" />
          <stop offset="100%" stopColor="#101131" />
        </radialGradient>
        <linearGradient id="lg-ring" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8a8df7" />
          <stop offset="55%" stopColor="#b18cff" />
          <stop offset="100%" stopColor="#5b5ee0" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30" fill="url(#lg-disc)" stroke="url(#lg-ring)" strokeWidth="2" />
      <circle cx="32" cy="32" r="24.5" fill="none" stroke="#8a8df7" strokeWidth="0.6" opacity="0.55" />
      {ticks.map((t, i) => (
        <line key={i} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="#b18cff" strokeWidth="1" opacity="0.75" />
      ))}
      <polyline
        points={dipper.map(([x, y]) => `${x},${y}`).join(' ')}
        fill="none" stroke="#ecd9a8" strokeWidth="1.1" opacity="0.9" strokeLinecap="round" strokeLinejoin="round"
      />
      {dipper.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r={i === 6 ? 1.9 : 1.4} fill="#ffe9b8" />
      ))}
      {/* 篆意「紫」印 */}
      <rect x="35" y="37" width="16" height="16" rx="3" fill="#6d59d8" stroke="#b18cff" strokeWidth="1" />
      <text
        x="43" y="49.5" textAnchor="middle" fontSize="11.5" fill="#f2ecff"
        fontFamily="'Songti SC','Noto Serif SC',serif" fontWeight="700"
      >
        紫
      </text>
    </svg>
  );
}
