"use client";

import { useState } from "react";
import Link from "next/link";
import { Clock, FileText, LayoutGrid, List, Loader2, Play, Pause, Search, X } from "lucide-react";
import CoverArt from "../CoverArt";
import { useBrowse } from "./BrowseContext";
import { Avatar } from "./Acharyas";
import { PlayIcon } from "./PlayFab";
import PlayAllButtons from "./PlayAllButtons";
import CardMenu from "./CardMenu";
import Highlight, { matchesIn } from "./Highlight";
import LikeButton from "../library/LikeButton";
import { Equaliser } from "../player/controls";
import { usePlaySlug } from "./usePlaySlug";
import SpotCard from "./SpotCard";
import { BLUE_TONES, FOCUS, MUTED, RESULTS_ID, hash, initials } from "./tones";
import { clientFetchBhajanList, fmtDuration, labelOf, type BhajanSummary, type FacetCount } from "@/lib/bhajans";

const COLS =
  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 sm:grid-cols-[44px_minmax(0,2.6fr)_minmax(0,1.2fr)_72px_88px] xl:grid-cols-[44px_minmax(0,2.6fr)_minmax(0,1.2fr)_minmax(0,1.2fr)_72px_88px]";
const PILL = "inline-block max-w-full truncate rounded-full bg-vk-50 px-2.5 py-1 text-[13px] font-medium leading-none text-vk-800 ring-1 ring-vk-100";
const SORTS: { v: "" | "new" | "title" | "plays"; label: string }[] = [
  { v: "", label: "Featured" },
  { v: "new", label: "Newest" },
  { v: "title", label: "A to Z" },
  { v: "plays", label: "Most played" },
];

/** Shared composer/category pictures repeat on many bhajans, so rows show a quiet blue initials tile instead. */
function Thumb({ b, size }: { b: BhajanSummary; size: string }) {
  const shared = /\/bhajans\/(authors|categories)\//.test(b.coverImage || "");
  if (b.coverImage && !shared) {
    return (
      <span className={`relative shrink-0 overflow-hidden rounded-lg bg-vk-100 ${size}`}>
        <CoverArt title={b.title} src={b.coverImage} showInitials={false} sizes="56px" />
      </span>
    );
  }
  const h = hash(b.title);
  const c1 = BLUE_TONES[h % BLUE_TONES.length];
  const c2 = BLUE_TONES[(h >> 3) % BLUE_TONES.length];
  return (
    <span aria-hidden className={`flex shrink-0 items-center justify-center rounded-lg font-serif-display text-base font-semibold text-white ${size}`} style={{ backgroundImage: `linear-gradient(135deg, ${c1}, ${c2})` }}>
      {initials(b.title)}
    </span>
  );
}

