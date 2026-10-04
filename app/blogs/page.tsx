"use client";

/* eslint-disable @next/next/no-img-element -- blog covers come from admin-supplied
   hosts that may not be in next.config remotePatterns, so plain <img> is safer. */

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { ArrowRight, ChevronLeft, ChevronRight, Clock, Home, Mail } from "lucide-react";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: { name: string; avatar?: string; slug?: string };
  publishedAt?: string;
  createdAt: string;
  readTime: number;
  views: number;
}

interface Category {
  name: string;
  slug: string;
  count: number;
}

interface LandingData {
  recents: Blog[];
  devotional: Blog[];
  categories: Category[];
  byCategory: (Category & { items: Blog[] })[];
  popular: Blog[];
  recent: Blog[];
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:3000";

// Vaikuntham Blue gradients for the category tiles (no uploaded images),
// rotated by position so neighbouring tiles always differ.
const TILE_GRADIENTS = [
  "from-vk-700 via-vk-600 to-vk-500",
  "from-vk-900 via-vk-800 to-vk-700",
  "from-vk-600 via-vk-500 to-vk-400",
  "from-vk-800 via-vk-700 to-vk-600",
  "from-vk-900 via-vk-700 to-vk-500",
];

// Date formatter — short form
const fmtDate = (s?: string) => {
  if (!s) return "";
  const d = new Date(s);
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" });
};
const fmtDay = (s?: string) => (s ? new Date(s).getDate() : "");
const fmtMonth = (s?: string) =>
  s ? new Date(s).toLocaleDateString("en-IN", { month: "short" }) : "";

/* ─────────────────────────── shared bits ─────────────────────────── */

/** Cover image, or a soft navy gradient when the post has none. */
function Cover({ blog, className = "" }: { blog: Blog; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-vk-100 ${className}`}>
      {blog.coverImage ? (
        <img
          src={blog.coverImage}
          alt={blog.title}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-400" />
      )}
    </div>
  );
}

function CategoryPill({ name }: { name?: string }) {
  if (!name) return null;
  return (
    <span className="absolute left-3 top-3 z-[2] max-w-[85%] truncate rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-vk-800 shadow">
      {name}
    </span>
  );
}

function Avatar({ blog, size = "h-7 w-7" }: { blog: Blog; size?: string }) {
  return blog.author?.avatar ? (
    <img src={blog.author.avatar} alt="" className={`${size} shrink-0 rounded-full object-cover`} />
  ) : (
    <div className={`${size} grid shrink-0 place-items-center rounded-full bg-vk-100 text-[10px] font-bold text-vk-700`}>
      {(blog.author?.name || "A").charAt(0)}
    </div>
  );
}

function ScrollButtons({ onPrev, onNext }: { onPrev: () => void; onNext: () => void }) {
  return (
    <div className="hidden gap-2 md:flex">
      <button
        type="button"
        onClick={onPrev}
        aria-label="Scroll left"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 shadow-sm transition-colors hover:border-vk-700 hover:bg-vk-50"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        onClick={onNext}
        aria-label="Scroll right"
        className="flex h-10 w-10 items-center justify-center rounded-full border border-vk-200 bg-white text-vk-700 shadow-sm transition-colors hover:border-vk-700 hover:bg-vk-50"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

/* ─────────────────────────── page ─────────────────────────── */

export default function BlogsListPage() {
  const [data, setData] = useState<LandingData | null>(null);
  const [tab, setTab] = useState<"recents" | "stories">("recents");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${API_URL}/blogs/landing`, { cache: "no-store" });
        if (res.ok) setData(await res.json());
      } catch (_) {}
      setLoading(false);
    })();
  }, []);

  if (loading) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center bg-white pt-[var(--header-h)] text-muted-foreground">
          <span className="vk-pill-soft">Loading blogs…</span>
        </div>
      </PageLayout>
    );
  }

  if (!data) {
    return (
      <PageLayout>
        <div className="flex min-h-[60vh] items-center justify-center bg-white px-4 pt-[var(--header-h)]">
          <div className="vk-card max-w-md p-8 text-center text-muted-foreground">
            Failed to load blogs. Please try again later.
          </div>
        </div>
      </PageLayout>
    );
  }

  const chips = data.categories.filter((c) => c.count > 0);

  return (
    <PageLayout>
      <main className="overflow-x-hidden bg-white pt-[var(--header-h)]">
        {/* ─── HERO — tinted band, title, category chips ─── */}
        <section className="relative overflow-hidden bg-gradient-to-b from-vk-100 via-vk-50 to-white">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-vk-300/30 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -left-20 bottom-0 h-56 w-56 rounded-full bg-vk-200/50 blur-3xl"
          />
          <div className="vk-container relative pb-6 pt-8 md:pb-10 md:pt-14">
            <nav
              aria-label="Breadcrumb"
              className="mb-5 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/70 shadow-sm md:text-[13px]"
            >
              <Link href="/" className="inline-flex items-center gap-1 transition-colors hover:text-vk-700">
                <Home className="h-3.5 w-3.5" />
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5 opacity-60" />
              <span className="font-semibold text-vk-700" aria-current="page">
                Blogs
              </span>
            </nav>
            <h1 className="vk-h1 max-w-3xl">Nourish Your Soul Daily — with Spiritual Teachings</h1>

            {chips.length > 0 && (
              <div className="-mx-4 mt-6 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide md:mx-0 md:flex-wrap md:px-0">
                {chips.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/blogs/categories/${cat.slug}`}
                    className="inline-flex min-h-[40px] shrink-0 items-center gap-2 rounded-full border border-vk-200 bg-white px-4 text-sm font-medium text-ink/80 shadow-sm transition-colors hover:border-vk-700 hover:bg-vk-50 hover:text-vk-700"
                  >
                    {cat.name}
                    <span className="rounded-full bg-vk-100 px-1.5 py-0.5 text-[11px] font-bold text-vk-700">
                      {cat.count}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ─── RECENTS STRIP ─── */}
        <section className="pb-10 pt-4 md:pb-14">
          <div className="vk-container">
            <div className="mb-6 inline-flex rounded-full border border-vk-200 bg-vk-50 p-1">
              <button
                type="button"
                onClick={() => setTab("recents")}
                className={`min-h-[40px] rounded-full px-5 text-sm font-semibold transition-colors ${
                  tab === "recents" ? "bg-vk-700 text-white shadow" : "text-ink/70 hover:text-vk-700"
                }`}
              >
                Recents
              </button>
              <Link
                href="/web-stories"
                className="inline-flex min-h-[40px] items-center rounded-full px-5 text-sm font-semibold text-ink/70 transition-colors hover:text-vk-700"
              >
                Web Stories
              </Link>
            </div>

            {/* Horizontal scroll of recent posts */}
            <RecentStrip blogs={data.recents} />
          </div>
        </section>

        {/* ─── DEVOTIONAL WISDOM — featured carousel ─── */}
        {data.devotional.length > 0 && (
          <section className="vk-section vk-band">
            <div className="vk-container">
              <DevotionalCarousel blogs={data.devotional} />
            </div>
          </section>
        )}

        {/* ─── CATEGORY TILES ─── */}
        {data.categories.length > 0 && (
          <section className="vk-section">
            <div className="vk-container">
              <SectionHeading eyebrow="Categories" title="Get Started Here" />
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 md:gap-4 lg:grid-cols-5">
                {data.categories.map((cat, i) => (
                  <Link
                    key={cat.slug}
                    href={`/blogs/categories/${cat.slug}`}
                    className="vk-tile group aspect-[4/5] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${TILE_GRADIENTS[i % TILE_GRADIENTS.length]}`} />
                    <div aria-hidden className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />
                    <div aria-hidden className="absolute -left-6 top-1/3 h-16 w-16 rounded-full bg-white/5" />
                    <div className="vk-tile-caption">
                      <span className="mb-2 inline-block rounded-full bg-white/95 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-vk-800">
                        {cat.count} {cat.count === 1 ? "blog" : "blogs"}
                      </span>
                      <h3 className="line-clamp-3 text-base font-bold leading-tight text-white md:text-lg">
                        {cat.name}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── PER-CATEGORY SECTIONS (each has 6 posts + View All) ─── */}
        {data.byCategory.map((cat, idx) => (
          <section key={cat.slug} className={`vk-section ${idx % 2 === 0 ? "vk-band" : ""}`}>
            <div className="vk-container">
              <SectionHeading
                title={cat.name}
                action={{ href: `/blogs/categories/${cat.slug}`, label: "View All" }}
              />
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {cat.items.slice(0, 6).map((blog, i) => (
                  <Reveal key={blog._id} delay={Math.min(i, 5) * 0.05} className="h-full">
                    <BlogCardWithAuthor blog={blog} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* ─── POPULAR BLOGS — featured large + date list ─── */}
        {data.popular.length > 0 && (
          <section className="vk-section">
            <div className="vk-container">
              <SectionHeading eyebrow="Most Read" title="Popular blogs" />
              <div className="grid gap-6 lg:grid-cols-5">
                {/* Featured large card */}
                <Link
                  href={`/blogs/${data.popular[0].slug}`}
                  className="vk-card vk-card-hover group block overflow-hidden lg:col-span-2"
                >
                  <div className="relative">
                    <Cover blog={data.popular[0]} className="aspect-[4/3]" />
                    <CategoryPill name={data.popular[0].category} />
                  </div>
                  <div className="p-5 md:p-6">
                    <h3 className="mb-2 text-xl font-bold leading-tight text-ink transition-colors group-hover:text-vk-700 md:text-2xl">
                      {data.popular[0].title}
                    </h3>
                    {data.popular[0].excerpt && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">{data.popular[0].excerpt}</p>
                    )}
                  </div>
                </Link>

                {/* Date-strip list */}
                <div className="vk-card divide-y divide-vk-100 px-4 md:px-6 lg:col-span-3">
                  {data.popular.slice(1, 6).map((b) => (
                    <Link key={b._id} href={`/blogs/${b.slug}`} className="group flex items-center gap-4 py-4 md:gap-5">
                      <div className="w-14 shrink-0 rounded-2xl bg-vk-50 py-2 text-center leading-none">
                        <div className="text-xl font-extrabold text-vk-700">{fmtDay(b.publishedAt)}</div>
                        <div className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          {fmtMonth(b.publishedAt)}
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="mb-1 line-clamp-2 text-[15px] font-semibold text-ink transition-colors group-hover:text-vk-700 md:text-base">
                          {b.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">By {b.author?.name || "Admin"}</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-vk-500 transition-transform group-hover:translate-x-0.5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ─── RECENT BLOGS — detailed cards ─── */}
        {data.recent.length > 0 && (
          <section className="vk-section vk-band">
            <div className="vk-container">
              <SectionHeading eyebrow="Fresh Reads" title="Recent Blogs" />
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
                {data.recent.map((blog, i) => (
                  <Reveal key={blog._id} delay={Math.min(i, 5) * 0.05} className="h-full">
                    <Link
                      href={`/blogs/${blog.slug}`}
                      className="vk-card vk-card-hover group flex h-full flex-col overflow-hidden"
                    >
                      <div className="relative">
                        <Cover blog={blog} className="aspect-[16/10]" />
                        <CategoryPill name={blog.category} />
                      </div>
                      <div className="flex flex-1 flex-col p-5">
                        <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <Avatar blog={blog} size="h-6 w-6" />
                          <span className="truncate">By {blog.author?.name || "Admin"}</span>
                        </div>
                        <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-snug text-ink transition-colors group-hover:text-vk-700">
                          {blog.title}
                        </h3>
                        {blog.excerpt && (
                          <p className="mb-3 line-clamp-3 flex-1 text-sm text-muted-foreground">{blog.excerpt}</p>
                        )}
                        <div className="mt-auto inline-flex items-center gap-1.5 pt-1 text-sm font-semibold text-vk-700">
                          Read more
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      </div>
                    </Link>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ─── NEWSLETTER ─── */}
        <section className="py-10 md:py-16">
          <div className="vk-container">
            <div className="relative isolate grid items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-br from-vk-600 via-vk-700 to-vk-900 p-6 text-white md:grid-cols-2 md:gap-8 md:p-12">
              <div aria-hidden className="absolute -bottom-20 -right-16 -z-10 h-56 w-56 rounded-full bg-white/10" />
              <div aria-hidden className="absolute -left-10 -top-12 -z-10 h-32 w-32 rounded-full bg-white/5" />
              <div>
                <span className="vk-pill-light mb-3">
                  <Mail className="h-3.5 w-3.5" /> Newsletter
                </span>
                <h2 className="mb-3 text-[1.75rem] font-bold leading-tight text-white md:text-4xl">
                  Join Our Newsletter 🎉
                </h2>
                <p className="text-white/80">
                  Read and share new perspectives on just about any topic. Everyone&apos;s welcome.
                </p>
              </div>
              <form
                onSubmit={(e) => e.preventDefault()}
                className="flex w-full max-w-md flex-col gap-2 sm:flex-row md:ml-auto"
              >
                <input type="email" required placeholder="you@example.com" className="vk-input flex-1" />
                <button
                  type="submit"
                  className="vk-btn min-h-[44px] bg-white text-vk-800 shadow hover:bg-vk-50"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>
    </PageLayout>
  );
}

// ─── RECENT POSTS STRIP — horizontal scrollable cards ──────────────────
function RecentStrip({ blogs }: { blogs: Blog[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: "l" | "r") => {
    if (!ref.current) return;
    const w = ref.current.clientWidth * 0.8;
    ref.current.scrollBy({ left: dir === "l" ? -w : w, behavior: "smooth" });
  };

  if (!blogs.length) {
    return (
      <p className="rounded-2xl border border-dashed border-vk-200 bg-vk-50 py-8 text-center text-sm text-muted-foreground">
        No recent posts yet — be the first to publish.
      </p>
    );
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="vk-bar-title text-lg text-ink md:text-xl">Latest posts</h2>
        <ScrollButtons onPrev={() => scroll("l")} onNext={() => scroll("r")} />
      </div>
      <div ref={ref} className="vk-scroller -mx-4 px-4 md:mx-0 md:px-0">
        {blogs.map((b) => (
          <Link
            key={b._id}
            href={`/blogs/${b.slug}`}
            className="vk-card group block w-[78%] max-w-[300px] shrink-0 overflow-hidden sm:w-[300px]"
          >
            <div className="relative">
              <Cover blog={b} className="aspect-[16/10]" />
              <CategoryPill name={b.category} />
            </div>
            <div className="p-4">
              <div className="mb-1.5 text-[11px] text-muted-foreground">{fmtDate(b.publishedAt)}</div>
              <h3 className="line-clamp-2 text-[15px] font-semibold leading-snug text-ink transition-colors group-hover:text-vk-700">
                {b.title}
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── DEVOTIONAL WISDOM CAROUSEL ────────────────────────────────────────
function DevotionalCarousel({ blogs }: { blogs: Blog[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scroll = (dir: "l" | "r") => {
    if (!ref.current) return;
    const w = ref.current.clientWidth * 0.85;
    ref.current.scrollBy({ left: dir === "l" ? -w : w, behavior: "smooth" });
    setIndex((i) => Math.max(0, Math.min(blogs.length - 1, i + (dir === "l" ? -1 : 1))));
  };

  if (!blogs.length) return null;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <SectionHeading
          eyebrow="Devotional Wisdom"
          title="Discover the Spiritual Essence of Our Vedic Literature"
          subtitle="A collection of inspiring reads from the pens of the Hare Krishna Vaikuntham Team."
          className="!mb-0"
        />
        <div className="mb-1 flex shrink-0 items-center gap-3">
          <span className="hidden text-xs font-semibold text-muted-foreground md:inline">
            {index + 1} / {blogs.length}
          </span>
          <ScrollButtons onPrev={() => scroll("l")} onNext={() => scroll("r")} />
        </div>
      </div>

      <div ref={ref} className="vk-scroller -mx-4 mt-8 px-4 md:mx-0 md:px-0">
        {blogs.map((b) => (
          <Link
            key={b._id}
            href={`/blogs/${b.slug}`}
            className="vk-tile group block h-[340px] w-[85%] max-w-[420px] shrink-0 sm:w-[380px] md:h-[400px] md:w-[420px]"
          >
            {b.coverImage ? (
              <img
                src={b.coverImage}
                alt={b.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-400" />
            )}
            <div className="absolute inset-0 z-[1] bg-gradient-to-t from-vk-900/90 via-vk-900/30 to-transparent" />
            <div className="vk-tile-caption">
              {b.category && <span className="vk-pill-light mb-3 max-w-full truncate">{b.category}</span>}
              <h3 className="mb-3 line-clamp-3 text-lg font-bold leading-snug text-white md:text-xl">{b.title}</h3>
              <div className="flex items-center gap-2 text-xs text-white/80">
                <Avatar blog={b} />
                <span className="truncate">By {b.author?.name || "Admin"}</span>
                <span aria-hidden className="text-white/50">·</span>
                <span className="whitespace-nowrap">{fmtDate(b.publishedAt)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-3 text-center text-xs text-muted-foreground md:hidden">
        {index + 1} / {blogs.length}
      </div>
    </div>
  );
}

// ─── CARD WITH AUTHOR (used by per-category sections) ──────────────────
function BlogCardWithAuthor({ blog }: { blog: Blog }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="vk-card vk-card-hover group flex h-full flex-col overflow-hidden">
      <div className="relative">
        <Cover blog={blog} className="aspect-[16/10]" />
        <CategoryPill name={blog.category} />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="mb-3 line-clamp-2 text-base font-bold leading-snug text-ink transition-colors group-hover:text-vk-700 md:text-lg">
          {blog.title}
        </h3>
        <div className="mt-auto flex items-center gap-2 text-xs text-muted-foreground">
          <Avatar blog={blog} />
          <span className="truncate">By {blog.author?.name || "Admin"}</span>
          <span aria-hidden className="text-muted-foreground/60">·</span>
          <span className="whitespace-nowrap">{fmtDate(blog.publishedAt)}</span>
          {blog.readTime ? (
            <span className="ml-auto hidden items-center gap-1 whitespace-nowrap sm:inline-flex">
              <Clock className="h-3 w-3" /> {blog.readTime} min
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  );
}
