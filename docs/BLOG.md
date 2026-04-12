# PopArt.ee blog (SEO)

Isolated under `src/app/(blog)/` — existing routes and files are unchanged.

## URLs

| Pattern | Example |
|---------|---------|
| Blog index | `/et/blog`, `/ru/blog`, `/en/blog` |
| Article | `/et/blog/{slug}`, `/ru/blog/{slug}`, `/en/blog/{slug}` |

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
```

## Adding articles (300+)

1. Create `src/data/blog/{et|ru|en}/{slug}.json`.
2. Same logical article across languages: use the **same `slug`** in each locale folder (for hreflang and sitemap).
3. Required JSON fields: `slug`, `title`, `description`, `publishedAt`, `author`, `coverImage`, `keywords`, `bodyHtml`.
4. Optional: `updatedAt`, `faqs[]`, `relatedSlugs[]` (same locale slugs), `internalLinks[]` (`href` + `label`).
5. Run `npm run build` — `generateStaticParams` discovers all JSON files via `fs.readdirSync`.

`coverImage`: prefer paths under `public/` (e.g. `/og-image.jpg`). Remote `http(s)` URLs use a plain `<img>` with `loading="lazy"` (no `next.config` change).

## SEO features

- Per-page `generateMetadata`: title, description, keywords, canonical, `alternates.languages` (hreflang + `x-default` → Estonian), Open Graph article, Twitter card.
- JSON-LD: `@graph` with `Article`, `BreadcrumbList`, optional `FAQPage` (when `faqs` present). Blog index: `CollectionPage` + `BreadcrumbList`.
- Reading time: `estimateReadingMinutes(bodyHtml)`.

## Linking from the main site

Without editing existing components, you can add links in new places only, e.g. a future footer block or a dedicated “Blog” link component. Sitemap already lists `/et/blog`, `/ru/blog`, `/en/blog`.
