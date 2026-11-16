"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";

/*
 * Shared pieces for /acharyas: the "temple manuscript" look. Ivory paper, Vaikuntham-blue ink, hairline gold rules,
 * and clean rounded paintings with soft shadows (not the Srila Prabhupada page's rays/arch).
 */
export const IVORY = "#FBF7EE";
export const INK = "#0F1E4A";
export const ease = [0.22, 0.8, 0.3, 1] as const;

/** Fades and lifts its children into view once (static when the visitor prefers reduced motion). */
export function Rise({ children, delay = 0, className = "", as = "div" }: { children: React.ReactNode; delay?: number; className?: string; as?: "div" | "li" }) {
  const reduce = useReducedMotion();
  const M = as === "li" ? motion.li : motion.div;
  return (
    <M initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.75, ease, delay }} className={className}>
      {children}
    </M>
  );
}

/** Small-caps eyebrow with gold hairlines. */
export function Eyebrow({ children, center = false, light = false }: { children: React.ReactNode; center?: boolean; light?: boolean }) {
  const line = light ? "bg-[#E9C46A]/70" : "bg-[#C9962B]";
  return (
    <p className={`flex items-center gap-3 text-[11px] font-bold uppercase tracking-[0.26em] ${light ? "text-[#E9C46A]" : "text-[#A87A1E]"} ${center ? "justify-center text-center" : ""}`}>
      <span aria-hidden className={`h-px w-6 shrink-0 sm:w-8 ${line}`} />
      <span className="min-w-0">{children}</span>
      {center && <span aria-hidden className={`h-px w-6 shrink-0 sm:w-8 ${line}`} />}
    </p>
  );
}

/** A gold diamond between two fading rules. */
export function Divider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-2 text-[10px] text-[#C9962B] ${className}`}>
      <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#C9962B]" />◆<span className="h-px w-14 bg-gradient-to-l from-transparent to-[#C9962B]" />
    </div>
  );
}

/** A clean 4:5 portrait: rounded image only (callers add the soft shadow). */
export function Portrait({ src, alt, sizes, priority = false, className = "", zoom = false }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string; zoom?: boolean }) {
  return (
    <div className={`relative isolate aspect-[4/5] overflow-hidden bg-[#0F1E4A] ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} loading={priority ? "eager" : undefined} fetchPriority={priority ? "high" : undefined} quality={90}
        className={`object-cover object-top ${zoom ? "transition-transform duration-700 ease-out group-hover:scale-[1.05]" : ""}`} />
    </div>
  );
}

/**
 * The page's call-to-action pill: a label plus an arrow in a small navy circle. Styling only (a span), so it can sit
 * inside a link or a whole clickable card; the parent link carries `group/btn` for the hover effects.
 * - "gold": gold gradient pill, a light sweep runs across it and the arrow turns on hover.
 * - "card": full-width outline pill for cards (always visible, 44px tall); a gold fill sweeps in on hover.
 * - "ghost": outline pill for dark backgrounds.
 * - "outline": outline pill for light backgrounds.
 */
export function CtaPill({ label, variant = "gold", className = "" }: { label: string; variant?: "gold" | "card" | "ghost" | "outline"; className?: string }) {
  const base = "relative isolate inline-flex min-h-11 items-center overflow-hidden rounded-full font-bold transition-shadow duration-300";
  const look = {
    gold: "gap-3 bg-gradient-to-r from-[#F6C752] via-[#EFC155] to-[#C9962B] py-1.5 pl-5 pr-1.5 text-[14px] text-[#0F1E4A] shadow-[0_14px_30px_-12px_rgba(201,150,43,.75)] group-hover/btn:shadow-[0_18px_36px_-12px_rgba(201,150,43,.95)]",
    card: "w-full justify-between gap-2 bg-white py-1 pl-3.5 pr-1 text-[11px] uppercase tracking-[0.12em] text-[#0F1E4A] ring-1 ring-inset ring-[#E7DCC3] sm:pl-4 sm:text-[11.5px]",
    ghost: "gap-3 py-1.5 pl-5 pr-1.5 text-[14px] text-[#FBF7EE] ring-1 ring-inset ring-white/25 group-hover/btn:ring-white/60",
    outline: "gap-3 bg-white py-1.5 pl-5 pr-1.5 text-[14px] text-[#0F1E4A] ring-1 ring-inset ring-[#0F1E4A]/15 group-hover/btn:ring-[#C9962B]",
  }[variant];
  const circle = {
    gold: "h-8 w-8 bg-[#0F1E4A] text-[#F6C752]",
    card: "h-8 w-8 bg-[#0F1E4A] text-[#F6C752]",
    ghost: "h-8 w-8 bg-white/10 text-[#F6C752] group-hover/btn:bg-[#F6C752] group-hover/btn:text-[#0F1E4A]",
    outline: "h-8 w-8 bg-[#FBF2DC] text-[#A87A1E] group-hover/btn:bg-[#0F1E4A] group-hover/btn:text-[#F6C752]",
  }[variant];
  return (
    <span className={`${base} ${look} ${className}`}>
      {variant === "card" && (
        <span aria-hidden className="absolute inset-0 -z-10 origin-left scale-x-0 bg-gradient-to-r from-[#F6C752] to-[#E7B847] transition-transform duration-500 ease-out group-hover/btn:scale-x-100" />
      )}
      {variant === "gold" && (
        <span aria-hidden className="pointer-events-none absolute inset-y-0 -left-1/2 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0 transition-all duration-700 ease-out group-hover/btn:left-[115%] group-hover/btn:opacity-100" />
      )}
      <span className="relative min-w-0 truncate">{label}</span>
      <span className={`relative flex shrink-0 items-center justify-center rounded-full transition duration-300 group-hover/btn:-rotate-45 ${circle}`}>
        <ArrowRight className="h-4 w-4" />
      </span>
    </span>
  );
}
