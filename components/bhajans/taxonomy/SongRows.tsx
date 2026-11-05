"use client";

import { useState } from "react";
import Link from "next/link";
import { LayoutGrid, List, Loader2 } from "lucide-react";
import CoverArt from "../CoverArt";
import SpotCard from "../browse/SpotCard";
import { PlayIcon } from "../browse/PlayFab";
import { usePlaySlug } from "../browse/usePlaySlug";
import LikeButton from "../library/LikeButton";
import { clientFetchBhajanList, fmtDuration, type BhajanQuery, type BhajanSummary } from "@/lib/bhajans";
import { FOCUS, PILL } from "./ui";

/** One Spotify-style row: index/play, cover, title + composer, mood (desktop), duration, like. 60px tall. */
export function SongRow({ b, index, moodLabel }: { b: BhajanSummary; index?: number; moodLabel?: string }) {
  const { isCurrent, showPause, busy, onPlay } = usePlaySlug(b.slug);
  return (
    <li className={`group/row flex min-h-[60px] items-center gap-2 rounded-lg px-1 transition-colors motion-reduce:transition-none hover:bg-vk-50 sm:gap-3 sm:px-2 ${isCurrent ? "bg-vk-50" : ""}`}>
      {b.hasAudio ? (
        <button type="button" onClick={() => void onPlay()} aria-label={`${showPause ? "Pause" : "Play"} ${b.title}`} className={`relative inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-vk-700 hover:bg-white ${FOCUS}`}>
          {busy || showPause || isCurrent ? (
            <PlayIcon busy={busy} pause={showPause} className="h-5 w-5 text-vk-700" />
          ) : (
            <>
              {index !== undefined && <span className="[@media(hover:hover)]:group-hover/row:hidden">{index}</span>}
              <PlayIcon className={`h-5 w-5 text-vk-700 ${index !== undefined ? "hidden [@media(hover:hover)]:group-hover/row:block" : ""}`} />
            </>
          )}
        </button>
      ) : (
        <span aria-hidden className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-sm font-semibold text-vk-700">{index ?? ""}</span>
      )}
      <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-md bg-vk-100 shadow-[0_2px_6px_-3px_rgba(15,31,92,.3)]">
        <CoverArt title={b.title} src={b.coverImage} sizes="44px" showInitials={false} />
      </div>
      <Link href={`/bhajans/${b.slug}`} className={`min-w-0 flex-1 rounded-sm py-2 ${FOCUS}`}>
        <span className={`block truncate text-[15px] font-bold leading-tight ${isCurrent ? "text-vk-700" : "text-ink"}`}>{b.title}</span>
        <span className="mt-0.5 block truncate text-[13px] leading-snug text-vk-700">{b.artist}{!b.hasAudio ? " · Lyrics" : ""}</span>
      </Link>
      {moodLabel && <span className="hidden w-40 shrink-0 truncate text-[13px] text-vk-700 md:block">{moodLabel}</span>}
      <span className="w-11 shrink-0 text-right text-[13px] tabular-nums text-vk-700">{b.duration ? fmtDuration(b.duration) : ""}</span>
      <LikeButton song={{ slug: b.slug, title: b.title, artist: b.artist, coverImage: b.coverImage }} />
    </li>
  );
}

export function RowList({ items, moodLabels, start = 1, numbered = true }: { items: BhajanSummary[]; moodLabels?: Record<string, string>; start?: number; numbered?: boolean }) {
  return (
    <ul>
      {items.map((b, i) => (
        <SongRow key={b._id || b.slug} b={b} index={numbered ? start + i : undefined} moodLabel={moodLabels?.[b.moods?.[0] || ""]} />
      ))}
    </ul>
  );
}

/** The full songs list with list/grid toggle and Load more. `query` picks the taxonomy filter. */
export default function SongRows({ initial, total, pages, query, moodLabels, title = "All bhajans", showMoodColumn = false }: { initial: BhajanSummary[]; total: number; pages: number; query: BhajanQuery; moodLabels?: Record<string, string>; title?: string; showMoodColumn?: boolean }) {
  const [items, setItems] = useState(initial);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState<"list" | "grid">("list");
  const more = page < pages && items.length < total;

  async function loadMore() {
    setLoading(true);
    const l = await clientFetchBhajanList({ ...query, page: page + 1, limit: 24 });
    setLoading(false);
    if (!l.items.length) return setPage(pages);
    setItems((cur) => {
      const seen = new Set(cur.map((x) => x.slug));
      return [...cur, ...l.items.filter((x) => !seen.has(x.slug))];
    });
    setPage(page + 1);
  }

  return (
    <section aria-label={title}>
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="min-w-0 truncate font-serif-display text-xl font-bold text-ink sm:text-2xl">{title}</h2>
        <div className="flex shrink-0 gap-1 rounded-full bg-vk-50 p-1 ring-1 ring-vk-100" role="group" aria-label="Layout">
          {([["list", List, "List view"], ["grid", LayoutGrid, "Grid view"]] as const).map(([v, Icon, label]) => (
            <button key={v} type="button" aria-pressed={view === v} aria-label={label} onClick={() => setView(v)} className={`inline-flex h-10 w-10 items-center justify-center rounded-full ${FOCUS} ${view === v ? "bg-white text-vk-800 ring-1 ring-vk-200" : "text-vk-700"}`}>
              <Icon className="h-5 w-5" aria-hidden />
            </button>
          ))}
        </div>
      </div>
      {!items.length ? (
        <p className="rounded-xl bg-vk-50 px-4 py-8 text-center text-[15px] text-vk-800">No bhajans here yet.</p>
      ) : view === "list" ? (
        <RowList items={items} moodLabels={showMoodColumn ? moodLabels : undefined} />
      ) : (
        <ul className="-mx-1 grid grid-cols-2 gap-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {items.map((b) => (
            <li key={b._id || b.slug} className="min-w-0"><SpotCard b={b} /></li>
          ))}
        </ul>
      )}
      {more && (
        <div className="mt-6 flex justify-center">
          <button type="button" onClick={loadMore} disabled={loading} className={PILL}>
            {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
            Load more ({total - items.length} left)
          </button>
        </div>
      )}
    </section>
  );
}
