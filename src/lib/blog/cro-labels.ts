import type { BlogLocale } from "./types";

export type BlogCroLabels = {
  trustStrip: string[];
  emotionalAboveFold: string;
  localProof: string;
  ctaMidTitle: string;
  ctaMidBody: string;
  ctaMidButton: string;
  urgencyLine: string;
  ctaBottomTitle: string;
  ctaBottomBody: string;
  ctaBottomPrimary: string;
  ctaBottomSecondary: string;
  listBannerTitle: string;
  listBannerBody: string;
  listBannerButton: string;
};

const CRO: Record<BlogLocale, BlogCroLabels> = {
  et: {
    trustStrip: [
      "Turvaline makse",
      "Eelvaade enne trükki",
      "Tellimus üle Eesti",
      "Tugi eesti keeles",
    ],
    emotionalAboveFold:
      "Kingitus või kodu kaunistus — sama tellimusvoog, mis aitab valida õige suuruse ja stiili.",
    localProof:
      "Teenust tellitakse Eestist ja Tallinnast: selged sammud, tarneinfo tellimuses ja abi vormi kaudu.",
    ctaMidTitle: "Valmis oma fotost portree tellima?",
    ctaMidBody:
      "Laadige üles foto, valige lõuendi suurus ja vaadake tulemust enne lõplikku kinnitust — nii on otsus kindel.",
    ctaMidButton: "Alusta tellimust",
    urgencyLine:
      "Populaarsed mõõdud võivad hooajal kiiremini täituda — alustades täna jääte järjekorras eespoole.",
    ctaBottomTitle: "Teeme selle lihtsaks",
    ctaBottomBody:
      "Kui artikkel vastas teie küsimustele, on järgmine samm tellimus: kõik toimub veebis, ilma poetiiruta.",
    ctaBottomPrimary: "Mine tellimuse juurde",
    ctaBottomSecondary: "Avaleht ja hinnad",
    listBannerTitle: "Soovite oma portreed juba täna alustada?",
    listBannerBody:
      "Tellimus avaneb avalehel: üleslaadimine, suurus ja makse — Tallinn ja üle Eesti.",
    listBannerButton: "Alusta tellimust",
  },
  ru: {
    trustStrip: [
      "Безопасная оплата",
      "Предпросмотр перед печатью",
      "Заказ по всей Эстонии",
      "Поддержка на русском",
    ],
    emotionalAboveFold:
      "Подарок или декор для дома — один понятный процесс выбора размера и стиля.",
    localProof:
      "Заказы из Эстонии и Таллина: понятные шаги, доставка в подтверждении заказа и помощь через форму.",
    ctaMidTitle: "Готовы заказать портрет по фото?",
    ctaMidBody:
      "Загрузите фото, выберите размер холста и посмотрите результат перед финальным подтверждением.",
    ctaMidButton: "Начать заказ",
    urgencyLine:
      "В сезон популярные размеры могут быстрее заниматься — чем раньше начнёте, тем спокойнее сроки.",
    ctaBottomTitle: "Мы упростили процесс",
    ctaBottomBody:
      "Если статья закрыла вопросы, следующий шаг — оформление: всё онлайн, без лишних поездок.",
    ctaBottomPrimary: "Перейти к заказу",
    ctaBottomSecondary: "Главная и цены",
    listBannerTitle: "Хотите начать портрет уже сегодня?",
    listBannerBody:
      "Оформление на главной странице: загрузка, размер и оплата — Таллин и вся Эстония.",
    listBannerButton: "Начать заказ",
  },
  en: {
    trustStrip: [
      "Secure checkout",
      "Preview before printing",
      "Orders across Estonia",
      "Support in English",
    ],
    emotionalAboveFold:
      "A gift or a statement piece for your home—same guided flow to pick size and style with confidence.",
    localProof:
      "Built for Estonia and Tallinn customers: clear steps, delivery details in your order confirmation, and help via the site flow.",
    ctaMidTitle: "Ready to order your portrait from a photo?",
    ctaMidBody:
      "Upload your photo, pick a canvas size, and review the result before you finalize—so you commit with confidence.",
    ctaMidButton: "Start your order",
    urgencyLine:
      "Popular sizes can fill faster in peak seasons—starting today keeps your place in the queue calmer.",
    ctaBottomTitle: "We keep it simple",
    ctaBottomBody:
      "If this article answered your questions, the next step is the order flow—fully online, no studio visit required.",
    ctaBottomPrimary: "Go to order",
    ctaBottomSecondary: "Home & pricing",
    listBannerTitle: "Want to start your portrait today?",
    listBannerBody:
      "The order flow lives on the homepage: upload, size, and checkout—Tallinn and all of Estonia.",
    listBannerButton: "Start your order",
  },
};

export function getBlogCroLabels(locale: BlogLocale): BlogCroLabels {
  return CRO[locale];
}
