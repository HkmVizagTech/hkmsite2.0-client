import Link from "next/link";
import { Headphones } from "lucide-react";
import CoverArt from "./CoverArt";
import { CardPlay } from "./PlayButtons";
import { fmtDuration, type BhajanSummary } from "@/lib/bhajans";

export default function BhajanCard({ b, className = "", priority = false }: { b: BhajanSummary; className?: string; priority?: boolean }) {
  return (
    <article className={`group relative ${className}`}>
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-vk-100 shadow-[0_10px_24px_-14px_rgba(11,23,69,.5)] ring-1 ring-vk-100 transition-transform duration-300 motion-reduce:transition-none group-hover:-translate-y-0.5">
        <CoverArt title={b.title} src={b.coverImage} priority={priority} />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0b1745]/55 via-transparent to-transparent opacity-80" />
        {b.hasAudio && (
          <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[11px] font-semibold text-vk-800">
            <Headphones className="h-3 w-3" aria-hidden />
            {b.duration ? fmtDuration(b.duration) : "Audio"}
          </span>
        )}
        {b.hasAudio && (
          <div className="absolute bottom-2 right-2 z-[2] translate-y-1 opacity-100 transition duration-200 motion-reduce:transition-none lg:opacity-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-hover:translate-y-0 lg:group-hover:opacity-100">
            <CardPlay slug={b.slug} title={b.title} />
          </div>
        )}
      </div>
      <Link
        href={`/bhajans/${b.slug}`}
        className="mt-3 block rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vk-500 after:absolute after:inset-0 after:z-[1] after:content-['']"
      >
        <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-ink">{b.title}</h3>
        <p className="mt-0.5 line-clamp-1 text-[13px] text-ink/60">{b.artist}</p>
      </Link>
    </article>
  );
}
