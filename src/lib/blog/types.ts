export type BlogLocale = "et" | "ru" | "en";

export type BlogAuthor = {
  name: string;
  url?: string;
  jobTitle?: string;
};

export type BlogFaqItem = {
  question: string;
  answer: string;
};

export type BlogInternalLink = {
  href: string;
  label: string;
};

export type BlogArticle = {
  slug: string;
  locale: BlogLocale;
  title: string;
  description: string;
  publishedAt: string;
  updatedAt?: string;
  author: BlogAuthor;
  coverImage: string;
  keywords: string[];
  bodyHtml: string;
  faqs?: BlogFaqItem[];
  relatedSlugs?: string[];
  internalLinks?: BlogInternalLink[];
};
