import PageLayout from "@/components/PageLayout";
import JsonLd from "@/components/seo/JsonLd";
import AuthorsIndex from "@/components/bhajans/taxonomy/AuthorsIndex";
import BrowseByStrip from "@/components/bhajans/taxonomy/BrowseByStrip";
import Crumbs from "@/components/bhajans/taxonomy/Crumbs";
import { fetchTaxonomyList } from "@/lib/bhajansTaxonomy";
import { breadcrumbJsonLd } from "@/lib/seo";
import { localized } from "@/lib/i18n/seo";

export const generateMetadata = localized({
  title: "Vaishnava Bhajan Composers and Acharyas",
  description: "Browse the Gaudiya Vaishnava acharyas and composers behind our bhajans, with their songs, lyrics, translations and audio.",
  alternates: { canonical: "/bhajans/authors" },
  openGraph: { url: "/bhajans/authors", type: "website" as const },
});

export default async function AuthorsPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const items = (await fetchTaxonomyList("author", { limit: 300 })).filter((a) => a.songCount > 0);
  return (
    <PageLayout>
      <JsonLd data={breadcrumbJsonLd([{ name: "Vaishnava Bhajans", path: "/bhajans" }, { name: "Composers", path: "/bhajans/authors" }])} />
      <main className="overflow-x-clip bg-white pt-[var(--header-h)] text-ink">
        <header className="bg-[linear-gradient(180deg,#eef3ff_0%,#ffffff_100%)]">
          <div className="vk-container pb-6 pt-6 md:pb-8">
            <Crumbs trail={[{ name: "Composers" }]} />
            <h1 className="font-serif-display text-[2rem] font-bold leading-tight tracking-tight sm:text-5xl">Composers</h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/80">The acharyas and devotees whose songs we sing. Choose a composer to see their bhajans.</p>
          </div>
        </header>
        <div className="vk-container space-y-8 pb-14 pt-4">
          <BrowseByStrip active="authors" />
          <AuthorsIndex items={items} lang={lang} />
        </div>
      </main>
    </PageLayout>
  );
}
