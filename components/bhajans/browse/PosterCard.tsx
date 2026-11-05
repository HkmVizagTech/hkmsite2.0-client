"use client";

import Link from "next/link";
import CoverArt from "../CoverArt";
import { useBrowse } from "./BrowseContext";
import { PlayIcon } from "./PlayFab";
import CardActions from "./CardActions";
import { Equaliser } from "../player/controls";
import { usePlaySlug } from "./usePlaySlug";
import { FOCUS } from "./tones";
import { fmtDuration, labelOf, type BhajanSummary } from "@/lib/bhajans";

/** Tall 4:5 poster: full-bleed cover, frosted-glass info panel, gold play button, optional editorial index. */
export default function PosterCard({ b, index, priority = false }: { b: BhajanSummary; index?: number; priority?: boolean }) {
  const { meta } = useBrowse();
  const { isCurrent, showPause, busy, onPlay } = usePlaySlug(b.slug);
  // The poster always prints the title in its own panel, so the shared-picture title overlay is switched off below.
  const titleOnCover = false;
  const tag = b.festivals[0] ? labelOf(meta.festivals, b.festivals[0]) : b.moods[0] ? labelOf(meta.moods, b.moods[0]) : "";
  return (
    <div className="relative pt-8">
      {index !== undefined && (
        <span
          aria-hidden
          className="pointer-events-none absolute left-1 top-0 z-0 select-none font-serif-display text-[64px] font-bold leading-none tracking-tight text-transparent [-webkit-text-stroke:1.5px_#9db4f5]"
        >
          {String(index).padStart(2, "0")}
        </span>
      )}
      <article className="group/poster relative z-[1] aspect-[4/5] overflow-hidden rounded-3xl bg-vk-100 shadow-[0_14px_28px_-18px_rgba(15,31,92,.28)] transition duration-300 motion-reduce:transition-none [@media(hover:hover)]:hover:-translate-y-1.5 motion-reduce:[@media(hover:hover)]:hover:translate-y-0">
        <div className="absolute inset-0 transition-transform duration-[900ms] ease-out motion-reduce:transition-none [@media(hover:hover)]:group-hover/poster:scale-105 motion-reduce:[@media(hover:hover)]:group-hover/poster:scale-100">
          <CoverArt title={b.title} src={b.coverImage} priority={priority} sizes="280px" showInitials={false} />
        </div>
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-[#0b1745]/85 via-[#0b1745]/40 to-transparent" />

        <span className="absolute left-3 top-3 z-[2] inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/15 px-2.5 py-1 text-[12px] font-semibold text-white backdrop-blur-md">
          {isCurrent && <Equaliser paused={!showPause} />}
          {b.hasAudio ? (b.duration ? fmtDuration(b.duration) : "Audio") : "Lyrics"}
        </span>
        <CardActions b={b} className="absolute right-2 top-2 z-[3]" />

        <div className="absolute inset-x-[10px] bottom-[10px] z-[2] flex items-end gap-2 rounded-2xl border border-white/30 bg-white/15 p-3 backdrop-blur-md transition-colors duration-300 motion-reduce:transition-none group-hover/poster:bg-white/25">
          <div className="min-w-0 flex-1">
            {!titleOnCover && (
              <h3 className="line-clamp-2 font-serif-display text-lg font-semibold leading-snug text-white drop-shadow-[0_1px_6px_rgba(0,0,0,.5)]">
                <Link href={`/bhajans/${b.slug}`} className={`rounded-sm after:absolute after:inset-0 after:content-[''] ${FOCUS}`}>{b.title}</Link>
              </h3>
            )}
            <p className={`truncate text-[11px] font-semibold uppercase tracking-wider text-white/90 ${titleOnCover ? "" : "mt-1"}`}>
              {titleOnCover && (
                <Link href={`/bhajans/${b.slug}`} aria-label={b.title} className={`rounded-sm after:absolute after:inset-0 after:content-[''] ${FOCUS}`}>{b.artist}</Link>
              )}
              {!titleOnCover && b.artist}
            </p>
            {tag && <span className="mt-2 inline-block max-w-full truncate rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium text-white">{tag}</span>}
          </div>
          {b.hasAudio && (
            <button
              type="button"
              aria-label={`${showPause ? "Pause" : "Play"} ${b.title}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                void onPlay();
              }}
              className={`relative z-[3] inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#F6C752] text-[#0b1745] shadow-[0_6px_14px_-6px_rgba(15,31,92,.28)] transition duration-150 motion-reduce:transition-none [@media(hover:hover)]:hover:scale-105 active:scale-95 ${FOCUS}`}
            >
              <span aria-hidden className={`pointer-events-none absolute inset-0 rounded-full bg-[#F6C752]/60 motion-reduce:hidden ${isCurrent && showPause ? "" : "[@media(hover:hover)]:group-hover/poster:animate-[ping_.9s_cubic-bezier(0,0,.2,1)_1]"}`} />
              <PlayIcon busy={busy} pause={showPause} className="relative h-5 w-5" />
            </button>
          )}
        </div>
      </article>
    </div>
  );
}
