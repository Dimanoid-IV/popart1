import HomePage from "@/components/HomePage";
import StorefrontJsonLd from "@/components/seo/StorefrontJsonLd";

export default function Home() {
  return (
    <>
      <StorefrontJsonLd locale="en" />
      <HomePage />
    </>
  );
}
