import Link from "next/link";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import JsonLd from "@/components/seo/JsonLd";
import CoverArt from "../CoverArt";
import BrowseByStrip from "./BrowseByStrip";
import Crumbs from "./Crumbs";
import PlayAllButtons from "./PlayAllButtons";
import SongRows from "./SongRows";
import FollowButton from "../library/FollowButton";
import { fetchBhajanList, fetchBhajanMeta, fmtDuration, type BhajanQuery } from "@/lib/bhajans";
import { TAXONOMY_META, fetchTaxonomyItem, fetchTaxonomyList, pickL10n, taxonomyHref, type TaxonomyType } from "@/lib/bhajansTaxonomy";
import { breadcrumbJsonLd } from "@/lib/seo";
import { FOCUS } from "./ui";

export type PlaylistType = Exclude<TaxonomyType, "author">;
const STRIP = { category: "categories", mood: "moods", festival: "festivals" } as const;

export async function playlistMetadata(type: PlaylistType, slug: string) {
  const item = await fetchTaxonomyItem(type, slug);
  const m = TAXONOMY_META[type];
  if (!item) return { title: m.singular, robots: { index: false, follow: true } };
  const name = pickL10n(item.name, "en");
  const desc = (pickL10n(item.description, "en") || `Vaishnava bhajans for ${name}.`).replace(/\s+/g, " ").slice(0, 155);
  const path = taxonomyHref(type, slug);
  return {
    title: `${name} Bhajans: Lyrics and Audio`,
    description: desc,
    alternates: { canonical: path },
    openGraph: { title: `${name} Bhajans`, description: desc, url: path, type: "website" as const, ...(item.image ? { images: [item.image] } : {}) },
    robots: { index: true, follow: true },
  };
}

function duration(sec: number): string {
  if (sec >= 3600) return `${Math.floor(sec / 3600)} hr ${Math.round((sec % 3600) / 60)} min`;
  return fmtDuration(sec);
}

/** Spotify PLAYLIST style page for a category, mood or festival. */
export default async function PlaylistPage({ type, slug, lang }: { type: PlaylistType; slug: string; lang: string }) {
  const item = await fetchTaxonomyItem(type, slug);
  if (!item) notFound();
  const m = TAXONOMY_META[type];
  const query: BhajanQuery = { [m.query]: slug, sort: "featured" };
  const [list, audio, meta, siblings] = await Promise.all([
    fetchBhajanList({ ...query, limit: 24 }),
    fetchBhajanList({ [m.query]: slug, hasAudio: true, limit: 60 }),
    fetchBhajanMeta(),
    fetchTaxonomyList(type, { limit: 40 }),
  ]);
  const name = pickL10n(item.name, lang);
  const desc = pickL10n(item.description, lang);
  const total = list.total || item.songCount;
  const audioSec = audio.items.reduce((n, b) => n + (b.duration || 0), 0);
  const covers = list.items.filter((b) => b.coverImage).slice(0, 4);
  const moodLabels = Object.fromEntries(meta.moods.map((x) => [x.slug, x.label]));
  const path = taxonomyHref(type, slug);
  const related = siblings.filter((s) => s.slug !== slug && s.songCount > 0).slice(0, 14);

  return (
    <PageLayout>
      <JsonLd data={breadcrumbJsonLd([{ name: "Vaishnava Bhajans", path: "/bhajans" }, { name: m.plural, path: taxonomyHref(type) }, { name, path }])} />
      <main className="overflow-x-clip bg-white pt-[var(--header-h)] text-ink">
        <header className="bg-[linear-gradient(180deg,#eef3ff_0%,#ffffff_100%)]">
          <div className="vk-container pb-8 pt-6 md:pb-10">
            <Crumbs trail={[{ name: m.plural, href: taxonomyHref(type) }, { name }]} />
            <div className="flex flex-col items-center gap-6 text-center md:flex-row md:items-end md:gap-8 md:text-left">
              <div className="relative aspect-square w-[min(68vw,260px)] shrink-0 overflow-hidden rounded-xl bg-vk-100 shadow-[0_10px_24px_-14px_rgba(15,31,92,.35)] md:w-[232px]">
                {item.image ? (
                  <CoverArt title={name} src={item.image} priority sizes="260px" />
                ) : covers.length >= 4 ? (
                  <div className="grid h-full w-full grid-cols-2 grid-rows-2">
                    {covers.map((c) => (
                      <div key={c.slug} className="relative"><CoverArt title={c.title} src={c.coverImage} sizes="130px" showInitials={false} /></div>
                    ))}
                  </div>
                ) : (
                  <CoverArt title={name} priority sizes="260px" />
                )}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-vk-700">{m.singular}</p>
                <h1 className="mt-2 font-serif-display text-[2rem] font-bold leading-[1.1] tracking-tight sm:text-5xl">{name}</h1>
                {desc && <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-relaxed text-ink/80 line-clamp-4 md:mx-0">{desc}</p>}
                <p className="mt-3 text-sm text-vk-800">
                  {total} {total === 1 ? "bhajan" : "bhajans"}
                  {item.audioCount ? ` · ${item.audioCount} with audio` : ""}
                  {audioSec ? ` · ${duration(audioSec)}` : ""}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  <PlayAllButtons src={{ query }} disabled={!item.audioCount && !audio.total} />
                  <FollowButton mode="save" item={{ type, slug, name, image: item.image }} />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="vk-container space-y-9 pb-14 pt-4 md:space-y-10">
          <BrowseByStrip active={STRIP[type]} />
          <SongRows initial={list.items} total={total} pages={list.pages} query={query} moodLabels={moodLabels} showMoodColumn title="Bhajans" />
          {related.length > 0 && (
            <section aria-label={`More ${m.plural.toLowerCase()}`}>
              <h2 className="mb-3 font-serif-display text-xl font-bold sm:text-2xl">More {m.plural.toLowerCase()}</h2>
              <ul className="flex flex-wrap gap-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={taxonomyHref(type, r.slug)} className={`inline-flex min-h-[44px] items-center rounded-full bg-vk-50 px-4 text-sm font-semibold text-vk-800 ring-1 ring-vk-100 hover:bg-vk-100 ${FOCUS}`}>
                      {pickL10n(r.name, lang)}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
    </PageLayout>
  );
}
