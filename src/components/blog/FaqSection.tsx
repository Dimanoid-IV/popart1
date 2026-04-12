import type { BlogFaqItem } from "@/lib/blog/types";

type Props = {
  faqs: BlogFaqItem[];
  heading: string;
};

export default function FaqSection({ faqs, heading }: Props) {
  if (!faqs.length) return null;
  return (
    <section className="mt-12 border-t border-gray-200 pt-10" aria-labelledby="blog-faq-heading">
      <h2 id="blog-faq-heading" className="text-2xl font-bold text-gray-900">
        {heading}
      </h2>
      <dl className="mt-6 space-y-6">
        {faqs.map((faq, i) => (
          <div key={i}>
            <dt className="font-semibold text-gray-900">{faq.question}</dt>
            <dd className="mt-2 text-gray-700">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
