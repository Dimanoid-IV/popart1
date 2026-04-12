import { buildRootJsonLd } from "@/lib/seo/root-schemas";

/**
 * Global structured data (Organization, LocalBusiness, WebSite).
 * No visual output; safe to include once in root layout.
 */
export default function RootJsonLd() {
  const data = buildRootJsonLd();
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
