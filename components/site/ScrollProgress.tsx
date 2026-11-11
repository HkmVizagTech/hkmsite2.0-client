"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

/** Thin gold line at the very top of the page that fills as you read down. */
export default function ScrollProgress() {
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const x = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.3 });
  if (reduce) return null;
  return (
    <motion.div
      aria-hidden
      style={{ scaleX: x, transformOrigin: "0% 50%" }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] bg-gradient-to-r from-[hsl(var(--gold))] via-[hsl(var(--gold-deep))] to-[hsl(var(--gold))]"
    />
  );
}
