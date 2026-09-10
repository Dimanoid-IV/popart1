export type Language = "en" | "ru" | "et";

export const translations = {
  en: {
    nav: {
      howItWorks: "How It Works",
      pricing: "Pricing",
      gallery: "Gallery",
      blog: "Blog",
      orderNow: "Order Now",
      menu: "Menu",
      close: "Close",
    },
    hero: {
      title1: "Your Photos.",
      title2: "Pure Art.",
      description:
        "Turn your favourite photos into painted canvas portraits. Review a digital preview, then we print and ship across Estonia — free, the next working day after generation.",
      ctaPrimary: "Create My Portrait",
      ctaSecondary: "How it Works",
    },
    trust: {
      delivery: "Free delivery across Estonia.",
      ships:
        "Ships the next working day after your portrait is generated.",
      preview:
        "The on-screen preview is ready in seconds. The printed canvas is what we ship.",
      payment: "Secure payment with Stripe — cards accepted.",
      contact: "Questions? info@popart.ee",
    },
    features: {
      sectionTitle: "From photo to wall in 3 steps",
      sectionDesc:
        "A digital preview first, then a printed canvas delivered across Estonia.",
      feature1: {
        title: "Digital preview in seconds",
        desc: "Our engine turns your photo into a painted preview in seconds, keeping the likeness while adding artistic style. This is the on-screen preview — not the courier.",
      },
      feature2: {
        title: "Digital painting",
        desc: "No filters here. Each portrait is transformed into a digital painting style with artistic backgrounds.",
      },
      feature3: {
        title: "Printed canvas, free Estonia delivery",
        desc: "Printed on high-quality museum-grade canvas. Free delivery across Estonia. We ship the next working day after your portrait is generated.",
      },
    },
    guide: {
      eyebrow: "Custom portrait guide",
      title: "Custom digital painting portraits from your photo",
      paragraphs: [
        "PopArt.ee turns your favourite photos into custom digital painting portraits for gifts, wall art, family memories, and special occasions. The process is simple: upload a clear photo, choose a canvas size, review the preview, and confirm the print when the portrait feels right.",
        "A good portrait starts with a sharp image and a story worth keeping. Natural light, visible facial details, and a relaxed expression help the artwork feel personal instead of generic. If you are ordering for a birthday, wedding, anniversary, or holiday gift, start the preview early so the next-working-day dispatch is easy to plan.",
        "Every order is made for real homes: canvas sizes are easy to compare, the preview step lets you choose a look before printing, and delivery is free across Estonia. Start with the photo you love most, then use the order flow below.",
      ],
      personalTitle: "What makes the portrait feel personal?",
      personalText:
        "The best result usually comes from one meaningful photo, not a large album of almost-right images. Choose a photo where the face, eyes, and expression are clear. Tell us whether the portrait is for a partner, parent, friend, child, pet owner, or business gift so the final artwork can match the occasion.",
      timingTitle: "Preview, print, and delivery",
      timingText:
        "The digital preview is ready in seconds. After your portrait is generated, we ship the printed canvas the next working day — free across Estonia.",
      cta: "Start your portrait order",
    },
    gallery: {
      eyebrow: "Portraits in real interiors",
      title: "Imagine your portrait at home",
      description:
        "See how a personal canvas portrait becomes part of a warm, modern interior. Each example shows a realistic scale, natural light, and the character of a gallery-wrapped canvas.",
      items: [
        "Wedding portrait in a warm living room",
        "Family portrait in a Scandinavian interior",
        "Couple portrait in a soft neutral room",
        "Modern portrait in a contemporary interior",
        "Blue Dream Art portrait in a home office",
        "Young champion portrait in warm coral colors",
        "Young champion portrait in turquoise colors",
        "Formal portrait in a modern study",
        "Bright Dream Art portrait in a living room",
      ],
      cta: "Create a portrait for my home",
    },
    reviews: {
      eyebrow: "Customer reviews",
      title: "What gift buyers say",
      description:
        "Sample quotes showing how a portrait from a photo is used as a gift in Estonia. Replace these with real reviews when you have them.",
      sampleBadge: "Sample",
      empty: "Customer reviews will appear here.",
    },
    order: {
      sectionTitle: "Start Your Transformation",
      sectionDesc: "Select your size and upload your photo to begin.",
      steps: {
        upload: "Upload",
        size: "Size",
        process: "Process",
        select: "Select",
        pay: "Pay",
      },
      upload: {
        title: "Upload your photo",
        desc: "High resolution photos work best (JPG, PNG)",
        button: "Choose File",
        footer:
          "Your digital preview is created in seconds. The printed canvas ships the next working day — free across Estonia.",
      },
      size: {
        title: "Choose Canvas Size",
        premium: "Premium Canvas",
        back: "Back",
        button: "Process",
      },
      background: {
        title: "Choose colors for both portraits",
        desc: "Set a separate background palette for each generated variant.",
        variant1: "Portrait variant 1",
        variant2: "Portrait variant 2",
        options: {
          surprise: "Surprise",
          turquoise: "Turquoise",
          lavender: "Lavender",
          aqua: "Aqua",
          coral: "Coral & gold",
          sapphire: "Sapphire",
        },
      },
      processing: {
        title: "Your art is being created...",
        desc: "Creating your digital preview with different artistic backgrounds.",
      },
      selection: {
        title: "Select Your Result",
        desc: "Pick the one you love the most!",
        button: "Proceed to Checkout",
      },
      checkout: {
        title: "Your Order Summary",
        product: "Product",
        productName: "Digital Painting Portrait",
        size: "Size",
        total: "Total Price",
        shippingTitle: "Shipping & Contact Information",
        fullName: "Full Name",
        email: "Email Address",
        address: "Shipping Address (Street, House, Appt)",
        postalCode: "Postal Code",
        phone: "Phone Number",
        payButton: "Pay with Stripe",
        secure: "Secure payment via Stripe. No credit card details stored.",
        delivery:
          "Free delivery across Estonia. Ships the next working day after your portrait is generated.",
        notification:
          "We email order updates to you. The printed canvas ships the next working day after generation — free across Estonia.",
        back: "Back to Selection",
      },
    },
    footer: {
      desc: "Painted canvas portraits from your photos, with free delivery across Estonia.",
      contact: "Contact",
      legal: "Legal",
      terms: "Terms of Service",
      privacy: "Privacy Policy",
      delivery: "Delivery",
      blog: "Blog",
      quickLinks: "Quick links",
      location: "Tallinn, Estonia",
      emailLabel: "Email",
      rights: "All rights reserved.",
    },
  },
  ru: {
    nav: {
      howItWorks: "Как это работает",
      pricing: "Цены",
      gallery: "Галерея",
      blog: "Блог",
      orderNow: "Заказать сейчас",
      menu: "Меню",
      close: "Закрыть",
    },
    hero: {
      title1: "Ваши фото.",
      title2: "Чистое искусство.",
      description:
        "Превратите любимые фотографии в портреты на холсте. Сначала цифровой предпросмотр, затем печать и доставка по Эстонии — бесплатно, на следующий рабочий день после генерации.",
      ctaPrimary: "Создать портрет",
      ctaSecondary: "Как это работает",
    },
    trust: {
      delivery: "Бесплатная доставка по всей Эстонии.",
      ships:
        "Отправка на следующий рабочий день после генерации портрета.",
      preview:
        "Предпросмотр на экране готов за секунды. На холсте мы печатаем и отправляем выбранный портрет.",
      payment: "Безопасная оплата через Stripe — карты принимаются.",
      contact: "Вопросы? info@popart.ee",
    },
    features: {
      sectionTitle: "От фото до стены в 3 шага",
      sectionDesc:
        "Сначала цифровой предпросмотр, затем печатный холст с доставкой по Эстонии.",
      feature1: {
        title: "Предпросмотр за секунды",
        desc: "Система превращает фото в художественный предпросмотр за секунды, сохраняя сходство. Это изображение на экране — не курьер.",
      },
      feature2: {
        title: "Цифровая живопись",
        desc: "Никаких простых фильтров. Каждый портрет превращается в цифровую картину с уникальным фоном.",
      },
      feature3: {
        title: "Холст и бесплатная доставка по Эстонии",
        desc: "Печать на качественном музейном холсте. Бесплатная доставка по всей Эстонии. Отправка на следующий рабочий день после генерации портрета.",
      },
    },
    guide: {
      eyebrow: "Гид по портретам на заказ",
      title: "Цифровые художественные портреты по вашей фотографии",
      paragraphs: [
        "PopArt.ee превращает любимые фотографии в цифровые художественные портреты для подарков, интерьера, семейных воспоминаний и особых событий. Всё просто: загрузите чёткое фото, выберите размер холста, оцените предпросмотр и подтвердите печать.",
        "Хороший портрет начинается с качественной фотографии и истории, которую хочется сохранить. Естественный свет, хорошо видимые черты лица и непринуждённое выражение помогают сделать работу личной. Если портрет нужен к дате, начните с предпросмотра заранее — отправка на следующий рабочий день после генерации.",
        "Каждый заказ создаётся для реального интерьера: размеры холста легко сравнить, предпросмотр помогает выбрать вариант до печати, а доставка по Эстонии бесплатная. Начните с любимой фотографии и используйте форму ниже.",
      ],
      personalTitle: "Что делает портрет действительно личным?",
      personalText:
        "Лучший результат обычно получается из одной значимой фотографии, а не из большого альбома почти подходящих кадров. Выберите снимок, где хорошо видны лицо, глаза и выражение. Укажите, кому предназначен портрет, чтобы оформление соответствовало поводу.",
      timingTitle: "Предпросмотр, печать и доставка",
      timingText:
        "Цифровой предпросмотр готов за секунды. После генерации портрета мы отправляем печатный холст на следующий рабочий день — бесплатно по всей Эстонии.",
      cta: "Начать создание портрета",
    },
    gallery: {
      eyebrow: "Портреты в настоящем интерьере",
      title: "Представьте ваш портрет у себя дома",
      description:
        "Посмотрите, как персональный портрет на холсте становится частью уютного современного интерьера. На примерах показаны реалистичный масштаб, естественное освещение и фактура холста на подрамнике.",
      items: [
        "Свадебный портрет в тёплой гостиной",
        "Семейный портрет в скандинавском интерьере",
        "Портрет пары в мягком нейтральном интерьере",
        "Современный портрет в стильной гостиной",
        "Синий портрет Dream Art в домашнем кабинете",
        "Портрет юного чемпиона в коралловых тонах",
        "Портрет юного чемпиона в бирюзовых тонах",
        "Деловой портрет в современном кабинете",
        "Яркий портрет Dream Art в гостиной",
      ],
      cta: "Создать портрет для моего дома",
    },
    reviews: {
      eyebrow: "Отзывы",
      title: "Что говорят о подарках",
      description:
        "Примеры формулировок, как портрет по фото заказывают в подарок в Эстонии. Их нужно заменить реальными отзывами, когда они появятся.",
      sampleBadge: "Пример",
      empty: "Здесь появятся отзывы покупателей.",
    },
    order: {
      sectionTitle: "Начните трансформацию",
      sectionDesc: "Выберите размер и загрузите фото, чтобы начать.",
      steps: {
        upload: "Загрузка",
        size: "Размер",
        process: "Обработка",
        select: "Выбор",
        pay: "Оплата",
      },
      upload: {
        title: "Загрузите ваше фото",
        desc: "Лучше всего подходят фото высокого разрешения (JPG, PNG)",
        button: "Выбрать файл",
        footer:
          "Цифровой предпросмотр создаётся за секунды. Печатный холст отправим на следующий рабочий день — бесплатно по всей Эстонии.",
      },
      size: {
        title: "Выберите размер холста",
        premium: "Премиум холст",
        back: "Назад",
        button: "Обработать",
      },
      background: {
        title: "Выберите цвета для двух портретов",
        desc: "Назначьте отдельную гамму фона каждому создаваемому варианту.",
        variant1: "Вариант портрета 1",
        variant2: "Вариант портрета 2",
        options: {
          surprise: "Сюрприз",
          turquoise: "Бирюзовый",
          lavender: "Лавандовый",
          aqua: "Аквамарин",
          coral: "Коралл и золото",
          sapphire: "Сапфировый",
        },
      },
      processing: {
        title: "Ваш портрет создается...",
        desc: "Создаём цифровой предпросмотр с различными художественными фонами.",
      },
      selection: {
        title: "Выберите результат",
        desc: "Выберите тот вариант, который вам нравится больше всего!",
        button: "Перейти к оплате",
      },
      checkout: {
        title: "Ваш заказ",
        product: "Товар",
        productName: "Цифровой портрет",
        size: "Размер",
        total: "Итоговая цена",
        shippingTitle: "Информация для доставки",
        fullName: "Имя и Фамилия",
        email: "Электронная почта",
        address: "Адрес доставки (Улица, дом, кв.)",
        postalCode: "Почтовый индекс",
        phone: "Номер телефона",
        payButton: "Оплатить через Stripe",
        secure: "Безопасная оплата через Stripe. Мы не храним данные карт.",
        delivery:
          "Бесплатная доставка по всей Эстонии. Отправка на следующий рабочий день после генерации портрета.",
        notification:
          "Мы пришлём обновления заказа на почту. Печатный холст отправим на следующий рабочий день после генерации — бесплатно по всей Эстонии.",
        back: "Назад к выбору",
      },
    },
    footer: {
      desc: "Художественные портреты на холсте по вашим фото, с бесплатной доставкой по Эстонии.",
      contact: "Контакты",
      legal: "Юридическая информация",
      terms: "Условия использования",
      privacy: "Политика конфиденциальности",
      delivery: "Доставка",
      blog: "Блог",
      quickLinks: "Разделы",
      location: "Таллин, Эстония",
      emailLabel: "Email",
      rights: "Все права защищены.",
    },
  },
  et: {
    nav: {
      howItWorks: "Kuidas see toimib",
      pricing: "Hinnad",
      gallery: "Galerii",
      blog: "Blogi",
      orderNow: "Telli kohe",
      menu: "Menüü",
      close: "Sulge",
    },
    hero: {
      title1: "Sinu fotod.",
      title2: "Puhas kunst.",
      description:
        "Muuda lemmikfotod maalitud lõuendiportreedeks. Vaata digitaalset eelvaadet, seejärel trükime ja saadame üle Eesti — tasuta, järgmisel tööpäeval pärast genereerimist.",
      ctaPrimary: "Loo minu portree",
      ctaSecondary: "Kuidas see toimib",
    },
    trust: {
      delivery: "Tasuta tarne üle Eesti.",
      ships: "Saadame järgmisel tööpäeval pärast portree genereerimist.",
      preview:
        "Eelvaade ekraanil valmib sekunditega. Trükitud lõuend on see, mille me saadame.",
      payment: "Turvaline makse Stripe'iga — kaardid on teretulnud.",
      contact: "Küsimused? info@popart.ee",
    },
    features: {
      sectionTitle: "Fotost seinale 3 sammuga",
      sectionDesc:
        "Kõigepealt digitaalne eelvaade, seejärel trükitud lõuend tarnega üle Eesti.",
      feature1: {
        title: "Digitaalne eelvaade sekunditega",
        desc: "Süsteem muudab foto maalitud eelvaateks sekunditega, hoides sarnasuse ja lisades kunstilist stiili. See on eelvaade ekraanil — mitte kuller.",
      },
      feature2: {
        title: "Digitaalne maal",
        desc: "Siin pole filtreid. Iga portree muudetakse kunstilise taustaga digitaalseks maaliks.",
      },
      feature3: {
        title: "Lõuend ja tasuta tarne üle Eesti",
        desc: "Trükitud kvaliteetsele muuseumiklassi lõuendile. Tasuta tarne üle Eesti. Saadame järgmisel tööpäeval pärast portree genereerimist.",
      },
    },
    guide: {
      eyebrow: "Eritellimusportree juhend",
      title: "Sinu fotost loodud digitaalne kunstiline portree",
      paragraphs: [
        "PopArt.ee muudab sinu lemmikfotod digitaalseteks kunstilisteks portreedeks kingituseks, kodu kaunistuseks, peremälestusteks ja tähtpäevadeks. Protsess on lihtne: laadi üles selge foto, vali lõuendi suurus, vaata eelvaade üle ja kinnita trükk.",
        "Hea portree algab teravast fotost ja loost, mida tasub hoida. Loomulik valgus, nähtavad näodetailid ja vaba ilme aitavad teose isiklikuks muuta. Kui kingitusel on kuupäev, alusta eelvaatest varakult — saadame järgmisel tööpäeval pärast genereerimist.",
        "Iga tellimus valmib päris kodu jaoks: lõuendisuurusi on lihtne võrrelda, eelvaade aitab variandi enne trükki valida ning tarne üle Eesti on tasuta. Alusta lemmikfotost ja kasuta allolevat tellimisvormi.",
      ],
      personalTitle: "Mis muudab portree isiklikuks?",
      personalText:
        "Parim tulemus sünnib tavaliselt ühest tähenduslikust fotost, mitte suurest peaaegu sobivate piltide albumist. Vali foto, millel nägu, silmad ja ilme on selgelt nähtavad. Anna teada, kellele portree on mõeldud, et kujundus sobiks sündmusega.",
      timingTitle: "Eelvaade, trükk ja tarne",
      timingText:
        "Digitaalne eelvaade valmib sekunditega. Pärast portree genereerimist saadame trükitud lõuendi järgmisel tööpäeval — tasuta üle Eesti.",
      cta: "Alusta portree tellimist",
    },
    gallery: {
      eyebrow: "Portreed päris interjööris",
      title: "Kujutle oma portreed koduseinal",
      description:
        "Vaata, kuidas personaalne lõuendiportree saab osaks hubasest ja moodsast interjöörist. Näited annavad ettekujutuse tegelikust mõõdust, loomulikust valgusest ning alusraamile pingutatud lõuendi ilmest.",
      items: [
        "Pulmaportree soojas elutoas",
        "Pereportree skandinaavialikus interjööris",
        "Paariportree pehmetes neutraalsetes toonides",
        "Moodne portree kaasaegses elutoas",
        "Sinine Dream Art portree kodukontoris",
        "Noore tšempioni portree koralltoonides",
        "Noore tšempioni portree türkiissinistes toonides",
        "Pidulik portree moodsas kabinetis",
        "Ere Dream Art portree elutoas",
      ],
      cta: "Loo portree minu koju",
    },
    reviews: {
      eyebrow: "Tagasiside",
      title: "Mida kingiostjad ütlevad",
      description:
        "Näidistsitaadid, kuidas portreed fotost Eestis kingituseks tellitakse. Asenda need päris arvustustega, kui need on olemas.",
      sampleBadge: "Näidis",
      empty: "Kliendiarvustused ilmuvad siia.",
    },
    order: {
      sectionTitle: "Alusta transformatsiooni",
      sectionDesc: "Vali suurus ja laadi foto üles, et alustada.",
      steps: {
        upload: "Laadi üles",
        size: "Suurus",
        process: "Töötle",
        select: "Vali",
        pay: "Maksa",
      },
      upload: {
        title: "Laadi üles oma foto",
        desc: "Parimad on kõrge eraldusvõimega fotod (JPG, PNG)",
        button: "Vali fail",
        footer:
          "Digitaalne eelvaade valmib sekunditega. Trükitud lõuendi saadame järgmisel tööpäeval — tasuta üle Eesti.",
      },
      size: {
        title: "Vali lõuendi suurus",
        premium: "Premium lõuend",
        back: "Tagasi",
        button: "Töötle",
      },
      background: {
        title: "Vali mõlema portree värvid",
        desc: "Määra kummalegi loodavale variandile eraldi tausta värvigamma.",
        variant1: "Portree variant 1",
        variant2: "Portree variant 2",
        options: {
          surprise: "Üllatus",
          turquoise: "Türkiis",
          lavender: "Lavendel",
          aqua: "Akvamariin",
          coral: "Korall ja kuld",
          sapphire: "Safiir",
        },
      },
      processing: {
        title: "Sinu portree luuakse...",
        desc: "Loome digitaalset eelvaadet erinevate kunstiliste taustadega.",
      },
      selection: {
        title: "Vali oma tulemus",
        desc: "Vali see, mis sulle kõige rohkem meeldib!",
        button: "Jätka maksmisega",
      },
      checkout: {
        title: "Sinu tellimuse kokkuvõte",
        product: "Toode",
        productName: "Digitaalne maaliportree",
        size: "Suurus",
        total: "Koguhind",
        shippingTitle: "Tarne- ja kontaktandmed",
        fullName: "Täisnimi",
        email: "E-posti aadress",
        address: "Tarneaadress (Tänav, maja, korter)",
        postalCode: "Postiindeks",
        phone: "Telefoninumber",
        payButton: "Maksa Stripe'iga",
        secure: "Turvaline makse Stripe'i kaudu. Kaardiandmeid ei salvestata.",
        delivery:
          "Tasuta tarne üle Eesti. Saadame järgmisel tööpäeval pärast portree genereerimist.",
        notification:
          "Saadame tellimuse uuendused e-postile. Trükitud lõuendi saadame järgmisel tööpäeval pärast genereerimist — tasuta üle Eesti.",
        back: "Tagasi valiku juurde",
      },
    },
    footer: {
      desc: "Maalitud lõuendiportreed sinu fotodest, tasuta tarnega üle Eesti.",
      contact: "Kontakt",
      legal: "Õiguslik teave",
      terms: "Kasutustingimused",
      privacy: "Privaatsuspoliitika",
      delivery: "Tarne",
      blog: "Blogi",
      quickLinks: "Kiirlingid",
      location: "Tallinn, Eesti",
      emailLabel: "E-post",
      rights: "Kõik õigused kaitstud.",
    },
  },
};
