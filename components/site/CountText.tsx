"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";

/**
 * Text like "2 Lakh+" or "21+" whose number counts up once when it scrolls into view. The final text is rendered first
 * (so it is right without JS and in translations); years (1900 to 2100) are left as they are.
 */
export default function CountText({ text, className, style }: { text: string; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const m = text.match(/^(\D*)(\d[\d,]*)(.*)$/);
  const target = m ? Number(m[2].replace(/,/g, "")) : NaN;
  const countable = !!m && Number.isFinite(target) && !(target >= 1900 && target <= 2100 && m[2].length === 4);
  const [n, setN] = useState(target);

  useEffect(() => {
    if (!countable || !inView || reduce) return;
    const c = animate(0, target, { duration: 1.2, ease: "easeOut", onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [countable, inView, reduce, target]);

  return (
    <p ref={ref} className={className} style={style}>
      {countable && m ? `${m[1]}${n.toLocaleString("en-IN")}${m[3]}` : text}
    </p>
  );
}
