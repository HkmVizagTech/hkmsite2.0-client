/**
 * A calm row of brass diyas with softly flickering flames: plain SVG + CSS, no scripts, no 3D. The flicker pauses with
 * prefers-reduced-motion. Used in the light festival heroes.
 */
export default function DiyaRow({ count = 7, className = "" }: { count?: number; className?: string }) {
  return (
    <div aria-hidden className={`flex items-end justify-center gap-3 sm:gap-6 ${className}`}>
      <svg width="0" height="0" className="absolute">
        <defs>
          <linearGradient id="dr-brass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#F6C752" />
            <stop offset="1" stopColor="#B8860B" />
          </linearGradient>
          <linearGradient id="dr-flame" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#FFE9A8" />
            <stop offset="1" stopColor="#F47A12" />
          </linearGradient>
          <radialGradient id="dr-glow">
            <stop offset="0" stopColor="#FFB84D" stopOpacity="0.55" />
            <stop offset="1" stopColor="#FFB84D" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
      {Array.from({ length: count }, (_, i) => {
        const mid = (count - 1) / 2;
        const lift = Math.abs(i - mid) / mid; // the middle lamp is the tallest
        const s = 1 - lift * 0.28;
        return (
          <svg key={i} viewBox="0 0 64 80" className="overflow-visible" style={{ width: `${46 * s}px`, height: `${58 * s}px` }}>
            <ellipse cx="32" cy="26" rx="30" ry="28" fill="url(#dr-glow)" />
            <g className="fs-flame" style={{ animationDelay: `${(i % 4) * 0.35}s` }}>
              <path d="M32 8c7 9 11 16 11 23a11 11 0 0 1-22 0c0-7 4-14 11-23Z" fill="url(#dr-flame)" />
              <path d="M32 21c3 4 5 7 5 10.5a5 5 0 0 1-10 0c0-3.500 2-6.500 5-10.500Z" fill="#FFF7D6" />
            </g>
            <path d="M6 42h52c0 16-11 26-26 26S6 58 6 42Z" fill="url(#dr-brass)" />
            <path d="M6 42h52" stroke="#FFE49A" strokeWidth="3" strokeLinecap="round" />
            <rect x="20" y="68" width="24" height="5" rx="2.500" fill="#B8860B" />
          </svg>
        );
      })}
    </div>
  );
}
