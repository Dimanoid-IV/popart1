type Props = {
  data: Record<string, unknown>;
};

/** Generic JSON-LD script for pages that extend SEO without duplicating logic. */
export default function JsonLdScript({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
