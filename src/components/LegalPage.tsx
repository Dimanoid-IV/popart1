import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getLegalDocument, type LegalDocId } from "@/lib/legal-content";
import type { Language } from "@/lib/translations";

export default function LegalPage({
  locale,
  doc,
}: {
  locale: Language;
  doc: LegalDocId;
}) {
  const content = getLegalDocument(locale, doc);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <main className="flex-grow">
        <article className="container mx-auto max-w-3xl px-4 py-16 sm:px-6">
          <h1 className="text-4xl font-black tracking-tight text-gray-900">
            {content.title}
          </h1>
          <p className="mt-3 text-sm text-gray-500">{content.updated}</p>
          <div className="mt-10 space-y-8">
            {content.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold text-gray-900">
                  {section.heading}
                </h2>
                {section.paragraphs.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="mt-3 text-base leading-7 text-gray-700"
                  >
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
