"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { useT } from "@/components/i18n/LocaleProvider";

const ease = [0.22, 0.8, 0.3, 1] as const;

/** "— THE DILEMMA —": small gold caps between two fine gold lines. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  const t = useT();
  if (typeof children === "string") children = t(children);
  return (
    <p className={`flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[#F6C752] ${className}`}>
      <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-[#F6C752] md:w-14" />
      {children}
      <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-[#F6C752] md:w-14" />
    </p>
  );
}

/** Epic gold title in Cinzel; words rise in one after another (one scroll trigger for the whole title). */
export function EpicTitle({ text, as: Tag = "h2", className = "" }: { text: string; as?: "h1" | "h2" | "h3"; className?: string }) {
  const reduce = useReducedMotion();
  const t = useT();
  const words = t(text).split(" ");
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={`font-[family-name:var(--font-cinzel),var(--font-telugu)] font-bold uppercase leading-[1.08] tracking-[0.04em] ${className}`}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={{ once: true, amount: 0.3 }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
    >
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="kk-gold-text inline-block"
          variants={{ hidden: { opacity: 0, y: "0.4em", filter: "blur(6px)" }, show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.7, ease } } }}
        >
          {w}
          {i < words.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </MotionTag>
  );
}

/** Dark glass panel with a fine gold edge. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-[#F6C752]/20 bg-white/[0.04] ${className}`}>{children}</div>;
}

export function FadeIn({ children, delay = 0, className = "", y = 22 }: { children: ReactNode; delay?: number; className?: string; y?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay, ease }}>
      {children}
    </motion.div>
  );
}
