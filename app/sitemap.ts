import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/founder`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/sevas`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/gallery`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/events`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/blogs`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/daily-schedule`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/important-dates`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/subhojanam`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/csr`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/anna-daan-seva`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/gau-seva`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/sqft-seva-campaign`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/gita-daan-seva`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/alankara-vastra-seva`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/brick-seva-campaign`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/donations`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/janmashtami`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${SITE_URL}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${SITE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/terms-and-conditions`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/refund-policy`, changeFrequency: "yearly", priority: 0.2 },
    // Shop & giving paths that search users actually land on.
    { url: `${SITE_URL}/shop`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/donate`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/vaishnav-calendar`, changeFrequency: "weekly", priority: 0.6 },
    { url: `${SITE_URL}/festival`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/volunteer`, changeFrequency: "monthly", priority: 0.6 },
  ];

  // Dynamic: published blog posts
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/blogs?limit=50`, { next: { revalidate: 3600 } });
    if (res.ok) {
      const data = await res.json();
      blogPages = (data.blogs || []).map((b: any) => ({
        url: `${SITE_URL}/blogs/${b.slug}`,
        lastModified: b.updatedAt ? new Date(b.updatedAt) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      }));
    }
  } catch {}

  // Dynamic: shop products
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/shop/products?limit=500&sort=newest`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      productPages = (data.products || []).map((p: any) => ({
        url: `${SITE_URL}/shop/${p.slug}`,
        lastModified: p.updatedAt ? new Date(p.updatedAt) : undefined,
        changeFrequency: "weekly" as const,
        priority: 0.8,
      }));
    }
  } catch {}

  // Dynamic: festival showcase pages
  let festivalPages: MetadataRoute.Sitemap = [];
  try {
    const res = await fetch(`${API_URL}/festival-showcases/public`, {
      next: { revalidate: 3600 },
    });
    if (res.ok) {
      const data = await res.json();
      const list = Array.isArray(data) ? data : [];
      festivalPages = list.map((f: any) => ({
        url: `${SITE_URL}/festivals/${f.slug}`,
        lastModified: f.updatedAt ? new Date(f.updatedAt) : undefined,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      }));
    }
  } catch {}

  return [...staticPages, ...blogPages, ...productPages, ...festivalPages];
}