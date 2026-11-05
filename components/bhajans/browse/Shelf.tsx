"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import PlayAllButtons from "./PlayAllButtons";
import SpotCard from "./SpotCard";
import PosterCard from "./PosterCard";
import { useBrowse, type Filters } from "./BrowseContext";
import { FOCUS } from "./tones";
import type { BhajanSummary } from "@/lib/bhajans";

export function ShelfHead({
  title,
  subtitle,
  onShowAll,
  showAllHref,
  showAllLabel = "Show all",
  playSlugs,
}: {
  title: string;
  subtitle?: string;
  onShowAll?: () => void;
  showAllHref?: string;
  showAllLabel?: string;
  /** Slugs to play / shuffle; buttons are hidden when empty. */
  playSlugs?: string[];
}) {
  const linkCls = `-mr-2 inline-flex min-h-[44px] shrink-0 items-center rounded-md px-2 text-sm font-bold text-vk-700 hover:text-vk-900 hover:underline ${FOCUS}`;
  return (
    <div className="mb-3 flex items-center justify-between gap-3 md:mb-4">
      <div className="min-w-0">
        <h2 className="truncate text-xl font-bold tracking-tight text-ink md:text-2xl">{title}</h2>
        {subtitle && <p className="truncate text-[13px] text-vk-700 md:text-sm">{subtitle}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-1 sm:gap-3">
        {playSlugs && playSlugs.length > 0 && <PlayAllButtons getSlugs={() => playSlugs} label={title} />}
        {showAllHref ? (
          <Link href={showAllHref} className={linkCls}>{showAllLabel}</Link>
        ) : onShowAll ? (
          <button type="button" onClick={onShowAll} className={linkCls}>{showAllLabel}</button>
        ) : null}
      </div>
    </div>
  );
}

/** Horizontally scrolling row (snap on touch) with hover arrows on desktop. */
export function ScrollRow({ children, label, itemClass = "w-[168px] sm:w-[176px] lg:w-[188px]", arrowTop = "top-[84px]" }: { children: ReactNode[]; label: string; itemClass?: string; arrowTop?: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const [left, setLeft] = useState(false);
  const [right, setRight] = useState(false);
  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setLeft(el.scrollLeft > 4);
    setRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);
  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);
  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: reduce ? "auto" : "smooth" });
  };
  const arrow = `absolute ${arrowTop} z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white text-vk-800 shadow-[0_6px_14px_-6px_rgba(15,31,92,.28)] ring-1 ring-vk-200 transition duration-150 motion-reduce:transition-none hover:bg-vk-50 md:flex opacity-0 group-hover/row:opacity-100 focus-visible:opacity-100 ${FOCUS}`;
  return (
    <div className="group/row relative">
      <ul
        ref={ref}
        onScroll={update}
        aria-label={label}
        className="-mx-4 -mb-6 -mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pb-8 pt-3 md:-mx-3 md:snap-none md:scroll-px-3 md:px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:gap-4"
      >
        {children.map((c, i) => (
          <li key={i} className={`shrink-0 snap-start ${itemClass}`}>{c}</li>
        ))}
      </ul>
      {left && (
        <button type="button" aria-label={`Scroll ${label} left`} onClick={() => go(-1)} className={`${arrow} -left-5`}>
          <ChevronLeft className="h-6 w-6" aria-hidden />
        </button>
      )}
      {right && (
        <button type="button" aria-label={`Scroll ${label} right`} onClick={() => go(1)} className={`${arrow} -right-5`}>
          <ChevronRight className="h-6 w-6" aria-hidden />
        </button>
      )}
    </div>
  );
}

export default function SpotShelf({ title, items, showAll, poster = false, numbered = false }: { title: string; items: BhajanSummary[]; showAll?: Partial<Filters>; poster?: boolean; numbered?: boolean }) {
  const { apply } = useBrowse();
  if (!items.length) return null;
  return (
    <section className="pt-8 md:pt-10" aria-label={title}>
      <div className="vk-container">
        <ShelfHead title={title} onShowAll={showAll ? () => apply(showAll) : undefined} playSlugs={items.filter((x) => x.hasAudio).map((x) => x.slug)} />
        {poster ? (
          <ScrollRow label={title} itemClass="w-[72%] sm:w-[240px] lg:w-[264px]" arrowTop="top-[190px]">
            {items.map((b, i) => <PosterCard key={b._id || b.slug} b={b} index={numbered ? i + 1 : undefined} />)}
          </ScrollRow>
        ) : (
          <ScrollRow label={title}>{items.map((b) => <SpotCard key={b._id || b.slug} b={b} />)}</ScrollRow>
        )}
      </div>
    </section>
  );
}
