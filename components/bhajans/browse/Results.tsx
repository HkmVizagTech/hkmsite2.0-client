"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, LayoutGrid, List, Loader2, Search, X } from "lucide-react";
import CoverArt from "../CoverArt";
import { useBrowse } from "./BrowseContext";
import { Avatar } from "./Acharyas";
import PlayFab from "./PlayFab";
import PlayAllButtons from "./PlayAllButtons";
import CardMenu from "./CardMenu";
import Highlight, { matchesIn } from "./Highlight";
import LikeButton from "../library/LikeButton";
import { Equaliser } from "../player/controls";
import { usePlaySlug } from "./usePlaySlug";
import SpotCard from "./SpotCard";
import { FOCUS, MUTED, RESULTS_ID } from "./tones";
import { clientFetchBhajanList, fmtDuration, labelOf, type BhajanSummary, type FacetCount } from "@/lib/bhajans";

function tagOf(b: BhajanSummary, moods: FacetCount[], festivals: FacetCount[]): string {
  if (b.festivals[0]) return labelOf(festivals, b.festivals[0]);
  if (b.moods[0]) return labelOf(moods, b.moods[0]);
  return "";
}

const COLS = "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 sm:grid-cols-[2rem_minmax(0,6fr)_minmax(0,3fr)_4rem_8.5rem] sm:gap-x-4";

function Row({ b, index, tag, term }: { b: BhajanSummary; index: number; tag: string; term: string }) {
  const { isCurrent, showPause } = usePlaySlug(b.slug);
  const lyricsOnlyMatch = !!term && !matchesIn(term, b.title, b.artist);
  const song = { slug: b.slug, title: b.title, artist: b.artist, coverImage: b.coverImage };
  return (
    <li className={`group/row relative ${COLS} rounded-md px-2 py-1.5 transition-colors duration-150 motion-reduce:transition-none hover:bg-vk-50 sm:px-3 ${isCurrent ? "bg-vk-50" : ""}`}>
      <span aria-hidden className={`hidden items-center justify-end text-sm tabular-nums sm:flex ${MUTED} ${isCurrent ? "text-vk-600" : ""}`}>
        {isCurrent ? <Equaliser paused={!showPause} /> : index}
      </span>
      <div className="flex min-w-0 items-center gap-3">
        <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded bg-vk-100 shadow-[0_4px_10px_-6px_rgba(15,31,92,.3)]">
          <CoverArt title={b.title} src={b.coverImage} showInitials={false} sizes="48px" />
          {isCurrent && (
            <span className="absolute inset-0 flex items-center justify-center bg-white/80 text-vk-600 sm:hidden"><Equaliser paused={!showPause} /></span>
          )}
        </span>
        <div className="min-w-0">
          <Link href={`/bhajans/${b.slug}`} className={`block truncate rounded-sm text-[15px] font-bold after:absolute after:inset-0 after:content-[''] hover:underline ${FOCUS} ${isCurrent ? "text-vk-700" : "text-ink"}`}>
            <Highlight text={b.title} term={term} />
          </Link>
          <p className={`truncate text-[13px] ${MUTED}`}>
            <Highlight text={b.artist} term={term} />
            {tag && <span className="sm:hidden"> · {tag}</span>}
            {lyricsOnlyMatch && <span className="ml-1.5 rounded-full bg-[#FDF3D2] px-1.5 py-0.5 text-[12px] font-semibold text-ink">in lyrics</span>}
          </p>
        </div>
      </div>
      <p className={`hidden truncate text-[13px] sm:block ${MUTED}`}>{tag}</p>
      <p className={`hidden text-right text-[13px] tabular-nums sm:block ${MUTED}`}>{b.hasAudio && b.duration ? fmtDuration(b.duration) : ""}</p>
      <div className="relative z-[1] flex items-center justify-end">
        <LikeButton song={song} size="sm" className="max-sm:hidden [@media(hover:hover)]:sm:opacity-0 [@media(hover:hover)]:sm:group-hover/row:opacity-100 focus-visible:!opacity-100" />
        <CardMenu slug={b.slug} title={b.title} hasAudio={b.hasAudio} song={song} className="[@media(hover:hover)]:sm:opacity-0 [@media(hover:hover)]:sm:group-hover/row:opacity-100 focus-visible:!opacity-100 aria-expanded:!opacity-100" />
        {b.hasAudio ? (
          <PlayFab slug={b.slug} title={b.title} size="sm" className="[@media(hover:hover)]:sm:opacity-0 [@media(hover:hover)]:sm:group-hover/row:opacity-100 focus-visible:!opacity-100" />
        ) : (
          <span className="ml-1 rounded-full bg-vk-50 px-2 py-0.5 text-[12px] font-semibold text-vk-700 ring-1 ring-vk-200">Lyrics</span>
        )}
      </div>
    </li>
  );
}

