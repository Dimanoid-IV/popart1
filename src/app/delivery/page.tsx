import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/seo/storefront-metadata";

export const metadata: Metadata = buildLegalMetadata("en", "delivery");

export default function DeliveryPage() {
  return <LegalPage locale="en" doc="delivery" />;
}
