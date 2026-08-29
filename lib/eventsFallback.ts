/**
 * Fallback content for the /events page.
 *
 * Events on the site are admin-created and served from the API. When the
 * admin hasn't published any (which is the normal state between festival
 * seasons), the page used to render a bare "No events found" — an empty
 * page for one of the most-visited sections of the site.
 *
 * The temple already ships a full Gaudiya Vaishnava calendar for the year
 * (lib/vaishnavaCalendarData.ts), which is exactly the information a
 * visitor asking "what's coming up at the temple?" wants. These helpers
 * project that calendar into the shapes the events page already renders,
 * so the page always has real, accurate content. Admin-created events
 * still win whenever they exist.
 */

import {
  vaishnavaCalendar2026,
  type VaishnavaDate,
} from "./vaishnavaCalendarData";

export type FallbackEvent = {
  _id: string;
  title: string;
  date: string;
  description?: string;
  image?: string;
  location?: string;
  /** Where the card links to — a real page on this site, never a dead /events/<id>. */
  href: string;
  /** Marks the item as calendar-derived rather than admin-created. */
  isFallback: true;
};

export type FallbackImportantDate = {
  _id: string;
  title: string;
  date: string;
  description?: string;
  type: "Ekadashi" | "Festival" | "Other";
};

/**
 * Festival banners we already ship in /public/assets. Matched on a
 * lowercase substring of the title; first match wins, so keep the more
 * specific keys above the generic ones.
 */
const IMAGE_BY_KEYWORD: Array<[string, string]> = [
  ["janmashtami", "/assets/home-event-janmashtami.webp"],
  ["radhashtami", "/assets/home-event-radhashtami.webp"],
  ["gita jayanti", "/assets/home-event-gita-jayanti.webp"],
  ["nandotsav", "/assets/home-event-janmashtami.webp"],
  ["govardhan", "/assets/gallery-festival-1.jpg"],
  ["annakut", "/assets/gallery-festival-1.jpg"],
  ["diwali", "/assets/gallery-aarti.jpg"],
  ["dipavali", "/assets/gallery-aarti.jpg"],
  ["rath yatra", "/assets/home-banner-jagannatha-rath-yatra.webp"],
  ["rasa yatra", "/assets/home-gallery-radha-krishna.webp"],
  ["gaura purnima", "/assets/gallery-festival-1.jpg"],
  ["ekadashi", "/assets/gallery-darshan-1.jpg"],
];

const DEFAULT_IMAGE = "/assets/gallery-festival-2.jpg";

/** Festivals that have a dedicated page on this site. */
const HREF_BY_KEYWORD: Array<[string, string]> = [
  ["janmashtami", "/janmashtami"],
  ["nandotsav", "/janmashtami"],
];

function pick(list: Array<[string, string]>, title: string): string | undefined {
  const t = title.toLowerCase();
  return list.find(([keyword]) => t.includes(keyword))?.[1];
}

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function upcoming(): VaishnavaDate[] {
  const today = startOfToday();
  return vaishnavaCalendar2026
    .filter((d) => new Date(d.date) >= today)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

/**
 * Upcoming celebrations for the events grid.
 *
 * Only Festivals are surfaced as "events" — appearance/disappearance days
 * and Ekadashis are observances, and they're already listed in full in the
 * Important Dates section below the grid.
 */
export function getFallbackEvents(limit = 12): FallbackEvent[] {
  return upcoming()
    .filter((d) => d.type === "Festival")
    .slice(0, limit)
    .map((d) => ({
      _id: `calendar-${d.date}`,
      title: d.title,
      date: d.date,
      description: d.description,
      image: pick(IMAGE_BY_KEYWORD, d.title) || DEFAULT_IMAGE,
      location: "Temple Premises",
      href: pick(HREF_BY_KEYWORD, d.title) || "/vaishnav-calendar",
      isFallback: true as const,
    }));
}

/**
 * Upcoming Ekadashis, festivals and observances for the Important Dates
 * section. Capped to roughly the next quarter so the three-column month
 * layout stays readable.
 */
export function getFallbackImportantDates(monthsAhead = 3): FallbackImportantDate[] {
  const cutoff = startOfToday();
  cutoff.setMonth(cutoff.getMonth() + monthsAhead);

  return upcoming()
    .filter((d) => new Date(d.date) <= cutoff)
    .map((d) => ({
      _id: `calendar-${d.date}-${d.title}`,
      title: d.title,
      date: d.date,
      description: d.description,
      type:
        d.type === "Ekadashi"
          ? ("Ekadashi" as const)
          : d.type === "Festival"
            ? ("Festival" as const)
            : ("Other" as const),
    }));
}
