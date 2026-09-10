"use client";

import { Quote, Star } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import { REVIEWS } from "@/lib/reviews";

export default function ReviewsSection() {
  const { t, language } = useLanguage();

  return (
    <section id="reviews" className="bg-indigo-50/40 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-indigo-600">
            {t.reviews.eyebrow}
          </p>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-gray-900 md:text-5xl">
            {t.reviews.title}
          </h2>
          <p className="mt-5 text-base leading-8 text-gray-600 md:text-lg">
            {t.reviews.description}
          </p>
        </div>

        {REVIEWS.length === 0 ? (
          <p className="mx-auto mt-10 max-w-xl text-center text-sm text-gray-500">
            {t.reviews.empty}
          </p>
        ) : (
          <ul className="mx-auto mt-12 grid max-w-6xl gap-6 md:grid-cols-3">
            {REVIEWS.map((review, index) => (
              <li
                key={`${review.city}-${index}`}
                className="relative flex h-full flex-col rounded-3xl border border-dashed border-indigo-200 bg-white p-7 shadow-sm"
              >
                {review.isPlaceholder ? (
                  <span className="absolute right-5 top-5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-800">
                    {t.reviews.sampleBadge}
                  </span>
                ) : null}
                <Quote className="h-8 w-8 text-indigo-200" aria-hidden />
                {!review.isPlaceholder ? (
                  <div
                    className="mt-4 flex gap-1"
                    aria-label={`${review.rating} / 5`}
                  >
                    {Array.from({ length: 5 }).map((_, starIndex) => (
                      <Star
                        key={starIndex}
                        className={`h-4 w-4 ${
                          starIndex < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-gray-200"
                        }`}
                        aria-hidden
                      />
                    ))}
                  </div>
                ) : null}
                <blockquote className="mt-4 flex-1 text-sm leading-7 text-gray-700">
                  {review.quote[language]}
                </blockquote>
                <p className="mt-6 text-sm font-bold text-gray-900">
                  {review.isPlaceholder
                    ? `${t.reviews.sampleAttribution} · ${review.city}`
                    : `${review.name} · ${review.city}`}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
