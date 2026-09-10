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
      "Tasuta tarne üle Eesti",
      "Saadetis järgmisel tööpäeval",
    ],
    emotionalAboveFold:
      "Kingitus või kodu kaunistus — sama tellimusvoog, mis aitab valida õige suuruse ja stiili.",
    localProof:
      "Teenust tellitakse Eestist ja Tallinnast: tasuta tarne üle Eesti, saatmine järgmisel tööpäeval pärast portree genereerimist.",
    ctaMidTitle: "Valmis oma fotost portree tellima?",
    ctaMidBody:
      "Laadige üles foto, valige lõuendi suurus ja vaadake tulemust enne lõplikku kinnitust — nii on otsus kindel.",
    ctaMidButton: "Alusta tellimust",
    urgencyLine:
      "Digitaalne eelvaade valmib sekunditega; trükitud lõuendi saadame järgmisel tööpäeval — tasuta üle Eesti.",
    ctaBottomTitle: "Teeme selle lihtsaks",
    ctaBottomBody:
      "Kui artikkel vastas teie küsimustele, on järgmine samm tellimus: kõik toimub veebis, ilma poetiiruta.",
    ctaBottomPrimary: "Mine tellimuse juurde",
    ctaBottomSecondary: "Avaleht ja hinnad",
    listBannerTitle: "Soovite oma portreed juba täna alustada?",
    listBannerBody:
      "Tellimus avaneb avalehel: üleslaadimine, suurus ja makse. Tasuta tarne üle Eesti, saatmine järgmisel tööpäeval pärast genereerimist.",
    listBannerButton: "Alusta tellimust",
  },
  ru: {
    trustStrip: [
      "Безопасная оплата",
      "Предпросмотр перед печатью",
      "Бесплатная доставка по Эстонии",
      "Отправка на следующий рабочий день",
    ],
    emotionalAboveFold:
      "Подарок или декор для дома — один понятный процесс выбора размера и стиля.",
    localProof:
      "Заказы из Эстонии и Таллина: бесплатная доставка по стране, отправка на следующий рабочий день после генерации портрета.",
    ctaMidTitle: "Готовы заказать портрет по фото?",
    ctaMidBody:
      "Загрузите фото, выберите размер холста и посмотрите результат перед финальным подтверждением.",
    ctaMidButton: "Начать заказ",
    urgencyLine:
      "Цифровой предпросмотр готов за секунды; печатный холст отправим на следующий рабочий день — бесплатно по Эстонии.",
    ctaBottomTitle: "Мы упростили процесс",
    ctaBottomBody:
      "Если статья закрыла вопросы, следующий шаг — оформление: всё онлайн, без лишних поездок.",
    ctaBottomPrimary: "Перейти к заказу",
    ctaBottomSecondary: "Главная и цены",
    listBannerTitle: "Хотите начать портрет уже сегодня?",
    listBannerBody:
      "Оформление на главной странице: загрузка, размер и оплата. Бесплатная доставка по Эстонии, отправка на следующий рабочий день после генерации.",
    listBannerButton: "Начать заказ",
  },
  en: {
    trustStrip: [
      "Secure checkout",
      "Preview before printing",
      "Free delivery across Estonia",
      "Ships next working day",
    ],
    emotionalAboveFold:
      "A gift or a statement piece for your home—same guided flow to pick size and style with confidence.",
    localProof:
      "Built for Estonia and Tallinn customers: free delivery nationwide, dispatch the next working day after your portrait is generated.",
    ctaMidTitle: "Ready to order your portrait from a photo?",
    ctaMidBody:
      "Upload your photo, pick a canvas size, and review the result before you finalize—so you commit with confidence.",
    ctaMidButton: "Start your order",
    urgencyLine:
      "The digital preview is ready in seconds; we ship the printed canvas the next working day — free across Estonia.",
    ctaBottomTitle: "We keep it simple",
    ctaBottomBody:
      "If this article answered your questions, the next step is the order flow—fully online, no studio visit required.",
    ctaBottomPrimary: "Go to order",
    ctaBottomSecondary: "Home & pricing",
    listBannerTitle: "Want to start your portrait today?",
    listBannerBody:
      "The order flow lives on the homepage: upload, size, and checkout. Free delivery across Estonia, ships the next working day after generation.",
    listBannerButton: "Start your order",
  },
};

export function getBlogCroLabels(locale: BlogLocale): BlogCroLabels {
  return CRO[locale];
}
