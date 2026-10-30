/**
 * Decoration for the Vaikuntha Ekadashi page: a soft heavenly sky (drifting clouds, golden light), the gold gateway
 * of Vaikuntha and the Sudarshana chakra. Plain SVG / CSS only, nothing heavy, and it all stops with prefers-reduced-motion.
 */

/** Slow-drifting white clouds filling a relatively positioned parent. */
export function Clouds({ className = "" }: { className?: string }) {
  const puffs = [
    { left: "-8%", top: "6%", w: 360, h: 120, d: 70, delay: 0 },
    { left: "28%", top: "52%", w: 440, h: 140, d: 95, delay: -30 },
    { left: "60%", top: "10%", w: 380, h: 120, d: 80, delay: -15 },
    { left: "84%", top: "64%", w: 300, h: 100, d: 66, delay: -44 },
  ];
  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {puffs.map((p, i) => (
        <span
          key={i}
          className="vkd-cloud absolute block rounded-full bg-white/70 blur-2xl"
          style={{ left: p.left, top: p.top, width: p.w, height: p.h, animationDuration: `${p.d}s`, animationDelay: `${p.delay}s` }}
        />
      ))}
    </div>
  );
}

/** A row of soft cloud puffs, laid along the bottom of the banner so the page seems to rise out of the clouds. */
export function CloudEdge({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 1200 70" preserveAspectRatio="none" className={`pointer-events-none block h-9 w-full md:h-14 ${className}`}>
      <defs>
        <linearGradient id="vkd-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" stopOpacity="0.0" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.9" />
        </linearGradient>
      </defs>
      <path
        d="M0 70V44c40-8 62-30 110-24 34 4 44 22 84 20 40-2 52-26 104-24 46 2 58 20 100 18 46-2 62-30 118-26 48 4 56 24 100 22 50-2 66-28 122-24 46 4 54 20 96 18 50-2 62-26 112-22 40 3 44 14 54 22v46Z"
        fill="url(#vkd-edge)"
      />
    </svg>
  );
}

/** The gold gateway of Vaikuntha (an arched door with a lotus finial). */
export function GoldGate({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 120 86" className={`mx-auto h-16 w-auto md:h-20 ${className}`} fill="none" stroke="hsl(40 94% 38%)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M26 84V40M94 84V40" />
      <path d="M19 84h14M87 84h14" />
      <path d="M26 40C26 18 52 14 60 4c8 10 34 14 34 36" />
      <path d="M34 40C34 25 54 22 60 14c6 8 26 11 26 26" opacity="0.55" />
      <path d="M60 3c-3.500 4-3.500 8 0 11 3.500-3 3.500-7 0-11Z" fill="hsl(43 89% 54%)" />
      <path d="M40 84V47c0-10 9-14 20-14s20 4 20 14v37" fill="hsl(43 89% 54% / 0.16)" stroke="hsl(43 89% 54%)" />
      <path d="M60 36v48" stroke="hsl(43 89% 54%)" opacity="0.5" />
    </svg>
  );
}

/** The Sudarshana chakra, a faint slowly turning watermark. */
export function Chakra({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 200" className={`fs-turn pointer-events-none ${className}`} fill="none" stroke="hsl(43 89% 54%)" strokeOpacity="0.5">
      <circle cx="100" cy="100" r="94" />
      <circle cx="100" cy="100" r="86" strokeDasharray="1 5" />
      <circle cx="100" cy="100" r="36" />
      <circle cx="100" cy="100" r="9" fill="hsl(43 89% 54%)" fillOpacity="0.5" />
      {Array.from({ length: 12 }, (_, i) => (
        <g key={i} transform={`rotate(${i * 30} 100 100)`}>
          <path d="M100 64V14" />
          <path d="M100 14c-9 12-9 24 0 34 9-10 9-22 0-34Z" />
        </g>
      ))}
    </svg>
  );
}
