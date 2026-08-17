import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    const removedArticles = [
      {
        slug: "polnoe-rukovodstvo-popart-ee-v-podarok-kak-vybrat-luchshii-variant",
        destination: "/ru/blog/personaalne-kingitus",
      },
      {
        slug: "polnoe-rukovodstvo-portret-po-foto-na-holste",
        destination: "/ru/blog/portree-fotost-tallinn",
      },
      {
        slug: "polnoe-rukovodstvo-cifrovaya-zhivopis-iz-fotografii",
        destination: "/ru/blog/digitaalne-kunstiline-portree",
      },
      {
        slug: "polnoe-rukovodstvo-portret-po-foto-v-podarok",
        destination: "/ru/blog/personaalne-kingitus",
      },
    ];

    return [
      ...removedArticles.flatMap(({ slug, destination }) => [
        { source: `/ru/blog/${slug}`, destination, permanent: true },
        { source: `/blog/${slug}`, destination, permanent: true },
      ]),
      { source: "/blog", destination: "/et/blog", permanent: true },
      { source: "/blog/:slug", destination: "/ru/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
