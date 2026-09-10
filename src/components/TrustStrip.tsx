"use client";

import { CreditCard, Mail, Truck } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { CONTACT_EMAIL } from "@/lib/site-contact";

export default function TrustStrip() {
  const { t } = useLanguage();

  const items = [
    { icon: Truck, text: `${t.trust.delivery} ${t.trust.ships}` },
    { icon: CreditCard, text: t.trust.payment },
    { icon: Mail, text: t.trust.contact },
  ];

  return (
    <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-indigo-100 bg-white/90 p-5 text-left shadow-lg backdrop-blur-sm">
      <p className="mb-4 text-sm leading-6 text-gray-600">{t.trust.preview}</p>
      <ul className="space-y-3">
        {items.map(({ icon: Icon, text }) => (
          <li key={text} className="flex items-start gap-3 text-sm font-medium text-gray-800">
            <Icon className="mt-0.5 h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
            <span>
              {text.includes(CONTACT_EMAIL) ? (
                <>
                  {text.split(CONTACT_EMAIL)[0]}
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-indigo-600 underline underline-offset-2"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </>
              ) : (
                text
              )}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
