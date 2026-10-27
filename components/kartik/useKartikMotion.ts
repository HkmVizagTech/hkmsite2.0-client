"use client";

import { useLayoutEffect, useRef, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { SceneState } from "./KartikScene";

/**
 * All GSAP on the Kartik Maas page lives here, scoped to `root` and cleaned up on unmount.
 *
 * Markers used in the markup:
 *   data-hero-word   headline words (rise in)        data-hero-fade   hero copy/buttons (fade up in order)
 *   data-reveal      fade-up when scrolled into view data-group > [data-item]  staggered children
 *   data-lamps       the 30-lamp grid (flames ignite) data-parallax  image that drifts while scrolling
 *   data-marquee     endless mantra strip            data-tilt  card that leans toward the pointer
 *   data-count       number that counts up (data-count="30")
 *
 * With prefers-reduced-motion nothing moves: everything is simply shown, and the 3D scene is told to start lit.
 */
export function useKartikMotion(root: RefObject<HTMLElement | null>, scene: SceneState) {
  const sceneRef = useRef(scene);
  sceneRef.current = scene;

  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: reduce)", () => {
      sceneRef.current.intro = 1;
    });

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        // Hero: the flame ignites and the lotus opens (the scene reads `intro`), while the copy rises in.
        sceneRef.current.intro = 0;
        gsap.to(sceneRef.current, { intro: 1, duration: 2.6, ease: "power2.inOut", delay: 0.25 });
        const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });
        tl.from("[data-hero-word]", { yPercent: 115, rotate: 3, opacity: 0, duration: 0.9, stagger: 0.07 })
          .from("[data-hero-fade]", { y: 26, opacity: 0, duration: 0.8, stagger: 0.1 }, "-=0.5");

        // Fade-up on scroll
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((n) => {
          gsap.from(n, { y: 38, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 88%", once: true } });
        });
        // Staggered groups (seva cards, reason cards...)
        gsap.utils.toArray<HTMLElement>("[data-group]").forEach((g) => {
          const items = g.querySelectorAll("[data-item]");
          if (!items.length) return;
          gsap.from(items, { y: 46, opacity: 0, scale: 0.97, duration: 0.85, ease: "power3.out", stagger: 0.12, scrollTrigger: { trigger: g, start: "top 85%", once: true } });
        });
        // Lamps ignite one after another
        const lamps = el.querySelector("[data-lamps]");
        if (lamps) {
          gsap.from(lamps.querySelectorAll("[data-lamp]"), { y: 14, opacity: 0, duration: 0.5, stagger: 0.03, ease: "back.out(2)", scrollTrigger: { trigger: lamps, start: "top 85%", once: true } });
          // The flames only exist once the page has worked out today's date (after mount), so look them up on entry.
          ScrollTrigger.create({
            trigger: lamps,
            start: "top 85%",
            once: true,
            onEnter: () => {
              const flames = lamps.querySelectorAll("[data-flame]");
              if (flames.length) gsap.from(flames, { scale: 0, transformOrigin: "50% 100%", duration: 0.7, stagger: 0.05, delay: 0.4, ease: "elastic.out(1,0.6)" });
            },
          });
        }
        // Parallax image
        gsap.utils.toArray<HTMLElement>("[data-parallax]").forEach((img) => {
          gsap.fromTo(img, { yPercent: -8 }, { yPercent: 8, ease: "none", scrollTrigger: { trigger: img.parentElement, start: "top bottom", end: "bottom top", scrub: 0.6 } });
        });
        // Mantra marquee
        gsap.utils.toArray<HTMLElement>("[data-marquee]").forEach((m) => {
          gsap.to(m, { xPercent: -50, duration: 46, ease: "none", repeat: -1 });
        });
        // Count-up numbers
        gsap.utils.toArray<HTMLElement>("[data-count]").forEach((n) => {
          const to = Number(n.dataset.count || 0);
          const o = { v: 0 };
          gsap.to(o, { v: to, duration: 1.6, ease: "power2.out", onUpdate: () => (n.textContent = String(Math.round(o.v))), scrollTrigger: { trigger: n, start: "top 90%", once: true } });
        });

        // Cards lean toward the pointer (mouse only; touch screens skip this)
        if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
          gsap.utils.toArray<HTMLElement>("[data-tilt]").forEach((card) => {
            const rx = gsap.quickTo(card, "rotationX", { duration: 0.5, ease: "power3.out" });
            const ry = gsap.quickTo(card, "rotationY", { duration: 0.5, ease: "power3.out" });
            gsap.set(card, { transformPerspective: 900, transformOrigin: "center" });
            card.addEventListener("pointermove", (e) => {
              const r = card.getBoundingClientRect();
              ry(((e.clientX - r.left) / r.width - 0.5) * 7);
              rx(-((e.clientY - r.top) / r.height - 0.5) * 7);
            });
            card.addEventListener("pointerleave", () => {
              rx(0);
              ry(0);
            });
          });
        }
      }, el);
      return () => ctx.revert();
    });

    // Images and fonts settle after first paint; recalculate trigger positions once they have.
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const t = window.setTimeout(refresh, 900);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(t);
      mm.revert();
    };
  }, [root]);
}
