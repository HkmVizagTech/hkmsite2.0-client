import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { BrowseProvider, ShelvesGate } from "@/components/bhajans/browse/BrowseContext";
import HeroSearch from "@/components/bhajans/browse/HeroSearch";
import FilterBar from "@/components/bhajans/browse/FilterBar";
import QuickPicks from "@/components/bhajans/browse/QuickPicks";
import SpotShelf from "@/components/bhajans/browse/Shelf";
import Acharyas from "@/components/bhajans/browse/Acharyas";
import GenreTiles, { type FacetTile } from "@/components/bhajans/browse/GenreTiles";
import ContinueListening from "@/components/bhajans/browse/ContinueListening";
import BhajanOfTheDay from "@/components/bhajans/browse/BhajanOfTheDay";
import BrowseByStrip from "@/components/bhajans/taxonomy/BrowseByStrip";
import Results from "@/components/bhajans/browse/Results";
import type { BhajanSummary, FacetCount } from "@/lib/bhajans";
import { PlayQueueButton } from "@/components/bhajans/PlayButtons";
import Image from "next/image";
import { BHAJANS_HERO_BANNER, BHAJANS_HERO_BANNER_MOBILE, fetchBhajanBySlug, fetchBhajanList, fetchBhajanMeta, tracksToQueue } from "@/lib/bhajans";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { localized } from "@/lib/i18n/seo";
import { ChevronRight, Home } from "lucide-react";

const baseMetadata = {
  title: "Vaishnava Bhajans: Lyrics, Meaning and Audio",
  description:
    "Sing along with Vaishnava bhajans by the Gaudiya acharyas. Read lyrics in English, Telugu and Hindi with translations, word meanings and audio recordings.",
  alternates: { canonical: "/bhajans" },
  openGraph: { url: "/bhajans", type: "website" as const },
};
export const generateMetadata = localized(baseMetadata);

