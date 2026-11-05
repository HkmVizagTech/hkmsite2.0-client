import Link from "next/link";
import CoverArt from "../CoverArt";
import { PlayQueueButton } from "../PlayButtons";
import LikeButton from "../library/LikeButton";
import { labelOf, tracksToQueue, type Bhajan, type BhajanMeta } from "@/lib/bhajans";

/** Deterministic "Bhajan of the day" strip (server component). Flat light card, no heavy shadows. */
export default function BhajanOfTheDay({ doc, meta, dateLabel }: { doc: Bhajan; meta: BhajanMeta; dateLabel: string }) {
  const queue = tracksToQueue(doc);
  const mood = doc.moods[0];
  const verse = doc.verses.find((v) => v.translation?.en) || null;
  const snippet = verse?.translation?.en?.replace(/\s+/g, " ").trim() || "";
  return (
    <section className="pt-8 md:pt-10" aria-label="Bhajan of the day">
      <div className="vk-container">
        <div className="flex flex-col items-center gap-5 rounded-3xl bg-vk-50 p-5 text-center sm:flex-row sm:gap-8 sm:p-6 sm:text-left lg:p-8">
          <Link href={`/bhajans/${doc.slug}`} className="relative aspect-square w-[62%] max-w-[240px] shrink-0 overflow-hidden rounded-2xl bg-vk-100 shadow-[0_8px_18px_-12px_rgba(15,31,92,.3)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vk-500 sm:w-[200px] lg:w-[260px] lg:max-w-none" aria-label={`Open ${doc.title}`}>
            <CoverArt title={doc.title} src={doc.coverImage} sizes="260px" />
          </Link>
          <div className="min-w-0 flex-1">
            <p className="text-[13px] font-bold uppercase tracking-[0.16em] text-vk-700">Bhajan of the day · {dateLabel}</p>
            <h2 className="font-serif-display mt-2 text-[1.75rem] font-semibold leading-tight text-ink break-words sm:text-3xl lg:text-4xl">{doc.title}</h2>
            {doc.artist && <p className="mt-1.5 text-base font-semibold text-ink/80">{doc.artist}</p>}
            {mood && (
              <p className="mt-3">
                <Link href={`/bhajans/moods/${mood}`} className="inline-flex min-h-[36px] items-center rounded-full bg-white px-3.5 text-[13px] font-semibold text-vk-800 ring-1 ring-vk-200 hover:bg-vk-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500">
                  {labelOf(meta.moods, mood)}
                </Link>
              </p>
            )}
            {snippet && <p className="mx-auto mt-3 line-clamp-2 max-w-xl text-[15px] italic leading-relaxed text-ink/75 sm:mx-0">“{snippet}”</p>}
            <div className="mt-5 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              {queue.length > 0 && <PlayQueueButton queue={queue} label="Play" className="w-full sm:w-auto" />}
              <Link href={`/bhajans/${doc.slug}`} className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-white px-7 text-base font-semibold text-vk-800 ring-1 ring-vk-200 hover:bg-vk-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500">
                Open lyrics
              </Link>
              <LikeButton song={{ slug: doc.slug, title: doc.title, artist: doc.artist, coverImage: doc.coverImage }} size="lg" className="self-center" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
