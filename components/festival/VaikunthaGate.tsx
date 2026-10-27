/**
 * Line-art "Vaikuntha Dwara": the gateway of the Lord's abode, drawn in thin gold lines (static, no animation).
 * Used as the quiet illustration in the hero when no banner artwork has been supplied.
 */
export default function VaikunthaGate({ className = "" }: { className?: string }) {
  const gold = "hsl(43 89% 58%)";
  return (
    <svg viewBox="0 0 420 480" fill="none" className={className} aria-hidden>
      <defs>
        <radialGradient id="vg-glow" cx="50%" cy="46%" r="46%">
          <stop offset="0" stopColor="#FFD36B" stopOpacity="0.5" />
          <stop offset="1" stopColor="#FFD36B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="vg-door" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFE9A8" stopOpacity="0.55" />
          <stop offset="1" stopColor="#FFB547" stopOpacity="0.08" />
        </linearGradient>
      </defs>
      <ellipse cx="210" cy="220" rx="200" ry="210" fill="url(#vg-glow)" />
      {/* rays */}
      {Array.from({ length: 13 }, (_, i) => {
        const a = (-70 + i * (140 / 12)) * (Math.PI / 180);
        const r = (n: number) => Math.round(n * 10) / 10; // fixed precision keeps server and client markup identical
        return <line key={i} x1={r(210 + Math.sin(a) * 118)} y1={r(236 - Math.cos(a) * 118)} x2={r(210 + Math.sin(a) * 196)} y2={r(236 - Math.cos(a) * 196)} stroke={gold} strokeOpacity="0.28" strokeWidth="1" />;
      })}
      {/* outer + inner arch */}
      <path d="M92 420V228c0-70 52-122 118-122s118 52 118 122v192" stroke={gold} strokeWidth="2" />
      <path d="M112 420V232c0-60 44-104 98-104s98 44 98 104v188" stroke={gold} strokeOpacity="0.55" strokeWidth="1.2" />
      {/* the open door */}
      <path d="M140 420V238c0-42 30-76 70-76s70 34 70 76v182Z" fill="url(#vg-door)" stroke={gold} strokeOpacity="0.8" strokeWidth="1.5" />
      <path d="M210 162v258" stroke={gold} strokeOpacity="0.35" strokeWidth="1" />
      {/* finial: lotus + kalasha */}
      <path d="M210 106c-14-6-20-18-18-32 10 4 16 12 18 20 2-8 8-16 18-20 2 14-4 26-18 32Z" stroke={gold} strokeWidth="1.5" />
      <path d="M210 74V50m-6 0h12" stroke={gold} strokeWidth="1.5" strokeLinecap="round" />
      {/* pillars */}
      {[92, 328].map((x) => (
        <g key={x} stroke={gold} strokeOpacity="0.8">
          <rect x={x - 16} y="196" width="32" height="14" rx="3" strokeWidth="1.3" />
          <rect x={x - 12} y="210" width="24" height="206" strokeWidth="1.3" />
          <rect x={x - 18} y="416" width="36" height="12" rx="3" strokeWidth="1.3" />
          {[240, 280, 320, 360].map((y) => (
            <line key={y} x1={x - 12} y1={y} x2={x + 12} y2={y} strokeOpacity="0.35" />
          ))}
        </g>
      ))}
      {/* steps */}
      {[0, 1, 2].map((i) => (
        <rect key={i} x={118 - i * 14} y={428 + i * 10} width={184 + i * 28} height="10" rx="2" stroke={gold} strokeOpacity={0.7 - i * 0.2} strokeWidth="1.2" />
      ))}
      {/* a lamp in the doorway */}
      <ellipse cx="210" cy="352" rx="10" ry="16" fill="#FFD36B" fillOpacity="0.85" />
      <path d="M190 366h40c0 9-9 16-20 16s-20-7-20-16Z" fill="#E2A012" />
    </svg>
  );
}
