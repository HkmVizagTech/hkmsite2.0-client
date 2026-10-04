import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ChevronRight, Home } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import SectionHeading from "@/components/site/SectionHeading";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  author: { name: string; avatar?: string };
  publishedAt?: string;
  createdAt: string;
  readTime: number;
}

interface CategoryEntry {
  name: string;
  slug: string;
  count: number;
}

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:3000";

async function getCategories(): Promise<CategoryEntry[]> {
  try {
    const res = await fetch(`${API_URL}/blogs/categories`, { cache: "no-store" });
    if (!res.ok) return [];
    return (await res.json()).categories || [];
  } catch (_) {
    return [];
  }
}
async function getBlogsForCategory(name: string): Promise<Blog[]> {
  try {
    const res = await fetch(
      `${API_URL}/blogs?category=${encodeURIComponent(name)}&limit=50`,
      { cache: "no-store" }
    );
    if (!res.ok) return [];
    return (await res.json()).blogs || [];
  } catch (_) {
    return [];
  }
}

const fmtDate = (s?: string) =>
  s
    ? new Date(s).toLocaleDateString("en-IN", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === slug);
  return {
    title: cat ? `${cat.name} · Blogs · Hare Krishna Vaikuntham` : "Category · Blogs",
    description: cat ? `Read all blog posts in the ${cat.name} category.` : undefined,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const categories = await getCategories();
  const cat = categories.find((c) => c.slug === slug);
  if (!cat) notFound();

  const blogs = await getBlogsForCategory(cat.name);
  const otherCats = categories.filter((c) => c.slug !== slug && c.count > 0).slice(0, 8);

  return (
    <PageLayout>
    <main className="overflow-x-hidden bg-white pt-[var(--header-h)]">
      {/* ─── Tinted hero ─── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-vk-100 via-vk-50 to-white">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-vk-300/30 blur-3xl"
        />
        <div className="vk-container relative pb-8 pt-8 md:pb-12 md:pt-14">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-5 inline-flex max-w-full items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-xs font-medium text-ink/70 shadow-sm md:text-[13px]"
          >
            <Link href="/" className="inline-flex shrink-0 items-center gap-1 transition-colors hover:text-vk-700">
              <Home className="h-3.5 w-3.5" />
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <Link href="/blogs" className="shrink-0 transition-colors hover:text-vk-700">Blogs</Link>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-60" />
            <span className="truncate font-semibold text-vk-700" aria-current="page">{cat.name}</span>
          </nav>

          <header className="max-w-3xl">
            <span className="vk-pill mb-3">Category</span>
            <h1 className="vk-h1">{cat.name}</h1>
            <p className="vk-lead mt-3">
              {cat.count} {cat.count === 1 ? "post" : "posts"} in this category
            </p>
          </header>
        </div>
      </section>

      <section className="pb-12 pt-4 md:pb-16">
        <div className="vk-container">
          {blogs.length === 0 ? (
            <div className="vk-card mx-auto max-w-md p-10 text-center">
              <p className="text-muted-foreground">No posts in this category yet.</p>
              <Link href="/blogs" className="vk-btn-outline mt-5">
                <ArrowLeft className="h-4 w-4" /> Back to all blogs
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
              {blogs.map((b) => (
                <Link
                  key={b._id}
                  href={`/blogs/${b.slug}`}
                  className="vk-card vk-card-hover group flex h-full flex-col overflow-hidden"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-vk-100">
                    {b.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={b.coverImage}
                        alt={b.title}
                        loading="lazy"
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-400" />
                    )}
                    <span className="absolute left-3 top-3 max-w-[85%] truncate rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-vk-800 shadow">
                      {b.category || cat.name}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-ink transition-colors group-hover:text-vk-700 md:text-lg">
                      {b.title}
                    </h3>
                    {b.excerpt && (
                      <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                        {b.excerpt}
                      </p>
                    )}
                    <div className="mt-auto flex items-center gap-2 pt-1 text-xs text-muted-foreground">
                      {b.author?.avatar ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={b.author.avatar}
                          alt=""
                          className="h-6 w-6 rounded-full object-cover"
                        />
                      ) : (
                        <div className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-vk-100 text-[10px] font-bold text-vk-700">
                          {(b.author?.name || "A").charAt(0)}
                        </div>
                      )}
                      <span className="truncate">By {b.author?.name || "Admin"}</span>
                      <span aria-hidden>·</span>
                      <span className="whitespace-nowrap">{fmtDate(b.publishedAt || b.createdAt)}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Other categories — chips */}
      {otherCats.length > 0 && (
        <section className="vk-section vk-band">
          <div className="vk-container">
            <SectionHeading
              eyebrow="Keep Exploring"
              title="Other Categories"
              action={{ href: "/blogs", label: "All Blogs" }}
            />
            <div className="flex flex-wrap gap-2">
              {otherCats.map((c) => (
                <Link
                  key={c.slug}
                  href={`/blogs/categories/${c.slug}`}
                  className="group inline-flex min-h-[44px] items-center gap-2 rounded-full border border-vk-200 bg-white px-4 text-sm font-medium text-ink/85 shadow-sm transition-colors hover:border-vk-700 hover:text-vk-700"
                >
                  {c.name}
                  <span className="rounded-full bg-vk-100 px-1.5 py-0.5 text-[11px] font-bold text-vk-700">
                    {c.count}
                  </span>
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