function SkeletonRows({ n = 6 }: { n?: number }) {
  return (
    <ul aria-hidden className="mt-1">
      {Array.from({ length: n }).map((_, i) => (
        <li key={i} className="flex items-center gap-3 px-2 py-1.5 sm:px-3">
          <span className="h-12 w-12 shrink-0 animate-pulse rounded bg-vk-100 motion-reduce:animate-none" />
          <span className="min-w-0 flex-1 space-y-2">
            <span className="block h-3.5 animate-pulse rounded bg-vk-100 motion-reduce:animate-none" style={{ width: `${55 + ((i * 17) % 35)}%` }} />
            <span className="block h-3 w-1/3 animate-pulse rounded bg-vk-50 motion-reduce:animate-none" />
          </span>
        </li>
      ))}
    </ul>
  );
}

function SkeletonGrid({ n = 6 }: { n?: number }) {
  return (
    <ul aria-hidden className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: n }).map((_, i) => (
        <li key={i} className="p-2.5">
          <span className="block aspect-square animate-pulse rounded-xl bg-vk-100 motion-reduce:animate-none" />
          <span className="mt-3 block h-3.5 w-3/4 animate-pulse rounded bg-vk-100 motion-reduce:animate-none" />
          <span className="mt-2 block h-3 w-1/2 animate-pulse rounded bg-vk-50 motion-reduce:animate-none" />
        </li>
      ))}
    </ul>
  );
}

