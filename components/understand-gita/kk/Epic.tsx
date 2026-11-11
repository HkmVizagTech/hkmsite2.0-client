"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

const ease = [0.22, 0.8, 0.3, 1] as const;

/** "— THE DILEMMA —": small gold caps between two fine gold lines. */
export function Eyebrow({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p className={`flex items-center justify-center gap-3 text-[11px] font-bold uppercase tracking-[0.32em] text-[#F6C752] ${className}`}>
      <span aria-hidden className="h-px w-8 bg-gradient-to-r from-transparent to-[#F6C752] md:w-14" />
      {children}
      <span aria-hidden className="h-px w-8 bg-gradient-to-l from-transparent to-[#F6C752] md:w-14" />
    </p>
  );
}

/** Epic gold title in Cinzel; words rise in one after another. */
export function EpicTitle({ text, as: Tag = "h2", className = "" }: { text: string; as?: "h1" | "h2" | "h3"; className?: string }) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  return (
    <Tag className={`kk-gold-text font-[family-name:var(--font-cinzel)] font-bold uppercase leading-[1.08] tracking-[0.04em] ${className}`}>
      {words.map((w, i) => (
        <motion.span
          key={i}
          className="inline-block"
          initial={reduce ? false : { opacity: 0, y: "0.4em", filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, delay: i * 0.08, ease }}
        >
          {w}
          {i < words.length - 1 ? " " : ""}
        </motion.span>
      ))}
    </Tag>
  );
}

/** Dark glass panel with a fine gold edge. */
export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-[#F6C752]/20 bg-white/[0.035] backdrop-blur-[2px] ${className}`}>{children}</div>;
}

export function FadeIn({ children, delay = 0, className = "" }: { children: ReactNode; delay?: number; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div className={className} initial={reduce ? false : { opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-60px" }} transition={{ duration: 0.8, delay, ease }}>
      {children}
    </motion.div>
  );
}
