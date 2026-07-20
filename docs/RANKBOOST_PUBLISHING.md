# RankBoost blog publishing endpoint

PopArt.ee stores blog articles as JSON files under:

```text
src/data/blog/{locale}/{slug}.json
```

Because Vercel deployments cannot safely write source files at runtime, the RankBoost endpoint publishes by committing a new JSON article file to GitHub. Vercel then redeploys the site from the commit.

## Endpoint

```text
POST https://www.popart.ee/api/rankboost/articles
```

RankBoost should use this URL in Custom API / Webhook settings.

## Required Vercel environment variables

```text
RANKBOOST_WEBHOOK_SECRET=long-random-secret
POPART_GITHUB_TOKEN=github_pat_...
POPART_GITHUB_OWNER=Dimanoid-IV
POPART_GITHUB_REPO=popart1
POPART_GITHUB_BRANCH=main
```

`RANKBOOST_WEBHOOK_SECRET` must be the same secret saved in RankBoost custom webhook settings.

`POPART_GITHUB_TOKEN` should be a fine-grained GitHub token limited to this repository with **Contents: Read and write**.

## Security

- Requests must include `X-RankBoost-Signature`.
- Signature format is `sha256=<hex HMAC SHA-256>`.
- The HMAC input is the exact raw JSON body.
- The endpoint does not return or log secrets.
- Dry-run requests do not write to GitHub.
- Real article writes are idempotent by `{locale}/{slug}`: if the JSON file already exists, the endpoint returns success with `duplicate: true` and does not create another file.

## Supported RankBoost payload

Dry-run:

```json
{
  "event": "rankboost.test",
  "dryRun": true,
  "article": {
    "id": "article-id",
    "slug": "test-slug",
    "metaTitle": "Test"
  }
}
```

Real publish:

```json
{
  "event": "article.ready",
  "dryRun": false,
  "article": {
    "id": "rankboost-article-id",
    "title": "Article title",
    "slug": "article-slug",
    "metaTitle": "SEO title",
    "metaDescription": "SEO description",
    "html": "<p>Article HTML...</p>",
    "language": "ru",
    "targetKeyword": "портрет по фото"
  }
}
```

## Response

```json
{
  "ok": true,
  "externalId": "ru/article-slug",
  "url": "https://www.popart.ee/ru/blog/article-slug",
  "githubPath": "src/data/blog/ru/article-slug.json",
  "commitSha": "..."
}
```

The URL becomes live after Vercel finishes deploying the GitHub commit.
