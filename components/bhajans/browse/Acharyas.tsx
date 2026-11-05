"use client";

import Link from "next/link";
import { useBrowse } from "./BrowseContext";
import { ScrollRow, ShelfHead } from "./Shelf";
import { FOCUS, MUTED } from "./tones";
import PersonAvatar from "../PersonAvatar";

export function Avatar({ name, src, className = "" }: { name: string; src?: string; className?: string }) {
  return <PersonAvatar name={name} src={src} className={`aspect-square ${className}`} sizes="188px" />;
}

export function ArtistCard({ slug, name, src }: { slug: string; name: string; src?: string }) {
  return (
    <Link
      href={`/bhajans/authors/${slug}`}
      className={`group/card flex w-full flex-col rounded-xl p-2.5 text-left transition-colors duration-150 motion-reduce:transition-none hover:bg-vk-50 ${FOCUS}`}
    >
      <Avatar name={name} src={src} className="w-full text-base shadow-[0_6px_16px_-8px_rgba(15,31,92,.3)]" />
      <span className="mt-3 block truncate text-[15px] font-bold leading-snug text-ink">{name}</span>
      <span className={`block text-[13px] leading-5 ${MUTED}`}>Composer</span>
    </Link>
  );
}

/** "Browse by composer": round portraits that open each composer's page; "Show all" opens the composers index. */
export default function Acharyas({ portraits }: { portraits: Record<string, string> }) {
  const { meta } = useBrowse();
  const artists = meta.artists;
  if (!artists.length) return null;
  return (
    <section className="pt-8 md:pt-10" aria-label="Browse by composer">
      <div className="vk-container">
        <ShelfHead title="Browse by composer" subtitle="The Acharyas and their songs" showAllHref="/bhajans/authors" />
        <ScrollRow label="Composers">
          {artists.slice(0, 20).map((a) => <ArtistCard key={a.slug} slug={a.slug} name={a.name} src={portraits[a.slug]} />)}
        </ScrollRow>
      </div>
    </section>
  );
}
