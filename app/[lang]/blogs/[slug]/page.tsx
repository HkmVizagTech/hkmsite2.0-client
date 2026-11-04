import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import PageLayout from "@/components/PageLayout";
import { CREAM, Eyebrow, LINE, PostCard, SERIF, ShelfHeading } from "@/components/blogs/parts";
import { Calendar, Clock, ArrowRight, Tag, ChevronRight, Home, ListTree } from "lucide-react";
import { stripBrand, clampDescription, htmlToText, withBrand, absUrl, BRAND, DEFAULT_OG_IMAGE, SITE_URL, breadcrumbJsonLd } from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";

import { localizedFn } from "@/lib/i18n/seo";
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
    const res = await fetch(`${API_URL}/blogs/${slug}`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const json = await res.json();
    return json.blog as Blog;
  } catch (_) {
    return null;
  }
}
async function getRelated(id: string): Promise<Blog[]> {
  try {
    const res = await fetch(`${API_URL}/blogs/${id}/related`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    return (await res.json()).items || [];
  } catch (_) {
    return [];
  }
}
async function getCategories(): Promise<Category[]> {
  try {
    const res = await fetch(`${API_URL}/blogs/categories`, { next: { revalidate: 300 } });
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

const slugifyHeading = (t: string) =>
  t
    .toLowerCase()
    .replace(/&[a-z#0-9]+;/g, " ")
    .replace(/[^\p{L}\p{N}\s-]/gu, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 60);

/** Gives every <h2> an id so it can be linked to, and lists them for the contents box. */
function withHeadingIds(html: string): { html: string; toc: { id: string; text: string }[] } {
  const toc: { id: string; text: string }[] = [];
  const used = new Set<string>();
  const out = (html || "").replace(/<h2([^>]*)>([\s\S]*?)<\/h2>/gi, (_m, attrs: string, inner: string) => {
    const text = htmlToText(inner).replace(/\s+/g, " ").replace(/[.\s]+$/, "").trim();
    if (!text) return _m;
    let id = (attrs.match(/\sid=["']([^"']+)["']/i) || [])[1] || slugifyHeading(text) || "section";
    let n = 2;
    const base = id;
    while (used.has(id)) id = `${base}-${n++}`;
    used.add(id);
    toc.push({ id, text });
    const cleanAttrs = attrs.replace(/\sid=["'][^"']*["']/i, "");
    return `<h2${cleanAttrs} id="${id}">${inner}</h2>`;
  });
  return { html: out, toc };
}

const wordCount = (html: string) => htmlToText(html).split(/\s+/).filter(Boolean).length;

const fmtDate = (s?: string) => {
  if (!s) return "";
  return new Date(s).toLocaleDateString("en-IN", { month: "long", day: "numeric", year: "numeric" });
};

async function baseGenerateMetadata({ params }: { params: Promise<{ slug: string; lang: string }> }) {
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
      modifiedTime: blog.updatedAt || blog.publishedAt,
      section: blog.category,
      tags: blog.tags?.length ? blog.tags : undefined,
      authors: [blog.author?.name || BRAND],
    },
    robots: { index: true, follow: true, "max-image-preview": "large" as const, "max-snippet": -1 },
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
  const populatedCats = categories.filter((c) => c.count > 0).slice(0, 8);
  const { html: bodyHtml, toc } = withHeadingIds(demoteH1(blog.content));
  const showToc = toc.length >= 3;
  const catHref = `/blogs/categories/${catSlug(blog.category)}`;
  const isGitaPost = /gita|geeta/i.test(`${blog.title} ${blog.slug} ${(blog.tags || []).join(" ")}`);

  // Build share URLs
  const fullUrl = `${SITE_URL}/blogs/${blog.slug}`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`Click here & start reading now! ${fullUrl}`)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(fullUrl)}`;
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(fullUrl)}&text=${encodeURIComponent(
    "Click here & start reading now!"
  )}`;

  const isPerson = Boolean(blog.author?.name && blog.author.name !== "Admin" && blog.author.name !== "Hare Krishna Movement Vizag");
  const blogPostingJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title.slice(0, 110),
    description: clampDescription(blog.metaDescription || blog.excerpt || htmlToText(blog.content)),
    image: blog.coverImage ? [blog.coverImage] : undefined,
    datePublished: blog.publishedAt,
    dateModified: blog.updatedAt || blog.publishedAt,
    articleSection: blog.category,
    keywords: blog.tags?.length ? blog.tags.join(", ") : undefined,
    wordCount: wordCount(blog.content),
    inLanguage: "en-IN",
    author: isPerson
      ? { "@type": "Person", name: blog.author.name }
      : { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BRAND, url: SITE_URL },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND,
      logo: { "@type": "ImageObject", url: `${SITE_URL}/assets/iskcon-gambheeram-logo.jpeg` },
    },
    isPartOf: { "@type": "Blog", "@id": `${SITE_URL}/blogs`, name: `${BRAND} Blog`, url: `${SITE_URL}/blogs` },
    mainEntityOfPage: { "@type": "WebPage", "@id": fullUrl },
  };

  const shareBtn =
    "inline-flex min-h-[40px] items-center gap-2 rounded-full px-4 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95";

  return (
    <PageLayout>
    <JsonLd data={blogPostingJsonLd} />
    <JsonLd
      data={breadcrumbJsonLd([
        { name: "Blog", path: "/blogs" },
        { name: blog.category, path: catHref },
        { name: blog.title, path: `/blogs/${blog.slug}` },
      ])}
    />
    <main className={`overflow-x-hidden ${CREAM} pt-[var(--header-h)]`}>
      {/* ─── Header: calm, centred, serif ─── */}
      <header className="relative overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-full bg-[radial-gradient(60%_80%_at_50%_0%,rgba(47,91,211,0.07),transparent_70%)]"
        />
        <div className="vk-container relative pb-8 pt-8 text-center md:pb-12 md:pt-12">
          <nav
            aria-label="Breadcrumb"
            className="mx-auto mb-6 flex max-w-full items-center justify-center gap-1.5 text-xs font-medium text-ink/55 md:text-[13px]"
          >
            <Link href="/" className="inline-flex shrink-0 items-center gap-1 transition-colors hover:text-vk-700">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <Link href="/blogs" className="shrink-0 transition-colors hover:text-vk-700">Blogs</Link>
            <ChevronRight className="hidden h-3.5 w-3.5 shrink-0 opacity-60 sm:block" />
            <Link href={catHref} className="hidden shrink-0 transition-colors hover:text-vk-700 sm:inline">{blog.category}</Link>
          </nav>

          <Link href={catHref} className="inline-block">
            <Eyebrow>{blog.category}</Eyebrow>
          </Link>

          <h1
            className={`${SERIF} mx-auto mt-4 max-w-3xl text-[2rem] font-semibold leading-[1.15] text-ink sm:text-[2.6rem] lg:text-[3.1rem]`}
          >
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="mx-auto mt-5 max-w-2xl text-[17px] leading-relaxed text-ink/65 md:text-lg">{blog.excerpt}</p>
          )}

          {/* Byline */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-ink/60">
            <span className="inline-flex items-center gap-2 font-semibold text-ink">
              {blog.author?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={blog.author.avatar} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-vk-100" />
              ) : (
                <span className="grid h-8 w-8 place-items-center rounded-full bg-[#EEF2FF] text-xs font-bold text-vk-600">
                  {(blog.author?.name || "A").charAt(0)}
                </span>
              )}
              {blog.author?.name || "Admin"}
            </span>
            <span aria-hidden className="text-vk-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-vk-600" />
              <time dateTime={blog.publishedAt || blog.createdAt}>{fmtDate(blog.publishedAt || blog.createdAt)}</time>
            </span>
            <span aria-hidden className="text-vk-300">•</span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-vk-600" />
              {blog.readTime} min read
            </span>
          </div>
        </div>
      </header>

      {/* Cover */}
      {blog.coverImage && (
        <div className="vk-container">
          <div className="mx-auto max-w-4xl overflow-hidden rounded-[1.75rem] bg-[#EEF2FF] shadow-[0_34px_70px_-38px_rgba(30,58,138,0.65)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.coverImage} alt={blog.title} fetchPriority="high" className="h-auto w-full object-cover" />
          </div>
        </div>
      )}

      <article className="vk-container pb-14 pt-10 md:pb-20 md:pt-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_320px] xl:gap-16">
          {/* ─── MAIN CONTENT — comfortable reading column ─── */}
          <div className="mx-auto w-full min-w-0 max-w-[720px]">
            {/* Contents — on phones it folds away */}
            {showToc && (
              <details className={`group mb-8 rounded-2xl border ${LINE} bg-white/70 p-5 lg:hidden`}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-ink">
                  <span className="inline-flex items-center gap-2">
                    <ListTree className="h-4 w-4 text-vk-600" /> In this article
                  </span>
                  <ChevronRight className="h-4 w-4 transition-transform group-open:rotate-90" />
                </summary>
                <ol className="mt-3 space-y-2 text-[15px]">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="text-ink/75 hover:text-vk-700">{t.text}</a>
                    </li>
                  ))}
                </ol>
              </details>
            )}

            {/* HTML content from CKEditor */}
            <div id="article-body" className="blog-content" dangerouslySetInnerHTML={{ __html: bodyHtml }} />

            {/* A reading about the Gita also points to Gita Daan, the seva that matches it */}
            {isGitaPost && (
              <Link
                href={`/gita-daan-seva?utm_source=blog&utm_medium=post-cta&utm_campaign=${blog.slug}`}
                className={`group mt-12 flex items-center justify-between gap-4 rounded-2xl border ${LINE} bg-white/80 p-5 transition-colors hover:border-vk-600/40 md:p-6`}
              >
                <div>
                  <Eyebrow>Gita Daan Seva</Eyebrow>
                  <div className={`${SERIF} mt-1 text-[1.25rem] font-semibold leading-snug text-ink`}>
                    Gift a Bhagavad-gita to a seeker from ₹250
                  </div>
                  <p className="mt-1 text-sm text-ink/65">Place Bhagavad-gita As It Is in the hands of a student or seeker who may never find it alone.</p>
                </div>
                <ArrowRight className="h-5 w-5 shrink-0 text-vk-700 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            {/* Offer a seva: every reading ends with an invitation to Brick Seva */}
            <div className={`relative ${isGitaPost ? "mt-6" : "mt-12"} overflow-hidden rounded-2xl border border-vk-200 bg-gradient-to-br from-vk-50 via-white to-vk-100 p-6 md:p-8`}>
              <div aria-hidden className="absolute -bottom-16 -right-12 h-44 w-44 rounded-full bg-vk-100 blur-2xl" />
              <div className="relative">
                <Eyebrow>Offer a seva</Eyebrow>
                <h3 className={`${SERIF} mt-2 text-[1.5rem] font-semibold leading-snug text-ink md:text-[1.75rem]`}>
                  Your brick stays as long as the temple stands
                </h3>
                <p className="mt-2 max-w-xl text-[15px] leading-relaxed text-ink/70">
                  Every brick becomes a permanent part of the Lord&apos;s abode. Sponsor one in the Hare Krishna Vaikuntham temple in Visakhapatnam, and it remains there for as long as the temple stands.
                </p>
                <Link
                  href={`/brick-seva-campaign?utm_source=blog&utm_medium=post-cta&utm_campaign=${blog.slug}`}
                  className="vk-btn mt-5 min-h-[46px] bg-vk-700 px-6 text-white shadow hover:bg-vk-800"
                >
                  Offer Brick Seva <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Share */}
            <div className={`mt-6 rounded-2xl border ${LINE} bg-white/70 p-5`}>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-vk-600">Share this reading</h4>
              <div className="flex flex-wrap gap-2">
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className={`${shareBtn} bg-[#25D366]`}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" className={`${shareBtn} bg-[#1877F2]`}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </a>
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" className={`${shareBtn} bg-ink`}>
                  <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X
                </a>
              </div>
            </div>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="mt-8 flex flex-wrap items-center gap-2">
                <Link
                  href={catHref}
                  className="inline-flex min-h-[34px] items-center rounded-full bg-vk-700 px-3.5 text-xs font-semibold text-white transition-colors hover:bg-vk-600"
                >
                  {blog.category}
                </Link>
                {blog.tags.map((t) => (
                  <span
                    key={t}
                    className={`inline-flex min-h-[34px] items-center gap-1 rounded-full border ${LINE} bg-white/70 px-3.5 text-xs font-medium text-ink/75`}
                  >
                    <Tag className="h-3 w-3" /> {t}
                  </span>
                ))}
              </div>
            )}

            {/* Author */}
            <div className={`mt-10 flex items-start gap-4 rounded-2xl border ${LINE} bg-white/70 p-5 md:p-6`}>
              {blog.author?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={blog.author.avatar} alt={blog.author.name} className="h-14 w-14 shrink-0 rounded-full object-cover ring-4 ring-[#EEF2FF]" />
              ) : (
                <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#EEF2FF] text-lg font-bold text-vk-600">
                  {(blog.author?.name || "A").charAt(0)}
                </div>
              )}
              <div className="min-w-0">
                <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-vk-600">Written by</div>
                <div className={`${SERIF} text-lg font-semibold leading-tight text-ink`}>{blog.author?.name || "Admin"}</div>
                <div className="mt-0.5 text-sm text-ink/55">
                  Updated {fmtDate(blog.updatedAt || blog.publishedAt || blog.createdAt)}
                </div>
                {blog.author?.bio && <p className="mt-2 text-sm leading-relaxed text-ink/65">{blog.author.bio}</p>}
              </div>
            </div>
          </div>

          {/* ─── SIDEBAR ─── */}
          <aside className="space-y-6 lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
            {showToc && (
              <nav aria-label="In this article" className={`hidden rounded-2xl border ${LINE} bg-white/70 p-5 lg:block`}>
                <div className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-vk-600">
                  <ListTree className="h-4 w-4" /> In this article
                </div>
                <ol className="space-y-2 border-l border-[#E4E9F7] text-[14px]">
                  {toc.map((t) => (
                    <li key={t.id}>
                      <a href={`#${t.id}`} className="-ml-px block border-l border-transparent py-0.5 pl-3 leading-snug text-ink/70 transition-colors hover:border-vk-700 hover:text-vk-700">
                        {t.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </nav>
            )}

            {populatedCats.length > 0 && (
              <div className={`rounded-2xl border ${LINE} bg-white/70 p-5`}>
                <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-vk-600">Explore topics</div>
                <div className="space-y-0.5">
                  {populatedCats.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/blogs/categories/${cat.slug}`}
                      className="group flex min-h-[38px] items-center justify-between gap-3 rounded-lg px-2 transition-colors hover:bg-[#F5F7FF]"
                    >
                      <span className="text-sm font-medium text-ink/80 transition-colors group-hover:text-vk-700">{cat.name}</span>
                      <span className="text-[11px] font-semibold text-vk-600">{cat.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Seva promotions — real pages on this site, with each seva's actual image */}
            <div>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-vk-600">Support our sevas</div>
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
                  <Link key={ad.href} href={ad.href} className="vk-tile group block aspect-[16/9] !rounded-2xl">
                    <Image
                      src={ad.image}
                      alt={ad.title}
                      fill
                      sizes="(min-width: 1024px) 320px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover"
                    />
                    <div className="vk-tile-caption flex items-end justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-base font-bold leading-tight text-white">{ad.title}</div>
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

      {/* ─── KEEP READING ─── */}
      {related.length > 0 && (
        <section className="border-t border-[#E4E9F7] bg-white/60 py-12 md:py-16">
          <div className="vk-container">
            <ShelfHeading eyebrow="Keep reading" title="More from the journal" href="/blogs" hrefLabel="All blogs" />
            <div className="grid grid-cols-1 gap-x-7 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
              {related.slice(0, 6).map((r) => (
                <PostCard key={r._id} blog={r as never} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Reading typography for the article body (CKEditor / imported HTML). */}
      <style>{`
        .blog-content { font-size: 1.1rem; line-height: 1.9; color: #1b2440; }
        .blog-content > *:first-child { margin-top: 0; }
        .blog-content p { margin: 0 0 1.35rem; }
        .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4 {
          font-family: var(--font-playfair), Georgia, serif; color: #1b2440; line-height: 1.25; scroll-margin-top: calc(var(--header-h) + 1.5rem);
        }
        .blog-content h2 { font-size: 1.75rem; font-weight: 600; margin: 3rem 0 1rem; padding-top: 1.1rem; border-top: 1px solid #E4E9F7; }
        .blog-content h2:first-child { border-top: 0; padding-top: 0; margin-top: 0; }
        .blog-content h3 { font-size: 1.3rem; font-weight: 600; margin: 2.1rem 0 0.7rem; }
        .blog-content h4 { font-size: 1.1rem; font-weight: 600; margin: 1.6rem 0 0.5rem; }
        .blog-content strong { font-weight: 700; color: #1b2440; }
        .blog-content a { color: #2F5BD3; font-weight: 500; text-decoration: underline; text-decoration-color: #B9C8FB; text-underline-offset: 4px; }
        .blog-content a:hover { text-decoration-color: #2F5BD3; }
        .blog-content ul, .blog-content ol { margin: 0 0 1.4rem; padding-left: 1.4rem; }
        .blog-content ul { list-style: disc; }
        .blog-content ol { list-style: decimal; }
        .blog-content li { margin: 0.45rem 0; padding-left: 0.25rem; }
        .blog-content li::marker { color: #2F5BD3; }
        .blog-content blockquote {
          margin: 2rem 0; padding: 1.1rem 1.4rem; border-left: 4px solid #2F5BD3; border-radius: 0 1rem 1rem 0;
          background: #F5F7FF; font-family: var(--font-playfair), Georgia, serif; font-style: italic; color: #1b2440;
        }
        .blog-content blockquote p:last-child { margin-bottom: 0; }
        .blog-content img { max-width: 100%; height: auto; display: block; margin: 2rem auto; border-radius: 1.1rem; box-shadow: 0 22px 44px -30px rgba(30,58,138,.55); }
        .blog-content iframe, .blog-content video { max-width: 100%; border-radius: 1rem; }
        .blog-content hr { border: 0; height: 1px; background: #E4E9F7; margin: 2.5rem 0; }
        .blog-content table {
          display: block; overflow-x: auto; width: 100%; margin: 1.8rem 0; border-collapse: separate; border-spacing: 0;
          border: 1px solid #E4E9F7; border-radius: 1rem; background: #fff; font-size: 0.98rem; line-height: 1.55;
        }
        .blog-content th { background: #F5F7FF; text-align: left; font-weight: 600; color: #1b2440; }
        .blog-content th, .blog-content td { padding: 0.7rem 1rem; border-bottom: 1px solid #E4E9F7; vertical-align: top; }
        .blog-content tr:last-child td { border-bottom: 0; }
        .blog-content code { background: #EEF2FF; color: #1E3A8A; padding: 0.15rem 0.4rem; border-radius: 6px; font-size: 0.9em; font-family: ui-monospace, SFMono-Regular, monospace; }
        @media (max-width: 640px) { .blog-content { font-size: 1.04rem; line-height: 1.85; } .blog-content h2 { font-size: 1.5rem; } }
      `}</style>
    </main>
    </PageLayout>
  );
}

export const generateMetadata = localizedFn(baseGenerateMetadata);

// Built on first visit, then served from cache and refreshed every 5
// minutes (ISR) instead of rendered per request. An empty list is what
// lets Next cache these paths at runtime.
export async function generateStaticParams() {
  return [];
}
