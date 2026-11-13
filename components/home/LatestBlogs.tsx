"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";
import SectionHeading from "@/components/site/SectionHeading";
import Reveal from "@/components/site/Reveal";
import { useT } from "@/components/i18n/LocaleProvider";

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

/** "Latest Blogs": one featured post with its full cover, and four more beside it (a swipe row on phones). Hidden when there are no posts. */
export default function LatestBlogs() {
  const t = useT();
  const [blogs, setBlogs] = useState<Blog[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/blogs?limit=6`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => Array.isArray(d?.blogs) && setBlogs(d.blogs.slice(0, 6)))
      .catch(() => {});
  }, []);

  if (blogs.length === 0) return null;
  const [lead, ...others] = blogs;
  const side = others.slice(0, 4);

  const meta = (b: Blog, light = false) => (
    <p className={`flex flex-wrap items-center gap-x-2 text-xs ${light ? "text-white/75" : "text-ink/55"}`}>
      <span>{fmtDate(b.publishedAt || b.createdAt)}</span>
      {b.readTime ? (
        <>
          <span aria-hidden>•</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3" /> {t("{n} min", { n: b.readTime })}
          </span>
        </>
      ) : null}
    </p>
  );

  // Blog covers are designed posters, so they are shown whole (16:9) rather than cropped.
  const Cover = ({ b, sizes, className = "" }: { b: Blog; sizes: string; className?: string }) => (
    <div className={`relative aspect-video overflow-hidden bg-vk-100 ${className}`}>
      <Image src={b.coverImage || FALLBACK_COVER} alt={b.title} fill sizes={sizes} className="object-cover transition-transform duration-700 group-hover:scale-105" />
      {b.category && (
        <span className="absolute left-3 top-3 rounded-full bg-[#0A1640]/85 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#FFE6A3] ring-1 ring-[#F6C752]/60 backdrop-blur">
          {b.category}
        </span>
      )}
    </div>
  );

  return (
    <section className="vk-section">
      <div className="vk-container">
        <SectionHeading
          eyebrow={t("Worth Knowing")}
          title={t("Latest Blogs")}
          subtitle={t("Krishna katha, festival insights and the teachings of Srila Prabhupada.")}
          action={{ href: "/blogs", label: t("View All") }}
        />
        <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* featured post */}
          <Reveal>
            <Link href={`/blogs/${lead.slug}`} className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_50px_-28px_rgba(30,58,138,.55)] ring-1 ring-[#F6C752]/40 transition-shadow hover:shadow-[0_30px_60px_-26px_rgba(30,58,138,.65)]">
              <Cover b={lead} sizes="(min-width: 1024px) 680px, 100vw" />
              <div className="flex flex-1 flex-col p-5 md:p-7">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-[hsl(var(--gold-deep))]">✦ {t("Featured")}</span>
                <h3 className="mt-2 font-serif-display text-2xl font-bold leading-snug text-vk-800 transition-colors group-hover:text-vk-600 md:text-[1.9rem]">{lead.title}</h3>
                {lead.excerpt && <p className="mt-3 line-clamp-3 text-[15px] leading-relaxed text-ink/70">{lead.excerpt}</p>}
                <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                  {meta(lead)}
                  <span className="inline-flex items-center gap-1.5 text-sm font-bold text-vk-700 group-hover:text-vk-500">{t("Read more")} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></span>
                </div>
              </div>
            </Link>
          </Reveal>

          {/* more posts: a column on computers, a swipe row on phones */}
          {side.length > 0 && (
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 [scrollbar-width:none] lg:mx-0 lg:grid lg:grid-cols-2 lg:overflow-visible lg:px-0 lg:pb-0 [&::-webkit-scrollbar]:hidden">
              {side.map((b, i) => (
                <Reveal key={b._id} delay={0.08 + i * 0.05} className="w-[72%] shrink-0 snap-start sm:w-[45%] lg:w-auto">
                  <Link href={`/blogs/${b.slug}`} className="group flex h-full flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-vk-100 transition-all hover:-translate-y-1 hover:shadow-card hover:ring-[#F6C752]/60">
                    <Cover b={b} sizes="(min-width: 1024px) 280px, 72vw" />
                    <div className="flex flex-1 flex-col p-3.5">
                      <h3 className="line-clamp-2 text-[15px] font-bold leading-snug text-ink group-hover:text-vk-700">{b.title}</h3>
                      {b.excerpt && <p className="mt-1.5 line-clamp-2 text-[13px] leading-relaxed text-ink/60">{b.excerpt}</p>}
                      <div className="mt-auto pt-2">{meta(b)}</div>
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
