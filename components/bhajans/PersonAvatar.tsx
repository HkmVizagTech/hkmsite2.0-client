"use client";

import { useState } from "react";
import Image from "next/image";

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** First letter of the first and last word: "Jiva Goswami" -> JG, "Raghunatha Dasa Goswami" -> RG, "Vyasadeva" -> VY. */
export function personInitials(name: string): string {
  const w = name.replace(/[^\p{L}\p{N}\s]/gu, " ").split(/\s+/).filter(Boolean);
  if (!w.length) return "ॐ";
  if (w.length === 1) return Array.from(w[0]).slice(0, 2).join("").toUpperCase();
  return (Array.from(w[0])[0] + Array.from(w[w.length - 1])[0]).toUpperCase();
}

/**
 * Round person picture. Shows the portrait when it loads; otherwise (no image, or it fails) a designed initials disc:
 * a blue-family gradient from the name, a soft top-left highlight, a fine inner ring and the initials in serif type.
 * Fills its own box: give it a size (e.g. `h-24 w-24` or `w-full aspect-square`) through `className`.
 */
export default function PersonAvatar({ name, src, className = "h-24 w-24", sizes = "188px", textClass = "text-[2.2em]" }: { name: string; src?: string; className?: string; sizes?: string; textClass?: string }) {
  const [failed, setFailed] = useState(false);
  const h = hash(name);
  const a = 212 + (h % 26);
  const b = 198 + ((h >> 5) % 34);
  const showImage = !!src && !failed;
  return (
    <span className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-vk-100 ${className}`}>
      {showImage ? (
        <Image src={src as string} alt="" fill unoptimized sizes={sizes} className="object-cover" onError={() => setFailed(true)} />
      ) : (
        <span
          aria-hidden
          className="relative flex h-full w-full items-center justify-center"
          style={{ backgroundImage: `linear-gradient(145deg, hsl(${a} 72% 26%) 0%, hsl(${b} 68% 46%) 100%)` }}
        >
          <span className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 28% 22%, rgba(255,255,255,.28), transparent 55%)" }} />
          <span className="absolute inset-[7%] rounded-full ring-1 ring-white/30" />
          <span className={`relative font-serif-display font-semibold tracking-[0.04em] text-white drop-shadow-[0_1px_2px_rgba(0,0,0,.3)] ${textClass}`}>{personInitials(name)}</span>
        </span>
      )}
    </span>
  );
}
