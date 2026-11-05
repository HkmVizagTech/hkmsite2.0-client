import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import JsonLd from "@/components/seo/JsonLd";
import CoverArt from "@/components/bhajans/CoverArt";
import Shelf from "@/components/bhajans/Shelf";
import { ActionRow, LyricsPanel, TrackList } from "@/components/bhajans/DetailClient";
import { fetchBhajanBySlug, fetchBhajanList, fetchBhajanMeta, labelOf, lyricsAsText, tracksToQueue, type BhajanSummary } from "@/lib/bhajans";
import { BHAJANS_SONG_BANNER, LANG_LABEL, fmtDuration } from "@/lib/bhajans";
import { breadcrumbJsonLd, clampDescription, SITE_URL, absUrl, DEFAULT_OG_IMAGE, BRAND, withBrand } from "@/lib/seo";
import { localizedFn } from "@/lib/i18n/seo";
import BrowseByStrip from "@/components/bhajans/taxonomy/BrowseByStrip";
import { ChevronRight, Home } from "lucide-react";

type P = { params: Promise<{ slug: string; lang: string }> };

async function baseGenerateMetadata({ params }: P) {
  const { slug } = await params;
  const b = await fetchBhajanBySlug(slug);
  if (!b) return { title: "Bhajan", robots: { index: false, follow: true } };
  const title = `${b.title} Lyrics and Meaning`;
  const description = clampDescription(
    `${b.title} by ${b.artist}: lyrics, translation and word meanings${b.tracks.length ? ", with audio" : ""}. ${lyricsAsText(b, "en").replace(/\s+/g, " ").slice(0, 120)}`,
  );
  const image = b.coverImage || absUrl(DEFAULT_OG_IMAGE);
  return {
    title,
    description,
    alternates: { canonical: `/bhajans/${b.slug}` },
    openGraph: { title: withBrand(title), description, images: [image], type: "article" as const, siteName: BRAND, url: `/bhajans/${b.slug}` },
    twitter: { card: "summary_large_image" as const, title: withBrand(title), description, images: [image] },
    robots: { index: true, follow: true, "max-image-preview": "large" as const },
  };
}
export const generateMetadata = localizedFn(baseGenerateMetadata);

// Built on first visit, then cached and refreshed every 5 minutes.
export async function generateStaticParams() {
  return [];
}

