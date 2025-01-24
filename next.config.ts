import type { NextConfig } from "next";
import { setupDevPlatform } from "@cloudflare/next-on-pages/next-dev";

const nextConfig: NextConfig = {};

// Wrapped in async IIFE to support top-level await in TypeScript
(async () => {
  if (process.env.NODE_ENV === "development") {
    await setupDevPlatform();
  }
})();

export default nextConfig;
