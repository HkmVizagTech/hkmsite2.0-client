// Home page hero banners, fetched on the server (cached 5 minutes) so the
// first banner is in the initial HTML. The carousel used to fetch them in the
// browser after the page became interactive and then swap its slides, which
// made the banner the last thing to appear on phones (~7 s LCP).
import type { TempleCarouselSlide } from "@/components/TempleCarousel";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

/** Admin-managed banners, or null to fall back to the carousel's own loading. */
export async function getHeroSlides(): Promise<TempleCarouselSlide[] | null> {
  try {
    const res = await fetch(`${API_URL}/hero-banners`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data.banners) || data.banners.length === 0) return null;
    return data.banners.map((b: { desktopImage: string; mobileImage: string; title: string; linkUrl?: string }) => ({
      src: b.desktopImage,
      mobileSrc: b.mobileImage,
      title: b.title,
      linkUrl: b.linkUrl || "",
    }));
  } catch {
    return null;
  }
}
