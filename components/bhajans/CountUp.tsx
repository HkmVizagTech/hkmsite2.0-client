"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/** Number that counts up once when it scrolls into view. Renders the final value first, so it is right without JS. */
export default function CountUp({ value, className }: { value: number; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, value, { duration: 1.1, ease: "easeOut", onUpdate: (v) => setShown(Math.round(v)) });
    return () => c.stop();
  }, [inView, reduce, value]);
  return <strong ref={ref} className={className}>{shown.toLocaleString("en-IN")}</strong>;
}
