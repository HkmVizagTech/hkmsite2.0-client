"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Lenis smooth scrolling for the public site. Desktop pointers only (phones keep native momentum scrolling), skipped
 * for visitors who ask for reduced motion and for the admin screens. Anything that locks the page (modals, sheets set
 * body overflow to hidden) is left to the browser, so dialogs keep scrolling normally.
 */
export default function SmoothScroll() {
  const pathname = usePathname() || "";
  const off = /^\/admin(\/|$)/.test(pathname) || /^\/donations\/admin(\/|$)/.test(pathname);

  useEffect(() => {
    if (off) return;
    const mq = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
    if (!mq.matches) return;

    let raf = 0;
    let lenis: import("lenis").default | null = null;
    let cancelled = false;
    (async () => {
      const { default: Lenis } = await import("lenis");
      if (cancelled) return;
      lenis = new Lenis({
        lerp: 0.09,
        wheelMultiplier: 1,
        smoothWheel: true,
        // Let the browser handle scrolling whenever the page is locked by an open modal / sheet.
        prevent: () => document.body.style.overflow === "hidden" || document.documentElement.style.overflow === "hidden" || document.body.hasAttribute("data-scroll-locked"),
      });
      const tick = (t: number) => {
        lenis?.raf(t);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    })();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      lenis?.destroy();
    };
  }, [off]);

  return null;
}
