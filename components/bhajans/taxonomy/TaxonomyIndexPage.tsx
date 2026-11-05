import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import JsonLd from "@/components/seo/JsonLd";
import CoverArt from "../CoverArt";
import BrowseByStrip from "./BrowseByStrip";
import Crumbs from "./Crumbs";
import { TAXONOMY_META, fetchTaxonomyList, pickL10n, taxonomyHref } from "@/lib/bhajansTaxonomy";
import { breadcrumbJsonLd } from "@/lib/seo";
import { FOCUS } from "./ui";

const BLURB = {
  category: "Browse bhajans by theme: the Lord, the holy name, prayers, the spiritual master and more.",
  mood: "Find a bhajan to match how you feel: longing, humility, surrender, praise.",
  festival: "Songs for the festivals and observances of the Vaishnava calendar.",
} as const;
const STRIP = { category: "categories", mood: "moods", festival: "festivals" } as const;

export function indexMetadata(type: "category" | "mood" | "festival") {
  const m = TAXONOMY_META[type];
  const path = `/bhajans/${m.segment}`;
  return { title: `Vaishnava Bhajans by ${m.singular}`, description: BLURB[type], alternates: { canonical: path }, openGraph: { url: path, type: "website" as const } };
}

/** Grid of cover tiles for /bhajans/categories, /moods and /festivals. */
export default async function TaxonomyIndexPage({ type, lang }: { type: "category" | "mood" | "festival"; lang: string }) {
  const m = TAXONOMY_META[type];
  const items = (await fetchTaxonomyList(type, { limit: 100 })).filter((i) => i.songCount > 0);
  return (
    <PageLayout>
      <JsonLd data={breadcrumbJsonLd([{ name: "Vaishnava Bhajans", path: "/bhajans" }, { name: m.plural, path: taxonomyHref(type) }])} />
      <main className="overflow-x-clip bg-white pt-[var(--header-h)] text-ink">
        <header className="bg-[linear-gradient(180deg,#eef3ff_0%,#ffffff_100%)]">
          <div className="vk-container pb-6 pt-6 md:pb-8">
            <Crumbs trail={[{ name: m.plural }]} />
            <h1 className="font-serif-display text-[2rem] font-bold leading-tight tracking-tight sm:text-5xl">{m.plural}</h1>
            <p className="mt-2 max-w-2xl text-[15px] leading-relaxed text-ink/80">{BLURB[type]}</p>
          </div>
        </header>
        <div className="vk-container space-y-8 pb-14 pt-4">
          <BrowseByStrip active={STRIP[type]} />
          {items.length === 0 ? (
            <p className="rounded-xl bg-vk-50 px-4 py-10 text-center text-[15px] text-vk-800">Nothing to show yet.</p>
          ) : (
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4 xl:grid-cols-5">
              {items.map((i) => {
                const name = pickL10n(i.name, lang);
                return (
                  <li key={i.slug} className="min-w-0">
                    <Link href={taxonomyHref(type, i.slug)} className={`group block rounded-xl p-2 transition-colors motion-reduce:transition-none hover:bg-vk-50 ${FOCUS}`}>
                      <div className="relative aspect-square overflow-hidden rounded-xl bg-vk-100 shadow-[0_6px_16px_-8px_rgba(15,31,92,.3)]">
                        <CoverArt title={name} src={i.image} sizes="200px" showInitials={false} />
                      </div>
                      <h2 className="mt-3 line-clamp-2 text-[15px] font-bold leading-snug text-ink">{name}</h2>
                      <p className="text-[13px] text-vk-700">{i.songCount} bhajans</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
    </PageLayout>
  );
}
