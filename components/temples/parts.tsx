"use client";

import { Star } from "lucide-react";

/* Small pieces shared by the temple list and the temple page. */

export const IVORY = "#FBF7EE";
export const INK = "#0F1E4A";
export const HERO_BG = "linear-gradient(160deg,#172B6E 0%,#0F1E4A 55%,#0A1233 100%)";

export function Eyebrow({ children, light = false, center = false }: { children: React.ReactNode; light?: boolean; center?: boolean }) {
  const c = light ? "text-[#E9C46A]" : "text-[#A87A1E]";
  const b = light ? "bg-[#E9C46A]/70" : "bg-[#C9962B]";
  return (
    <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.26em] ${c} ${center ? "justify-center" : ""}`}>
      <span aria-hidden className={`h-px w-8 ${b}`} />
      {children}
      {center && <span aria-hidden className={`h-px w-8 ${b}`} />}
    </p>
  );
}

/** Google star rating, e.g. ★ 4.7 (12,340). */
export function Stars({ rating, count, light = false }: { rating?: number; count?: number; light?: boolean }) {
  if (!rating) return null;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[13px] font-semibold ${light ? "text-white" : "text-[#0F1E4A]"}`}>
      <span className="flex" aria-hidden>
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} className={`h-3.5 w-3.5 ${i < Math.round(rating) ? "fill-[#F6B93B] text-[#F6B93B]" : light ? "text-white/30" : "text-[#0F1E4A]/20"}`} />
        ))}
      </span>
      {rating.toFixed(1)}
      {count ? <span className={light ? "text-white/60" : "text-[#0F1E4A]/55"}>({count.toLocaleString("en-IN")})</span> : null}
      <span className="sr-only">out of 5 on Google</span>
    </span>
  );
}

/** The word "Google" in its colours, used for attribution. */
export function GoogleWord({ className = "" }: { className?: string }) {
  return (
    <span className={`font-semibold ${className}`} aria-label="Google">
      <span className="text-[#4285F4]">G</span><span className="text-[#EA4335]">o</span><span className="text-[#FBBC05]">o</span>
      <span className="text-[#4285F4]">g</span><span className="text-[#34A853]">l</span><span className="text-[#EA4335]">e</span>
    </span>
  );
}

/** Fallback artwork when a temple has no photo yet: the temple's Telugu name on a gopuram silhouette. */
export function TempleArt({ telugu, form }: { telugu: string; form: string }) {
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: HERO_BG }}>
      <svg aria-hidden viewBox="0 0 200 160" className="absolute inset-x-0 bottom-0 h-[78%] w-full text-white/[.07]" preserveAspectRatio="xMidYMax meet">
        <path fill="currentColor" d="M70 160V70h60v90zM78 70l8-14h28l8 14zM84 56l6-12h20l6 12zM90 44l5-10h10l5 10zM96 34l4-9 4 9zM40 160v-40h30v40zM130 160v-40h30v40z" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <span className="font-heading text-2xl font-bold text-[#F6E3B0] md:text-3xl">{telugu}</span>
        <span className="mt-1 text-[11px] font-bold uppercase tracking-[0.22em] text-white/50">{form}</span>
      </div>
    </div>
  );
}
