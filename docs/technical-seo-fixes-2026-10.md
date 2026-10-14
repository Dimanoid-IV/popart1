# Technical SEO fixes — October 2026

## Scope

This change set addresses confirmed technical issues T1, T2, T3, T4, T6 and T8 from the 14 October 2026 audit. It does not change portrait generation, uploads, checkout, Stripe webhooks, order handling, prices, delivery rules or production configuration.

## Implemented fixes

### Hreflang

- Article alternates now contain only published pages.
- Confirmed translations with different slugs use an explicit reciprocal map in `src/lib/blog/article-translations.ts`.
- `x-default` is emitted only when an Estonian translation actually exists.
- Category alternates are limited to locales with a published category page.
- Category titles no longer append `PopArt.ee` before the root title template appends the brand.

### Internal links

- Corrected the Estonian typo `/et/blog/kuningitus-sunnipaevaks` to the published `/et/blog/kingitus-synnipaevaks`.
- Replaced the missing Russian photo guide with `/ru/blog/kak-zakazat-pop-art-portret-po-fotografii`, whose first section covers photo selection.
- Replaced a related article scheduled for 20 October with an already published relevant article.

### Service routes

- `/success` now emits `noindex, nofollow` and no canonical URL; robots.txt allows Google to read that directive.
- `/test-email` returns `404`.
- `/api/test-email` returns `404` unless both development mode and the explicit `ENABLE_TEST_EMAIL_ROUTE=true` flag are present. It remains unavailable in production even if that flag is set.

### Structured data

- Removed the global `FAQPage` graph because its questions and answers were not visible on every page.
- Existing Organization, LocalBusiness and WebSite data remains in place.

### Sitemap

- Removed synthetic build-time `lastModified` values from homepage, legal, blog index and category entries.
- Article entries retain their real `updatedAt` or `publishedAt` value.
- Existing indexable URLs remain included; service pages remain excluded.

## Automated checks

- Passed `npm run test:seo` (4/4): reciprocal translation mapping, published related articles and valid curated article links.
- Passed the selected existing regression suite (12/12): order flow visibility, pricing, generation credits, background options and shipping banner behavior.
- Added `npm run test:seo:http` for rendered metadata, hreflang status and reciprocity, sitemap integrity, canonical URLs, HTML language, service page directives, structured data, internal links and representative redirect chains.
- The local `node_modules` directory contains iCloud dataless placeholders. Next.js and ESLint block while reading those files, so the HTTP suite, `npm run lint` and `npm run build` could not complete locally. No dependency installation was performed; run these three checks in CI or a hydrated checkout before merge.

## Manual configuration still required

The host redirects are outside this repository. Configure Vercel Domains so each source performs one permanent redirect:

- `http://popart.ee/*` → `https://www.popart.ee/*`
- `https://popart.ee/*` → `https://www.popart.ee/*`
- `http://www.popart.ee/*` → `https://www.popart.ee/*`

Use `301` or `308`, preserve the path and query string, and verify all four host/protocol variants after the change.

## Post-deployment verification

1. Run `SEO_TEST_ORIGIN=https://www.popart.ee npm run test:seo:http` after deployment.
2. Confirm `sitemap.xml` processing in Google Search Console.
3. Inspect `/success`, the three translated gift articles and the Dream Art category URLs.
4. Recheck hreflang, selected canonical, crawl status and rendered HTML in URL Inspection.
