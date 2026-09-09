import type { NextConfig } from "next";
import { BLOG_EDITORIAL_REDIRECTS } from "./src/lib/blog/editorial-policy";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    const removedArticles = [
      {
        slug: "polnoe-rukovodstvo-popart-ee-v-podarok-kak-vybrat-luchshii-variant",
        destination: "/ru/blog/personalnyy-podarok-zhenshchine-estonia",
      },
      {
        slug: "polnoe-rukovodstvo-portret-po-foto-na-holste",
        destination: "/ru/blog/portree-fotost-tallinn",
      },
      {
        slug: "polnoe-rukovodstvo-cifrovaya-zhivopis-iz-fotografii",
        destination: "/ru/blog/portree-fotost-tallinn",
      },
      {
        slug: "polnoe-rukovodstvo-portret-po-foto-v-podarok",
        destination: "/ru/blog/personalnyy-podarok-zhenshchine-estonia",
      },
    ];

    return [
      ...BLOG_EDITORIAL_REDIRECTS.map(({ locale, slug, destinationSlug }) => ({
        source: `/${locale}/blog/${slug}`,
        destination: `/${locale}/blog/${destinationSlug}`,
        permanent: true,
      })),
      ...removedArticles.flatMap(({ slug, destination }) => [
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
