import { LOCALES } from "@/lib/i18n/config";
import { SITE_URL } from "@/lib/seo";
import { WEB_STORIES, getWebStory } from "@/lib/webStories";

/**
 * A web story is an AMP page (the format Google surfaces in Search and Discover),
 * so it is a standalone HTML document rather than a React page: no site header,
 * no site scripts, just <amp-story>.
 */

const PUBLISHER = "ISKCON Gambheeram, Visakhapatnam";
const LOGO = `${SITE_URL}/assets/web-story-logo.png`;
const PAGE_SECONDS = 7;

export function generateStaticParams() {
  return LOCALES.flatMap((lang) => WEB_STORIES.map((s) => ({ lang, slug: s.slug })));
}

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const CSS = `
amp-story{font-family:Georgia,'Times New Roman',serif}
.shade{background:linear-gradient(to top,rgba(5,8,24,.92) 0%,rgba(5,8,24,.6) 45%,rgba(5,8,24,0) 100%)}
.text{align-content:end;padding:0 24px 56px;color:#fff}
.text h3{margin:0 0 10px;font-size:26px;line-height:1.2;font-weight:700;text-shadow:0 1px 8px rgba(0,0,0,.5)}
.text p,.text li{margin:0 0 8px;font-size:17px;line-height:1.45;text-shadow:0 1px 6px rgba(0,0,0,.5)}
.text ul,.text ol{margin:0 0 8px;padding-left:20px}
.brand{align-content:start;padding:18px 18px 0}
.brand span{display:inline-block;font-size:12px;letter-spacing:.06em;color:#fff;background:rgba(5,8,24,.55);border-radius:999px;padding:5px 12px}
`;

export async function GET(_req: Request, { params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { slug } = await params;
  const story = getWebStory(slug);
  if (!story) return new Response("Not found", { status: 404 });

  const url = `${SITE_URL}/web-stories/${story.slug}`;

  const pages = story.pages
    .map((p, i) => {
      const heading = p.heading ? `<h3>${esc(p.heading)}</h3>` : "";
      return `<amp-story-page id="p${i + 1}" auto-advance-after="${PAGE_SECONDS}s">
<amp-story-grid-layer template="fill"><amp-img src="${esc(p.image)}" width="${p.w}" height="${p.h}" layout="fill" object-fit="cover" alt="${esc(p.heading || story.title)}"></amp-img></amp-story-grid-layer>
<amp-story-grid-layer template="fill"><div class="shade"></div></amp-story-grid-layer>
<amp-story-grid-layer template="vertical" class="brand"><span>${esc(PUBLISHER)}</span></amp-story-grid-layer>
<amp-story-grid-layer template="vertical" class="text">${heading}${p.text}</amp-story-grid-layer>
</amp-story-page>`;
    })
    .join("\n");

  const html = `<!doctype html>
<html amp lang="en">
<head>
<meta charset="utf-8">
<title>${esc(story.title)} | ${esc(PUBLISHER)}</title>
<link rel="canonical" href="${url}">
<meta name="viewport" content="width=device-width,minimum-scale=1,initial-scale=1">
<meta name="description" content="${esc(story.description)}">
<meta property="og:title" content="${esc(story.title)}">
<meta property="og:description" content="${esc(story.description)}">
<meta property="og:image" content="${esc(story.poster)}">
<meta property="og:url" content="${url}">
<meta property="og:type" content="article">
<style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
<script async src="https://cdn.ampproject.org/v0.js"></script>
<script async custom-element="amp-story" src="https://cdn.ampproject.org/v0/amp-story-1.0.js"></script>
<style amp-custom>${CSS}</style>
</head>
<body>
<amp-story standalone title="${esc(story.title)}" publisher="${esc(PUBLISHER)}" publisher-logo-src="${LOGO}" poster-portrait-src="${esc(story.poster)}">
${pages}
</amp-story>
</body>
</html>`;

  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
    },
  });
}
