"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  coverImage?: string;
  category?: string;
  author?: { name?: string };
  publishedAt?: string;
  createdAt: string;
  readTime?: number;
}

const FALLBACK_COVER = "/assets/home-gallery-radha-krishna.webp";

const fmtDate = (s?: string) =>
  s ? new Date(s).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "";

/** GVD "Latest Blogs" — two featured cards plus a compact list. Hidden when there are no posts. */
export default function LatestBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/blogs?limit=6`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => Array.isArray(d?.blogs) && setBlogs(d.blogs.slice(0, 6)))
      .catch(() => {});
  }, []);

  if (blogs.length === 0) return null;
  const featured = blogs.slice(0, 2);
  const rest = blogs.slice(2, 6);

  const meta = (b: Blog) => (
    <p className="flex flex-wrap items-center gap-x-2 text-xs text-ink/55">
      <span>{b.author?.name || "Hare Krishna Vaikuntham"}</span>
      <span aria-hidden>•</span>
      <span>{fmtDate(b.publishedAt || b.createdAt)}</span>
      {b.readTime ? (
        <>
          <span aria-hidden>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {b.readTime} min
          </span>
        </>
      ) : null}
    </p>
  );

  return (
    <section className="vk-section">
      <div className="vk-container">
        <SectionHeading
          eyebrow="Worth Knowing"
          title="Latest Blogs"
          subtitle="Krishna katha, festival insights and the teachings of Srila Prabhupada."
          action={{ href: "/blogs", label: "View All" }}
        />
        <div className="grid gap-5 lg:grid-cols-[2fr_1fr]">
          <div className="grid gap-5 sm:grid-cols-2">
            {featured.map((b, i) => (
              <Reveal key={b._id} delay={i * 0.06}>
                <Link href={`/blogs/${b.slug}`} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-vk-100 shadow-card">
                    <Image
                      src={b.coverImage || FALLBACK_COVER}
                      alt={b.title}
                      fill
                      sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {b.category && (
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-vk-800 shadow">
                        {b.category}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">{meta(b)}</div>
                  <h3 className="mt-1.5 line-clamp-2 text-lg font-bold leading-snug text-ink transition-colors group-hover:text-vk-700">
                    {b.title}
                  </h3>
                  {b.excerpt && <p className="mt-1.5 line-clamp-2 text-sm text-muted-foreground">{b.excerpt}</p>}
                </Link>
              </Reveal>
            ))}
          </div>

          {rest.length > 0 && (
            <div className="flex flex-col gap-3">
              {rest.map((b, i) => (
                <Reveal key={b._id} delay={0.1 + i * 0.05}>
                  <Link
                    href={`/blogs/${b.slug}`}
                    className="group flex items-center gap-3 rounded-2xl border border-vk-100 bg-white p-2.5 transition-shadow hover:shadow-card"
                  >
                    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-vk-100">
                      <Image
                        src={b.coverImage || FALLBACK_COVER}
                        alt=""
                        fill
                        sizes="96px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      {meta(b)}
                      <h3 className="mt-1 line-clamp-2 text-[15px] font-bold leading-snug text-ink group-hover:text-vk-700">
                        {b.title}
                      </h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
