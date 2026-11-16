"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/*
 * Shared pieces for /acharyas: the "temple manuscript" look. Ivory paper, Vaikuntham-blue ink, hairline gold rules,
 * and paintings set like framed icons with a soft halo behind the head (not the Srila Prabhupada page's rays/arch).
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

/**
 * A 4:5 painting set like an icon: rounded frame, a fine inner gold line and a soft halo of light around the head
 * (the paintings all place the head in the upper third).
 */
export function HaloPortrait({ src, alt, sizes, priority = false, className = "", zoom = false, halo = true }: { src: string; alt: string; sizes: string; priority?: boolean; className?: string; zoom?: boolean; halo?: boolean }) {
  return (
    <div className={`relative isolate aspect-[4/5] overflow-hidden bg-[#0F1E4A] ${className}`}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} quality={90}
        className={`object-cover object-top ${zoom ? "transition-transform duration-700 ease-out group-hover:scale-[1.05]" : ""}`} />
      {halo && <>
      <span aria-hidden className="pointer-events-none absolute left-1/2 top-[3%] h-[46%] w-[86%] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(255,230,163,.30),rgba(246,199,82,.10)_55%,transparent)] mix-blend-screen" />
      <svg aria-hidden viewBox="0 0 100 125" className="pointer-events-none absolute inset-0 h-full w-full mix-blend-screen">
        <circle cx="50" cy="31" r="25" fill="none" stroke="#FFE6A3" strokeOpacity=".45" strokeWidth=".35" />
        <circle cx="50" cy="31" r="29" fill="none" stroke="#FFE6A3" strokeOpacity=".22" strokeWidth=".3" strokeDasharray=".8 1.6" />
      </svg>
      </>}
      <span aria-hidden className="pointer-events-none absolute inset-[6px] rounded-[inherit] ring-1 ring-inset ring-[#F6C752]/35" />
    </div>
  );
}
