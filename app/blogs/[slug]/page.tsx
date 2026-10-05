import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";
import { Calendar, Clock, ArrowRight, Tag, ChevronRight, Home } from "lucide-react";
import { stripBrand, clampDescription, htmlToText, withBrand, absUrl, BRAND, DEFAULT_OG_IMAGE, SITE_URL, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: { name: string; avatar?: string; bio?: string; slug?: string };
  publishedAt?: string;
  createdAt: string;
  readTime: number;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
  updatedAt?: string;
}

interface Category {
  name: string;
  slug: string;
  count: number;
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:3000";

async function getBlog(slug: string): Promise<Blog | null> {
  try {
    const res = await fetch(`${API_URL}/blogs/${slug}`, { cache: "no-store" });
    if (!res.ok) return null;
    const json = await res.json();
    return json.blog as Blog;
  } catch (_) {
    return null;
  }
}
async function getRelated(id: string): Promise<Blog[]> {
  try {
    const res = await fetch(`${API_URL}/blogs/${id}/related`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()).items || [];
  } catch (_) {
    return [];
  }
}
async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/blogs/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()).categories || [];
  } catch (_) {
    return [];
  }
}

// Slugify mirror for category links
const catSlug = (name: string) =>
  name
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

// The post title is the page's only <h1>; headings typed as H1 inside the
// article body are shown as <h2> (same look via .blog-content h2).
const demoteH1 = (html: string) => (html || "").replace(/<(\/?)h1(\b[^>]*)>/gi, "<$1h2$2>");

