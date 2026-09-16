/**
 * Fallback content for the /festival index.
 *
 * Festivals are admin-managed records (festivalShowcase). Until one is
 * published for every celebration, we project the temple's own Gaudiya
 * Vaishnava calendar into the same card shape so the page always lists the
 * full festival line-up of the year — Janmashtami, Radhashtami, Ratha Yatra,
 * Diwali, Govardhan Puja, etc. — rather than depending on the admin state or
 * on the (upcoming-only) events helper. Admin records win whenever they exist.
 */

import { vaishnavaCalendar2026 } from "./vaishnavaCalendarData";
import {
  startOfToday,
  pickImageByKeyword,
  pickFestivalHref,
  GENERIC_IMAGES,
} from "./eventsFallback";
import type { FestivalShowcase } from "./festivalShowcase";

/**
 * A festival card for the index. `href` lets fallback items point at real
 * pages (/janmashtami, /radhashtami, …); admin items fall back to
 * /festivals/<slug>.
 */
export type FestivalCardItem = FestivalShowcase & { href?: string };

export function getFallbackFestivals(limit = 0): FestivalCardItem[] {
  const today = startOfToday();

  const festivals = vaishnavaCalendar2026
    .filter((d) => d.type === "Festival")
    .slice()
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(
      (d, i): FestivalCardItem => {
        const image =
          pickImageByKeyword(d.title) || GENERIC_IMAGES[i % GENERIC_IMAGES.length];
        return {
          _id: `calendar-${d.date}-${d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          slug: `calendar-${d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          title: d.title,
          heroImage: image,
          cardImage: image,
          eventDate: d.date,
          location: "Temple Premises",
          description: d.description,
          status: new Date(d.date) >= today ? "upcoming" : "completed",
          featured: false,
          gallery: [],
          schedule: [],
          testimonials: [],
          href: pickFestivalHref(d.title) || "/vaishnav-calendar",
        };
      }
    )
    .filter((_, i) => limit <= 0 || i < limit);

  // Spotlight the next upcoming festival; if the whole year is behind us,
  // spotlight the most recent one so the page never features an empty card.
  const nextIdx = festivals.findIndex((f) => f.status === "upcoming");
  const spotlightIdx = nextIdx >= 0 ? nextIdx : festivals.length - 1;
  if (spotlightIdx >= 0) {
    festivals[spotlightIdx] = { ...festivals[spotlightIdx], featured: true };
  }

  return festivals;
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