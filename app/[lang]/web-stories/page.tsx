import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight, Home, Layers } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { pageSeo, siteKeywords, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { WEB_STORIES } from "@/lib/webStories";
import { CREAM, Eyebrow, LINE, SERIF } from "@/components/blogs/parts";

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
      <main className={`overflow-x-hidden ${CREAM} pt-[var(--header-h)]`}>
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(60%_80%_at_50%_0%,rgba(47,91,211,0.07),transparent_70%)]"
          />
          <div className="vk-container relative pb-8 pt-10 text-center md:pb-12 md:pt-16">
            <nav aria-label="Breadcrumb" className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-ink/55 md:text-[13px]">
              <Link href="/" className="inline-flex items-center gap-1 hover:text-vk-700">
                <Home className="h-3.5 w-3.5" /> Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              <Link href="/blogs" className="hover:text-vk-700">
                Blog
              </Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              <span className="font-semibold text-vk-700" aria-current="page">
                Web Stories
              </span>
            </nav>
            <div className="flex justify-center">
              <Eyebrow>Tap through · One minute each</Eyebrow>
            </div>
            <h1 className={`${SERIF} mx-auto mt-4 max-w-3xl text-[2.1rem] font-semibold leading-[1.15] text-ink sm:text-5xl lg:text-[3.2rem]`}>
              Web Stories
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65 md:text-base">
              Short, full-screen stories you can tap through in a minute: Krishna&apos;s pastimes, Ekadashi guidance, prayers, recipes and festival ideas.
            </p>
            <div className="mt-6 flex justify-center">
              <Link
                href="/blogs"
                className={`inline-flex min-h-[40px] items-center gap-2 rounded-full border ${LINE} bg-white/80 px-4 text-sm font-medium text-ink/80 transition-colors hover:border-vk-600 hover:text-vk-700`}
              >
                Prefer reading? Browse the blog <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="pb-14 pt-2 md:pb-24">
          <div className="vk-container">
            <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-4 xl:grid-cols-5">
              {WEB_STORIES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`${PATH}/${s.slug}`}
                    className="group relative block aspect-[9/16] overflow-hidden rounded-[1.4rem] bg-vk-900 shadow-[0_22px_40px_-26px_rgba(20,30,80,0.65)] ring-1 ring-vk-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_30px_50px_-26px_rgba(20,30,80,0.75)]"
                  >
                    <Image
                      src={s.poster}
                      alt={s.title}
                      fill
                      sizes="(min-width: 1280px) 220px, (min-width: 1024px) 24vw, (min-width: 640px) 30vw, 46vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                    />
                    <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-black/45 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">
                      <Layers className="h-3 w-3" /> {s.pages.length}
                    </span>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#0b1230]/90 via-[#0b1230]/50 to-transparent p-4 pt-16">
                      <h2 className={`${SERIF} line-clamp-3 text-[0.98rem] font-semibold leading-snug text-white`}>{s.title}</h2>
                      <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold text-[#BFD0FF]">
                        Watch story <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
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
