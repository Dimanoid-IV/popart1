type IncomingArticleQualityInput = {
  title: string;
  targetKeyword?: string;
  metaDescription?: string;
  html: string;
  qualityScore?: number | null;
};

function plainText(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

export function normalizeIncomingArticleHtml(html: string) {
  const articleMatch = html.match(/<article(?:\s[^>]*)?>([\s\S]*?)<\/article>/i);
  const content = articleMatch?.[1] ?? html;

  return content
    .replace(/<!doctype[^>]*>/gi, "")
    .replace(/<head[\s\S]*?<\/head>/gi, "")
    .replace(/<\/?(?:html|body)(?:\s[^>]*)?>/gi, "")
    .replace(/^\s*<h1(?:\s[^>]*)?>[\s\S]*?<\/h1>\s*/i, "")
    .trim();
}

function hasRepeatedLongParagraphs(html: string) {
  const paragraphs = [...html.matchAll(/<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/gi)]
    .map((match) => plainText(match[1]).toLocaleLowerCase())
    .filter((paragraph) => paragraph.split(/\s+/).length >= 20);
  return new Set(paragraphs).size < paragraphs.length;
}

export function validateIncomingArticle(input: IncomingArticleQualityInput) {
  const html = normalizeIncomingArticleHtml(input.html);
  const text = plainText(html);
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const topic = `${input.title} ${input.targetKeyword ?? ""}`.toLocaleLowerCase();
  const allCopy = `${input.metaDescription ?? ""} ${text}`;

  if (
    /popart\.ee\s+(?:в подарок|as a gift|kingit)/i.test(topic) ||
    /(?:лучший|best)\s+popart\.ee/i.test(topic)
  ) {
    return { ok: false as const, error: "unsafe_domain_as_article_topic" };
  }

  if (wordCount < 500) {
    return { ok: false as const, error: "article_too_short", wordCount };
  }

  if (typeof input.qualityScore === "number" && input.qualityScore < 80) {
    return { ok: false as const, error: "article_quality_score_too_low" };
  }

  if (
    /Практичный материал для владельца бизнеса|Данные о конкурентах будут добавлены|small business in your region/i.test(
      allCopy
    )
  ) {
    return { ok: false as const, error: "generic_generation_boilerplate" };
  }

  if (hasRepeatedLongParagraphs(html)) {
    return { ok: false as const, error: "repeated_article_paragraphs" };
  }

  return { ok: true as const, html, wordCount };
}
