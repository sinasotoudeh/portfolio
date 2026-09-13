import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // On-demand optimization (Vercel in production, sharp under `next start`).
    // AVIF first, WebP for browsers without AVIF support.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
