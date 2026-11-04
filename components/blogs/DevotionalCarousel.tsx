"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Eyebrow, Meta, SERIF, ShelfHeading, type Blog } from "./parts";

function ScrollButtons({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  const cls =
    "flex h-10 w-10 items-center justify-center rounded-full border border-[#D5DDF5] bg-white text-vk-700 shadow-sm transition-colors hover:border-vk-700 hover:bg-vk-50";
  return (
    <div className="hidden gap-2 md:flex">
      <button type="button" onClick={onPrev} aria-label="Scroll left" className={cls}>
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button type="button" onClick={onNext} aria-label="Scroll right" className={cls}>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

/** Horizontally scrolling picture cards with prev/next buttons. */
export default function DevotionalCarousel({ blogs }: { blogs: Blog[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scroll = (dir: "l" | "r") => {
    if (!ref.current) return;
    const w = ref.current.clientWidth * 0.85;
    ref.current.scrollBy({ left: dir === "l" ? -w : w, behavior: "smooth" });
    setIndex((i) => Math.max(0, Math.min(blogs.length - 1, i + (dir === "l" ? -1 : 1))));
  };

  if (!blogs.length) return null;

  return (
    <div>
      <ShelfHeading
        eyebrow="Devotional Wisdom"
        title="The spiritual essence of our Vedic literature"
        subtitle="Inspiring reads from the pens of the Hare Krishna Vaikuntham team."
        right={
          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden text-xs font-semibold text-ink/50 md:inline">
              {index + 1} / {blogs.length}
            </span>
            <ScrollButtons onPrev={() => scroll("l")} onNext={() => scroll("r")} />
          </div>
        }
      />

      <div ref={ref} className="vk-scroller -mx-4 px-4 md:mx-0 md:px-0">
        {blogs.map((b) => (
          <Link
            key={b._id}
            href={`/blogs/${b.slug}`}
            className="group relative block aspect-video w-[90%] max-w-[560px] shrink-0 overflow-hidden rounded-[1.5rem] shadow-[0_24px_46px_-30px_rgba(20,30,80,0.7)] sm:w-[480px] md:w-[540px]"
          >
            {b.coverImage ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={b.coverImage}
                alt={b.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-400" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b1230]/85 via-[#0b1230]/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
              {b.category && <Eyebrow light>{b.category}</Eyebrow>}
              <h3 className={`${SERIF} mt-1.5 line-clamp-2 text-[1.1rem] font-semibold leading-snug text-white md:text-[1.2rem]`}>{b.title}</h3>
              <div className="mt-2">
                <Meta blog={b} light />
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-3 text-center text-xs text-ink/50 md:hidden">
        {index + 1} / {blogs.length}
      </div>
    </div>
  );
}
