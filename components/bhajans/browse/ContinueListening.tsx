"use client";

import { ScrollRow, ShelfHead } from "./Shelf";
import SpotCard from "./SpotCard";
import { clearHistory, useHistory } from "./history";
import { FOCUS } from "./tones";
import type { BhajanSummary } from "@/lib/bhajans";

/** "Continue listening": the local play history. Renders nothing when empty (and on the server). */
export default function ContinueListening() {
  const history = useHistory();
  if (!history.length) return null;
  const items: BhajanSummary[] = history.slice(0, 12).map((h) => ({
    _id: h.slug,
    slug: h.slug,
    title: h.title,
    artist: h.artist,
    coverImage: h.coverImage,
    categories: [],
    moods: [],
    festivals: [],
    languages: [],
    isFeatured: false,
    hasAudio: true,
    trackCount: 1,
    duration: 0,
    playCount: 0,
  }));
  return (
    <section className="pt-7 md:pt-8" aria-label="Continue listening">
      <div className="vk-container">
        <ShelfHead title="Continue listening" subtitle="Recently played on this device" playSlugs={items.map((i) => i.slug)} />
        <ScrollRow label="Continue listening">{items.map((b) => <SpotCard key={b.slug} b={b} />)}</ScrollRow>
        <button type="button" onClick={clearHistory} className={`mt-6 inline-flex min-h-[44px] items-center rounded-md text-[13px] font-semibold text-vk-700 hover:underline ${FOCUS}`}>
          Clear history
        </button>
      </div>
    </section>
  );
}
