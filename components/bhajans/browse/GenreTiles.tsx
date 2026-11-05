"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CoverArt from "../CoverArt";
import { BLUE_TONES, FOCUS } from "./tones";

export interface FacetTile {
  slug: string;
  label: string;
  count: number;
  /** A distinct bhajan picture for this tile (empty: generated lotus art). */
  cover?: string;
}

function Tile({ t, href, tone }: { t: FacetTile; href: string; tone: string }) {
  return (
    <Link
      href={href}
      aria-label={`${t.label}, ${t.count} bhajans`}
      style={{ backgroundColor: tone, backgroundImage: "linear-gradient(135deg, rgba(255,255,255,.2) 0%, rgba(255,255,255,0) 52%)" }}
      className={`group/tile relative block aspect-[16/10] min-h-[112px] w-full overflow-hidden rounded-2xl text-left shadow-[inset_0_1px_0_rgba(255,255,255,.28)] transition-transform duration-200 motion-reduce:transition-none [@media(hover:hover)]:hover:-translate-y-0.5 motion-reduce:[@media(hover:hover)]:hover:translate-y-0 ${FOCUS}`}
    >
      <span className="absolute left-3 top-3 z-[1] line-clamp-2 max-w-[62%] break-words text-[15px] min-[400px]:text-[17px] md:max-w-[58%] font-bold leading-tight text-white [text-wrap:balance] md:left-4 md:top-4 md:text-xl">
        {t.label}
      </span>
      <ArrowUpRight aria-hidden className="absolute right-3 top-3 z-[1] h-5 w-5 -translate-x-1 translate-y-1 text-white opacity-0 transition duration-200 motion-reduce:transition-none group-hover/tile:translate-x-0 group-hover/tile:translate-y-0 group-hover/tile:opacity-100 group-focus-visible/tile:opacity-100" />
      <span className="absolute bottom-3 left-3 z-[1] rounded-full bg-white/20 px-2.5 py-1 text-[12px] font-semibold text-white md:bottom-4 md:left-4">
        {t.count} bhajan{t.count === 1 ? "" : "s"}
      </span>
      <span
        aria-hidden
        className="absolute -bottom-3 -right-3 aspect-square w-[36%] rotate-[14deg] overflow-hidden rounded-xl bg-white/10 shadow-[0_8px_16px_-8px_rgba(0,0,0,.35)] transition-transform duration-300 motion-reduce:transition-none [@media(hover:hover)]:group-hover/tile:rotate-[17deg] motion-reduce:[@media(hover:hover)]:group-hover/tile:rotate-[14deg]"
      >
        <CoverArt title={t.label} src={t.cover} showInitials={false} sizes="140px" />
      </span>
    </Link>
  );
}

function Section({ title, subtitle, base, tiles }: { title: string; subtitle: string; base: string; tiles: FacetTile[] }) {
  const [all, setAll] = useState(false);
  if (!tiles.length) return null;
  const shown = all ? tiles : tiles.slice(0, 8);
  return (
    <div className="pt-8 md:pt-10">
      <div className="mb-3 flex items-center justify-between gap-3 md:mb-4">
        <div className="min-w-0">
          <h2 className="truncate text-xl font-bold tracking-tight text-ink md:text-2xl">{title}</h2>
          <p className="truncate text-[13px] text-vk-700 md:text-sm">{subtitle}</p>
        </div>
        {tiles.length > 8 && (
          <button type="button" aria-expanded={all} onClick={() => setAll((v) => !v)} className={`-mr-2 inline-flex min-h-[44px] shrink-0 items-center rounded-md px-2 text-sm font-bold text-vk-700 hover:text-vk-900 hover:underline ${FOCUS}`}>
            {all ? "Show less" : "Show all"}
          </button>
        )}
      </div>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-5">
        {shown.map((t, i) => (
          <li key={t.slug} className="min-w-0">
            <Tile t={t} href={`${base}/${t.slug}`} tone={BLUE_TONES[i % BLUE_TONES.length]} />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Three headed grids that link to the category, mood and festival pages. */
export default function GenreTiles({ categories, moods, festivals }: { categories: FacetTile[]; moods: FacetTile[]; festivals: FacetTile[] }) {
  if (!categories.length && !moods.length && !festivals.length) return null;
  return (
    <section aria-label="Browse all">
      <div className="vk-container">
        <Section title="By category" subtitle="Prayers, glories and songs by theme" base="/bhajans/categories" tiles={categories} />
        <Section title="By mood" subtitle="Songs for how you feel today" base="/bhajans/moods" tiles={moods} />
        <Section title="By festival" subtitle="Bhajans for the holy days" base="/bhajans/festivals" tiles={festivals} />
      </div>
    </section>
  );
}
