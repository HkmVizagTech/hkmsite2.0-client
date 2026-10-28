/**
 * Traditional, light decoration for the festival pages. Everything is plain SVG / CSS (no scripts, no 3D), uses auspicious
 * colours only (marigold, saffron, gold, lotus pink) and stops moving with prefers-reduced-motion.
 */

/** A marigold garland (torana) hung across the top of a section. */
export function Torana({ className = "" }: { className?: string }) {
  const flowers = Array.from({ length: 30 }, (_, i) => i);
  return (
    <svg aria-hidden viewBox="0 0 1200 56" preserveAspectRatio="none" className={`pointer-events-none h-8 w-full md:h-12 ${className}`}>
      <path d="M0 6 Q 300 40 600 6 T 1200 6" fill="none" stroke="#2f7d3a" strokeWidth="2" opacity="0.75" />
      {flowers.map((i) => {
        const x = 20 + i * 40;
        const y = 6 + Math.sin((x / 600) * Math.PI) * 0 + 17 * Math.abs(Math.sin((x / 1200) * Math.PI * 2 + 0)) * 0.9;
        const warm = i % 3 === 0 ? "#f59e0b" : i % 3 === 1 ? "#ff8a1f" : "#fbbf24";
        return (
          <g key={i} transform={`translate(${x} ${y + 4})`}>
            <circle r="9" fill={warm} />
            <circle r="5.500" fill="#fff3b0" opacity="0.55" />
            <circle r="2.200" fill="#b45309" opacity="0.7" />
          </g>
        );
      })}
    </svg>
  );
}

/** A faint, slowly turning gold mandala used as a watermark behind a heading. */
export function Mandala({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 400 400" className={`fs-turn pointer-events-none ${className}`} fill="none" stroke="hsl(43 89% 54%)" strokeOpacity="0.38">
      <circle cx="200" cy="200" r="190" />
      <circle cx="200" cy="200" r="176" strokeDasharray="2 6" />
      <circle cx="200" cy="200" r="120" />
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} transform={`rotate(${(i * 360) / 16} 200 200)`} d="M200 30c16 28 22 52 0 82-22-30-16-54 0-82Z" />
      ))}
      {Array.from({ length: 12 }, (_, i) => (
        <path key={i} transform={`rotate(${(i * 360) / 12 + 15} 200 200)`} d="M200 96c11 20 15 36 0 58-15-22-11-38 0-58Z" />
      ))}
      <circle cx="200" cy="200" r="22" />
    </svg>
  );
}

/** A thin gold rule with a lotus in the middle, to separate sections. */
export function OrnamentDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`mx-auto flex max-w-xs items-center gap-3 ${className}`}>
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[hsl(var(--gold)/0.7)]" />
      <svg viewBox="0 0 40 24" className="h-5 w-8" fill="hsl(43 89% 54%)">
        <path d="M20 22C12 20 6 14 4 6c6 1 11 5 16 16Z" opacity="0.7" />
        <path d="M20 22c8-2 14-8 16-16-6 1-11 5-16 16Z" opacity="0.7" />
        <path d="M20 22C15 15 15 7 20 1c5 6 5 14 0 21Z" />
      </svg>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[hsl(var(--gold)/0.7)]" />
    </div>
  );
}

const PETAL_COLORS = [
  "from-amber-200 to-yellow-500",
  "from-yellow-200 to-amber-400",
  "from-pink-300 to-orange-200",
  "from-amber-300 to-orange-400",
  "from-yellow-100 to-amber-300",
];
const PETAL_SIZES = ["h-3 w-2", "h-4 w-2.5", "h-2.5 w-1.5", "h-5 w-3"];

/** Soft petals drifting down, mostly gold with a few marigold and rose ones (CSS only). `gold` = gold petals only. */
export function PetalFall({ count = 9, className = "", gold = false }: { count?: number; className?: string; gold?: boolean }) {
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {Array.from({ length: count }, (_, i) => (
        <span
          key={i}
          className={`fs-petal absolute -top-6 block rounded-[60%_40%_60%_40%] bg-gradient-to-br shadow-[0_0_6px_rgba(255,200,80,0.55)] ${PETAL_SIZES[i % PETAL_SIZES.length]} ${PETAL_COLORS[gold ? i % 2 : i % PETAL_COLORS.length]}`}
          style={{
            left: `${(i * 37 + 5) % 97}%`,
            opacity: 0.55 + (i % 4) * 0.1,
            animationDelay: `${-((i * 1.9) % 14)}s`,
            animationDuration: `${9 + (i % 5) * 2.5}s`,
          }}
        />
      ))}
    </div>
  );
}