export default async function BhajanPage({ params }: P) {
  const { slug } = await params;
  const b = await fetchBhajanBySlug(slug);
  if (!b) notFound();

  const [meta, byMood, byCat, byArtist] = await Promise.all([
    fetchBhajanMeta(),
    b.moods[0] ? fetchBhajanList({ mood: b.moods[0], limit: 12 }) : null,
    b.categories[0] ? fetchBhajanList({ category: b.categories[0], limit: 12 }) : null,
    b.authorSlug ? fetchBhajanList({ artist: b.authorSlug, limit: 12 }) : null,
  ]);
  const seen = new Set([b.slug]);
  const related: BhajanSummary[] = [];
  for (const l of [byArtist, byMood, byCat]) {
    for (const it of l?.items || []) if (!seen.has(it.slug)) { seen.add(it.slug); related.push(it); }
  }

  const queue = tracksToQueue(b);
  const path = `/bhajans/${b.slug}`;
  const fullUrl = `${SITE_URL}${path}`;
  const text = lyricsAsText(b, b.languages.includes("en") || !b.languages.length ? "en" : b.languages[0]);
  const verseCount = b.verses.filter((v) => Object.values(v.text || {}).some((l) => l?.length)).length;
  const totalSec = queue.reduce((n, t) => n + (t.duration || 0), 0);
  const langNames = b.languages.filter((l) => LANG_LABEL[l]).map((l) => (l === "en" ? "English" : l === "te" ? "Telugu" : "Hindi"));
  const metaLine = [
    verseCount ? `${verseCount} ${verseCount === 1 ? "verse" : "verses"}` : "",
    queue.length ? `${queue.length} ${queue.length === 1 ? "recording" : "recordings"}` : "Lyrics only",
    totalSec ? fmtDuration(totalSec) : "",
    langNames.join(", "),
  ].filter(Boolean).join(" · ");
  const copyText = text ? `${b.title}\n${b.artist}\n\n${text}` : "";
  const tagGroups = [
    { title: "Categories", base: "categories", items: b.categories.map((slug) => ({ slug, label: labelOf(meta.categories, slug) })) },
    { title: "Mood", base: "moods", items: b.moods.map((slug) => ({ slug, label: labelOf(meta.moods, slug) })) },
    { title: "Festivals", base: "festivals", items: b.festivals.map((slug) => ({ slug, label: labelOf(meta.festivals, slug) })) },
  ].filter((g) => g.items.length);
  const heroTags = tagGroups.flatMap((g) => g.items.map((i) => ({ ...i, href: `/bhajans/${g.base}/${i.slug}` }))).slice(0, 6);
  const composerHref = b.authorSlug ? `/bhajans/authors/${b.authorSlug}` : `/bhajans?q=${encodeURIComponent(b.artist)}`;
  const chip = "inline-flex min-h-[36px] items-center rounded-full bg-vk-50 px-3.5 text-[13px] font-semibold text-vk-800 ring-1 ring-vk-200 transition-colors duration-150 hover:bg-vk-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500";

  const ld = {
    "@context": "https://schema.org",
    "@type": "MusicComposition",
    "@id": fullUrl,
    name: b.title,
    url: fullUrl,
    composer: b.artist ? { "@type": "Person", name: b.artist } : undefined,
    lyrics: text ? { "@type": "CreativeWork", text: text.slice(0, 5000) } : undefined,
    inLanguage: b.languages.length ? b.languages : undefined,
    image: b.coverImage || undefined,
    genre: "Devotional",
    recordedAs: queue.length
      ? queue.map((t) => ({
          "@type": "MusicRecording",
          name: b.title,
          byArtist: t.singer ? { "@type": "Person", name: t.singer } : undefined,
          duration: t.duration ? `PT${Math.floor(t.duration / 60)}M${Math.floor(t.duration % 60)}S` : undefined,
          audio: { "@type": "AudioObject", contentUrl: t.url },
        }))
      : undefined,
  };

  return (
    <PageLayout>
      <JsonLd data={ld} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Vaishnava Bhajans", path: "/bhajans" }, { name: b.title, path }])} />
      <main className="overflow-x-clip bg-white pt-[var(--header-h)] text-ink">
        <header className="relative isolate overflow-hidden">
          {/* Light wash with Srila Prabhupada's portrait shown whole (face clear), fading softly towards the text. */}
          <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden bg-[linear-gradient(180deg,#eef3ff_0%,#ffffff_100%)]">
            <div className="absolute inset-x-0 top-0 h-[260px] [-webkit-mask-image:linear-gradient(to_bottom,#000_62%,transparent_100%)] [mask-image:linear-gradient(to_bottom,#000_62%,transparent_100%)] md:inset-y-0 md:left-auto md:right-0 md:h-auto md:w-[54%] md:[-webkit-mask-image:linear-gradient(to_left,#000_58%,transparent_100%)] md:[mask-image:linear-gradient(to_left,#000_58%,transparent_100%)]">
              <Image src={BHAJANS_SONG_BANNER} alt="" fill priority unoptimized sizes="(min-width: 768px) 54vw, 100vw" className="object-cover object-top" />
            </div>
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-white" />
          </div>
          <div className="vk-container pb-10 pt-[200px] md:pb-14 md:pt-8">
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs text-ink/65">
              <Link href="/" className="inline-flex items-center gap-1 hover:text-vk-700"><Home className="h-3.5 w-3.5" aria-hidden /> Home</Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" aria-hidden />
              <Link href="/bhajans" className="hover:text-vk-700">Bhajans</Link>
              <ChevronRight className="hidden h-3.5 w-3.5 opacity-60 sm:block" aria-hidden />
              <span className="hidden max-w-[40ch] truncate text-ink sm:inline" aria-current="page">{b.title}</span>
            </nav>
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-7 text-center md:flex-row md:items-end md:gap-9 md:text-left">
              <div className="relative aspect-square w-[70vw] max-w-[300px] shrink-0 overflow-hidden rounded-xl bg-vk-100 shadow-[0_30px_60px_-20px_rgba(11,23,69,.45)] ring-1 ring-vk-100 md:w-[240px]">
                <CoverArt title={b.title} src={b.coverImage} priority sizes="300px" />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-vk-700">Bhajan</p>
                <h1 className="font-serif-display mt-2 break-words text-[2rem] font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.5rem]">{b.title}</h1>
                {b.artist && (
                  <p className="mt-3 text-lg font-semibold text-ink/90">
                    <Link href={composerHref} className="underline-offset-4 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500">{b.artist}</Link>
                  </p>
                )}
                {b.subtitle && <p className="mt-0.5 text-sm text-ink/60">{b.subtitle}</p>}
                {metaLine && <p className="mt-2 text-sm text-ink/65">{metaLine}</p>}
                {heroTags.length > 0 && (
                  <ul className="mt-4 flex flex-wrap justify-center gap-2 md:justify-start">
                    {heroTags.map((t) => (
                      <li key={t.href}><Link href={t.href} className={chip}>{t.label}</Link></li>
                    ))}
                  </ul>
                )}
                <ActionRow queue={queue} title={b.title} path={path} copyText={copyText} song={{ slug: b.slug, title: b.title, artist: b.artist, coverImage: b.coverImage }} />
              </div>
            </div>
          </div>
        </header>

        <TrackList queue={queue} />
        <LyricsPanel bhajan={b} />

        <section aria-label="About this bhajan" className="vk-container pt-8 md:pt-10">
          <div className="mx-auto max-w-5xl rounded-3xl bg-vk-50 p-5 md:p-7">
            <h2 className="text-xl font-bold text-ink md:text-2xl">About this bhajan</h2>
            <dl className="mt-4 grid gap-x-8 gap-y-5 sm:grid-cols-2">
              {b.artist && (
                <div className="min-w-0">
                  <dt className="text-[13px] font-bold uppercase tracking-[0.14em] text-vk-700">Composer</dt>
                  <dd className="mt-2"><Link href={composerHref} className={chip}>{b.artist}</Link></dd>
                </div>
              )}
              {tagGroups.map((g) => (
                <div key={g.title} className="min-w-0">
                  <dt className="text-[13px] font-bold uppercase tracking-[0.14em] text-vk-700">{g.title}</dt>
                  <dd className="mt-2 flex flex-wrap gap-2">
                    {g.items.map((i) => <Link key={i.slug} href={`/bhajans/${g.base}/${i.slug}`} className={chip}>{i.label}</Link>)}
                  </dd>
                </div>
              ))}
              <div className="min-w-0">
                <dt className="text-[13px] font-bold uppercase tracking-[0.14em] text-vk-700">Details</dt>
                <dd className="mt-2 text-[15px] leading-relaxed text-ink/80">{metaLine}</dd>
              </div>
            </dl>
          </div>
        </section>

        {b.source?.name && (
          <p className="vk-container pt-6 text-center text-[13px] text-ink/70">
            Lyrics source: {b.source.url ? <a href={b.source.url} target="_blank" rel="noopener noreferrer" className="underline">{b.source.name}</a> : b.source.name}
          </p>
        )}

        <div className="vk-container pt-6"><BrowseByStrip /></div>
        <div className="pb-12 pt-4">
          <Shelf title="More like this" subtitle="Same composer, mood or theme" items={related.slice(0, 12)} />
        </div>
      </main>
    </PageLayout>
  );
}
