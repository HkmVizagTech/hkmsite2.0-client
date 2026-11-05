import Image from "next/image";
import { notFound } from "next/navigation";
import PageLayout from "@/components/PageLayout";
import JsonLd from "@/components/seo/JsonLd";
import Avatar from "@/components/bhajans/taxonomy/Avatar";
import AuthorShelf from "@/components/bhajans/taxonomy/AuthorShelf";
import BrowseByStrip from "@/components/bhajans/taxonomy/BrowseByStrip";
import Crumbs from "@/components/bhajans/taxonomy/Crumbs";
import PlayAllButtons from "@/components/bhajans/taxonomy/PlayAllButtons";
import SongRows, { RowList } from "@/components/bhajans/taxonomy/SongRows";
import FollowButton from "@/components/bhajans/library/FollowButton";
import { fetchBhajanList, fetchBhajanMeta } from "@/lib/bhajans";
import { fetchTaxonomyItem, fetchTaxonomyList, pickL10n, strHash } from "@/lib/bhajansTaxonomy";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { localizedFn } from "@/lib/i18n/seo";

type P = { params: Promise<{ slug: string; lang: string }> };

export const generateMetadata = localizedFn(async ({ params }: P) => {
  const { slug } = await params;
  const a = await fetchTaxonomyItem("author", slug);
  if (!a) return { title: "Composer", robots: { index: false, follow: true } };
  const name = pickL10n(a.name, "en");
  const desc = (pickL10n(a.description, "en") || `Bhajans composed by ${name}, with lyrics, translations and audio.`).replace(/\s+/g, " ").slice(0, 155);
  const path = `/bhajans/authors/${slug}`;
  return {
    title: `${name}: Bhajans, Lyrics and Audio`,
    description: desc,
    alternates: { canonical: path },
    openGraph: { title: `${name} Bhajans`, description: desc, url: path, type: "profile" as const, ...(a.image ? { images: [a.image] } : {}) },
    robots: { index: true, follow: true },
  };
});

export async function generateStaticParams() {
  return [];
}

export default async function AuthorPage({ params }: P) {
  const { slug, lang } = await params;
  const a = await fetchTaxonomyItem("author", slug);
  if (!a) notFound();
  const query = { artist: slug };
  const [list, popular, meta, others] = await Promise.all([
    fetchBhajanList({ ...query, sort: "title", limit: 24 }),
    fetchBhajanList({ ...query, sort: "plays", limit: 5 }),
    fetchBhajanMeta(),
    fetchTaxonomyList("author", { limit: 24 }),
  ]);
  const name = pickL10n(a.name, lang);
  const bio = pickL10n(a.description, lang);
  const total = list.total || a.songCount;
  const moodLabels = Object.fromEntries(meta.moods.map((x) => [x.slug, x.label]));
  const path = `/bhajans/authors/${slug}`;
  const hue = 210 + (strHash(name) % 30);
  const fans = others.filter((o) => o.slug !== slug && o.songCount > 0).slice(0, 14);

  return (
    <PageLayout>
      <JsonLd data={breadcrumbJsonLd([{ name: "Vaishnava Bhajans", path: "/bhajans" }, { name: "Composers", path: "/bhajans/authors" }, { name, path }])} />
      <JsonLd data={{ "@context": "https://schema.org", "@type": "Person", name, url: `${SITE_URL}${path}`, image: a.image || undefined, description: bio || undefined }} />
      <main className="overflow-x-clip bg-white pt-[var(--header-h)] text-ink">
        <header className="relative isolate overflow-hidden">
          <div aria-hidden className="absolute inset-0 -z-10" style={{ background: `linear-gradient(180deg, hsl(${hue} 80% 94%) 0%, #ffffff 100%)` }}>
            {a.image && (
              <div className="absolute inset-0 scale-125 opacity-30 blur-[60px]">
                <Image src={a.image} alt="" fill unoptimized sizes="100vw" className="object-cover" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-b from-transparent to-white" />
          </div>
          <div className="vk-container pb-8 pt-6 md:pb-12">
            <Crumbs trail={[{ name: "Composers", href: "/bhajans/authors" }, { name }]} />
            <div className="flex flex-col items-center gap-6 text-center md:min-h-[280px] md:flex-row md:items-end md:gap-9 md:text-left">
              <Avatar name={a.name.en || name} src={a.image} className="h-44 w-44 md:h-56 md:w-56" sizes="240px" textClass="text-6xl" />
              <div className="min-w-0">
                <p className="text-[13px] font-bold uppercase tracking-[0.2em] text-vk-700">Composer</p>
                <h1 className="mt-2 font-serif-display text-[2rem] font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">{name}</h1>
                <p className="mt-3 text-sm text-vk-800">
                  {total} {total === 1 ? "bhajan" : "bhajans"}
                  {a.audioCount ? ` · ${a.audioCount} with audio` : ""}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                  <PlayAllButtons src={{ query }} shuffle={false} disabled={!a.audioCount} />
                  <FollowButton item={{ type: "author", slug, name, image: a.image }} className="min-h-[52px]" />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="vk-container space-y-9 pb-14 md:space-y-12">
          <BrowseByStrip active="authors" />
          {bio && (
            <section aria-label="About">
              <h2 className="mb-3 font-serif-display text-xl font-bold sm:text-2xl">About</h2>
              <p className="rounded-2xl bg-vk-50 p-5 text-[15px] leading-relaxed text-ink/85 ring-1 ring-vk-100 md:p-6 md:text-base">{bio}</p>
            </section>
          )}
          {popular.items.length > 0 && (
            <section aria-label="Popular">
              <h2 className="mb-3 font-serif-display text-xl font-bold sm:text-2xl">Popular</h2>
              <RowList items={popular.items} />
            </section>
          )}
          <SongRows initial={list.items} total={total} pages={list.pages} query={{ ...query, sort: "title" }} moodLabels={moodLabels} showMoodColumn title="All bhajans" />
          <AuthorShelf title="Fans also like" items={fans} lang={lang} />
        </div>
      </main>
    </PageLayout>
  );
}
