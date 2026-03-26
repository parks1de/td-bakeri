import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
    ],
    unoptimized: false,
  },
  async headers() {
    return [
      {
        source: "/api/stripe/webhook",
        headers: [{ key: "Content-Type", value: "application/json" }],
      },
    ];
  },
};

export default nextConfig;
