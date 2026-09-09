import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { buildLegalMetadata } from "@/lib/seo/storefront-metadata";

export const metadata: Metadata = buildLegalMetadata("en", "terms");

export default function TermsPage() {
  return <LegalPage locale="en" doc="terms" />;
}
