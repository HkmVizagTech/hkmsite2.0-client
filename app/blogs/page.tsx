"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Search } from "lucide-react";
import PageHero from "@/components/PageHero";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  publishedAt?: string;
  createdAt: string;
  readTime: number;
  views: number;
}

const CATEGORIES = ["All", "Spirituality", "Festivals", "Vizag Guide", "Recipes", "Philosophy"];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function BlogsListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ status: "published", limit: "30" });
        if (activeCategory !== "All") params.set("category", activeCategory);
        if (search) params.set("q", search);
        const res = await fetch(`${API_URL}/blogs?${params.toString()}`);
        const json = await res.json();
        if (res.ok) setBlogs(json.blogs || []);
      } catch (_) {
        // silent
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [activeCategory]);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // re-trigger effect by toggling category in same value
    setActiveCategory((c) => c);
    (async () => {
      setLoading(true);
      const params = new URLSearchParams({ status: "published", limit: "30" });
      if (activeCategory !== "All") params.set("category", activeCategory);
      if (search) params.set("q", search);
      const res = await fetch(`${API_URL}/blogs?${params.toString()}`);
      const json = await res.json();
      if (res.ok) setBlogs(json.blogs || []);
      setLoading(false);
    })();
  };

  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <>
      <PageHero
        title="Blogs &amp; Articles"
        breadcrumb="Blog"
        subtitle="Spiritual insights, festival guides, and stories from the Hare Krishna Movement, Vizag."
      />

      {/* Filter bar */}
      <section className="border-b bg-background sticky top-0 z-30 py-4">
        <div className="container mx-auto px-4 flex flex-wrap items-center gap-3 justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setActiveCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                  activeCategory === c
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/70 text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <form onSubmit={onSearch} className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search blogs…"
              className="pl-9 h-9 w-[220px]"
            />
          </form>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="text-center py-20 text-muted-foreground">Loading articles…</div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground">No blog posts yet — check back soon.</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
              >
                <Link
                  href={`/blogs/${featured.slug}`}
                  className="group grid md:grid-cols-2 gap-6 items-center bg-card border rounded-2xl overflow-hidden hover:shadow-lg transition"
                >
                  <div
                    className="aspect-[16/10] bg-cover bg-center md:aspect-auto md:h-full md:min-h-[320px]"
                    style={{
                      backgroundImage: featured.coverImage
                        ? `url(${featured.coverImage})`
                        : "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--secondary)))",
                    }}
                  />
                  <div className="p-6 md:p-10">
                    <div className="inline-block px-3 py-1 mb-3 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wide">
                      ★ Featured · {featured.category}
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary transition">
                      {featured.title}
                    </h2>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4" />
                        {new Date(featured.publishedAt || featured.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" /> {featured.readTime} min read
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-5 line-clamp-3">{featured.excerpt}</p>
                    <Button variant="default">
                      Read Article <ArrowRight className="w-4 h-4 ml-1.5" />
                    </Button>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Rest grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rest.map((blog, idx) => (
                <motion.article
                  key={blog._id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.04 }}
                >
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="group block bg-card border rounded-xl overflow-hidden hover:shadow-md hover:-translate-y-1 transition-all"
                  >
                    <div
                      className="aspect-[16/10] bg-cover bg-center"
                      style={{
                        backgroundImage: blog.coverImage
                          ? `url(${blog.coverImage})`
                          : "linear-gradient(135deg, hsl(var(--primary) / 0.4), hsl(var(--accent) / 0.4))",
                      }}
                    />
                    <div className="p-5">
                      <div className="text-xs text-muted-foreground mb-2">
                        {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · <span className="text-primary font-semibold">{blog.author}</span>
                      </div>
                      <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition">
                        {blog.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {blog.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-primary font-semibold inline-flex items-center gap-1">
                          Read more <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {blog.readTime} min
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </>
        )}
      </section>
    </>
  );
}
