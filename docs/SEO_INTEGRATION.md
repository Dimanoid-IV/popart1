# SEO extension (PopArt.ee)

## What was added

| Area | Files |
|------|--------|
| Site URL + hreflang hubs | `src/lib/seo/site-config.ts` |
| Root metadata (title, description, canonical, OG, Twitter, robots) | `src/lib/seo/root-metadata.ts` |
| JSON-LD builders (Organization, LocalBusiness, WebSite, Article, Breadcrumb) | `src/lib/seo/root-schemas.ts` |
| Barrel exports | `src/lib/seo/index.ts` |
| Global JSON-LD in document | `src/components/seo/RootJsonLd.tsx` |
| Reusable JSON-LD script | `src/components/seo/JsonLdScript.tsx` |
| Extra sitemap URLs | `src/lib/seo/marketing-sitemap-urls.ts` |
| Robots | `src/app/robots.ts` |

## Minimal integration (already applied)

1. **`src/app/layout.tsx`** — `metadata` is now imported from `rootMetadata` (same copy as before, plus `metadataBase`, canonical `https://www.popart.ee`, hreflang alternates, robots hints). `<RootJsonLd />` is rendered once at the top of `<body>` (no UI change).
2. **`src/app/sitemap.ts`** — appends entries from `getMarketingSitemapEntries()` (e.g. `/success`).
3. **`next.config.ts`** — `images.formats`: AVIF + WebP for `next/image` (Core Web Vitals–friendly, non-breaking).

## Hreflang (et / ru / en)

The marketing homepage is a **single URL** with client-side language switching. For `alternates.languages`, localized **blog index** URLs are used as language-specific alternates (`/et/blog`, `/ru/blog`, `/en/blog`), with `x-default` pointing at the homepage. Adjust in `site-config.ts` if you add dedicated locale landing pages later.

## Using Article / Breadcrumb builders on new pages

```tsx
import JsonLdScript from "@/components/seo/JsonLdScript";
import { buildArticleJsonLd, buildBreadcrumbJsonLd } from "@/lib/seo";

// In a Server Component:
<>
  <JsonLdScript data={buildArticleJsonLd({ ... }) as unknown as Record<string, unknown>} />
</>
```

Blog articles already emit their own Article + FAQ JSON-LD; you may optionally align them with `buildArticleJsonLd` in a future small edit.

## Robots

- Allows `/`, disallows `/api/` and `/test-email`.
- `Sitemap`: `https://www.popart.ee/sitemap.xml`

## Verification

- `npm run build`
- After deploy: Rich Results Test / URL Inspection for `https://www.popart.ee/` and one blog URL.
