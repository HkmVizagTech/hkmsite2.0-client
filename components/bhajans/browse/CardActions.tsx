"use client";

import CardMenu from "./CardMenu";
import LikeButton from "../library/LikeButton";
import type { BhajanSummary } from "@/lib/bhajans";

const DISC = "relative !h-9 !w-9 rounded-full bg-white shadow-[0_2px_6px_-2px_rgba(11,23,69,.3)] after:absolute after:-inset-[4px] after:content-['']";

/** Heart + menu on white discs (36px visual, 44px hit area). Heart is hidden on phones; the menu has "Like". */
export default function CardActions({ b, className = "" }: { b: BhajanSummary; className?: string }) {
  const song = { slug: b.slug, title: b.title, artist: b.artist, coverImage: b.coverImage };
  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <span className="max-sm:hidden"><LikeButton song={song} size="sm" className={DISC} /></span>
      <CardMenu slug={b.slug} title={b.title} hasAudio={b.hasAudio} song={song} className={DISC} />
    </div>
  );
}
