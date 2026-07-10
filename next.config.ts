import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
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
};

export default nextConfig;
