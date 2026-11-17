/** Smoothly scroll to the element with this id, stopping just below the fixed header (works with Lenis too). */
export function scrollToSection(id: string): boolean {
  const el = document.getElementById(id);
  if (!el) return false;
  const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 0;
  const offset = -(header + 12);
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset, duration: 1.1 });
  else window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + offset, behavior: "smooth" });
  return true;
}

/** Jump to the very top, also telling the desktop smooth scroller (Lenis), which otherwise pulls the page back down. */
export function scrollToTopNow() {
  const go = () => {
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number, o: object) => void } }).__lenis;
    lenis?.scrollTo(0, { immediate: true, force: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  };
  go();
  // again after Next.js has finished its own scroll handling for the navigation
  requestAnimationFrame(() => { go(); window.setTimeout(go, 120); });
}
