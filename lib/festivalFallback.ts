/**
 * Fallback content for the /festival index.
 *
 * Festivals are admin-managed records (festivalShowcase). Until the admin
 * publishes any, we project the temple's own Gaudiya Vaishnava calendar into
 * the same card shape so the page always has real, accurate festivals —
 * Janmashtami, Radhashtami, etc. Admin records win whenever they exist.
 */

import { getFallbackEvents, type FallbackEvent } from "./eventsFallback";
import type { FestivalShowcase } from "./festivalShowcase";

/**
 * A festival card for the index. `href` lets fallback items point at real
 * pages (/janmashtami, /radhashtami, …); admin items fall back to
 * /festivals/<slug>.
 */
export type FestivalCardItem = FestivalShowcase & { href?: string };

export function getFallbackFestivals(limit = 12): FestivalCardItem[] {
  return getFallbackEvents(limit).map(
    ({ _id, title, date, description, image, location, href }: FallbackEvent) => ({
      _id,
      title,
      slug: `calendar-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      heroImage: image,
      cardImage: image,
      eventDate: date,
      location,
      description,
      status: "upcoming",
      featured: false,
      gallery: [],
      schedule: [],
      testimonials: [],
      href,
    })
  );
}

/**
 * Normalise a title for de-duplication — lowercased, non-alphanumerics out,
 * so "Govardhan Puja / Annakut Mahotsav" and "Govardhan Puja" match.
 */
const normTitle = (title?: string) =>
  String(title || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/**
 * Merge admin-published festival showcases with the calendar-derived fallback.
 *
 * The /festival index is admin-managed: when a Radhashtami showcase is
 * published it wins and the page shows only that one. But the Vaishnava
 * calendar (which already knows about Janmashtami, Radhashtami, Govardhan
 * Puja, etc.) should always fill in the rest of the festival line-up, so the
 * page never silently drops a festival with a dedicated page
 * (e.g. /govardhan-puja) just because no admin showcase exists yet.
 *
 * Admin records always take precedence: any calendar item whose title matches
 * a published showcase is skipped.
 */
export function mergeFestivalCards(
  admin: FestivalCardItem[],
  fallback: FestivalCardItem[]
): FestivalCardItem[] {
  const adminTitles = new Set(admin.map((f) => normTitle(f.title)));

  const uniqueAdmin = admin.reduce<FestivalCardItem[]>((acc, f) => {
    const key = `${normTitle(f.title)}-${String(f.eventDate || "").slice(0, 7)}`;
    if (!acc.some((e) => `${normTitle(e.title)}-${String(e.eventDate || "").slice(0, 7)}` === key)) {
      acc.push(f);
    }
    return acc;
  }, []);

  const missing = fallback.filter((f) => !adminTitles.has(normTitle(f.title)));

  return [...uniqueAdmin, ...missing];
}