import type { NextConfig } from "next";

// When NEXT_PUBLIC_DEMO_MODE is set, build a fully-static export
// (no API route, no server runtime) suitable for any static host.
// In normal builds (e.g. Vercel), the API route is included and powers
// the generator.
const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === "true";

const nextConfig: NextConfig = {
  ...(isDemo
    ? {
        output: "export",
        images: { unoptimized: true },
        trailingSlash: true,
      }
    : {}),
};

export default nextConfig;
