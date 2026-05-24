import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Clock, ArrowLeft, ArrowRight, Eye, Tag } from "lucide-react";
import PageHero from "@/components/PageHero";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt?: string;
  createdAt: string;
  readTime: number;
  views: number;
  metaTitle?: string;
  metaDescription?: string;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

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
    const json = await res.json();
    return (json.items as Blog[]) || [];
  } catch (_) {
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) return { title: "Blog · Hare Krishna Vaikuntham" };
  return {
    title: blog.metaTitle || `${blog.title} · Hare Krishna Vaikuntham`,
    description: blog.metaDescription || blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      images: blog.coverImage ? [blog.coverImage] : [],
      type: "article",
      publishedTime: blog.publishedAt,
      authors: [blog.author],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const blog = await getBlog(slug);
  if (!blog) notFound();

  const related = await getRelated(blog._id);

  return (
    <>
      <PageHero
        title={blog.title}
        breadcrumb={blog.category}
        subtitle={blog.excerpt}
      />

      <article className="container mx-auto px-4 py-12 max-w-3xl">
        {/* Meta strip */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground mb-6 pb-6 border-b">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-IN", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-primary" />
            {blog.readTime} min read
          </span>
          <span className="flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-primary" />
            {blog.views.toLocaleString()} views
          </span>
          <span className="ml-auto text-primary font-semibold">{blog.author}</span>
        </div>

        {/* Cover */}
        {blog.coverImage && (
          <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8 shadow-md">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={blog.coverImage} alt={blog.title} className="w-full h-full object-cover" />
          </div>
        )}

        {/* HTML content (from CKEditor) */}
        <div
          className="blog-content prose prose-neutral max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-6 border-t">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {blog.tags.map((t) => (
              <Link
                key={t}
                href={`/blogs?tag=${encodeURIComponent(t)}`}
                className="px-3 py-1 rounded-full bg-muted hover:bg-primary/10 hover:text-primary text-xs font-medium transition"
              >
                #{t}
              </Link>
            ))}
          </div>
        )}

        {/* Back to blogs */}
        <div className="mt-10">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-primary font-semibold text-sm hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to all articles
          </Link>
        </div>
      </article>

      {/* Related */}
      {related.length > 0 && (
        <section className="bg-muted/30 py-12 border-t">
          <div className="container mx-auto px-4 max-w-5xl">
            <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.slice(0, 3).map((r) => (
                <Link
                  key={r._id}
                  href={`/blogs/${r.slug}`}
                  className="group block bg-card border rounded-xl overflow-hidden hover:shadow-md transition"
                >
                  <div
                    className="aspect-[16/10] bg-cover bg-center"
                    style={{
                      backgroundImage: r.coverImage
                        ? `url(${r.coverImage})`
                        : "linear-gradient(135deg, hsl(var(--primary) / 0.4), hsl(var(--accent) / 0.4))",
                    }}
                  />
                  <div className="p-4">
                    <div className="text-xs text-muted-foreground mb-1.5">
                      {new Date(r.publishedAt || r.createdAt).toLocaleDateString()}
                    </div>
                    <h3 className="font-semibold mb-1.5 line-clamp-2 group-hover:text-primary transition">
                      {r.title}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{r.excerpt}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CKEditor produces standard HTML — these styles render it nicely on the public page.
          Tailwind's typography plugin is NOT a dependency; using plain CSS keeps this drop-in. */}
      <style>{`
        .blog-content { color: hsl(var(--foreground)); line-height: 1.8; font-size: 17px; }
        .blog-content h1 { font-size: 2.25rem; font-weight: 700; margin: 2rem 0 1rem; line-height: 1.2; }
        .blog-content h2 { font-size: 1.75rem; font-weight: 700; margin: 1.75rem 0 0.75rem; line-height: 1.25; }
        .blog-content h3 { font-size: 1.35rem; font-weight: 600; margin: 1.25rem 0 0.5rem; line-height: 1.3; }
        .blog-content p { margin: 0.75rem 0; }
        .blog-content ul, .blog-content ol { padding-left: 1.5rem; margin: 0.75rem 0; }
        .blog-content ul li { list-style: disc; margin: 0.25rem 0; }
        .blog-content ol li { list-style: decimal; margin: 0.25rem 0; }
        .blog-content a { color: hsl(var(--primary)); text-decoration: underline; }
        .blog-content a:hover { opacity: 0.8; }
        .blog-content img { max-width: 100%; height: auto; border-radius: 8px; margin: 1.25rem 0; }
        .blog-content figure { margin: 1.25rem 0; }
        .blog-content figure figcaption {
          text-align: center; color: hsl(var(--muted-foreground));
          font-size: 0.85rem; margin-top: 0.5rem; font-style: italic;
        }
        .blog-content blockquote {
          border-left: 4px solid hsl(var(--primary));
          padding: 0.5rem 0 0.5rem 1.25rem;
          margin: 1.25rem 0;
          color: hsl(var(--muted-foreground));
          font-style: italic;
          background: hsl(var(--muted) / 0.3);
          border-radius: 0 6px 6px 0;
        }
        .blog-content table { border-collapse: collapse; width: 100%; margin: 1.25rem 0; }
        .blog-content table td, .blog-content table th {
          border: 1px solid hsl(var(--border));
          padding: 0.55rem 0.75rem;
        }
        .blog-content table th { background: hsl(var(--muted)); font-weight: 600; }
        .blog-content code {
          background: hsl(var(--muted));
          padding: 0.15rem 0.4rem;
          border-radius: 4px;
          font-size: 0.9em;
          font-family: ui-monospace, SFMono-Regular, monospace;
        }
      `}</style>
    </>
  );
}
