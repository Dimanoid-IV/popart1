# PopArt.ee blog (SEO)

Isolated under `src/app/(blog)/` — existing routes and files are unchanged.

## URLs

| Pattern | Example |
|---------|---------|
| Blog index | `/et/blog`, `/ru/blog`, `/en/blog` |
| Article | `/et/blog/{slug}`, `/ru/blog/{slug}`, `/en/blog/{slug}` |
| Category hub | `/et/blog/category/{category}`, … (see `BlogCategoryId` in `types.ts`) |

Categories: `gifts`, `portrait-guide`, `interior`, `local-estonia` — labels in `src/lib/blog/categories.ts`.  
Optional JSON field: `"category": "gifts"` (etc.). Sitemap includes every locale × category hub automatically.

`SITE_URL` is defined in `src/lib/blog/constants.ts` (default `https://www.popart.ee`).

## Folder structure

```
src/
  app/
    (blog)/
      [locale]/
        layout.tsx          # Validates et | ru | en
        blog/
          page.tsx          # Listing + CollectionPage JSON-LD
          [slug]/
            page.tsx        # Article + generateMetadata + hreflang
          category/
            [category]/
              page.tsx      # Category listing + CollectionPage JSON-LD
    sitemap.ts              # Home + blog indexes + all articles
  components/blog/
    ArticleTemplate.tsx
    AuthorBlock.tsx
    BlogArticleImage.tsx
    Breadcrumbs.tsx
    FaqSection.tsx
    InternalLinks.tsx
    JsonLd.tsx
    RelatedArticles.tsx
    BlogCategoryChips.tsx
  data/blog/
    et/*.json
    ru/*.json
    en/*.json
  lib/blog/
    constants.ts
    fs-articles.ts
    index.ts
    paths.ts
    reading-time.ts
    schema.ts
    types.ts
    ui-labels.ts
    categories.ts
```

## Adding articles (300+)

1. Create `src/data/blog/{et|ru|en}/{slug}.json`.
2. Same logical article across languages: use the **same `slug`** in each locale folder (for hreflang and sitemap).
3. Required JSON fields: `slug`, `title`, `description`, `publishedAt`, `author`, `coverImage`, `keywords`, `bodyHtml`.
4. Optional: `category` (one of the four ids), `updatedAt`, `faqs[]`, `relatedSlugs[]` (same locale slugs), `internalLinks[]` (`href` + `label`).
5. Run `npm run build` — `generateStaticParams` discovers all JSON files via `fs.readdirSync`.

`coverImage`: prefer paths under `public/` (e.g. `/og-image.jpg`). Remote `http(s)` URLs use a plain `<img>` with `loading="lazy"` (no `next.config` change).

## SEO features

- Per-page `generateMetadata`: title, description, keywords, canonical, `alternates.languages` (hreflang + `x-default` → Estonian), Open Graph article, Twitter card.
- JSON-LD: `@graph` with `Article`, `BreadcrumbList`, optional `FAQPage` (when `faqs` present). Blog index: `CollectionPage` + `BreadcrumbList`.
- Reading time: `estimateReadingMinutes(bodyHtml)`.

## Conversion (CRO) on blog pages

- Copy and UI blocks: `src/lib/blog/cro-labels.ts`, `BlogCroTrustStrip`, `BlogCroMidCta`, `BlogCroBottomCta`, `BlogListCroBanner`.
- Articles: trust strip + local proof after the hero image; mid-CTA after `bodyHtml` (links to `/#order-now` and `/`); bottom CTA after FAQ, before author.
- Blog index & category listing: `BlogListCroBanner` at the bottom.
- To tune messaging, edit `cro-labels.ts` only (no order-flow logic changes).

## Linking from the main site

Without editing existing components, you can add links in new places only, e.g. a future footer block or a dedicated “Blog” link component. Sitemap already lists `/et/blog`, `/ru/blog`, `/en/blog`.