/** Results: Spotify songs list (default) or grid, with active-filter title, composer matches and Load more. */
export default function Results() {
  const { meta, searchText, filters, filtering, list, loading, loadMore, apply, query } = useBrowse();
  const [view, setView] = useState<"list" | "grid">("list");
  const lbl = (arr: FacetCount[], s: string) => (s ? arr.find((x) => x.slug === s)?.label : undefined);
  const parts = [
    lbl(meta.categories, filters.category),
    lbl(meta.moods, filters.mood),
    lbl(meta.festivals, filters.festival),
    meta.artists.find((a) => a.slug === filters.artist)?.name,
    filters.hasAudio ? "With audio" : "",
    filters.featured ? "Featured" : "",
    filters.sort === "plays" ? "Popular" : "",
  ].filter(Boolean) as string[];
  const title = searchText ? `Results for “${searchText}”` : parts.length ? parts.join(" · ") : "All bhajans";
  const needle = searchText.toLowerCase();
  const composers = needle.length >= 2 ? meta.artists.filter((a) => a.name.toLowerCase().includes(needle)).slice(0, 6) : [];
  const toggleBtn = (on: boolean) =>
    `inline-flex h-11 w-11 items-center justify-center rounded-md transition-colors duration-150 ${FOCUS} ${on ? "bg-vk-100 text-vk-800" : "text-vk-600 hover:text-vk-800"}`;
  const audioCount = list.items.filter((b) => b.hasAudio).length;
  const playableSlugs = async (): Promise<string[]> => {
    if (list.pages > 1) {
      const r = await clientFetchBhajanList({ ...query, hasAudio: true, page: 1, limit: 40 });
      if (r.items.length) return r.items.map((b) => b.slug);
    }
    return list.items.filter((b) => b.hasAudio).map((b) => b.slug);
  };
  const tagFor = (b: BhajanSummary) => tagOf(b, meta.moods, meta.festivals);

  return (
    <section id={RESULTS_ID} className="scroll-mt-[calc(var(--header-h)+72px)] pb-[calc(4rem+var(--player-h,0px))] pt-8 md:pt-10" aria-label={title}>
      <div className="vk-container">
        <div className="mb-3 flex items-end justify-between gap-3 md:mb-4">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold tracking-tight text-ink">{title}</h2>
            <p aria-live="polite" className={`mt-0.5 text-sm ${MUTED}`}>{list.total ? `${list.total} bhajan${list.total === 1 ? "" : "s"}` : loading ? "Searching…" : ""}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {audioCount > 0 && <PlayAllButtons getSlugs={playableSlugs} label={title} />}
          <div role="group" aria-label="View" className="-mr-2 flex shrink-0 items-center">
            <button type="button" aria-pressed={view === "list"} aria-label="List view" onClick={() => setView("list")} className={toggleBtn(view === "list")}><List className="h-5 w-5" aria-hidden /></button>
            <button type="button" aria-pressed={view === "grid"} aria-label="Grid view" onClick={() => setView("grid")} className={toggleBtn(view === "grid")}><LayoutGrid className="h-5 w-5" aria-hidden /></button>
          </div>
          </div>
        </div>

        {composers.length > 0 && (
          <div className="mb-6">
            <h3 className="mb-2 text-lg font-bold text-ink">Composers</h3>
            <ul className="flex flex-wrap gap-3">
              {composers.map((a) => (
                <li key={a.slug}>
                  <Link href={`/bhajans/authors/${a.slug}`} className={`flex min-h-[56px] items-center gap-3 rounded-full bg-vk-50 py-1.5 pl-1.5 pr-5 text-left transition-colors hover:bg-vk-100 ${FOCUS}`}>
                    <Avatar name={a.name} className="h-11 w-11 text-[10px]" />
                    <span>
                      <span className="block text-sm font-bold text-ink">{a.name}</span>
                      <span className={`block text-xs ${MUTED}`}>Composer · {a.count}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {(filtering) && composers.length > 0 && <h3 className="mb-2 text-lg font-bold text-ink">Songs</h3>}

        <div className={loading && list.items.length ? "opacity-60 transition-opacity" : ""}>
          {list.items.length ? (
            view === "list" ? (
              <>
                <div className={`${COLS} border-b border-vk-100 px-2 pb-2 text-xs font-semibold uppercase tracking-wider sm:px-3 ${MUTED}`} aria-hidden>
                  <span className="hidden text-right sm:block">#</span>
                  <span>Title</span>
                  <span className="hidden sm:block">Mood / festival</span>
                  <span className="hidden justify-end sm:flex"><Clock className="h-4 w-4" aria-hidden /></span>
                  <span className="hidden sm:block" />
                </div>
                <ol className="mt-1">
                  {list.items.map((b, i) => (
                    <Row key={b.slug} b={b} index={i + 1} tag={tagFor(b)} term={searchText} />
                  ))}
                </ol>
                {loading && list.page < list.pages && <SkeletonRows n={4} />}
              </>
            ) : (
              <>
                <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5 xl:grid-cols-6">
                  {list.items.map((b) => (
                    <li key={b.slug} className="min-w-0"><SpotCard b={b} /></li>
                  ))}
                </ul>
                {loading && list.page < list.pages && <div className="mt-3"><SkeletonGrid n={6} /></div>}
              </>
            )
          ) : loading ? (
            view === "list" ? <SkeletonRows n={7} /> : <SkeletonGrid n={6} />
          ) : (
            <div className="rounded-2xl bg-vk-50 px-5 py-10 text-center">
              <Search className="mx-auto h-8 w-8 text-vk-500" aria-hidden />
              <p className="mt-3 text-lg font-bold text-ink">{filtering ? "No bhajans found" : "The bhajan library is loading"}</p>
              <p className={`mx-auto mt-1 max-w-sm text-[15px] ${MUTED}`}>
                {filtering ? "Check the spelling, try a composer’s name or a word from the lyrics, or clear your filters." : "Please check back shortly."}
              </p>
              {filtering && (
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <button type="button" onClick={() => apply({}, { keepSearch: false, scroll: false })} className={`inline-flex min-h-[44px] items-center gap-1.5 rounded-full bg-vk-700 px-5 text-sm font-bold text-white ${FOCUS}`}>
                    <X className="h-4 w-4" aria-hidden /> Clear search and filters
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {list.page < list.pages && (
          <div className="mt-8 flex justify-center">
            <button type="button" onClick={loadMore} disabled={loading} className={`inline-flex min-h-[48px] items-center gap-2 rounded-full border border-vk-300 px-8 text-sm font-bold text-ink transition-colors hover:border-vk-600 hover:bg-vk-50 disabled:opacity-60 ${FOCUS}`}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null} Load more
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
