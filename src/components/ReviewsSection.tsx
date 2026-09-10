"use client";

import { Quote } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";
import {
  FACEBOOK_PAGE_NAME,
  FACEBOOK_REVIEWS_URL,
  REVIEWS,
} from "@/lib/reviews";

export default function ReviewsSection() {
  const { t } = useLanguage();

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
          <ul className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-2">
            {REVIEWS.map((review) => (
              <li
                key={review.name}
                className="relative flex h-full flex-col rounded-3xl border border-indigo-100 bg-white p-7 shadow-sm"
              >
                <Quote className="h-8 w-8 text-indigo-200" aria-hidden />
                {review.recommends ? (
                  <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-indigo-600">
                    {t.reviews.recommends}
                  </p>
                ) : null}
                <blockquote
                  lang="ru"
                  className="mt-3 flex-1 text-base leading-7 text-gray-800"
                >
                  {review.quote}
                </blockquote>
                <p className="mt-6 text-sm font-bold text-gray-900">
                  {review.name}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {t.reviews.published[review.publishedMonth] ??
                    review.publishedMonth}{" "}
                  · {FACEBOOK_PAGE_NAME}
                </p>
                <a
                  href={review.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 text-sm font-semibold text-indigo-600 underline-offset-2 hover:underline"
                >
                  {t.reviews.facebook}
                </a>
              </li>
            ))}
          </ul>
        )}

        {REVIEWS.length > 0 ? (
          <p className="mt-8 text-center text-sm text-gray-500">
            <a
              href={FACEBOOK_REVIEWS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-indigo-600 underline-offset-2 hover:underline"
            >
              {t.reviews.seeAllOnFacebook}
            </a>
          </p>
        ) : null}
      </div>
    </section>
  );
}
