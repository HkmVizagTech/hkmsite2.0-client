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
