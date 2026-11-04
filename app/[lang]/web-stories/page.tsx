import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Home, Layers } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { pageSeo, siteKeywords, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { WEB_STORIES } from "@/lib/webStories";

import { localized } from "@/lib/i18n/seo";

const PATH = "/web-stories";

const baseMetadata: Metadata = pageSeo({
  title: "Web Stories: Krishna, Festivals, Ekadashi and Prayers",
  description:
    "Quick, tap-through visual stories on Lord Krishna, Ekadashi, Gita, festivals, prayers and prasadam recipes from ISKCON Gambheeram Visakhapatnam.",
  path: PATH,
  keywords: ["Hare Krishna web stories", "Krishna stories", "Ekadashi guide", "ISKCON stories", ...siteKeywords],
});

export const generateMetadata = localized(baseMetadata);

export default function WebStoriesPage() {
  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Web stories",
    itemListElement: WEB_STORIES.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.title,
      url: `${SITE_URL}${PATH}/${s.slug}`,
    })),
  };

  return (
    <PageLayout>
      <JsonLd data={breadcrumbJsonLd([{ name: "Blog", path: "/blogs" }, { name: "Web Stories", path: PATH }])} />
      <JsonLd data={listJsonLd} />
      <main className="bg-white pt-[var(--header-h)]">
        <section className="bg-gradient-to-b from-vk-50 to-white pb-6 pt-6">
          <div className="vk-container">
            <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1.5 text-xs font-medium text-ink/55">
              <Link href="/" className="inline-flex items-center gap-1 hover:text-vk-700">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              <Link href="/blogs" className="hover:text-vk-700">
                Blog
              </Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              <span className="text-ink" aria-current="page">
                Web Stories
              </span>
            </nav>
            <h1 className="text-3xl font-bold tracking-tight text-ink md:text-4xl">Web Stories</h1>
            <p className="mt-2 max-w-2xl text-ink/65">
              Short, full-screen stories you can tap through in a minute: Krishna&apos;s pastimes, Ekadashi guidance, prayers, recipes and festival ideas.
            </p>
          </div>
        </section>

        <section className="vk-section">
          <div className="vk-container">
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
              {WEB_STORIES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`${PATH}/${s.slug}`}
                    className="group relative block aspect-[9/16] overflow-hidden rounded-2xl bg-vk-900 shadow-sm ring-1 ring-vk-100 transition-shadow hover:shadow-lg"
                  >
                    <Image
                      src={s.poster}
                      alt={s.title}
                      fill
                      sizes="(min-width: 1280px) 220px, (min-width: 1024px) 24vw, (min-width: 640px) 30vw, 46vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/45 to-transparent p-3 pt-12">
                      <h2 className="text-sm font-semibold leading-snug text-white">{s.title}</h2>
                      <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-white/75">
                        <Layers className="h-3 w-3" /> {s.pages.length} {s.pages.length === 1 ? "slide" : "slides"}
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
