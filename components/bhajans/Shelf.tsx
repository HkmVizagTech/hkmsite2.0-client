import type { ReactNode } from "react";
import BhajanCard from "./BhajanCard";
import type { BhajanSummary } from "@/lib/bhajans";

export function SectionHead({ title, subtitle, right }: { title: string; subtitle?: string; right?: ReactNode }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div className="min-w-0">
        <h2 className="font-serif-display text-[1.45rem] font-semibold leading-tight text-ink md:text-[1.8rem]">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-ink/60">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

/** Horizontal, swipeable shelf of bhajan cards. Renders nothing when empty. */
export default function Shelf({ title, subtitle, items }: { title: string; subtitle?: string; items: BhajanSummary[] }) {
  if (!items.length) return null;
  return (
    <section className="py-5 md:py-7" aria-label={title}>
      <div className="vk-container">
        <SectionHead title={title} subtitle={subtitle} />
      </div>
      <div className="vk-container">
        <ul className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-px-4 px-4 pb-3 md:mx-0 md:px-0 [scrollbar-width:thin]">
          {items.map((b) => (
            <li key={b._id || b.slug} className="w-[42vw] max-w-[200px] shrink-0 snap-start sm:w-[190px]">
              <BhajanCard b={b} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
