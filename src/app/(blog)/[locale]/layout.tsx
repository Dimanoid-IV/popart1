import { notFound } from "next/navigation";
import { isValidBlogLocale } from "@/lib/blog";

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function BlogLocaleLayout({ children, params }: Props) {
  const { locale } = await params;
  if (!isValidBlogLocale(locale)) {
    notFound();
  }
  return <>{children}</>;
}
