import type { Language } from "@/lib/translations";
import { buildStorefrontProductJsonLd } from "@/lib/seo/product-schema";
import JsonLdScript from "./JsonLdScript";

export default function StorefrontJsonLd({ locale }: { locale: Language }) {
  return (
    <JsonLdScript
      data={buildStorefrontProductJsonLd(locale) as Record<string, unknown>}
    />
  );
}
