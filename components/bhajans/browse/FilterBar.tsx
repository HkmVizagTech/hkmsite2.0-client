"use client";

import { X } from "lucide-react";
import { useBrowse } from "./BrowseContext";
import { FOCUS } from "./tones";

const chip = (on: boolean) =>
  `inline-flex h-11 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-sm font-semibold transition-colors duration-150 motion-reduce:transition-none ${FOCUS} ${
    on ? "bg-vk-700 text-white" : "bg-vk-50 text-vk-800 ring-1 ring-vk-200 hover:bg-vk-100"
  }`;

/** Sticky Spotify-style pill row: All, With audio, moods, festivals. */
export default function FilterBar() {
  const { meta, filters, toggle, clear, filtering } = useBrowse();
  const moods = meta.moods.filter((m) => m.count > 0);
  const fests = meta.festivals.filter((m) => m.count > 0);
  const artistName = meta.artists.find((a) => a.slug === filters.artist)?.name;
  const catName = meta.categories.find((c) => c.slug === filters.category)?.label;
  return (
    <div className="bg-white">
      <div className="vk-container relative">
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 py-2 md:mx-0 md:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="group" aria-label="Filter bhajans">
          <button type="button" aria-pressed={!filtering} onClick={clear} className={chip(!filtering)}>All</button>
          <button type="button" aria-pressed={filters.hasAudio} onClick={() => toggle("hasAudio", true)} className={chip(filters.hasAudio)}>With audio</button>
          {artistName && (
            <button type="button" aria-pressed onClick={() => toggle("artist", filters.artist)} className={chip(true)} aria-label={`Remove composer filter ${artistName}`}>
              {artistName} <X className="h-4 w-4" aria-hidden />
            </button>
          )}
          {catName && (
            <button type="button" aria-pressed onClick={() => toggle("category", filters.category)} className={chip(true)} aria-label={`Remove category filter ${catName}`}>
              {catName} <X className="h-4 w-4" aria-hidden />
            </button>
          )}
          <span aria-hidden className="mx-1 my-3 w-px shrink-0 bg-vk-200" />
          {moods.map((m) => (
            <button key={`m-${m.slug}`} type="button" aria-pressed={filters.mood === m.slug} onClick={() => toggle("mood", m.slug)} className={chip(filters.mood === m.slug)}>
              {m.label}
            </button>
          ))}
          <span aria-hidden className="mx-1 my-3 w-px shrink-0 bg-vk-200" />
          {fests.map((f) => (
            <button key={`f-${f.slug}`} type="button" aria-pressed={filters.festival === f.slug} onClick={() => toggle("festival", f.slug)} className={chip(filters.festival === f.slug)}>
              {f.label}
            </button>
          ))}
        </div>
        <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-white to-transparent md:hidden" />
        <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white to-transparent" />
      </div>
    </div>
  );
}
