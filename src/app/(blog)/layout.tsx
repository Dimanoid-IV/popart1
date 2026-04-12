import type { Metadata } from "next";
import { SITE_URL } from "@/lib/blog";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
};

export default function BlogGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
