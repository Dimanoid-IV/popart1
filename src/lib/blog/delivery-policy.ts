import type { BlogLocale } from "./types";

/** Current storefront policy — keep in sync with legal/delivery copy. */
export const DELIVERY_POLICY: Record<BlogLocale, string> = {
  et: "Tasuta tarne üle Eesti. Saadame järgmisel tööpäeval pärast portree genereerimist. Digitaalne eelvaade valmib sekunditega.",
  ru: "Бесплатная доставка по всей Эстонии. Отправка на следующий рабочий день после генерации портрета. Цифровой предпросмотр готов за секунды.",
  en: "Free delivery across Estonia. Ships the next working day after your portrait is generated. The digital preview is ready in seconds.",
};

const OUTDATED_TIMELINE =
  /(?:\d+\s*[–-]\s*\d+\s*(?:töö)?päev)|(?:\d+\s*[–-]\s*\d+\s*nädal)|(?:\d+\s*[–-]\s*\d+\s*(?:working\s+)?days?)|(?:\d+\s*[–-]\s*\d+\s*(?:weeks?|недел))|(?:\d+\s*[–-]\s*\d+\s*(?:рабоч(?:их|ий|им)?\s+)?дн)|tootmisaeg|kiirendatud valik|kiirem tarne|production time|срок изготовления|срок производства|tarneaeg sõltub asukohast|lisanädalaid/i;

export function hasOutdatedDeliveryTimeline(text: string): boolean {
  return OUTDATED_TIMELINE.test(text);
}

export function normalizeFaqAnswer(answer: string, locale: BlogLocale): string {
  if (!hasOutdatedDeliveryTimeline(answer)) return answer;
  return DELIVERY_POLICY[locale];
}

/** Rewrite repeated outdated production-timeline sentences in article HTML. */
export function rewriteOutdatedDeliveryHtml(
  html: string,
  locale: BlogLocale
): string {
  const policy = DELIVERY_POLICY[locale];
  return html
    .replace(
      /Tavaline tootmisaeg on \d+[–-]\d+ tööpäeva(?:,?\s*kiirendatud valikutel \d+[–-]\d+ tööpäeva)?[^.]*\./gi,
      policy
    )
    .replace(
      /portree valmib \d+[–-]\d+ tööpäeva\s*(?:\([^)]*\))?\s*(?:ja tarnitakse üle Eesti)?/gi,
      "portree saadetakse järgmisel tööpäeval pärast genereerimist — tasuta üle Eesti"
    )
    .replace(
      /Personaalne portree võtab \d+[–-]\d+ päeva\./gi,
      "Digitaalne eelvaade valmib sekunditega; trükitud lõuendi saadame järgmisel tööpäeval — tasuta üle Eesti."
    )
    .replace(
      /<strong>Tarne:<\/strong>\s*\d+[–-]\d+ päeva/gi,
      "<strong>Tarne:</strong> tasuta üle Eesti, järgmisel tööpäeval pärast genereerimist"
    )
    .replace(
      /Kogu protsess võtab tavaliselt <strong>\d+[–-]\d+ päeva<\/strong>:/gi,
      `Praegune poliitika: <strong>${policy}</strong>`
    )
    .replace(
      /Tarneaeg sõltub piirkonnast, tavaliselt \d+[–-]\d+ päeva pärast tootmist\./gi,
      policy
    )
    .replace(
      /<li><strong>Eelvaade:<\/strong> \d+[–-]\d+ päeva pärast foto üleslaadimist<\/li>/gi,
      `<li><strong>Eelvaade:</strong> valmib sekunditega pärast foto üleslaadimist</li>`
    )
    .replace(
      /<li><strong>Tootmine ja trükk:<\/strong> \d+[–-]\d+ päeva pärast kinnitust<\/li>/gi,
      `<li><strong>Trükk ja saatmine:</strong> järgmisel tööpäeval pärast portree genereerimist</li>`
    )
    .replace(
      /<li><strong>Tarne:<\/strong> \d+[–-]\d+ päeva, olenevalt asukohast<\/li>/gi,
      `<li><strong>Tarne:</strong> tasuta üle Eesti</li>`
    )
    .replace(
      /Lühem tarneaeg \(\d+[–-]\d+ päeva\)/gi,
      "Saadetis järgmisel tööpäeval pärast genereerimist"
    )
    .replace(/<li>Tarne \d+[–-]\d+ päeva<\/li>/gi, "<li>Tasuta tarne üle Eesti</li>")
    .replace(
      /Kiirendatud teenus on saadaval lisatasu eest\./gi,
      "Saadame järgmisel tööpäeval pärast portree genereerimist; tarne üle Eesti on tasuta."
    );
}
