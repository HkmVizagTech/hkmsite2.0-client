/* eslint-disable @next/next/no-img-element -- blog covers come from admin-supplied
   hosts that may not be in next.config remotePatterns, so plain <img> is safer. */

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, Clock } from "lucide-react";

/** Shared, presentational pieces of the blog pages (usable from server and client components). */

export interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  author: { name: string; avatar?: string; slug?: string };
  publishedAt?: string;
  createdAt: string;
  readTime: number;
  views?: number;
}

export const SERIF = "font-serif-display";
export const CREAM = "bg-white";
export const LINE = "border-[#E4E9F7]";

export const fmtDate = (s?: string, long = false) => {
  if (!s) return "";
  return new Date(s).toLocaleDateString("en-IN", { month: long ? "long" : "short", day: "numeric", year: "numeric" });
};

/** Cover image, or a soft gradient when the post has none. */
export function Cover({ blog, className = "", priority = false }: { blog: Blog; className?: string; priority?: boolean }) {
  return (
    <div className={`relative overflow-hidden bg-[#EEF2FF] ${className}`}>
      {blog.coverImage ? (
        <img
          src={blog.coverImage}
          alt={blog.title}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-vk-700 via-vk-600 to-vk-400" />
      )}
    </div>
  );
}

export function Meta({ blog, light = false }: { blog: Blog; light?: boolean }) {
  const parts = [fmtDate(blog.publishedAt || blog.createdAt), blog.readTime ? `${blog.readTime} min read` : ""].filter(Boolean);
  return (
    <p className={`flex items-center gap-1.5 text-xs ${light ? "text-white/75" : "text-ink/55"}`}>
      <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
      {parts.join("  ·  ")}
    </p>
  );
}

export function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
        light ? "text-[#BFD0FF]" : "text-vk-600"
      }`}
    >
      <span aria-hidden className={`h-px w-6 ${light ? "bg-[#BFD0FF]/70" : "bg-vk-600/60"}`} />
      {children}
    </span>
  );
}

/** Serif section title with a quiet gold rule and an optional link. */
export function ShelfHeading({
  eyebrow,
  title,
  subtitle,
  href,
  hrefLabel = "See all",
  right,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  href?: string;
  hrefLabel?: string;
  right?: ReactNode;
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div className="mb-7 flex flex-col gap-3 md:mb-9 md:flex-row md:items-end md:justify-between">
      <div className="max-w-2xl">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <Tag className={`${SERIF} mt-2 text-[1.7rem] font-semibold leading-tight text-ink md:text-[2.2rem]`}>{title}</Tag>
        {subtitle && <p className="mt-2 text-[15px] leading-relaxed text-ink/60">{subtitle}</p>}
      </div>
      {right ??
        (href && (
          <Link href={href} className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-vk-700 hover:text-vk-900">
            {hrefLabel}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
    </div>
  );
}

/** The everyday reading card: calm image, serif title, a few lines of excerpt. */
export function PostCard({ blog, showCategory = true }: { blog: Blog; showCategory?: boolean }) {
  return (
    <Link href={`/blogs/${blog.slug}`} className="group flex h-full flex-col">
      <Cover blog={blog} className="aspect-[3/2] rounded-2xl shadow-[0_14px_30px_-22px_rgba(30,58,138,0.55)]" />
      <div className="flex flex-1 flex-col pt-4">
        {showCategory && blog.category && (
          <span className="mb-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-vk-600">{blog.category}</span>
        )}
        <h3 className={`${SERIF} line-clamp-2 text-[1.2rem] font-semibold leading-snug text-ink transition-colors group-hover:text-vk-700`}>
          {blog.title}
        </h3>
        {blog.excerpt && <p className="mt-2 line-clamp-2 text-[14.5px] leading-relaxed text-ink/65">{blog.excerpt}</p>}
        <div className="mt-auto pt-3">
          <Meta blog={blog} />
        </div>
      </div>
    </Link>
  );
}
