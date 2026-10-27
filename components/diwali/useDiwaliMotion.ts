"use client";

import { useLayoutEffect, type RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { DiwaliState } from "./DiwaliScene";

/**
 * GSAP for the Diwali page, scoped to `root` and cleaned up on unmount:
 *  - the hero: the lamp lights (the scene reads `hero.intro`) while the copy rises in
 *  - the five-days stage: scroll progress through [data-steps] drives `stage.progress` and lights the matching card
 *  - [data-reveal]: gentle fade-up when a block scrolls into view
 * With prefers-reduced-motion nothing moves; the stage still follows the scroll because that is the visitor's own action.
 */
export function useDiwaliMotion(root: RefObject<HTMLElement | null>, hero: DiwaliState, stage: DiwaliState) {
  useLayoutEffect(() => {
    const el = root.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    const storyEl = el.querySelector<HTMLElement>("[data-days]");
    let trigger: ScrollTrigger | null = null;
    if (storyEl) {
      const cards = Array.from(storyEl.querySelectorAll<HTMLElement>("[data-step-card]"));
      const mark = (idx: number) => cards.forEach((c, i) => c.classList.toggle("km-on", i === idx));
      mark(0);
      const stageEl = storyEl.querySelector<HTMLElement>("[data-stage]");
      const px = (css: string) => {
        const probe = document.createElement("div");
        probe.style.cssText = `position:absolute;visibility:hidden;height:${css}`;
        document.body.appendChild(probe);
        const h = probe.offsetHeight;
        probe.remove();
        return h;
      };
      const stageBottom = () => px("var(--header-h)") + (window.innerWidth >= 1024 ? 28 : 8) + (stageEl?.offsetHeight ?? 400);
      trigger = ScrollTrigger.create({
        trigger: storyEl.querySelector("[data-steps]") ?? storyEl,
        start: () => (window.innerWidth < 1024 ? `top ${Math.round(stageBottom() + 90)}px` : "top 50%"),
        end: () => `bottom ${Math.round(stageBottom())}px`,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          stage.progress = self.progress;
          mark(Math.min(cards.length - 1, Math.floor(self.progress * cards.length + 0.0001)));
        },
      });
    }

    mm.add("(prefers-reduced-motion: reduce)", () => {
      hero.intro = 1;
    });
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        hero.intro = 0;
        gsap.to(hero, { intro: 1, duration: 3.2, ease: "power2.inOut", delay: 0.3 });
        gsap.from("[data-hero-fade]", { y: 28, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.12, delay: 0.25 });
        gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((n) => {
          gsap.from(n, { y: 34, opacity: 0, duration: 0.9, ease: "power3.out", scrollTrigger: { trigger: n, start: "top 88%", once: true } });
        });
        gsap.utils.toArray<HTMLElement>("[data-group]").forEach((g) => {
          const items = g.querySelectorAll("[data-item]");
          if (items.length) gsap.from(items, { y: 44, opacity: 0, scale: 0.97, duration: 0.85, ease: "power3.out", stagger: 0.1, scrollTrigger: { trigger: g, start: "top 85%", once: true } });
        });
      }, el);
      return () => ctx.revert();
    });

    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("load", refresh);
    const timer = window.setTimeout(refresh, 900);
    return () => {
      window.removeEventListener("load", refresh);
      window.clearTimeout(timer);
      trigger?.kill();
      mm.revert();
    };
  }, [root, hero, stage]);
}
