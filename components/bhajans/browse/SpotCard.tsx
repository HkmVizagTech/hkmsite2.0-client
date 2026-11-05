"use client";

import Link from "next/link";
import CoverArt from "../CoverArt";
import PlayFab from "./PlayFab";
import CardActions from "./CardActions";
import Highlight from "./Highlight";
import { useBrowseOptional } from "./BrowseContext";
import { usePlaySlug } from "./usePlaySlug";
import { Equaliser } from "../player/controls";
import { FOCUS, MUTED } from "./tones";
import type { BhajanSummary } from "@/lib/bhajans";

const REVEAL = "transition duration-150 motion-reduce:transition-none group-hover/card:opacity-100 group-focus-within/card:opacity-100 [@media(hover:none)]:opacity-100";

/** Spotify-style card: square cover, gold play FAB, heart + menu, equaliser mark while playing. */
export default function SpotCard({ b, priority = false, className = "" }: { b: BhajanSummary; priority?: boolean; className?: string }) {
  const { isCurrent, showPause } = usePlaySlug(b.slug);
  const term = useBrowseOptional()?.searchText;
  return (
    <article className={`group/card relative rounded-xl p-2.5 transition-colors duration-150 motion-reduce:transition-none hover:bg-vk-50 ${className}`}>
      <div className="relative aspect-square overflow-hidden rounded-xl bg-vk-100 shadow-[0_6px_16px_-8px_rgba(15,31,92,.3)]">
        <CoverArt title={b.title} src={b.coverImage} priority={priority} sizes="188px" />
        <CardActions b={b} className={`absolute right-1.5 top-1.5 z-[2] ${REVEAL} ${isCurrent ? "opacity-100" : "opacity-0"}`} />
        {isCurrent && (
          <span className="absolute bottom-2 left-2 z-[2] inline-flex h-8 items-center rounded-full bg-white px-2.5 text-vk-600">
            <Equaliser paused={!showPause} />
          </span>
        )}
        {b.hasAudio ? (
          <div className={`absolute bottom-2 right-2 z-[2] transition duration-150 motion-reduce:transition-none group-hover/card:translate-y-0 group-hover/card:opacity-100 group-focus-within/card:translate-y-0 group-focus-within/card:opacity-100 [@media(hover:none)]:translate-y-0 [@media(hover:none)]:opacity-100 ${isCurrent ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
            <PlayFab slug={b.slug} title={b.title} />
          </div>
        ) : (
          <span className="absolute bottom-2 right-2 rounded-full bg-white px-2 py-0.5 text-[12px] font-semibold text-vk-800 shadow">Lyrics</span>
        )}
      </div>
      <Link href={`/bhajans/${b.slug}`} className={`mt-3 block rounded-sm after:absolute after:inset-0 after:z-[1] after:content-[''] ${FOCUS}`}>
        <h3 className={`truncate text-[15px] font-bold leading-snug ${isCurrent ? "text-vk-700" : "text-ink"}`}><Highlight text={b.title} term={term} /></h3>
        <p className={`mt-0.5 line-clamp-2 min-h-[2.5rem] text-[13px] leading-5 ${MUTED}`}><Highlight text={b.artist} term={term} /></p>
      </Link>
    </article>
  );
}
