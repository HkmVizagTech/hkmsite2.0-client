import { NextResponse, type NextRequest } from "next/server";
import { resolvePhoto } from "@/lib/places";

/**
 * A Google Places photo for the temple guide, without exposing our API key:
 *   GET /api/place-photo?name=places/<id>/photos/<ref>&w=1200  → 302 to Google's image
 * The redirect is cached by the CDN for a day, so each photo costs one Google request per day at most.
 */
export async function GET(req: NextRequest) {
  const name = req.nextUrl.searchParams.get("name") ?? "";
  const w = Number(req.nextUrl.searchParams.get("w") ?? 1200);
  const uri = await resolvePhoto(name, w);
  if (!uri) return new NextResponse("Not found", { status: 404, headers: { "Cache-Control": "public, max-age=300" } });
  return NextResponse.redirect(uri, {
    status: 302,
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400, stale-while-revalidate=86400" },
  });
}
