import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronLeft, ChevronRight, Home } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { pageSeo, clampDescription, breadcrumbJsonLd, SITE_URL } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import { CREAM, Eyebrow, LINE, PostCard, SERIF, ShelfHeading, type Blog } from "@/components/blogs/parts";

import { localizedFn } from "@/lib/i18n/seo";

interface Category {
  name: string;
  slug: string;
  count: number;
}

const PER_PAGE = 12;

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:3000";

// A few lines of real copy for each topic, so a category page is more than a list of links.
const BLURBS: Record<string, string> = {
  "Krishna Katha":
    "The pastimes of Lord Krishna, from His childhood in Vrindavan to the Bhagavad Gita, told simply and with devotion.",
  "Vaishnava Songs and Prayers":
    "Prayers, stotras and kirtans that Vaishnavas sing every day, with their meaning and the mood behind them.",
  "Our Acharyas":
    "The lives and teachings of Srila Prabhupada and the acharyas who carried the message of Krishna consciousness to the world.",
  "Spiritual Knowledge":
    "Clear answers on bhakti, the Bhagavad Gita, fasting rules, offerings and the practices of Vaishnava life.",
  "Sacred Festivals & Occasions":
    "The meaning, dates and observances of Janmashtami, Ekadashi, Rath Yatra, Diwali and every major festival of the Vaishnava calendar.",
  "Spiritual News & Events": "Happenings from the temple and the wider Hare Krishna Movement.",
  "Spiritual Charity":
    "Why feeding the hungry, protecting cows and sharing the Gita are acts of devotion, and how you can take part.",
  "Timeless Wisdom": "Short reflections from the scriptures that stay true in every age.",
  "Divine Poetics": "Verses and poetry in praise of Krishna and His devotees.",
  "Krishna Consciousness": "What it means to live a Krishna conscious life, step by step.",
  Recipes: "Simple, offering-ready prasadam recipes made the temple way.",
  Pilgrimage: "Guides to holy places, temples and how to make a pilgrimage meaningful.",
};

async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/blogs/categories`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return (await res.json()).categories || [];
  } catch {
    return [];
  }
}

async function getBlogsForCategory(name: string, page: number): Promise<{ blogs: Blog[]; totalPages: number }> {
  try {
    const res = await fetch(`${API_URL}/blogs?category=${encodeURIComponent(name)}&limit=${PER_PAGE}&page=${page}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { blogs: [], totalPages: 1 };
    const j = await res.json();
    return { blogs: j.blogs || [], totalPages: j.totalPages || 1 };
  } catch {
    return { blogs: [], totalPages: 1 };
  }
}

const pageNum = (v: string | string[] | undefined) => Math.max(1, parseInt(Array.isArray(v) ? v[0] : v || "1", 10) || 1);

