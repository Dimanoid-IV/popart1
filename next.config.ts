import type { NextConfig } from "next";
import { getBlogRedirects } from "./src/lib/blog/editorial-policy";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./node_modules/@img/sharp-*/**/*", "./node_modules/sharp/**/*"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return getBlogRedirects();
  },
};

export default nextConfig;
