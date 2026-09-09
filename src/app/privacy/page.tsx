import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/seo/storefront-metadata";

export const metadata: Metadata = buildLegalMetadata("en", "privacy");

export default function PrivacyPage() {
  return <LegalPage locale="en" doc="privacy" />;
}