function Row({ b, index, mood, festival, term }: { b: BhajanSummary; index: number; mood: string; festival: string; term: string }) {
  const { isCurrent, showPause, busy, onPlay } = usePlaySlug(b.slug);
  const lyricsOnlyMatch = !!term && !matchesIn(term, b.title, b.artist);
  const song = { slug: b.slug, title: b.title, artist: b.artist, coverImage: b.coverImage };
  const reveal = "[@media(hover:hover)]:sm:opacity-0 [@media(hover:hover)]:sm:group-hover/row:opacity-100 focus-visible:!opacity-100 aria-expanded:!opacity-100";
  return (
    <li className={`group/row relative ${COLS} min-h-[64px] rounded-xl px-1 py-2 transition-colors duration-150 motion-reduce:transition-none hover:bg-vk-50 sm:px-2 ${isCurrent ? "bg-vk-50" : ""}`}>
      {/* # / play / equaliser */}
      <div className="relative z-[1] hidden h-10 items-center justify-center sm:flex">
        {b.hasAudio ? (
          <>
            <span aria-hidden className={`text-sm tabular-nums transition-opacity duration-150 group-hover/row:opacity-0 group-focus-within/row:opacity-0 [@media(hover:none)]:hidden ${isCurrent ? "" : MUTED}`}>
              {isCurrent ? <span className="text-vk-600"><Equaliser paused={!showPause} /></span> : index}
            </span>
            <button
              type="button"
              onClick={() => void onPlay()}
              aria-label={`${showPause ? "Pause" : "Play"} ${b.title}`}
              className={`absolute inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#F6C752] text-[#0b1745] transition-opacity duration-150 motion-reduce:transition-none group-hover/row:opacity-100 focus-visible:opacity-100 [@media(hover:none)]:opacity-100 [@media(hover:hover)]:opacity-0 ${FOCUS}`}
            >
              <PlayIcon busy={busy} pause={showPause} className="h-4 w-4" />
            </button>
          </>
        ) : (
          <span aria-hidden className={`text-sm tabular-nums ${MUTED}`}>{index}</span>
        )}
      </div>

      {/* Cover + title + composer */}
      <div className="flex min-w-0 items-center gap-3">
        <Thumb b={b} size="h-[52px] w-[52px] sm:h-12 sm:w-12" />
        <div className="min-w-0">
          <Link href={`/bhajans/${b.slug}`} className={`block truncate rounded-sm text-[15px] font-bold leading-snug after:absolute after:inset-0 after:content-[''] hover:underline ${FOCUS} ${isCurrent ? "text-vk-700" : "text-ink"}`}>
            <Highlight text={b.title} term={term} />
          </Link>
          <p className={`truncate text-[13px] leading-5 ${MUTED}`}>
            <Highlight text={b.artist} term={term} />
            {mood && <span className="sm:hidden"> · {mood}</span>}
            {lyricsOnlyMatch && <span className="ml-1.5 rounded-full bg-[#FDF3D2] px-1.5 py-0.5 text-[12px] font-semibold text-ink">in lyrics</span>}
          </p>
        </div>
      </div>

      <div className="hidden min-w-0 sm:block">{mood && <span className={PILL}>{mood}</span>}</div>
      <div className="hidden min-w-0 xl:block">{festival && <span className={PILL}>{festival}</span>}</div>

      <div className="hidden justify-end sm:flex">
        {b.hasAudio ? (
          <span className={`text-[13px] tabular-nums ${MUTED}`}>{b.duration ? fmtDuration(b.duration) : "Audio"}</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-[13px] text-vk-700/80"><FileText className="h-3.5 w-3.5" aria-hidden /> Lyrics</span>
        )}
      </div>

      {/* Actions */}
      <div className="relative z-[1] flex items-center justify-end">
        {b.hasAudio && (
          <button
            type="button"
            onClick={() => void onPlay()}
            aria-label={`${showPause ? "Pause" : "Play"} ${b.title}`}
            className={`mr-1 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#F6C752] text-[#0b1745] sm:hidden ${FOCUS}`}
          >
            {showPause ? <Pause className="h-4 w-4" fill="currentColor" aria-hidden /> : <Play className="h-4 w-4 translate-x-[1px]" fill="currentColor" aria-hidden />}
          </button>
        )}
        <LikeButton song={song} size="sm" className={`max-[399px]:hidden ${reveal}`} />
        <CardMenu slug={b.slug} title={b.title} hasAudio={b.hasAudio} song={song} className={reveal} />
      </div>
    </li>
  );
}

