import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Smaller images for browsers that support them (falls back to webp/original
  // automatically); Next negotiates via the Accept header per request.
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.harekrishnavizag.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "harekrishnavizag.org",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
      // Cloudflare R2 — hkmsite-media bucket public URL
      {
        protocol: "https",
        hostname: "pub-32ade8e1209149f980ffe2aa4ddc6c99.r2.dev",
        pathname: "/**",
      },
      // Cloudflare R2 — Temple Images bucket (campaigner pages)
      {
        protocol: "https",
        hostname: "pub-f62a54aab54448388c9e16334109aea9.r2.dev",
        pathname: "/**",
      },
      // Gupt Vrindavan Dham — donor privilege images
      {
        protocol: "https",
        hostname: "guptvrindavandham.org",
        pathname: "/**",
      },
      // DigitalOcean Spaces — Vaikuntham admin panel's daily darshan photo
      // uploads (bucket "appdid", region "blr1"), synced in via /darshan.
      // Update this if that bucket/region ever changes.
      {
        protocol: "https",
        hostname: "appdid.blr1.digitaloceanspaces.com",
        pathname: "/**",
      },
    ],
  },
  // Ensures per-icon tree-shaking for large barrel-export libraries so a
  // page importing 3 icons doesn't pull the whole package into its bundle.
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
  // SEO: these 6 sevas now have dedicated, purpose-built pages (richer
  // content, proper metadata/H1/structured data) that fully replace their
  // old generic /donate/[slug] listing. Leaving both URLs live for the same
  // content splits search authority between two competing pages instead of
  // consolidating it onto one (keyword cannibalization) — a real-world
  // ranking penalty for exactly the queries we want these pages to win.
  // 301s here merge any existing backlinks/index signal from the old URL
  // into the new page and stop Google indexing both.
  // Language routing (public pages live under app/[lang]/, prerendered for
  // en and te). Done here rather than in a proxy.ts on purpose: on Vercel,
  // config rewrites run at the edge next to the visitor, while a Next 16
  // proxy always runs as a server function in one region (iad1, USA) — an
  // extra trans-Pacific hop on every page view from India.
  //   /x     -> /en/x, or /te/x when the visitor chose Telugu (hk_lang=te)
  //   /te/x  -> served as-is (Telugu URL Google indexes)
  //   /en/x  -> 308 to /x (below, in redirects)
  // afterFiles: static files and staff pages (/admin, /donations/admin, /api)
  // match first; these apply before the [lang] dynamic route would catch /x.
  async rewrites() {
    const TE = [{ type: "cookie" as const, key: "hk_lang", value: "te" }];
    const PUBLIC = "/:path((?!(?:te|en|admin|api|_next|_vercel)(?:/|$)|donations/admin(?:/|$)).+)";
    return {
      // "/" is its own route (app/page.tsx, the English home); Telugu
      // visitors are sent to /te before that route is matched.
      beforeFiles: [{ source: "/", has: TE, destination: "/te" }],
      afterFiles: [
        { source: PUBLIC, has: TE, destination: "/te/:path" },
        { source: PUBLIC, destination: "/en/:path" },
      ],
      fallback: [],
    };
  },
  async redirects() {
    return [
      // One English URL per page: /en/x is the internal route only.
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/:path*", destination: "/:path*", permanent: true },
      { source: "/donate/gau-seva", destination: "/gau-seva", permanent: true },
      { source: "/donate/anna-daan-seva", destination: "/anna-daan-seva", permanent: true },
      { source: "/donate/square-foot-seva", destination: "/sqft-seva-campaign", permanent: true },
      { source: "/donate/brick-seva", destination: "/brick-seva-campaign", permanent: true },
      { source: "/donate/gita-daan-seva", destination: "/gita-daan-seva", permanent: true },
      { source: "/donate/vastra-seva", destination: "/alankara-vastra-seva", permanent: true },
    ];
  },
};

export default nextConfig;
