import type { BlogLocale } from "./types";

export type BlogEditorialRedirect = {
  locale: BlogLocale;
  slug: string;
  destinationSlug: string;
};

// These legacy pages were extremely short, duplicated another article, or both.
// Keep the source files for editorial history while consolidating their search intent.
export const BLOG_EDITORIAL_REDIRECTS: BlogEditorialRedirect[] = [
  { locale: "ru", slug: "sonbrapaeva-kingitus-paarile", destinationSlug: "portret-po-foto-podarok-na-svadbu" },
  { locale: "ru", slug: "emadepaeva-kingitus", destinationSlug: "portret-mame-po-foto-na-holste" },
  { locale: "ru", slug: "isadepaeva-kingitus", destinationSlug: "portret-pape-po-foto-podarok" },
  { locale: "ru", slug: "tellimus-tallinnas-tarne", destinationSlug: "portree-fotost-tallinn" },
  { locale: "ru", slug: "interjoor-portree-sein", destinationSlug: "portree-suurus-ja-paigutus-interjooris" },
  { locale: "ru", slug: "canvas-gift-tallinn", destinationSlug: "portret-na-holste-podarok-na-yubiley" },
  { locale: "ru", slug: "seinapilt-tellimine", destinationSlug: "portree-suurus-ja-paigutus-interjooris" },
  { locale: "ru", slug: "pilt-louendil", destinationSlug: "portree-suurus-ja-paigutus-interjooris" },
  { locale: "ru", slug: "kingitus-mehele", destinationSlug: "portret-pape-po-foto-podarok" },
  { locale: "ru", slug: "kingitus-naisele", destinationSlug: "personalnyy-podarok-zhenshchine-estonia" },
  { locale: "ru", slug: "personaalne-kingitus", destinationSlug: "personalnyy-podarok-zhenshchine-estonia" },
  { locale: "ru", slug: "kingitus-synnipaevaks", destinationSlug: "portret-na-holste-podarok-na-yubiley" },
  { locale: "ru", slug: "pulmakingitus-idee", destinationSlug: "portret-po-foto-podarok-na-svadbu" },
  { locale: "ru", slug: "kunstiline-portree", destinationSlug: "portree-fotost-tallinn" },
  { locale: "ru", slug: "custom-portrait-estonia", destinationSlug: "portree-fotost-tallinn" },
  { locale: "ru", slug: "custom-art-portrait-estonia", destinationSlug: "portree-fotost-tallinn" },
  { locale: "ru", slug: "dream-art-portree", destinationSlug: "portree-fotost-tallinn" },
  { locale: "ru", slug: "dream-art-portree-fotost", destinationSlug: "portree-fotost-tallinn" },
  { locale: "ru", slug: "digitaalne-kunstiline-portree", destinationSlug: "portree-fotost-tallinn" },
  { locale: "ru", slug: "fantaasia-portree-fotost", destinationSlug: "portree-fotost-tallinn" },
  { locale: "ru", slug: "dream-art-pilt-louendil", destinationSlug: "portree-suurus-ja-paigutus-interjooris" },
  { locale: "ru", slug: "joulukingitus-2026", destinationSlug: "portret-na-holste-podarok-roditelyam" },
  { locale: "ru", slug: "joulukingitus-mehele", destinationSlug: "portret-pape-po-foto-podarok" },
  { locale: "ru", slug: "joulukingitus-naisele", destinationSlug: "personalnyy-podarok-zhenshchine-estonia" },
];

const archivedArticleKeys = new Set(
  BLOG_EDITORIAL_REDIRECTS.map(({ locale, slug }) => `${locale}:${slug}`)
);

export function isEditoriallyPublished(locale: BlogLocale, slug: string) {
  return !archivedArticleKeys.has(`${locale}:${slug}`);
}
