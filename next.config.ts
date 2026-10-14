import type { NextConfig } from "next";
import {
  BLOG_EDITORIAL_REDIRECTS,
  BLOG_REMOVED_ARTICLE_REDIRECTS,
} from "./src/lib/blog/editorial-policy";

const nextConfig: NextConfig = {
  outputFileTracingIncludes: {
    "/*": ["./node_modules/@img/sharp-*/**/*", "./node_modules/sharp/**/*"],
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      ...BLOG_EDITORIAL_REDIRECTS.map(({ locale, slug, destinationSlug }) => ({
        source: `/${locale}/blog/${slug}`,
        destination: `/${locale}/blog/${destinationSlug}`,
        permanent: true,
      })),
      ...BLOG_REMOVED_ARTICLE_REDIRECTS.flatMap(({ slug, destination }) => [
        { source: `/ru/blog/${slug}`, destination, permanent: true },
        { source: `/blog/${slug}`, destination, permanent: true },
      ]),
      { source: "/blog", destination: "/et/blog", permanent: true },
      { source: "/blog/:slug", destination: "/ru/blog/:slug", permanent: true },
      { source: "/en", destination: "/", permanent: true },
      { source: "/en/privacy", destination: "/privacy", permanent: true },
      { source: "/en/terms", destination: "/terms", permanent: true },
      { source: "/en/delivery", destination: "/delivery", permanent: true },
    ];
  },
};

export default nextConfig;
