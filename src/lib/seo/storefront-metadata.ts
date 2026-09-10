import type { Metadata } from "next";
import type { Language } from "@/lib/translations";
import { LOCALE_ALTERNATES, OG_IMAGE, SITE_NAME, SITE_ORIGIN } from "./site-config";
import { localizePath } from "@/lib/locales";
import { getLegalDocument, type LegalDocId } from "@/lib/legal-content";

const HOME_COPY: Record<
  Language,
  { title: string; description: string; ogTitle: string }
> = {
  en: {
    title: `${SITE_NAME} - Custom Digital Painting Portraits`,
    description:
      "Turn your photos into painted canvas portraits. Digital preview in seconds. Free delivery across Estonia. Ships the next working day after your portrait is generated.",
    ogTitle: "PopArt.ee - Your Photos, Pure Art",
  },
  et: {
    title: `Portree fotost kingituseks | ${SITE_NAME}`,
    description:
      "Telli portree fotost: digitaalne eelvaade sekunditega, lõuend 45–75 € ja tasuta tarne üle Eesti. Saadame järgmisel tööpäeval pärast portree genereerimist.",
    ogTitle: "Portree fotost lõuendil | PopArt.ee",
  },
  ru: {
    title: `Портрет по фото в подарок | ${SITE_NAME}`,
    description:
      "Закажите портрет по фото: предпросмотр за секунды, холст 45–75 € и бесплатная доставка по Эстонии. Отправка на следующий рабочий день после генерации портрета.",
    ogTitle: "Портрет по фото на холсте | PopArt.ee",
  },
};

function ogLocale(locale: Language): string {
  if (locale === "et") return "et_EE";
  if (locale === "ru") return "ru_RU";
  return "en_US";
}

export function buildStorefrontMetadata(
  locale: Language,
  pathname: string
): Metadata {
  const copy = HOME_COPY[locale];
  const path = pathname === "/" ? "" : pathname;
  const canonical = `${SITE_ORIGIN}${path}`;
  const keywords =
    locale === "et"
      ? [
          "portree fotost",
          "portree kingitus",
          "lõuendiportree",
          "tasuta tarne Eesti",
          "PopArt.ee",
        ]
      : locale === "ru"
        ? [
            "портрет по фото",
            "портрет в подарок",
            "портрет на холсте",
            "доставка Эстония",
            "PopArt.ee",
          ]
        : undefined;
  return {
    title: { absolute: copy.title },
    description: copy.description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical,
      languages: { ...LOCALE_ALTERNATES },
    },
    openGraph: {
      title: copy.ogTitle,
      description: copy.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: "Custom portrait printed on canvas by PopArt.ee",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.ogTitle,
      description: copy.description,
      images: [OG_IMAGE],
    },
  };
}

export function buildLegalMetadata(
  locale: Language,
  doc: LegalDocId
): Metadata {
  const content = getLegalDocument(locale, doc);
  const pathname = localizePath(`/${doc}`, locale);
  const path = pathname === "/" ? "" : pathname;
  const canonical = `${SITE_ORIGIN}${path}`;
  const languages = {
    "x-default": `${SITE_ORIGIN}/${doc}`,
    en: `${SITE_ORIGIN}/${doc}`,
    et: `${SITE_ORIGIN}/et/${doc}`,
    ru: `${SITE_ORIGIN}/ru/${doc}`,
  };
  return {
    title: content.title,
    description: content.description,
    alternates: {
      canonical,
      languages,
    },
    openGraph: {
      title: `${content.title} | ${SITE_NAME}`,
      description: content.description,
      url: canonical,
      siteName: SITE_NAME,
      locale: ogLocale(locale),
      type: "website",
      images: [
        {
          url: OG_IMAGE,
          width: 1200,
          height: 630,
          alt: content.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${content.title} | ${SITE_NAME}`,
      description: content.description,
      images: [OG_IMAGE],
    },
  };
}
