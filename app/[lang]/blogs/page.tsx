/* eslint-disable @next/next/no-img-element -- blog covers come from admin-supplied
   hosts that may not be in next.config remotePatterns, so plain <img> is safer. */

import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import Reveal from "@/components/site/Reveal";
import JsonLd from "@/components/seo/JsonLd";
import DevotionalCarousel from "@/components/blogs/DevotionalCarousel";
import { ArrowRight, ChevronRight, Home, Layers } from "lucide-react";
import { WEB_STORIES } from "@/lib/webStories";
import { breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import { CREAM, Cover, Eyebrow, LINE, Meta, PostCard, SERIF, ShelfHeading, type Blog } from "@/components/blogs/parts";

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface LandingData {
  recents: Blog[];
  devotional: Blog[];
  categories: Category[];
  popular: Blog[];
  recent: Blog[];
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:3000";

async function getLanding(): Promise<LandingData | null> {
  try {
    const res = await fetch(`${API_URL}/blogs/landing`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    return (await res.json()) as LandingData;
  } catch {
    return null;
  }
}

async function getShelf(name: string): Promise<Blog[]> {
  try {
    const res = await fetch(`${API_URL}/blogs?category=${encodeURIComponent(name)}&limit=3`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return (await res.json()).blogs || [];
  } catch {
    return [];
  }
}

// Built on first visit, then refreshed every 5 minutes (ISR), so the posts are in the
// HTML that search engines read instead of being fetched in the browser.
export default async function BlogsListPage() {
  const data = await getLanding();

  if (!data) {
    return (
      <PageLayout>
        <div className={`flex min-h-[60vh] items-center justify-center ${CREAM} px-4 pt-[var(--header-h)]`}>
          <div className="vk-card max-w-md p-8 text-center text-muted-foreground">Failed to load blogs. Please try again later.</div>
        </div>
      </PageLayout>
    );
  }

  const chips = data.categories.filter((c) => c.count > 0);
  const shelves = (await Promise.all(chips.map(async (c) => ({ ...c, items: await getShelf(c.name) })))).filter((c) => c.items.length > 0);
  const imageOf = (slug: string) => shelves.find((x) => x.slug === slug)?.items.find((b) => b.coverImage)?.coverImage;

  const latest = data.recents.length ? data.recents : data.recent;
  const featured = latest[0];
  const alsoNew = latest.slice(1, 5);
  const stories = WEB_STORIES.slice(0, 12);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Blog: Krishna Katha, Festivals and Vaishnava Wisdom",
    url: `${SITE_URL}/blogs`,
    description:
      "Articles on Krishna Katha, festivals, Ekadashi and the teachings of Srila Prabhupada from ISKCON Gambheeram, Visakhapatnam.",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [...latest, ...data.popular].slice(0, 12).map((b, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: b.title,
        url: `${SITE_URL}/blogs/${b.slug}`,
      })),
    },
  };

  return (
    <PageLayout>
      <JsonLd data={breadcrumbJsonLd([{ name: "Blog", path: "/blogs" }])} />
      <JsonLd data={collectionJsonLd} />
      <main className={`overflow-x-hidden ${CREAM} pt-[var(--header-h)]`}>
        {/* ─── HERO: quiet, warm, centred ─── */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(60%_70%_at_50%_0%,rgba(212,175,55,0.16),transparent_70%)]"
          />
          <div className="vk-container relative pb-8 pt-10 text-center md:pb-12 md:pt-16">
            <nav aria-label="Breadcrumb" className="mb-6 inline-flex items-center gap-1.5 text-xs font-medium text-ink/55 md:text-[13px]">
              <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-vk-700">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              <span className="font-semibold text-vk-700" aria-current="page">
                Blogs
              </span>
            </nav>
            <div className="flex justify-center">
              <Eyebrow>Krishna Katha · Festivals · Wisdom</Eyebrow>
            </div>
            <h1 className={`${SERIF} mx-auto mt-4 max-w-3xl text-[2.1rem] font-semibold leading-[1.15] text-ink sm:text-5xl lg:text-[3.3rem]`}>
              Nourish Your Soul Daily — with Spiritual Teachings
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65 md:text-base">
              Take a quiet moment. Stories of Krishna, the meaning behind our festivals and the teachings of Srila Prabhupada, written to be read slowly.
            </p>

            {chips.length > 0 && (
              <div className="-mx-4 mt-8 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide md:mx-0 md:flex-wrap md:justify-center md:px-0">
                {chips.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/blogs/categories/${cat.slug}`}
                    className={`inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full border ${LINE} bg-white/80 px-4 text-sm font-medium text-ink/80 transition-colors hover:border-vk-600 hover:bg-white hover:text-vk-700`}
                  >
                    {cat.name}
                    <span className="text-[11px] font-semibold text-gold-deep">{cat.count}</span>
                  </Link>
                ))}
                <Link
                  href="/web-stories"
                  className="inline-flex min-h-[40px] shrink-0 items-center gap-1.5 rounded-full border border-gold/50 bg-gold/15 px-4 text-sm font-semibold text-gold-deep transition-colors hover:bg-gold/25"
                >
                  <Layers className="h-4 w-4" /> Web Stories
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ─── FEATURED + ALSO NEW ─── */}
        {featured && (
          <section className="pb-10 pt-2 md:pb-16">
            <div className="vk-container">
              <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr] lg:gap-12">
                <Reveal>
                  <Link href={`/blogs/${featured.slug}`} className="group block">
                    <Cover blog={featured} priority className="aspect-[16/10] rounded-[1.75rem] shadow-[0_30px_60px_-34px_rgba(60,40,10,0.6)]" />
                    <div className="pt-6">
                      <Eyebrow>{featured.category || "Latest"}</Eyebrow>
                      <h2 className={`${SERIF} mt-3 text-[1.9rem] font-semibold leading-tight text-ink transition-colors group-hover:text-vk-700 md:text-[2.5rem]`}>
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="mt-3 line-clamp-3 max-w-2xl text-base leading-relaxed text-ink/65">{featured.excerpt}</p>
                      )}
                      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                        <Meta blog={featured} />
                        <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-vk-700">
                          Continue reading
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </Reveal>

                {alsoNew.length > 0 && (
                  <aside className={`rounded-[1.75rem] border ${LINE} bg-white/70 p-5 md:p-7`}>
                    <Eyebrow>Fresh from the journal</Eyebrow>
                    <ul className="mt-3 divide-y divide-[#EFE5CE]">
                      {alsoNew.map((b) => (
                        <li key={b._id}>
                          <Link href={`/blogs/${b.slug}`} className="group flex items-center gap-4 py-4">
                            <Cover blog={b} className="h-20 w-20 shrink-0 rounded-xl" />
                            <div className="min-w-0">
                              <h3 className={`${SERIF} line-clamp-2 text-[1.05rem] font-semibold leading-snug text-ink transition-colors group-hover:text-vk-700`}>
                                {b.title}
                              </h3>
                              <div className="mt-1.5">
                                <Meta blog={b} />
                              </div>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </aside>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ─── EXPLORE BY TOPIC ─── */}
        {chips.length > 0 && (
          <section className="border-y border-[#EFE5CE] bg-white/60 py-12 md:py-16">
            <div className="vk-container">
              <ShelfHeading eyebrow="Explore" title="Find what your heart is looking for" subtitle="Choose a topic and read at your own pace." />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
                {chips.map((cat) => {
                  const img = imageOf(cat.slug);
                  return (
                    <Link
                      key={cat.slug}
                      href={`/blogs/categories/${cat.slug}`}
                      className="group relative block aspect-[5/4] overflow-hidden rounded-2xl bg-vk-900 shadow-[0_14px_30px_-24px_rgba(30,20,5,0.7)]"
                    >
                      {img && (
                        <img
                          src={img}
                          alt=""
                          loading="lazy"
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1b1408]/90 via-[#1b1408]/40 to-[#1b1408]/10" />
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className={`${SERIF} line-clamp-2 text-[1.05rem] font-semibold leading-snug text-white md:text-lg`}>{cat.name}</h3>
                        <span className="mt-1 block text-xs font-medium text-[#F3DFA6]">
                          {cat.count} {cat.count === 1 ? "article" : "articles"}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ─── DEVOTIONAL WISDOM ─── */}
        {data.devotional.length > 0 && (
          <section className="py-12 md:py-20">
            <div className="vk-container">
              <DevotionalCarousel blogs={data.devotional} />
            </div>
          </section>
        )}

        {/* ─── WEB STORIES ─── */}
        {stories.length > 0 && (
          <section className="relative overflow-hidden bg-gradient-to-b from-[#1F2A5C] to-[#141B3F] py-12 text-white md:py-16">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_60%_at_80%_0%,rgba(212,175,55,0.18),transparent_70%)]"
            />
            <div className="vk-container relative">
              <div className="mb-7 flex flex-col gap-3 md:mb-9 md:flex-row md:items-end md:justify-between">
                <div className="max-w-2xl">
                  <Eyebrow light>Web Stories</Eyebrow>
                  <h2 className={`${SERIF} mt-2 text-[1.7rem] font-semibold leading-tight text-white md:text-[2.2rem]`}>
                    A minute of Krishna, one tap at a time
                  </h2>
                </div>
                <Link href="/web-stories" className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[#F3DFA6] hover:text-white">
                  See all stories
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
              <div className="vk-scroller -mx-4 px-4 md:mx-0 md:px-0">
                {stories.map((s) => (
                  <Link
                    key={s.slug}
                    href={`/web-stories/${s.slug}`}
                    className="group relative block aspect-[9/16] w-[150px] shrink-0 overflow-hidden rounded-2xl ring-1 ring-white/15 sm:w-[170px]"
                  >
                    <img
                      src={s.poster}
                      alt={s.title}
                      loading="lazy"
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-3 pt-10">
                      <p className="line-clamp-3 text-[13px] font-semibold leading-snug text-white">{s.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── CATEGORY SHELVES: three calm picks each ─── */}
        {shelves.map((cat, idx) => (
          <section key={cat.slug} className={`py-12 md:py-16 ${idx % 2 === 1 ? "bg-white/60" : ""}`}>
            <div className="vk-container">
              <ShelfHeading
                eyebrow={`${cat.count} ${cat.count === 1 ? "article" : "articles"}`}
                title={cat.name}
                href={`/blogs/categories/${cat.slug}`}
                hrefLabel="View all"
              />
              <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.slice(0, 3).map((blog, i) => (
                  <Reveal key={blog._id} delay={i * 0.06} className="h-full">
                    <PostCard blog={blog} showCategory={false} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ─── MOST READ ─── */}
        {data.popular.length > 0 && (
          <section className="border-t border-[#EFE5CE] py-12 md:py-16">
            <div className="vk-container">
              <ShelfHeading eyebrow="Most read" title="What devotees are reading" />
              <div className="grid gap-8 lg:grid-cols-5 lg:gap-12">
                <Link href={`/blogs/${data.popular[0].slug}`} className="group block lg:col-span-2">
                  <Cover blog={data.popular[0]} className="aspect-[4/3] rounded-[1.5rem] shadow-[0_26px_50px_-32px_rgba(60,40,10,0.6)]" />
                  <h3 className={`${SERIF} mt-5 text-[1.5rem] font-semibold leading-snug text-ink transition-colors group-hover:text-vk-700`}>
                    {data.popular[0].title}
                  </h3>
                  {data.popular[0].excerpt && (
                    <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink/65">{data.popular[0].excerpt}</p>
                  )}
                </Link>
                <ol className="lg:col-span-3">
                  {data.popular.slice(0, 6).map((b, i) => (
                    <li key={b._id} className={`border-b border-[#EFE5CE] ${i === 0 ? "border-t" : ""}`}>
                      <Link href={`/blogs/${b.slug}`} className="group flex items-center gap-5 py-5">
                        <span className={`${SERIF} w-10 shrink-0 text-4xl font-semibold leading-none text-gold/70`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className={`${SERIF} line-clamp-2 text-[1.1rem] font-semibold leading-snug text-ink transition-colors group-hover:text-vk-700`}>
                            {b.title}
                          </h4>
                          <div className="mt-1.5">
                            <Meta blog={b} />
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 shrink-0 text-vk-500 transition-transform group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        )}

        {/* ─── MORE TO READ ─── */}
        {data.recent.length > 0 && (
          <section className="bg-white/60 py-12 md:py-16">
            <div className="vk-container">
              <ShelfHeading eyebrow="Fresh reads" title="More to read" />
              <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                {data.recent.map((blog, i) => (
                  <Reveal key={blog._id} delay={Math.min(i, 5) * 0.05} className="h-full">
                    <PostCard blog={blog} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── CLOSING INVITATION ─── */}
        <section className="py-12 md:py-20">
          <div className="vk-container">
            <div className="relative isolate overflow-hidden rounded-[1.75rem] border border-gold/40 bg-gradient-to-br from-[#FFF7E0] via-[#FBF1D4] to-[#F6E7BD] p-7 text-center md:p-14">
              <div aria-hidden className="absolute -bottom-20 -right-16 -z-10 h-56 w-56 rounded-full bg-gold/20 blur-2xl" />
              <div className="flex justify-center">
                <Eyebrow>Be part of it</Eyebrow>
              </div>
              <h2 className={`${SERIF} mx-auto mt-3 max-w-2xl text-[1.75rem] font-semibold leading-tight text-ink md:text-4xl`}>
                Be part of the temple for as long as it stands
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-ink/70">
                Every brick you sponsor becomes a permanent part of the Lord&apos;s abode in Visakhapatnam, and stays there for as long as the temple stands.
              </p>
              <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/brick-seva-campaign?utm_source=blog&utm_medium=cta&utm_campaign=blogs-index" className="vk-btn min-h-[46px] bg-vk-700 px-6 text-white shadow hover:bg-vk-800">
                  Offer Brick Seva
                </Link>
                <Link
                  href="/iskcon-vizag-temple"
                  className="vk-btn min-h-[46px] border border-vk-700/30 bg-white/80 px-6 text-vk-800 hover:bg-white"
                >
                  Plan your visit
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}
