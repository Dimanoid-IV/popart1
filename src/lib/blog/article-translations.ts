import type { BlogLocale } from "./types";

export type ArticleTranslationSlugs = Partial<Record<BlogLocale, string>>;

/**
 * Only confirmed translations with different slugs belong here.
 * Articles that share a slug are matched separately and still validated as published.
 */
const ARTICLE_TRANSLATION_GROUPS: ArticleTranslationSlugs[] = [
  {
    et: "personaalne-kingitus-naisele-eestis",
    ru: "personalnyy-podarok-zhenshchine-estonia",
    en: "personal-gift-for-her-estonia",
  },
];

export function getArticleTranslationCandidates(
  locale: BlogLocale,
  slug: string
): ArticleTranslationSlugs {
  const explicitGroup = ARTICLE_TRANSLATION_GROUPS.find(
    (group) => group[locale] === slug
  );
  return explicitGroup
    ? { ...explicitGroup }
    : { et: slug, ru: slug, en: slug };
}
