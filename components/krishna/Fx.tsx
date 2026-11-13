"use client";

import { useEffect, useState } from "react";

/** Cinematic touches for the Krishna moments, in the site's blue and gold. All purely decorative. */

/** A soft oval shadow on the ground under a walking or sitting figure. */
export function GroundShadow({ width, bob = false }: { width: number; bob?: boolean }) {
  return (
    <span aria-hidden className={`pointer-events-none absolute left-1/2 -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(10,22,64,.32),rgba(10,22,64,0))] ${bob ? "kc-shadow-bob" : ""}`}
      style={{ width: width * 0.8, height: Math.max(8, width * 0.12), bottom: -Math.max(3, width * 0.04) }} />
  );
}

/** Gold dust kicked up behind a runner: tiny sparks that drift back and fade. */
export function GoldDust({ every = 110, size = 1 }: { every?: number; size?: number }) {
  const [bits, setBits] = useState<{ id: number; dx: number; dy: number; s: number }[]>([]);
  useEffect(() => {
    let n = 0;
    const id = window.setInterval(() => {
      n++;
      setBits((b) => [...b.slice(-10), { id: n, dx: -(24 + Math.random() * 40) * size, dy: -(6 + Math.random() * 26) * size, s: (3 + Math.random() * 4) * size }]);
    }, every);
    return () => window.clearInterval(id);
  }, [every, size]);
  return (
    <span aria-hidden className="pointer-events-none absolute bottom-1 left-[22%]">
      {bits.map((b) => (
        <span key={b.id} className="kc-dust absolute rounded-full bg-[#F6C752] shadow-[0_0_8px_rgba(246,199,82,.9)]"
          style={{ width: b.s, height: b.s, ["--dx" as string]: `${b.dx}px`, ["--dy" as string]: `${b.dy}px` }} />
      ))}
    </span>
  );
}

/** A soft gold glow behind a figure (appearing, playing the flute, waving). */
export function Glow({ size, className = "" }: { size: number; className?: string }) {
  return (
    <span aria-hidden className={`kc-glow pointer-events-none absolute left-1/2 top-1/2 -z-10 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(246,199,82,.45),rgba(246,199,82,.12)_55%,transparent)] ${className}`}
      style={{ width: size, height: size }} />
  );
}

/** A puff of gold dust (landing, sitting down). Positioned by the parent. */
export function Puff({ size = 1 }: { size?: number }) {
  return (
    <span aria-hidden className="pointer-events-none absolute">
      {Array.from({ length: 9 }).map((_, i) => (
        <span key={i} className="kc-puff absolute rounded-full bg-[#F6C752]/80 shadow-[0_0_10px_rgba(246,199,82,.8)]"
          style={{ width: 6 * size, height: 6 * size, ["--a" as string]: `${-80 + i * 20}deg`, ["--r" as string]: `${(28 + (i % 3) * 10) * size}px` }} />
      ))}
    </span>
  );
}
