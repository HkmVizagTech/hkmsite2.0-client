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
      // TODO: replace with your actual R2 public domain (the value of
      // R2_PUBLIC_URL on Railway) once known, e.g. "media.harekrishnavizag.org"
      // or the *.r2.dev / *.r2.cloudflarestorage.com host Cloudflare gave you.
      {
        protocol: "https",
        hostname: "**.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
