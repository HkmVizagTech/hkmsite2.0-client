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
    ],
  },
  // Ensures per-icon tree-shaking for large barrel-export libraries so a
  // page importing 3 icons doesn't pull the whole package into its bundle.
  experimental: {
    optimizePackageImports: ["lucide-react", "recharts"],
  },
};

export default nextConfig;
