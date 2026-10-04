// Daily Darshan photos for the website, sourced from the Hare Krishna
// Vaikuntham community app (same photos and dates devotees see in the app).
// All reads go through the site's own /api/darshan route, which fetches the
// app backend server-side, caches briefly, and falls back to the website
// API's push-synced copy if the app backend is unreachable.

export interface DarshanPhoto {
  vaikunthamId: number;
  imageUrl: string;
  position: number;
  /** The darshan day this photo belongs to (ISO, IST midday). */
  syncedAt: string;
  isMain?: boolean;
  date?: string;
}

interface ApiPhoto {
  id: number;
  imageUrl: string;
  date: string;
  isMain: boolean;
}

const toDarshanPhoto = (p: ApiPhoto, i: number): DarshanPhoto => ({
  vaikunthamId: p.id,
  imageUrl: p.imageUrl,
  position: i,
  // Midday IST so any timezone formats it as the same calendar day.
  syncedAt: `${p.date}T12:00:00+05:30`,
  isMain: p.isMain,
  date: p.date,
});

async function load(query = ""): Promise<DarshanPhoto[]> {
  const url = `/api/darshan${query}`;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      const photos: ApiPhoto[] = Array.isArray(json?.photos) ? json.photos : [];
      return photos.map(toDarshanPhoto);
    } catch (err) {
      if (attempt === 1) {
        console.warn("darshan: failed to load photos", err instanceof Error ? err.message : err);
      } else {
        await new Promise((r) => setTimeout(r, 300));
      }
    }
  }
  return [];
}

/** Photos of the latest darshan day (main photo first). */
export const getDarshanPhotos = (): Promise<DarshanPhoto[]> => load();

/** Photos of one darshan day (YYYY-MM-DD). */
export const getDarshanForDate = (date: string): Promise<DarshanPhoto[]> =>
  load(`?date=${encodeURIComponent(date)}`);

/** Photos from the N most recent darshan days (for the gallery's date strip). */
export const getRecentDarshan = (days = 14): Promise<DarshanPhoto[]> => load(`?days=${days}`);
