"use client";

import Link from "next/link";
import CoverArt from "../CoverArt";
import LikeButton from "../library/LikeButton";
import { PlayIcon } from "./PlayFab";
import { usePlaySlug } from "./usePlaySlug";
import { Equaliser } from "../player/controls";
import { FOCUS } from "./tones";
import type { BhajanSummary } from "@/lib/bhajans";

function Tile({ b }: { b: BhajanSummary }) {
  const { isCurrent, showPause, busy, onPlay } = usePlaySlug(b.slug);
  const main = `group/tile flex h-full min-w-0 flex-1 items-center gap-3 overflow-hidden rounded-md text-left ${FOCUS}`;
  const cover = (
    <span className="relative h-14 w-14 shrink-0 overflow-hidden bg-vk-100 md:h-16 md:w-16">
      <CoverArt title={b.title} src={b.coverImage} showInitials={false} sizes="64px" />
    </span>
  );
  const title = (
    <span className={`line-clamp-2 min-w-0 flex-1 text-sm font-bold leading-tight ${isCurrent ? "text-vk-700" : "text-ink"}`}>
      {isCurrent && <Equaliser paused={!showPause} className="mr-1.5 inline-flex align-middle" />}
      {b.title}
    </span>
  );
  return (
    <div className="flex h-14 min-w-0 items-center overflow-hidden rounded-md bg-vk-50 pr-2 transition-colors duration-150 motion-reduce:transition-none hover:bg-vk-100 md:h-16">
      {b.hasAudio ? (
        <button type="button" onClick={() => void onPlay()} aria-label={`${showPause ? "Pause" : "Play"} ${b.title}`} className={main}>
          {cover}
          {title}
          <span
            aria-hidden
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F6C752] text-[#0b1745] shadow-[0_6px_14px_-6px_rgba(15,31,92,.28)] transition duration-150 motion-reduce:transition-none group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100 [@media(hover:none)]:opacity-100 ${isCurrent ? "opacity-100" : "opacity-0"}`}
          >
            <PlayIcon busy={busy} pause={showPause} className="h-5 w-5" />
          </span>
        </button>
      ) : (
        <Link href={`/bhajans/${b.slug}`} className={main}>
          {cover}
          {title}
        </Link>
      )}
      <LikeButton song={{ slug: b.slug, title: b.title, artist: b.artist, coverImage: b.coverImage }} size="sm" className="max-md:hidden" />
    </div>
  );
}

/** Spotify's "Good evening" block: 8 compact tiles. */
export default function QuickPicks({ items }: { items: BhajanSummary[] }) {
  if (!items.length) return null;
  return (
    <section className="pt-7 md:pt-8" aria-label="Quick picks">
      <div className="vk-container">
        <h2 className="mb-3 text-xl font-bold tracking-tight text-ink md:mb-4 md:text-2xl">Quick picks</h2>
        <ul className="grid grid-cols-2 gap-2 md:gap-3 lg:grid-cols-4">
          {items.slice(0, 8).map((b) => (
            <li key={b.slug} className="min-w-0">
              <Tile b={b} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
