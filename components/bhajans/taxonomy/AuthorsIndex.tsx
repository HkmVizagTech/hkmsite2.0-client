"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import Avatar from "./Avatar";
import { FOCUS } from "./ui";
import { pickL10n, type TaxonomyItem } from "@/lib/bhajansTaxonomy";

export default function AuthorsIndex({ items, lang }: { items: TaxonomyItem[]; lang: string }) {
  const [q, setQ] = useState("");
  const [letter, setLetter] = useState("");
  const [sort, setSort] = useState<"songs" | "az">("songs");
  const rows = useMemo(() => items.map((a) => ({ a, name: pickL10n(a.name, lang) })), [items, lang]);
  const letters = useMemo(() => Array.from(new Set(rows.map((r) => r.a.name.en?.trim()[0]?.toUpperCase() || "").filter(Boolean))).sort(), [rows]);
  const shown = useMemo(() => {
    const n = q.trim().toLowerCase();
    let r = rows.filter((x) => (!n || [x.a.name.en, x.a.name.te, x.a.name.hi].some((s) => s?.toLowerCase().includes(n))) && (!letter || x.a.name.en?.trim()[0]?.toUpperCase() === letter));
    r = [...r].sort((x, y) => (sort === "az" ? (x.a.name.en || "").localeCompare(y.a.name.en || "") : y.a.songCount - x.a.songCount));
    return r;
  }, [rows, q, letter, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="relative block flex-1">
          <span className="sr-only">Search composers</span>
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-vk-600" aria-hidden />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search composers"
            className="h-12 w-full rounded-full bg-vk-50 pl-12 pr-12 text-base text-ink ring-1 ring-vk-200 placeholder:text-vk-700/70 focus:bg-white focus:outline-none focus:ring-2 focus:ring-vk-500"
          />
          {q && (
            <button type="button" aria-label="Clear search" onClick={() => setQ("")} className={`absolute right-1 top-1/2 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-vk-700 hover:bg-vk-100 ${FOCUS}`}>
              <X className="h-5 w-5" aria-hidden />
            </button>
          )}
        </label>
        <div className="flex shrink-0 gap-1 self-start rounded-full bg-vk-50 p-1 ring-1 ring-vk-100" role="group" aria-label="Sort">
          {([["songs", "Most bhajans"], ["az", "A to Z"]] as const).map(([v, l]) => (
            <button key={v} type="button" aria-pressed={sort === v} onClick={() => setSort(v)} className={`min-h-[40px] rounded-full px-4 text-sm font-semibold ${FOCUS} ${sort === v ? "bg-white text-vk-800 ring-1 ring-vk-200" : "text-vk-700"}`}>{l}</button>
          ))}
        </div>
      </div>

      {letters.length > 1 && (
        <div role="group" aria-label="Jump to letter" className="-mx-4 mt-3 flex gap-1.5 overflow-x-auto px-4 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:flex-wrap md:px-0">
          {letters.map((l) => (
            <button key={l} type="button" aria-pressed={letter === l} onClick={() => setLetter(letter === l ? "" : l)} className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-1 ${FOCUS} ${letter === l ? "bg-vk-600 text-white ring-vk-600" : "bg-white text-vk-800 ring-vk-200 hover:bg-vk-50"}`}>{l}</button>
          ))}
        </div>
      )}

      <p className="mt-5 text-sm text-vk-800" role="status">{shown.length} {shown.length === 1 ? "composer" : "composers"}</p>
      {shown.length === 0 ? (
        <p className="mt-4 rounded-xl bg-vk-50 px-4 py-10 text-center text-[15px] text-vk-800">No composer matches your search.</p>
      ) : (
        <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-7 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {shown.map(({ a, name }) => (
            <li key={a.slug} className="min-w-0">
              <Link href={`/bhajans/authors/${a.slug}`} className={`group flex flex-col items-center rounded-2xl p-2 text-center transition-colors motion-reduce:transition-none hover:bg-vk-50 ${FOCUS}`}>
                <Avatar name={a.name.en || name} src={a.image} className="h-28 w-28 sm:h-32 sm:w-32 lg:h-36 lg:w-36" sizes="150px" textClass="text-3xl" />
                <span className="mt-3 line-clamp-2 min-h-[2.5rem] w-full text-[15px] font-bold leading-snug text-ink">{name}</span>
                <span className="mt-0.5 text-[13px] text-vk-700">{a.songCount} {a.songCount === 1 ? "bhajan" : "bhajans"}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