async function baseGenerateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; lang: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const page = pageNum((await searchParams).page);
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) return { title: "Blog Category", robots: { index: false, follow: true } };
  const blurb = BLURBS[cat.name] || `Read ${cat.name} articles from ISKCON Gambheeram, Visakhapatnam.`;
  return pageSeo({
    title: page > 1 ? `${cat.name}: Blog (Page ${page})` : `${cat.name}: Blog`,
    description: clampDescription(`${blurb} ${cat.count} articles from ISKCON Gambheeram, Visakhapatnam.`),
    path: `/blogs/categories/${cat.slug}${page > 1 ? `?page=${page}` : ""}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const page = pageNum((await searchParams).page);
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const { blogs, totalPages } = await getBlogsForCategory(cat.name, page);
  if (page > 1 && blogs.length === 0) notFound();
  const otherCats = categories.filter((c) => c.slug !== slug && c.count > 0).slice(0, 10);
  const base = `/blogs/categories/${cat.slug}`;
  const hrefFor = (p: number) => (p <= 1 ? base : `${base}?page=${p}`);
  const blurb = BLURBS[cat.name];

  const listJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${cat.name}: Blog`,
    url: `${SITE_URL}${hrefFor(page)}`,
    description: blurb,
    isPartOf: { "@type": "Blog", "@id": `${SITE_URL}/blogs` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: blogs.map((b, i) => ({
        "@type": "ListItem",
        position: (page - 1) * PER_PAGE + i + 1,
        name: b.title,
        url: `${SITE_URL}/blogs/${b.slug}`,
      })),
    },
  };

  return (
    <PageLayout>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Blog", path: "/blogs" },
          { name: cat.name, path: base },
        ])}
      />
      <JsonLd data={listJsonLd} />
      <main className={`overflow-x-hidden ${CREAM} pt-[var(--header-h)]`}>
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(60%_80%_at_50%_0%,rgba(212,175,55,0.16),transparent_70%)]"
          />
          <div className="vk-container relative pb-8 pt-10 text-center md:pb-12 md:pt-16">
            <nav aria-label="Breadcrumb" className="mb-6 inline-flex max-w-full items-center gap-1.5 text-xs font-medium text-ink/55 md:text-[13px]">
              <Link href="/" className="inline-flex shrink-0 items-center gap-1 transition-colors hover:text-vk-700">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
              <Link href="/blogs" className="shrink-0 transition-colors hover:text-vk-700">
                Blogs
              </Link>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
              <span className="truncate font-semibold text-vk-700" aria-current="page">
                {cat.name}
              </span>
            </nav>
            <div className="flex justify-center">
              <Eyebrow>{cat.count} {cat.count === 1 ? "article" : "articles"}</Eyebrow>
            </div>
            <h1 className={`${SERIF} mx-auto mt-4 max-w-3xl text-[2.1rem] font-semibold leading-[1.15] text-ink sm:text-5xl lg:text-[3.2rem]`}>
              {cat.name}
            </h1>
            {blurb && <p className="mx-auto mt-4 max-w-2xl text-[15px] leading-relaxed text-ink/65 md:text-base">{blurb}</p>}
          </div>
        </section>

        <section className="pb-14 pt-4 md:pb-20">
          <div className="vk-container">
            {blogs.length === 0 ? (
              <div className="vk-card mx-auto max-w-md p-10 text-center">
                <p className="text-muted-foreground">No posts in this category yet.</p>
                <Link href="/blogs" className="vk-btn-outline mt-5">
                  <ArrowLeft className="h-4 w-4" /> Back to all blogs
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                  {blogs.map((b) => (
                    <PostCard key={b._id} blog={b} showCategory={false} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav aria-label="Pagination" className="mt-14 flex items-center justify-center gap-2">
                    {page > 1 && (
                      <Link
                        href={hrefFor(page - 1)}
                        rel="prev"
                        className={`inline-flex min-h-[42px] items-center gap-1.5 rounded-full border ${LINE} bg-white/80 px-4 text-sm font-medium text-ink/80 hover:border-vk-600 hover:text-vk-700`}
                      >
                        <ChevronLeft className="h-4 w-4" /> Newer
                      </Link>
                    )}
                    <span className="px-3 text-sm text-ink/60">
                      Page {page} of {totalPages}
                    </span>
                    {page < totalPages && (
                      <Link
                        href={hrefFor(page + 1)}
                        rel="next"
                        className="inline-flex min-h-[42px] items-center gap-1.5 rounded-full bg-vk-700 px-5 text-sm font-semibold text-white hover:bg-vk-800"
                      >
                        Older <ChevronRight className="h-4 w-4" />
                      </Link>
                    )}
                  </nav>
                )}
              </>
            )}
          </div>
        </section>

        {otherCats.length > 0 && (
          <section className="border-t border-[#EFE5CE] bg-white/60 py-12 md:py-16">
            <div className="vk-container">
              <ShelfHeading eyebrow="Keep exploring" title="Other topics" href="/blogs" hrefLabel="All blogs" />
              <div className="flex flex-wrap gap-2">
                {otherCats.map((c) => (
                  <Link
                    key={c.slug}
                    href={`/blogs/categories/${c.slug}`}
                    className={`group inline-flex min-h-[44px] items-center gap-2 rounded-full border ${LINE} bg-white/80 px-4 text-sm font-medium text-ink/80 transition-colors hover:border-vk-600 hover:text-vk-700`}
                  >
                    {c.name}
                    <span className="text-[11px] font-semibold text-gold-deep">{c.count}</span>
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </PageLayout>
  );
}

export const generateMetadata = localizedFn(baseGenerateMetadata);