const fmtDate = (s?: string) => {
  if (!s) return "";
  return new Date(s).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" });
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Blog", robots: { index: false, follow: true } };
  const title = stripBrand(blog.metaTitle || blog.title);
  // Older posts have no excerpt or meta description; fall back to the opening
  // of the article so every post still has a real snippet.
  const description = clampDescription(blog.metaDescription || blog.excerpt || htmlToText(blog.content));
  const image = blog.coverImage || absUrl(DEFAULT_OG_IMAGE);
  return {
    title,
    description,
    alternates: { canonical: `/blogs/${blog.slug}` },
    openGraph: {
      title: withBrand(title),
      description,
      images: [image],
      type: "article",
      siteName: BRAND,
      locale: "en_IN",
      url: `/blogs/${blog.slug}`,
      publishedTime: blog.publishedAt,
      authors: [blog.author?.name || BRAND],
    },
    twitter: { card: "summary_large_image", title: withBrand(title), description, images: [image] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [blog, categories] = await Promise.all([getBlog(slug), getCategories()]);
  if (!blog) notFound();

  const related = await getRelated(blog._id);
  const populatedCats = categories.filter((c) => c.count > 0).slice(0, 6);

  // Build share URLs
  const fullUrl = `${SITE_URL}/blogs/${blog.slug}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    `Click here & start reading now! ${fullUrl}`
  )}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(
    "Click here & start reading now!"
  )}`;

  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: clampDescription(blog.metaDescription || blog.excerpt || htmlToText(blog.content)),
    image: blog.coverImage ? [blog.coverImage] : undefined,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    author: {
      "@type": blog.author?.name && blog.author.name !== "Admin" ? "Person" : "Organization",
      name: blog.author?.name && blog.author.name !== "Admin" ? blog.author.name : BRAND,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/iskcon-gambheeram-logo.jpeg` },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${process.env.NEXT_PUBLIC_SITE_URL || "https://www.harekrishnavizag.org"}/blogs/${blog.slug}`,
    },
  };

  const shareBtn =
    "inline-flex min-h-[40px] items-center gap-2 rounded-xl px-4 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95";

  return (
    <PageLayout>
    <JsonLd data={blogPostingJsonLd} />
    <JsonLd
      data={breadcrumbJsonLd([
        { name: "Blog", path: "/blogs" },
        { name: blog.title, path: `/blogs/${blog.slug}` },
      ])}
    />
    <main className="overflow-x-hidden bg-white pt-[var(--header-h)]">
      {/* ─── Tinted header band ─── */}
      <div className="bg-gradient-to-b from-vk-100 via-vk-50 to-white">
        <div className="vk-container pb-2 pt-6 md:pt-10">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/70 shadow-sm md:text-[13px]"
          >
            <Link href="/" className="inline-flex shrink-0 items-center gap-1 transition-colors hover:text-vk-700">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <Link href="/blogs" className="shrink-0 transition-colors hover:text-vk-700">Blogs</Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <span className="truncate font-semibold text-vk-700" aria-current="page">{blog.title}</span>
          </nav>
        </div>
      </div>

      <article className="vk-container pb-12 pt-6 md:pb-16 md:pt-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-14">
          {/* ─── MAIN CONTENT — comfortable reading column ─── */}
          <div className="mx-auto w-full min-w-0 max-w-[720px]">
            {/* Category pill */}
            <Link
              href={`/blogs/categories/${catSlug(blog.category)}`}
              className="vk-pill-soft mb-4 transition-colors hover:bg-vk-200"
            >
              {blog.category}
            </Link>

            <h1 className="vk-h1 !text-[1.9rem] sm:!text-[2.6rem] lg:!text-[2.9rem]">
              {blog.title}
            </h1>

            {blog.excerpt && (
              <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground md:text-lg">
                {blog.excerpt}
              </p>
            )}

            {/* Meta row — author · date · read time */}
            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2 font-semibold text-ink">
                {blog.author?.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={blog.author.avatar}
                    alt=""
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-vk-100"
                  />
                ) : (
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-vk-100 text-sm font-bold text-vk-700">
                    {(blog.author?.name || "A").charAt(0)}
                  </span>
                )}
                {blog.author?.name || "Admin"}
              </span>
              <span aria-hidden className="text-vk-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-vk-500" />
                {fmtDate(blog.publishedAt || blog.createdAt)}
              </span>
              <span aria-hidden className="text-vk-300">•</span>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-vk-500" />
                {blog.readTime} min read
              </span>
            </div>

            {/* Hero image */}
            {blog.coverImage && (
              <div className="mt-7 overflow-hidden rounded-3xl bg-vk-100 shadow-card">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={blog.coverImage}
                  alt={blog.title}
                  className="h-auto w-full object-cover"
                />
              </div>
            )}

            <p className="mb-8 mt-4 border-b border-vk-100 pb-6 text-xs text-muted-foreground">
              Updated {fmtDate(blog.updatedAt || blog.publishedAt || blog.createdAt)}
            </p>

            {/* HTML content from CKEditor */}
            <div
              className="blog-content vk-prose"
              dangerouslySetInnerHTML={{ __html: demoteH1(blog.content) }}
            />

            {/* Share */}
            <div className="mt-10 rounded-2xl border border-vk-100 bg-vk-50 p-5">
              <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-vk-800">
                Share:
              </h4>
              <div className="flex flex-wrap gap-2">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${shareBtn} bg-[#25D366]`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <a
                  href={facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${shareBtn} bg-[#1877F2]`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
                <a
                  href={twitterUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`${shareBtn} bg-ink`}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  Twitter
                </a>
              </div>
            </div>

            {/* Popular Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8">
                <h4 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
                  Popular Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  <Link
                    href={`/blogs/categories/${catSlug(blog.category)}`}
                    className="inline-flex min-h-[36px] items-center gap-1.5 rounded-full bg-vk-700 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-vk-600"
                  >
                    {blog.category}
                  </Link>
                  {blog.tags.map((t) => (
                    <Link
                      key={t}
                      href={`/blogs?tag=${encodeURIComponent(t)}`}
                      className="inline-flex min-h-[36px] items-center gap-1 rounded-full border border-vk-200 bg-white px-3.5 text-xs font-medium text-ink/80 transition-colors hover:border-vk-700 hover:text-vk-700"
                    >
                      <Tag className="h-3 w-3" /> {t}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Author block */}
            <div className="vk-card mt-10 flex items-start gap-4 p-5 md:p-6">
              {blog.author?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={blog.author.avatar}
                  alt={blog.author.name}
                  className="h-16 w-16 shrink-0 rounded-full object-cover ring-4 ring-vk-100"
                />
              ) : (
                <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-vk-100 text-xl font-bold text-vk-700">
                  {(blog.author?.name || "A").charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-lg font-bold leading-tight text-ink">
                  {blog.author?.name || "Admin"}
                </div>
                <div className="mt-0.5 text-sm text-muted-foreground">
                  {fmtDate(blog.publishedAt || blog.createdAt)} · {blog.readTime} min read
                </div>
                {blog.author?.bio && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{blog.author.bio}</p>
                )}
              </div>
            </div>
          </div>

          {/* ─── SIDEBAR ─── */}
          <aside className="space-y-6 lg:sticky lg:top-[calc(var(--header-h)+1.25rem)] lg:self-start">
            {/* Explore Categories */}
            {populatedCats.length > 0 && (
              <div className="vk-card p-5">
                <h4 className="vk-bar-title mb-1 text-base text-ink">Explore</h4>
                <div className="mb-3 pl-3.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Categories
                </div>
                <div className="space-y-1">
                  {populatedCats.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/blogs/categories/${cat.slug}`}
                      className="group flex min-h-[40px] items-center justify-between gap-3 rounded-xl px-3 transition-colors hover:bg-vk-50"
                    >
                      <span className="text-sm font-medium text-ink/85 transition-colors group-hover:text-vk-700">
                        {cat.name}
                      </span>
                      <span className="rounded-full bg-vk-100 px-2 py-0.5 text-[11px] font-bold text-vk-700">
                        {cat.count}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Seva promotions — real pages on this site, with each seva's actual image */}
            <div>
              <h4 className="vk-bar-title mb-4 text-base text-ink">Support Our Sevas</h4>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                {[
                  {
                    href: `/anna-daan-seva?utm_source=blog&utm_medium=sidebar&utm_campaign=${blog.slug}`,
                    title: "Anna Daan Seva",
                    sub: "Feed thousands of devotees",
                    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677363792-1783677363601-462395264797134589073566144398536696847591n.jpg",
                  },
                  {
                    href: `/gau-seva?utm_source=blog&utm_medium=sidebar&utm_campaign=${blog.slug}`,
                    title: "Gau Seva",
                    sub: "Protect indigenous cows",
                    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783676646237-1783676645536-ChatGPTImageJul102026031357PM.png",
                  },
                  {
                    href: `/sqft-seva-campaign?utm_source=blog&utm_medium=sidebar&utm_campaign=${blog.slug}`,
                    title: "Square Foot Seva",
                    sub: "Build Vizag's biggest temple",
                    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783677157979-1783677157883-Screenshot2026-07-10152227.png",
                  },
                  {
                    href: `/gita-daan-seva?utm_source=blog&utm_medium=sidebar&utm_campaign=${blog.slug}`,
                    title: "Gita Daan Seva",
                    sub: "Spread the wisdom of Krishna",
                    image: "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1783672760162-1783672758959-ChatGPTImageJul92026043444PM.png",
                  },
                ].map((ad) => (
                  <Link
                    key={ad.href}
                    href={ad.href}
                    className="vk-tile group block aspect-[16/9]"
                  >
                    <Image
                      src={ad.image}
                      alt={ad.title}
                      fill
                      sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="vk-tile-caption flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-base font-bold leading-tight text-white">
                          {ad.title}
                        </div>
                        <div className="mt-1 text-xs text-white/90">{ad.sub}</div>
                      </div>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors group-hover:bg-white group-hover:text-vk-700">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </article>

      {/* ─── RELATED ─── */}
      {related.length > 0 && (
        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading
              eyebrow="Related"
              title="Blogs"
              action={{ href: "/blogs", label: "View All" }}
            />
            <div className="vk-scroller -mx-4 px-4 md:mx-0 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible md:px-0 lg:grid-cols-5">
              {related.slice(0, 5).map((r) => (
                <Link
                  key={r._id}
                  href={`/blogs/${r.slug}`}
                  className="vk-card vk-card-hover group flex w-[72%] max-w-[280px] shrink-0 flex-col overflow-hidden md:w-auto md:max-w-none"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-vk-100">
                    {r.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={r.coverImage}
                        alt={r.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-400" />
                    )}
                    {r.category && (
                      <span className="absolute left-2.5 top-2.5 max-w-[85%] truncate rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-vk-800 shadow">
                        {r.category}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h4 className="mb-3 line-clamp-2 text-sm font-bold leading-snug text-ink transition-colors group-hover:text-vk-700">
                      {r.title}
                    </h4>
                    <div className="mt-auto flex items-center gap-2 text-[11px] text-muted-foreground">
                      {r.author?.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={r.author.avatar}
                          alt=""
                          className="h-5 w-5 rounded-full object-cover"
                        />
                      ) : (
                        <div className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-vk-100 text-[8px] font-bold text-vk-700">
                          {(r.author?.name || "A").charAt(0)}
                        </div>
                      )}
                      <span className="truncate">{r.author?.name || "Admin"}</span>
                      <span>·</span>
                      <span className="whitespace-nowrap">{fmtDate(r.publishedAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CKEditor content — fills the gaps vk-prose doesn't cover (h1/h4,
          inline code, embeds) without overriding its typography. */}
      <style>{`
        .blog-content h1 { font-size: 1.9rem; font-weight: 800; margin: 2.25rem 0 1rem; line-height: 1.2; color: hsl(var(--foreground)); }
        .blog-content h4 { font-size: 1.1rem; font-weight: 700; margin: 1.5rem 0 0.5rem; color: hsl(var(--foreground)); }
        .blog-content strong { font-weight: 700; color: hsl(var(--foreground)); }
        .blog-content img { max-width: 100%; height: auto; margin-left: auto; margin-right: auto; }
        .blog-content iframe, .blog-content video { max-width: 100%; border-radius: 1rem; }
        .blog-content blockquote p:last-child { margin-bottom: 0; }
        .blog-content table { display: block; overflow-x: auto; }
        .blog-content code {
          background: #EEF2FF;
          color: #1E3A8A;
          padding: 0.15rem 0.4rem;
          border-radius: 6px;
          font-size: 0.9em;
          font-family: ui-monospace, SFMono-Regular, monospace;
        }
      `}</style>
    </main>
    </PageLayout>
  );
}
