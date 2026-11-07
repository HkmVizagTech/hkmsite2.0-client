"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";
import { CHAPTERS } from "@/lib/understandGita";

/** Vertical journey through the 18 chapters; a gold line fills as the page scrolls past. */
export default function ChapterTimeline() {
  const ref = useRef<HTMLOListElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  return (
    <ol ref={ref} className="relative mx-auto max-w-4xl">
      <span aria-hidden className="absolute bottom-2 left-[22px] top-2 w-[3px] rounded-full bg-vk-200 md:left-1/2 md:-translate-x-1/2" />
      <motion.span
        aria-hidden
        style={{ scaleY: reduce ? 1 : fill, transformOrigin: "top" }}
        className="absolute bottom-2 left-[22px] top-2 w-[3px] rounded-full bg-gradient-to-b from-[hsl(var(--gold))] to-[hsl(var(--gold-deep))] md:left-1/2 md:-translate-x-1/2"
      />
      {CHAPTERS.map((c, i) => {
        const right = i % 2 === 1;
        return (
          <motion.li
            key={c.en}
            initial={reduce ? false : { opacity: 0, x: right ? 28 : -28 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: [0.22, 0.8, 0.3, 1] }}
            className={`relative flex items-center pb-5 pl-14 md:pb-6 md:pl-0 ${right ? "md:flex-row-reverse" : ""}`}
          >
            <span className="absolute left-0 flex h-[46px] w-[46px] items-center justify-center rounded-full border-4 border-white bg-vk-800 font-heading text-[15px] font-extrabold text-white ring-1 ring-vk-200 md:left-1/2 md:-translate-x-1/2">
              {i + 1}
            </span>
            <div className={`w-full rounded-2xl border border-vk-100 bg-white p-4 md:w-[calc(50%-40px)] ${right ? "md:text-left" : "md:text-right"}`}>
              <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[hsl(var(--gold-deep))]">Chapter {i + 1}</p>
              <h3 className="mt-1 text-[15px] font-bold leading-snug text-ink">{c.en}</h3>
              <p className="mt-0.5 text-[13px] italic text-vk-600">{c.sa}</p>
            </div>
          </motion.li>
        );
      })}
    </ol>
  );
}
