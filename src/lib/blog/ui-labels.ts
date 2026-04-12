import type { BlogLocale } from "./types";

export type BlogUiLabels = {
  blogTitle: string;
  blogIntro: string;
  readMore: string;
  authorTitle: string;
  faqHeading: string;
  internalLinksHeading: string;
  relatedHeading: string;
  readingTime: (minutes: number) => string;
  breadcrumbBlog: string;
  categoriesHeading: string;
  emptyCategory: string;
};

const LABELS: Record<BlogLocale, BlogUiLabels> = {
  et: {
    blogTitle: "PopArt.ee blogi",
    blogIntro:
      "Nõuanded ja ideed kohandatud kunstiliste portreedega Eestis — digitaalmaal, lõuend ja kingitused.",
    readMore: "Loe edasi",
    authorTitle: "Autor",
    faqHeading: "Korduma kippuvad küsimused",
    internalLinksHeading: "Soovitame lugeda",
    relatedHeading: "Seotud artiklid",
    readingTime: (m) => `${m} min lugemist`,
    breadcrumbBlog: "Blogi",
    categoriesHeading: "Kategooriad",
    emptyCategory: "Selles kategoorias pole veel artikleid.",
  },
  ru: {
    blogTitle: "Блог PopArt.ee",
    blogIntro:
      "Советы и идеи по индивидуальным художественным портретам в Эстонии — цифровая живопись, холст и подарки.",
    readMore: "Читать далее",
    authorTitle: "Автор",
    faqHeading: "Частые вопросы",
    internalLinksHeading: "Почитайте также",
    relatedHeading: "Похожие статьи",
    readingTime: (m) => `${m} мин. чтения`,
    breadcrumbBlog: "Блог",
    categoriesHeading: "Категории",
    emptyCategory: "В этой категории пока нет статей.",
  },
  en: {
    blogTitle: "PopArt.ee Blog",
    blogIntro:
      "Tips and ideas for custom artistic portraits in Estonia — digital painting, canvas prints, and gifts.",
    readMore: "Read more",
    authorTitle: "Author",
    faqHeading: "Frequently asked questions",
    internalLinksHeading: "Recommended reading",
    relatedHeading: "Related articles",
    readingTime: (m) => `${m} min read`,
    breadcrumbBlog: "Blog",
    categoriesHeading: "Categories",
    emptyCategory: "No articles in this category yet.",
  },
};

export function getBlogUiLabels(locale: BlogLocale): BlogUiLabels {
  return LABELS[locale];
}
