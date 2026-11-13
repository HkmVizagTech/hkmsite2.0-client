"use client";

import { useEffect, useMemo } from "react";
import { IMG, mascotScale } from "./RunSprite";

/**
 * Thank-you pages only: little Krishna rises in the lower corner and throws rose and marigold petals, which fall
 * softly across the whole screen. About 6 seconds.
 */
export default function PetalShower({ lift, onDone }: { lift: number; onDone: () => void }) {
  const petals = useMemo(
    () =>
      Array.from({ length: 34 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        delay: 0.6 + Math.random() * 2.2,
        dur: 3.2 + Math.random() * 2.4,
        size: 8 + Math.random() * 10,
        hue: ["#E8405A", "#F07A92", "#F6C752", "#F59E0B", "#FB7185"][i % 5],
        sway: (Math.random() - 0.5) * 120,
      })),
    []
  );
  useEffect(() => {
    const t = window.setTimeout(onDone, 6500);
    return () => window.clearTimeout(t);
  }, [onDone]);
  return (
    <>
      {petals.map((p) => (
        <span key={p.id} className="kc-petal pointer-events-none absolute -top-6 rounded-[60%_40%_60%_40%]"
          style={{ left: `${p.left}%`, width: p.size, height: p.size * 0.7, background: p.hue, animationDelay: `${p.delay}s`, animationDuration: `${p.dur}s`, ["--sway" as string]: `${p.sway}px` }} />
      ))}
      <img src={IMG("petals")} alt="" draggable={false}
        className="kc-rise pointer-events-none absolute left-2 w-auto select-none drop-shadow-[0_10px_14px_rgba(10,22,64,.28)] md:left-6"
        style={{ bottom: lift + 10, height: Math.round(165 * mascotScale()) }} />
    </>
  );
}
