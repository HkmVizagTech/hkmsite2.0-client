/*
 * Google Places API (New), used by the temple guide (/temples) to show each temple's live Google rating, opening
 * hours, visitor photos and reviews — always credited to Google and the contributor, as Google's terms require.
 *
 * Set GOOGLE_PLACES_API_KEY (server-only; restrict it to the Places API in Google Cloud). Without it every function
 * returns null and the pages simply leave the Google section out.
 *
 * Cost control: the place id lookup uses the free "IDs only" field mask and is remembered for 30 days; details are
 * refreshed once a day per temple; photos go through /api/place-photo, which the CDN caches.
 */

const KEY = process.env.GOOGLE_PLACES_API_KEY;
const BASE = "https://places.googleapis.com/v1";

export type PlaceReview = {
  author: string;
  authorUri?: string;
  authorPhoto?: string;
  rating: number;
  when: string; // e.g. "2 months ago"
  text: string;
};
export type PlacePhoto = { name: string; author?: string; authorUri?: string };
export type PlaceInfo = {
  id: string;
  rating?: number;
  ratingCount?: number;
  mapsUri?: string;
  address?: string;
  hours?: string[]; // "Monday: 5:00 AM – 9:00 PM"
  reviews: PlaceReview[];
  photos: PlacePhoto[];
  lat?: number;
  lng?: number;
};

type RawPlace = {
  id: string;
  rating?: number;
  userRatingCount?: number;
  googleMapsUri?: string;
  formattedAddress?: string;
  location?: { latitude: number; longitude: number };
  regularOpeningHours?: { weekdayDescriptions?: string[] };
  reviews?: {
    rating?: number;
    relativePublishTimeDescription?: string;
    text?: { text?: string };
    originalText?: { text?: string };
    authorAttribution?: { displayName?: string; uri?: string; photoUri?: string };
  }[];
  photos?: { name: string; authorAttributions?: { displayName?: string; uri?: string }[] }[];
};

async function placeId(query: string): Promise<string | null> {
  if (!KEY) return null;
  try {
    const r = await fetch(`${BASE}/places:searchText`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Goog-Api-Key": KEY, "X-Goog-FieldMask": "places.id" },
      body: JSON.stringify({ textQuery: query, regionCode: "IN", languageCode: "en", pageSize: 1 }),
      next: { revalidate: 60 * 60 * 24 * 30 },
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { places?: { id: string }[] };
    return j.places?.[0]?.id ?? null;
  } catch {
    return null;
  }
}

/** Live Google details for a temple, found by a Maps text query. Null when no key is set or Google fails. */
export async function getPlace(query: string): Promise<PlaceInfo | null> {
  const id = await placeId(query);
  if (!id || !KEY) return null;
  try {
    const r = await fetch(`${BASE}/places/${id}?languageCode=en`, {
      headers: {
        "X-Goog-Api-Key": KEY,
        "X-Goog-FieldMask": "id,rating,userRatingCount,googleMapsUri,formattedAddress,location,regularOpeningHours.weekdayDescriptions,reviews,photos",
      },
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!r.ok) return null;
    const p = (await r.json()) as RawPlace;
    return {
      id: p.id,
      rating: p.rating,
      ratingCount: p.userRatingCount,
      mapsUri: p.googleMapsUri,
      address: p.formattedAddress,
      hours: p.regularOpeningHours?.weekdayDescriptions,
      lat: p.location?.latitude,
      lng: p.location?.longitude,
      reviews: (p.reviews ?? [])
        .map((v) => ({
          author: v.authorAttribution?.displayName ?? "Google user",
          authorUri: v.authorAttribution?.uri,
          authorPhoto: v.authorAttribution?.photoUri,
          rating: v.rating ?? 0,
          when: v.relativePublishTimeDescription ?? "",
          text: (v.text?.text ?? v.originalText?.text ?? "").trim(),
        }))
        .filter((v) => v.text),
      photos: (p.photos ?? []).slice(0, 8).map((ph) => ({
        name: ph.name,
        author: ph.authorAttributions?.[0]?.displayName,
        authorUri: ph.authorAttributions?.[0]?.uri,
      })),
    };
  } catch {
    return null;
  }
}

/** Our own URL for a Google photo (the server route adds the key and redirects to Google's image). */
export function placePhotoUrl(name: string, width = 1200) {
  return `/api/place-photo?name=${encodeURIComponent(name)}&w=${width}`;
}

/** Fetches the short-lived Google image URL for a photo resource name. */
export async function resolvePhoto(name: string, width: number): Promise<string | null> {
  if (!KEY || !/^places\/[^/]+\/photos\/[^/]+$/.test(name)) return null;
  const w = Math.max(200, Math.min(1600, Math.round(width) || 1200));
  try {
    const r = await fetch(`${BASE}/${name}/media?maxWidthPx=${w}&skipHttpRedirect=true`, {
      headers: { "X-Goog-Api-Key": KEY },
      next: { revalidate: 60 * 60 * 24 },
    });
    if (!r.ok) return null;
    const j = (await r.json()) as { photoUri?: string };
    return j.photoUri ?? null;
  } catch {
    return null;
  }
}

/** A plain Google Maps search link (works without any key). */
export function mapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}
