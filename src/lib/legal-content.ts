import type { Language } from "./translations";
import { CONTACT_EMAIL } from "./site-contact";

export type LegalDocId = "privacy" | "terms" | "delivery";

export type LegalSection = {
  heading: string;
  paragraphs: string[];
};

export type LegalDocument = {
  title: string;
  description: string;
  updated: string;
  sections: LegalSection[];
};

const UPDATED = "9 September 2026";

const documents: Record<Language, Record<LegalDocId, LegalDocument>> = {
  en: {
    privacy: {
      title: "Privacy Policy",
      description:
        "How PopArt.ee collects and uses photos, contact details, and order information.",
      updated: `Last updated: ${UPDATED}`,
      sections: [
        {
          heading: "Who we are",
          paragraphs: [
            `PopArt.ee is a Tallinn, Estonia storefront for custom painted canvas portraits. Contact: ${CONTACT_EMAIL}.`,
            "This page describes the information we use to create a preview, take payment, and deliver your canvas.",
          ],
        },
        {
          heading: "What we collect",
          paragraphs: [
            "The photo you upload so we can generate a digital painting preview.",
            "Name, email, shipping address, and phone number you enter at checkout so we can confirm the order and deliver the canvas.",
            "Payment is processed by Stripe. We do not store card numbers on our servers.",
            "The site uses Google Analytics to understand aggregate visits. We do not sell personal data.",
          ],
        },
        {
          heading: "How we use it",
          paragraphs: [
            "To generate the on-screen preview, print the selected portrait, and ship it to you.",
            "To email order updates and answer questions you send to us.",
            "We keep order details as long as needed to fulfil the order and handle support.",
          ],
        },
        {
          heading: "Your rights",
          paragraphs: [
            `You can ask what data we hold, request a correction, or ask us to delete information that is no longer needed. Write to ${CONTACT_EMAIL}.`,
            "If you are in the EU/EEA, you may also contact your local data protection authority.",
          ],
        },
      ],
    },
    terms: {
      title: "Terms of Service",
      description:
        "Terms for ordering a PopArt.ee canvas portrait from your photo.",
      updated: `Last updated: ${UPDATED}`,
      sections: [
        {
          heading: "The service",
          paragraphs: [
            "PopArt.ee creates a digital painting preview from your photo and, after you pay, prints the selected result on canvas and ships it.",
            "The preview is an artistic interpretation, not a photographic reprint. You should review the preview before checkout.",
          ],
        },
        {
          heading: "Your photo",
          paragraphs: [
            "You confirm you have the right to use the photo you upload (for example your own photo, or permission from the people in it).",
            "Do not upload images you are not allowed to use.",
          ],
        },
        {
          heading: "Price and payment",
          paragraphs: [
            "The price shown for the canvas size is the amount you pay. Payment is handled securely by Stripe. Card details are not stored by PopArt.ee.",
          ],
        },
        {
          heading: "Delivery",
          paragraphs: [
            "Shipping to the customer is free across all of Estonia.",
            "Dispatch is the next working day after the portrait is generated.",
            "Working days are Monday–Friday, excluding Estonian public holidays. You provide a complete Estonia shipping address at checkout.",
          ],
        },
        {
          heading: "Contact",
          paragraphs: [
            `Questions about an order: ${CONTACT_EMAIL}. We are based in Tallinn, Estonia.`,
          ],
        },
      ],
    },
    delivery: {
      title: "Delivery",
      description:
        "Free delivery across Estonia. Ships the next working day after your portrait is generated.",
      updated: `Last updated: ${UPDATED}`,
      sections: [
        {
          heading: "Estonia delivery",
          paragraphs: [
            "Shipping to the customer is free across all of Estonia.",
            "Dispatch / delivery is the next working day after the portrait is generated (after generation is done).",
          ],
        },
        {
          heading: "Preview versus canvas",
          paragraphs: [
            "The digital preview on the website is created in seconds so you can choose a look.",
            "The printed canvas is what we pack and ship. Free delivery across Estonia. Ships the next working day after your portrait is generated.",
          ],
        },
        {
          heading: "Payment and questions",
          paragraphs: [
            "Pay securely with Stripe. Cards are accepted.",
            `Questions? ${CONTACT_EMAIL}`,
          ],
        },
      ],
    },
  },
  et: {
    privacy: {
      title: "Privaatsuspoliitika",
      description:
        "Kuidas PopArt.ee kasutab fotosid, kontaktandmeid ja tellimuse teavet.",
      updated: `Viimati uuendatud: ${UPDATED}`,
      sections: [
        {
          heading: "Kes me oleme",
          paragraphs: [
            `PopArt.ee on Tallinnas, Eestis tegutsev pood eritellimusel maalitud lõuendiportreedele. Kontakt: ${CONTACT_EMAIL}.`,
            "Siin on kirjas, milliseid andmeid kasutame eelvaate loomiseks, makse vastuvõtmiseks ja lõuendi kohaletoimetamiseks.",
          ],
        },
        {
          heading: "Milliseid andmeid kogume",
          paragraphs: [
            "Üleslaaditud foto, et luua digitaalne maalitud eelvaade.",
            "Kassa juures sisestatud nimi, e-post, tarneaadress ja telefon, et tellimust kinnitada ja lõuend kohale toimetada.",
            "Makse käib Stripe'i kaudu. Me ei salvesta kaardinumbreid oma serverites.",
            "Sait kasutab Google Analyticsit külastuste mõistmiseks. Me ei müü isikuandmeid.",
          ],
        },
        {
          heading: "Kuidas andmeid kasutame",
          paragraphs: [
            "Eelvaate loomiseks, valitud portree trükkimiseks ja sulle saatmiseks.",
            "Tellimuse uuenduste saatmiseks ja sinu küsimustele vastamiseks.",
            "Hoiame tellimuse andmeid nii kaua, kui see on täitmiseks ja toe pakkumiseks vajalik.",
          ],
        },
        {
          heading: "Sinu õigused",
          paragraphs: [
            `Võid küsida, milliseid andmeid meil on, paluda parandust või kustutamist, kui andmeid enam vaja ei ole. Kirjuta: ${CONTACT_EMAIL}.`,
            "EL/EMP elanikuna võid pöörduda ka andmekaitse järelevalveasutuse poole.",
          ],
        },
      ],
    },
    terms: {
      title: "Kasutustingimused",
      description: "Tingimused PopArt.ee lõuendiportree tellimiseks fotost.",
      updated: `Viimati uuendatud: ${UPDATED}`,
      sections: [
        {
          heading: "Teenus",
          paragraphs: [
            "PopArt.ee loob sinu fotost digitaalse maali eelvaate ja pärast tasumist trükib valitud tulemuse lõuendile ning saadab selle teele.",
            "Eelvaade on kunstiline tõlgendus, mitte foto uus trükk. Palun vaata eelvaade enne maksmist üle.",
          ],
        },
        {
          heading: "Sinu foto",
          paragraphs: [
            "Kinnitate, et teil on õigus üleslaaditud fotot kasutada (nt oma foto või inimeste nõusolek pildil).",
            "Ärge laadige üles pilte, mille kasutamiseks teil õigust ei ole.",
          ],
        },
        {
          heading: "Hind ja makse",
          paragraphs: [
            "Lõuendi suuruse juures näidatud hind on tasutav summa. Makse on turvaline Stripe'i kaudu. PopArt.ee kaardiandmeid ei hoia.",
          ],
        },
        {
          heading: "Tarne",
          paragraphs: [
            "Tarne kliendile on tasuta üle kogu Eesti.",
            "Saadame järgmisel tööpäeval pärast portree genereerimist.",
            "Tööpäevad on esmaspäev–reede, välja arvatud Eesti riigipühad. Kassa juures on vaja täielikku Eesti tarneaadressi.",
          ],
        },
        {
          heading: "Kontakt",
          paragraphs: [
            `Küsimused tellimuse kohta: ${CONTACT_EMAIL}. Asume Tallinnas, Eestis.`,
          ],
        },
      ],
    },
    delivery: {
      title: "Tarne",
      description:
        "Tasuta tarne üle Eesti. Saadame järgmisel tööpäeval pärast portree genereerimist.",
      updated: `Viimati uuendatud: ${UPDATED}`,
      sections: [
        {
          heading: "Tarne Eestis",
          paragraphs: [
            "Tarne kliendile on tasuta üle kogu Eesti.",
            "Lähetamine / tarne on järgmine tööpäev pärast portree genereerimist (kui genereerimine on tehtud).",
          ],
        },
        {
          heading: "Eelvaade ja lõuend",
          paragraphs: [
            "Digitaalne eelvaade saidil valmib sekunditega, et saaksid variandi valida.",
            "Trükitud lõuend on see, mille pakime ja saadame. Tasuta tarne üle Eesti. Saadame järgmisel tööpäeval pärast portree genereerimist.",
          ],
        },
        {
          heading: "Makse ja küsimused",
          paragraphs: [
            "Maksa turvaliselt Stripe'iga. Kaardid on teretulnud.",
            `Küsimused? ${CONTACT_EMAIL}`,
          ],
        },
      ],
    },
  },
  ru: {
    privacy: {
      title: "Политика конфиденциальности",
      description:
        "Как PopArt.ee использует фотографии, контакты и данные заказа.",
      updated: `Обновлено: ${UPDATED}`,
      sections: [
        {
          heading: "Кто мы",
          paragraphs: [
            `PopArt.ee — витрина в Таллине, Эстония, для портретов на холсте на заказ. Контакт: ${CONTACT_EMAIL}.`,
            "На этой странице описано, какие данные нужны для предпросмотра, оплаты и доставки холста.",
          ],
        },
        {
          heading: "Какие данные мы собираем",
          paragraphs: [
            "Загруженное фото, чтобы создать цифровой художественный предпросмотр.",
            "Имя, email, адрес доставки и телефон на оформлении — чтобы подтвердить заказ и доставить холст.",
            "Оплату обрабатывает Stripe. Номера карт на наших серверах не хранятся.",
            "Сайт использует Google Analytics для статистики посещений. Мы не продаём персональные данные.",
          ],
        },
        {
          heading: "Как мы используем данные",
          paragraphs: [
            "Чтобы создать предпросмотр, напечатать выбранный портрет и отправить его вам.",
            "Чтобы присылать обновления заказа и отвечать на вопросы.",
            "Данные заказа храним столько, сколько нужно для выполнения и поддержки.",
          ],
        },
        {
          heading: "Ваши права",
          paragraphs: [
            `Можно запросить, какие данные у нас есть, попросить исправление или удаление, если они больше не нужны. Пишите: ${CONTACT_EMAIL}.`,
            "Если вы в ЕС/ЕЭЗ, можно также обратиться в орган по защите данных.",
          ],
        },
      ],
    },
    terms: {
      title: "Условия использования",
      description: "Условия заказа портрета на холсте PopArt.ee по фото.",
      updated: `Обновлено: ${UPDATED}`,
      sections: [
        {
          heading: "Услуга",
          paragraphs: [
            "PopArt.ee создаёт цифровой художественный предпросмотр по вашему фото и после оплаты печатает выбранный результат на холсте и отправляет его.",
            "Предпросмотр — художественная интерпретация, а не повторная печать фотографии. Просмотрите результат до оплаты.",
          ],
        },
        {
          heading: "Ваше фото",
          paragraphs: [
            "Вы подтверждаете, что имеете право использовать загруженное фото (своё фото или согласие людей на снимке).",
            "Не загружайте изображения, которыми нельзя пользоваться.",
          ],
        },
        {
          heading: "Цена и оплата",
          paragraphs: [
            "Цена у выбранного размера холста — сумма к оплате. Оплата проходит через Stripe. PopArt.ee не хранит данные карт.",
          ],
        },
        {
          heading: "Доставка",
          paragraphs: [
            "Доставка клиенту бесплатна по всей Эстонии.",
            "Отправка на следующий рабочий день после генерации портрета.",
            "Рабочие дни — понедельник–пятница, кроме государственных праздников Эстонии. На оформлении нужен полный адрес доставки в Эстонии.",
          ],
        },
        {
          heading: "Контакт",
          paragraphs: [
            `Вопросы по заказу: ${CONTACT_EMAIL}. Мы в Таллине, Эстония.`,
          ],
        },
      ],
    },
    delivery: {
      title: "Доставка",
      description:
        "Бесплатная доставка по всей Эстонии. Отправка на следующий рабочий день после генерации портрета.",
      updated: `Обновлено: ${UPDATED}`,
      sections: [
        {
          heading: "Доставка по Эстонии",
          paragraphs: [
            "Доставка клиенту бесплатна по всей Эстонии.",
            "Отправка / доставка — на следующий рабочий день после генерации портрета (когда генерация завершена).",
          ],
        },
        {
          heading: "Предпросмотр и холст",
          paragraphs: [
            "Цифровой предпросмотр на сайте готов за секунды, чтобы выбрать вариант.",
            "Печатный холст — то, что мы упаковываем и отправляем. Бесплатная доставка по всей Эстонии. Отправка на следующий рабочий день после генерации портрета.",
          ],
        },
        {
          heading: "Оплата и вопросы",
          paragraphs: [
            "Оплачивайте безопасно через Stripe. Карты принимаются.",
            `Вопросы? ${CONTACT_EMAIL}`,
          ],
        },
      ],
    },
  },
};

export function getLegalDocument(
  locale: Language,
  doc: LegalDocId
): LegalDocument {
  return documents[locale][doc];
}