export default async function BhajansPage() {
  const [meta, all, featured, withAudio, popular, audioPool] = await Promise.all([
    fetchBhajanMeta(),
    fetchBhajanList({ sort: "featured", limit: 24 }),
    fetchBhajanList({ featured: true, limit: 12 }),
    fetchBhajanList({ hasAudio: true, sort: "plays", limit: 12 }),
    fetchBhajanList({ sort: "plays", limit: 12 }),
    fetchBhajanList({ hasAudio: true, limit: 60 }),
  ]);

  const topFestivals = [...meta.festivals].filter((f) => f.count > 0).sort((a, b) => b.count - a.count).slice(0, 3);
  const festivalShelves = await Promise.all(topFestivals.map(async (f) => ({ f, list: await fetchBhajanList({ festival: f.slug, limit: 12 }) })));

  // Quick picks: audio first, topped up with featured.
  const picks: BhajanSummary[] = [];
  for (const b of [...withAudio.items, ...featured.items, ...all.items]) {
    if (picks.length < 8 && !picks.some((p) => p.slug === b.slug)) picks.push(b);
  }

  // Distinct picture per Browse-all tile: a few bhajans per facet, then a greedy pick that never repeats an image within a section.
  const live = (arr: FacetCount[]) => arr.filter((x) => x.count > 0);
  const facetKinds = [["category", live(meta.categories)], ["mood", live(meta.moods)], ["festival", live(meta.festivals)]] as const;
  const facetItems = new Map<string, BhajanSummary[]>();
  await Promise.all(
    facetKinds.flatMap(([kind, arr]) =>
      arr.map(async (f) => {
        facetItems.set(`${kind}:${f.slug}`, (await fetchBhajanList({ [kind]: f.slug, limit: 24 })).items);
      }),
    ),
  );
  const buildTiles = (kind: "category" | "mood" | "festival", arr: FacetCount[]): FacetTile[] => {
    const used = new Set<string>();
    const picked = new Map<string, string>();
    const covers = (f: FacetCount) => (facetItems.get(`${kind}:${f.slug}`) || []).map((i) => i.coverImage).filter(Boolean);
    if (kind === "category") {
      for (const f of arr) {
        const own = covers(f).find((c) => c.includes(`/categories/${f.slug}.`));
        if (own && !used.has(own)) {
          used.add(own);
          picked.set(f.slug, own);
        }
      }
    }
    for (const f of arr) {
      if (picked.has(f.slug)) continue;
      const c = covers(f).find((x) => !used.has(x));
      if (c) {
        used.add(c);
        picked.set(f.slug, c);
      }
    }
    return arr.map((f) => ({ slug: f.slug, label: f.label, count: f.count, cover: picked.get(f.slug) }));
  };

  // Composer portraits (by author) for the composer shelf.
  const portraits: Record<string, string> = {};
  for (const b of [...all.items, ...featured.items, ...withAudio.items, ...popular.items, ...[...facetItems.values()].flat()]) {
    if (b.coverImage && b.authorSlug && /\/bhajans\/authors\//.test(b.coverImage) && !portraits[b.authorSlug]) portraits[b.authorSlug] = b.coverImage;
  }

  // Bhajan of the day: deterministic by calendar day (India time) from the with-audio list.
  const ymd = new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(new Date());
  const [yy, mm, dd] = ymd.split("-").map(Number);
  const dayNo = Math.floor(Date.UTC(yy, mm - 1, dd) / 86400000);
  const dayPool = audioPool.items.length ? audioPool.items : withAudio.items;
  const dayPick = dayPool.length ? dayPool[dayNo % dayPool.length] : null;
  const dayDoc = dayPick ? await fetchBhajanBySlug(dayPick.slug) : null;
  const dayLabel = new Date(Date.UTC(yy, mm - 1, dd)).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

  // Hero "Play": first featured (else any) bhajan that has audio.
  const heroPick = withAudio.items.find((b) => b.isFeatured) || withAudio.items[0];
  const heroDoc = heroPick ? await fetchBhajanBySlug(heroPick.slug) : null;
  const heroQueue = heroDoc ? tracksToQueue(heroDoc) : [];

  const listLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Vaishnava Bhajans",
    url: `${SITE_URL}/bhajans`,
    mainEntity: {
      "@type": "ItemList",
      itemListElement: all.items.slice(0, 24).map((b, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE_URL}/bhajans/${b.slug}`, name: b.title })),
    },
  };

  return (
    <PageLayout>
      <JsonLd data={listLd} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Vaishnava Bhajans", path: "/bhajans" }])} />
      <main className="overflow-x-clip bg-white pt-[var(--header-h)] text-ink">
        <BrowseProvider meta={meta} initial={all}>
          <section className="bg-white">
            {/* Banner: shown whole (never cropped) so every face stays clear; the title card only overlaps the empty dark fade (mobile) or the bottom edge (desktop) */}
            <div className="relative aspect-[2080/2048] overflow-hidden bg-[#0b1745] md:aspect-[3840/840]">
              <Image src={BHAJANS_HERO_BANNER_MOBILE} alt="" fill priority unoptimized sizes="100vw" className="object-cover md:hidden" />
              <Image src={BHAJANS_HERO_BANNER} alt="" fill priority unoptimized sizes="100vw" className="hidden object-cover md:block" />
              <div className="vk-container relative z-10 pt-5 md:pt-7">
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-white/85">
                  <Link href="/" className="inline-flex items-center gap-1 hover:text-white"><Home className="h-3.5 w-3.5" aria-hidden /> Home</Link>
                  <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
                  <span aria-current="page" className="text-white">Vaishnava Bhajans</span>
                </nav>
              </div>
            </div>

            {/* Title card: overlaps the banner's lower edge */}
            <div className="vk-container relative z-10 -mt-24 pb-8 md:-mt-9 md:pb-12">
              <div className="mx-auto max-w-3xl rounded-[1.75rem] bg-white px-5 pb-7 pt-8 text-center ring-1 ring-vk-100 shadow-[0_24px_50px_-40px_rgba(15,31,92,.35)] sm:px-10 sm:pb-9 sm:pt-10">
                <p className="mx-auto inline-block rounded-full bg-vk-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-vk-700 ring-1 ring-vk-100">Gaudiya Vaishnava songs</p>
                <h1 className="font-serif-display mt-4 text-[2rem] font-semibold leading-[1.1] text-ink sm:text-5xl">
                  ISKCON Vaishnava <span className="text-vk-700">Bhajans</span>
                </h1>
                <p className="mx-auto mt-3 max-w-xl text-[15px] leading-relaxed text-muted-foreground md:text-lg">
                  A complete collection of ISKCON Vaishnav aartis, bhajans with lyrics, and popular prayers by the Acharyas.
                </p>
                <div className="mx-auto mt-6 max-w-xl text-left [&_input]:ring-1 [&_input]:ring-vk-200"><HeroSearch /></div>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                  {heroQueue.length > 0 && heroPick && (
                    <PlayQueueButton queue={heroQueue} label={`Play ${heroPick.title}`} className="max-w-full [&]:whitespace-normal text-left" />
                  )}
                  {meta.totals.bhajans > 0 && (
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-lg font-semibold text-ink">{meta.totals.bhajans}</strong> bhajans
                      <span className="mx-2 text-vk-200">·</span>
                      <strong className="text-lg font-semibold text-ink">{meta.totals.withAudio}</strong> with audio
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <FilterBar />

          <ShelvesGate>
            <ContinueListening />
            <QuickPicks items={picks} />
            <div className="vk-container pt-6"><BrowseByStrip /></div>
            {dayDoc && <BhajanOfTheDay doc={dayDoc} meta={meta} dateLabel={dayLabel} />}
            <SpotShelf title="Featured" poster items={featured.items} showAll={{ featured: true }} />
            <SpotShelf title="With audio" poster items={withAudio.items} showAll={{ hasAudio: true }} />
            <SpotShelf title="Popular" poster items={popular.items} showAll={{ sort: "plays" }} />
            {festivalShelves.map(({ f, list }) => (
              <SpotShelf key={f.slug} title={f.label} items={list.items} showAll={{ festival: f.slug }} />
            ))}
            <Acharyas portraits={portraits} />
            <GenreTiles categories={buildTiles("category", live(meta.categories))} moods={buildTiles("mood", live(meta.moods))} festivals={buildTiles("festival", live(meta.festivals))} />
          </ShelvesGate>

          <Results />
        </BrowseProvider>
      </main>
    </PageLayout>
  );
}
