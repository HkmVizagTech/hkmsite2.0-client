// Short campaign links: harekrishnavizag.org/go/<name> sends the visitor to the page the link was made for,
// with its full UTM tags in the address bar (so the donation is credited to the campaign as usual).
// Links are made in Admin → Donations → UTM Builder and stored on the server; nothing to deploy for a new one.

export const dynamic = "force-dynamic";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

const redirectTo = (path: string) =>
  new Response(null, {
    status: 302,
    headers: {
      // Relative on purpose: it always stays on whatever address the visitor used.
      Location: path,
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });

export async function GET(req: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  try {
    const res = await fetch(`${API_URL}/short-links/resolve/${encodeURIComponent(code)}`, {
      cache: "no-store",
      headers: { "x-visitor-ua": req.headers.get("user-agent") || "" },
    });
    if (res.ok) {
      const data = (await res.json()) as { path?: string };
      // Only ever a path on this site.
      if (data.path && data.path.startsWith("/") && !data.path.startsWith("//")) return redirectTo(data.path);
    }
  } catch {
    // fall through to the home page
  }
  return redirectTo("/");
}
