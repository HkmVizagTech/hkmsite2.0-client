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