function SkeletonRows({ n = 6 }: { n?: number }) {
  return (
    <ul aria-hidden>
      {Array.from({ length: n }).map((_, i) => (
        <li key={i} className="flex min-h-[64px] items-center gap-3 px-2 py-2">
          <span className="h-12 w-12 shrink-0 animate-pulse rounded-lg bg-vk-100 motion-reduce:animate-none" />
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
    <ul aria-hidden className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
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

/** Results: Spotify songs list (default) or grid, with active-filter title, sort, composer matches and Load more. */
export default function Results() {
  const { meta, searchText, filters, filtering, list, loading, loadMore, apply, setSort, query } = useBrowse();
  const [view, setView] = useState<"list" | "grid">("grid");
  const lbl = (arr: FacetCount[], s: string) => (s ? arr.find((x) => x.slug === s)?.label : undefined);
  const parts = [
    lbl(meta.categories, filters.category),
    lbl(meta.moods, filters.mood),
    lbl(meta.festivals, filters.festival),
    meta.artists.find((a) => a.slug === filters.artist)?.name,
    filters.hasAudio ? "With audio" : "",
    filters.featured ? "Featured" : "",
  ].filter(Boolean) as string[];
  const title = searchText ? `Results for “${searchText}”` : parts.length ? parts.join(" · ") : "All bhajans";
  const needle = searchText.toLowerCase();
  const composers = needle.length >= 2 ? meta.artists.filter((a) => a.name.toLowerCase().includes(needle)).slice(0, 6) : [];
  const seg = (on: boolean) =>
    `inline-flex h-10 w-11 items-center justify-center rounded-full transition-colors duration-150 motion-reduce:transition-none ${FOCUS} ${on ? "bg-white text-vk-800 shadow-[0_1px_3px_rgba(11,23,69,.12)]" : "text-vk-700 hover:text-vk-900"}`;
  const audioCount = list.items.filter((b) => b.hasAudio).length;
  const playableSlugs = async (): Promise<string[]> => {
    if (list.pages > 1) {
      const r = await clientFetchBhajanList({ ...query, hasAudio: true, page: 1, limit: 40 });
      if (r.items.length) return r.items.map((b) => b.slug);
    }
    return list.items.filter((b) => b.hasAudio).map((b) => b.slug);
  };
  const moodOf = (b: BhajanSummary) => (b.moods[0] ? labelOf(meta.moods, b.moods[0]) : "");
  const festOf = (b: BhajanSummary) => (b.festivals[0] ? labelOf(meta.festivals, b.festivals[0]) : "");
  const hasMore = list.page < list.pages;

  return (
    <section id={RESULTS_ID} className="scroll-mt-[calc(var(--header-h)+72px)] pb-[calc(4rem+var(--player-h,0px))] pt-8 md:pt-10" aria-label={title}>
      <div className="vk-container">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-x-4 gap-y-3">
          <div className="min-w-0">
            <h2 className="truncate text-2xl font-bold leading-tight tracking-tight text-ink">{title}</h2>
            <p aria-live="polite" className={`mt-0.5 text-sm ${MUTED}`}>{list.total ? `${list.total} bhajan${list.total === 1 ? "" : "s"}` : loading ? "Searching…" : ""}</p>
          </div>
          <div className="flex w-full flex-wrap items-center justify-between gap-2 sm:w-auto sm:justify-end sm:gap-3">
            {audioCount > 0 && <PlayAllButtons getSlugs={playableSlugs} label={title} />}
            <div className="flex items-center gap-2 sm:gap-3">
              <label className="sr-only" htmlFor="bhajan-sort">Sort bhajans</label>
              <select
                id="bhajan-sort"
                value={filters.sort}
                onChange={(e) => setSort(e.target.value as typeof filters.sort)}
                className={`h-10 rounded-full bg-white px-4 text-base font-semibold text-vk-800 ring-1 ring-vk-200 hover:bg-vk-50 sm:text-sm ${FOCUS}`}
              >
                {SORTS.map((s) => (
                  <option key={s.v} value={s.v}>{s.v === "" && searchText ? "Best match" : s.label}</option>
                ))}
              </select>
              <div role="group" aria-label="View" className="inline-flex rounded-full bg-vk-100 p-0.5">
                <button type="button" aria-pressed={view === "list"} aria-label="List view" onClick={() => setView("list")} className={seg(view === "list")}><List className="h-5 w-5" aria-hidden /></button>
                <button type="button" aria-pressed={view === "grid"} aria-label="Grid view" onClick={() => setView("grid")} className={seg(view === "grid")}><LayoutGrid className="h-5 w-5" aria-hidden /></button>
              </div>
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
                      <span className={`block text-[13px] ${MUTED}`}>Composer · {a.count}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}

        {filtering && composers.length > 0 && <h3 className="mb-2 text-lg font-bold text-ink">Songs</h3>}

        <div className={loading && list.items.length ? "opacity-60 transition-opacity" : ""}>
          {list.items.length ? (
            view === "list" ? (
              <>
                <div className={`${COLS} hidden border-b border-vk-100 px-2 pb-2 text-[12px] font-bold uppercase tracking-[0.14em] sm:grid ${MUTED}`} aria-hidden>
                  <span className="text-center">#</span>
                  <span>Title</span>
                  <span>Mood</span>
                  <span className="hidden xl:block">Festival</span>
                  <span className="flex justify-end"><Clock className="h-4 w-4" aria-hidden /></span>
                  <span />
                </div>
                <ol className="sm:mt-1">
                  {list.items.map((b, i) => (
                    <Row key={b.slug} b={b} index={i + 1} mood={moodOf(b)} festival={festOf(b)} term={searchText} />
                  ))}
                </ol>
                {loading && hasMore && <SkeletonRows n={4} />}
              </>
            ) : (
              <>
                <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {list.items.map((b) => (
                    <li key={b.slug} className="min-w-0"><SpotCard b={b} /></li>
                  ))}
                </ul>
                {loading && hasMore && <div className="mt-3"><SkeletonGrid n={6} /></div>}
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

        {hasMore && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <button type="button" onClick={loadMore} disabled={loading} className={`inline-flex min-h-[48px] items-center gap-2 rounded-full border border-vk-300 px-8 text-sm font-bold text-ink transition-colors hover:border-vk-600 hover:bg-vk-50 disabled:opacity-60 ${FOCUS}`}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null} Load more
            </button>
            <p className={`text-[13px] ${MUTED}`}>Showing {list.items.length} of {list.total}</p>
          </div>
        )}
      </div>
    </section>
  );
}
