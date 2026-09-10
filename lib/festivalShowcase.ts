/**
 * Content for the /festival index and /festivals/[slug] showcase pages.
 *
 * Festivals are fully admin-managed records on the server (festivalShowcase
 * collection). Each one carries its own hero banner, gallery, schedule,
 * recap details and testimonials, so admins can build out a rich page for
 * Janmashtami, Radhashtami, Laksha Deepotsav, etc. without code changes.
 */

export type ScheduleItem = {
  start?: string;
  title?: string;
  description?: string;
};

export type DetailSection = {
  heading?: string;
  body?: string;
  image?: string;
};

export type Testimonial = {
  name?: string;
  role?: string;
  message?: string;
  rating?: number;
  avatar?: string;
};

export type FestivalShowcase = {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  heroImage?: string;
  cardImage?: string;
  eventDate?: string;
  location?: string;
  description?: string;
  status?: "upcoming" | "completed" | "annual";
  featured?: boolean;
  active?: boolean;
  ctaLabel?: string;
  ctaHref?: string;
  gallery?: string[];
  schedule?: ScheduleItem[];
  details?: DetailSection[];
  testimonials?: Testimonial[];
  createdAt?: string;
  updatedAt?: string;
};

const API_BASE =
  (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") ||
  "http://localhost:3003";

/** All active festivals for the /festival index (featured sorted first). */
export async function fetchFestivalShowcases(): Promise<FestivalShowcase[]> {
  try {
    const res = await fetch(`${API_BASE}/festival-showcases/public`, {
      cache: "no-store",
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** A single showcase for /festivals/[slug]; null when missing/inactive. */
export async function fetchFestivalShowcase(slug: string): Promise<FestivalShowcase | null> {
  try {
    const res = await fetch(`${API_BASE}/festival-showcases/${encodeURIComponent(slug)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data || null;
  } catch {
    return null;
  }
}

export const showFallbackImage =
  "https://pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev/media-library/1789035782586-1789035781981-event-radhashtami.webp";

export const festivalStatusLabel: Record<string, string> = {
  upcoming: "Upcoming",
  completed: "Recap",
  annual: "Annual",
};