import { NextResponse, type NextRequest } from "next/server";

/**
 * Daily Darshan for the website, read straight from the Hare Krishna
 * Vaikuntham community app's backend — the same photos, grouped by the same
 * dates, that devotees see in the app. The app is the single source of
 * truth; nothing has to be copied or kept in sync.
 *
 *   GET /api/darshan                 → latest darshan day (all its photos)
 *   GET /api/darshan?date=YYYY-MM-DD → that day's photos
 *   GET /api/darshan?days=N          → photos of the N most recent days
 *
 * Fetched server-side (no CORS involved) and cached for a couple of
 * minutes. If the app backend is unreachable we fall back to the copy the
 * website's own API keeps (fed by the panel's push sync), so the homepage
 * never goes blank because of one upstream hiccup.
 */

const COMMUNITY_API = (process.env.COMMUNITY_API_URL || "https://harekrishnavizag.co.in").replace(/\/+$/, "");
const SITE_API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");
const REVALIDATE_SECONDS = 120;

interface AppDarshanRow {
  id: number;
  image: string | null;
  date: string | null;
  is_main?: boolean;
  status?: string;
  created_at?: string;
}

export interface DarshanPhotoOut {
  id: number;
  imageUrl: string;
  date: string; // YYYY-MM-DD (IST day the photo belongs to)
  isMain: boolean;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

async function fetchAppPage(page: number, date?: string): Promise<{ rows: AppDarshanRow[]; hasMore: boolean }> {
  const qs = new URLSearchParams({ page: String(page) });
  if (date) qs.set("date", date);
  const res = await fetch(`${COMMUNITY_API}/api/v1/user/basic/daily-darshan?${qs}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: REVALIDATE_SECONDS },
  });
  if (!res.ok) throw new Error(`community app responded ${res.status}`);
  const json = await res.json();
  const rows: AppDarshanRow[] = Array.isArray(json?.data?.data) ? json.data.data : [];
  return { rows, hasMore: Boolean(json?.data?.next_page_url) };
}

function toPhoto(r: AppDarshanRow): DarshanPhotoOut | null {
  if (!r?.image || !/^https?:\/\//i.test(r.image)) return null;
  const date = (r.date || r.created_at || "").slice(0, 10);
  if (!DATE_RE.test(date)) return null;
  return { id: r.id, imageUrl: r.image, date, isMain: Boolean(r.is_main) };
}

// Main photo first, then newest upload first — the order the app uses.
const byDisplayOrder = (a: DarshanPhotoOut, b: DarshanPhotoOut) =>
  Number(b.isMain) - Number(a.isMain) || b.id - a.id;

/** All photos for one day (the app paginates 12 per page). */
async function fetchDay(date: string): Promise<DarshanPhotoOut[]> {
  const out: DarshanPhotoOut[] = [];
  for (let page = 1; page <= 5; page++) {
    const { rows, hasMore } = await fetchAppPage(page, date);
    for (const r of rows) {
      const p = toPhoto(r);
      if (p) out.push(p);
    }
    if (!hasMore) break;
  }
  return out.sort(byDisplayOrder);
}

/** Photos from the N most recent darshan days. */
async function fetchRecentDays(days: number): Promise<DarshanPhotoOut[]> {
  const out: DarshanPhotoOut[] = [];
  const seenDates = new Set<string>();
  for (let page = 1; page <= 10; page++) {
    const { rows, hasMore } = await fetchAppPage(page);
    for (const r of rows) {
      const p = toPhoto(r);
      if (!p) continue;
      if (!seenDates.has(p.date)) {
        if (seenDates.size >= days) return out;
        seenDates.add(p.date);
      }
      out.push(p);
    }
    if (!hasMore) break;
  }
  return out;
}

/** Fallback: the website API's own copy (push-synced from the panel). */
async function fetchSiteFallback(): Promise<DarshanPhotoOut[]> {
  if (!SITE_API) return [];
  const res = await fetch(`${SITE_API}/darshan`, { next: { revalidate: REVALIDATE_SECONDS } });
  if (!res.ok) return [];
  const json = await res.json();
  const items: { vaikunthamId: number; imageUrl: string; position: number; syncedAt?: string }[] = json?.items ?? [];
  return items
    .filter((i) => i?.imageUrl)
    .sort((a, b) => a.position - b.position)
    .map((i) => ({
      id: Number(i.vaikunthamId),
      imageUrl: i.imageUrl,
      date: (i.syncedAt || new Date().toISOString()).slice(0, 10),
      isMain: false,
    }));
}

export async function GET(req: NextRequest) {
  const params = req.nextUrl.searchParams;
  const date = params.get("date") || "";
  const days = Math.min(30, Math.max(1, Number(params.get("days")) || 0));

  try {
    let photos: DarshanPhotoOut[];
    if (date) {
      if (!DATE_RE.test(date)) {
        return NextResponse.json({ message: "date must be YYYY-MM-DD" }, { status: 400 });
      }
      photos = await fetchDay(date);
    } else if (params.has("days")) {
      photos = await fetchRecentDays(days);
    } else {
      // Latest day: find it from page 1, then load that whole day.
      const { rows } = await fetchAppPage(1);
      const latest = rows.map(toPhoto).find(Boolean)?.date;
      photos = latest ? await fetchDay(latest) : [];
    }
    return NextResponse.json(
      { source: "community-app", date: date || photos[0]?.date || null, photos },
      { headers: { "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=600` } }
    );
  } catch (err) {
    console.warn("darshan: community app unavailable, using website copy —", err instanceof Error ? err.message : err);
    const photos = await fetchSiteFallback().catch(() => []);
    return NextResponse.json(
      { source: "website", date: photos[0]?.date || null, photos },
      { headers: { "Cache-Control": "public, s-maxage=60" } }
    );
  }
}
