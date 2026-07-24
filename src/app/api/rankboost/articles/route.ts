import { createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import type { BlogArticle, BlogCategoryId, BlogLocale } from "@/lib/blog/types";

export const runtime = "nodejs";

const DEFAULT_OWNER = "Dimanoid-IV";
const DEFAULT_REPO = "popart1";
const DEFAULT_BRANCH = "main";
const DEFAULT_COVER = "/pic1.jpg";

type RankBoostPayload = {
  event?: string;
  dryRun?: boolean;
  task?: {
    id?: string;
  };
  fix?: {
    id?: string;
    type?: string;
    field?: string | null;
    title?: string;
    preview?: string;
    suggestedValue?: string;
    summary?: string | null;
    implementationNotes?: string | null;
  };
  article?: {
    id?: string;
    title?: string;
    slug?: string;
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
    html?: string;
    markdown?: string;
    language?: string;
    targetKeyword?: string;
    qualityScore?: number | null;
    keywords?: string[];
    tags?: string[];
    categories?: string[];
  };
};

function json(status: number, body: Record<string, unknown>) {
  return NextResponse.json(body, { status });
}

function sign(body: string, secret: string) {
  return `sha256=${createHmac("sha256", secret).update(body, "utf8").digest("hex")}`;
}

function verifySignature(body: string, secret: string, header: string | null) {
  if (!secret || !header) return false;
  const expected = Buffer.from(sign(body, secret));
  const actual = Buffer.from(header.trim());
  if (expected.length !== actual.length) return false;
  try {
    return timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

function validLocale(value: string | undefined): BlogLocale {
  const normalized = value?.trim().toLowerCase();
  if (normalized === "et" || normalized === "en" || normalized === "ru") {
    return normalized;
  }
  return "ru";
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9а-яё\s-]/gi, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
    .replace(/^-|-$/g, "");
}

function sanitizeHtml(html: string) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s(href|src)\s*=\s*(['"])\s*javascript:.*?\2/gi, "");
}

function excerptFromHtml(html: string, fallback: string) {
  const text = html
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return (text || fallback).slice(0, 155);
}

function inferCategory(payload: RankBoostPayload): BlogCategoryId {
  const text = [
    payload.article?.title,
    payload.article?.targetKeyword,
    ...(payload.article?.categories ?? []),
    ...(payload.article?.tags ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (/dream|fantasy|fantaasia|фантаз|дрим/.test(text)) return "dream-art";
  if (/tallinn|estonia|eesti|эстон|таллин/.test(text)) return "local-estonia";
  if (/interior|sein|wall|интерьер|стен/.test(text)) return "interior";
  if (/photo|foto|portrait|portree|портрет|холст|canvas/.test(text)) {
    return "portrait-guide";
  }
  return "gifts";
}

function buildArticle(payload: RankBoostPayload): BlogArticle {
  const article = payload.article ?? {};
  const title = article.title?.trim() || article.metaTitle?.trim();
  if (!title) {
    throw new Error("missing_title");
  }

  const bodyHtml = sanitizeHtml(article.html?.trim() || "");
  if (!bodyHtml || bodyHtml.length < 200) {
    throw new Error("missing_html");
  }

  const locale = validLocale(article.language);
  const slug = slugify(article.slug || title);
  if (!slug) {
    throw new Error("missing_slug");
  }

  const keywords = [
    article.targetKeyword,
    ...(article.keywords ?? []),
    ...(article.tags ?? []),
    "PopArt.ee",
  ]
    .filter((item): item is string => Boolean(item?.trim()))
    .map((item) => item.trim())
    .slice(0, 8);

  const today = new Date().toISOString().slice(0, 10);

  return {
    slug,
    locale,
    category: inferCategory(payload),
    title,
    description:
      article.metaDescription?.trim() || excerptFromHtml(bodyHtml, title),
    publishedAt: today,
    author: {
      name: "PopArt.ee",
      url: "https://www.popart.ee",
      jobTitle:
        locale === "ru"
          ? "Художественные портреты"
          : locale === "et"
            ? "Kunstilised portreed"
            : "Art portraits",
    },
    coverImage: DEFAULT_COVER,
    keywords,
    bodyHtml,
    faqs: [],
    relatedSlugs: [],
    internalLinks: [
      {
        href: "https://www.popart.ee/#order-now",
        label:
          locale === "ru"
            ? "заказать портрет"
            : locale === "et"
              ? "telli portree"
              : "order a portrait",
      },
    ],
  };
}

async function githubRequest(path: string, init: RequestInit = {}) {
  const token = process.env.POPART_GITHUB_TOKEN;
  if (!token) {
    return {
      ok: false,
      status: 500,
      body: { error: "github_token_missing" },
    };
  }

  const response = await fetch(`https://api.github.com${path}`, {
    ...init,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "PopArt-RankBoost-Publisher/1.0",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init.headers ?? {}),
    },
  });

  let body: unknown = null;
  try {
    body = await response.json();
  } catch {
    body = null;
  }

  return { ok: response.ok, status: response.status, body };
}

async function fileExists(input: {
  owner: string;
  repo: string;
  branch: string;
  path: string;
}) {
  const result = await githubRequest(
    `/repos/${input.owner}/${input.repo}/contents/${encodeURIComponent(input.path).replace(/%2F/g, "/")}?ref=${encodeURIComponent(input.branch)}`
  );
  if (result.status === 404) return false;
  if (!result.ok) {
    throw new Error(`github_lookup_${result.status}`);
  }
  return true;
}

async function readTextFile(input: {
  owner: string;
  repo: string;
  branch: string;
  path: string;
}) {
  const result = await githubRequest(
    `/repos/${input.owner}/${input.repo}/contents/${encodeURIComponent(input.path).replace(/%2F/g, "/")}?ref=${encodeURIComponent(input.branch)}`
  );
  if (!result.ok) {
    throw new Error(`github_read_${result.status}`);
  }
  const body = result.body as { content?: string; encoding?: string; sha?: string };
  if (!body.content || body.encoding !== "base64" || !body.sha) {
    throw new Error("github_read_invalid");
  }
  return {
    sha: body.sha,
    content: Buffer.from(body.content, "base64").toString("utf8"),
  };
}

async function updateTextFile(input: {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  sha: string;
  content: string;
  message: string;
}) {
  const result = await githubRequest(
    `/repos/${input.owner}/${input.repo}/contents/${encodeURIComponent(input.path).replace(/%2F/g, "/")}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message: input.message,
        content: Buffer.from(input.content, "utf8").toString("base64"),
        sha: input.sha,
        branch: input.branch,
        committer: {
          name: "RankBoost Publisher",
          email: "rankboost@popart.ee",
        },
        author: {
          name: "RankBoost Publisher",
          email: "rankboost@popart.ee",
        },
      }),
    }
  );

  if (!result.ok) {
    throw new Error(`github_update_${result.status}`);
  }

  return result.body as { commit?: { sha?: string } };
}

function escapeForDoubleQuotedTs(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function replaceStringProperty(source: string, property: string, value: string) {
  const escaped = escapeForDoubleQuotedTs(value.trim().slice(0, 220));
  const pattern = new RegExp(`(${property}:\\\\s*)\"[^\"]*\"`);
  if (!pattern.test(source)) return null;
  return source.replace(pattern, `$1"${escaped}"`);
}

function applyMetadataFix(source: string, payload: RankBoostPayload) {
  const field = payload.fix?.field?.trim().toLowerCase();
  const value = payload.fix?.suggestedValue?.trim() || payload.fix?.preview?.trim();
  if (!field || !value) {
    return { applied: false, reason: "missing_field_or_value", content: source };
  }

  if (field === "meta_title") {
    const next = replaceStringProperty(source, "default", value);
    return next
      ? { applied: next !== source, reason: "applied_meta_title", content: next }
      : { applied: false, reason: "meta_title_target_not_found", content: source };
  }

  if (field === "meta_description") {
    const next = replaceStringProperty(source, "description", value);
    return next
      ? { applied: next !== source, reason: "applied_meta_description", content: next }
      : { applied: false, reason: "meta_description_target_not_found", content: source };
  }

  return { applied: false, reason: "unsupported_fix_field", content: source };
}

function fixHaystack(payload: RankBoostPayload) {
  return [
    payload.fix?.field,
    payload.fix?.title,
    payload.fix?.preview,
    payload.fix?.suggestedValue,
    payload.fix?.summary,
    payload.fix?.implementationNotes,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function isFaqFix(payload: RankBoostPayload) {
  return /faq|faqpage|частых вопросов|faq-размет|schema/.test(
    fixHaystack(payload)
  );
}

function isThinContentFix(payload: RankBoostPayload) {
  return /мало текста|маловато|контента|thin content|word count|word_count|300.?500|описание услуг/.test(
    fixHaystack(payload)
  );
}

function applyRootFaqSchemaFix(source: string) {
  if (source.includes("@id\": `${SITE_ORIGIN}#rankboost-faq`")) {
    return { applied: true, reason: "already_applied_faq_schema", content: source };
  }

  const marker = `      {
        "@type": "WebSite",
        "@id": \`${"${SITE_ORIGIN}"}#website\`,`;
  if (!source.includes(marker)) {
    return { applied: false, reason: "faq_schema_target_not_found", content: source };
  }

  const faqBlock = `      {
        "@type": "FAQPage",
        "@id": \`${"${SITE_ORIGIN}"}#rankboost-faq\`,
        mainEntity: [
          {
            "@type": "Question",
            name: "How do I order a portrait from a photo?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Upload your photo, choose a canvas size, review the preview, and confirm the order before printing.",
            },
          },
          {
            "@type": "Question",
            name: "Can I use the portrait as a gift?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Yes. PopArt.ee portraits are designed for birthdays, weddings, holidays, and personal wall art gifts.",
            },
          },
          {
            "@type": "Question",
            name: "Do you deliver in Estonia?",
            acceptedAnswer: {
              "@type": "Answer",
              text: "Orders can be prepared online and delivered across Estonia after preview approval and printing.",
            },
          },
        ],
      },
`;

  return {
    applied: true,
    reason: "applied_faq_schema",
    content: source.replace(marker, faqBlock + marker),
  };
}

function applyHomepageContentFix(source: string) {
  if (
    source.includes('id="rankboost-seo-content"') &&
    source.includes('id="rankboost-seo-content-expanded"')
  ) {
    return { applied: true, reason: "already_applied_homepage_content", content: source };
  }

  if (source.includes('id="rankboost-seo-content"')) {
    const marker = `              <a
                href="#order-now"`;
    if (!source.includes(marker)) {
      return { applied: false, reason: "homepage_content_expand_target_not_found", content: source };
    }

    const expansion = `              <div id="rankboost-seo-content-expanded" className="mt-6 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
                  <h3 className="text-lg font-bold text-gray-900">
                    What makes the portrait feel personal?
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-700">
                    The best result usually comes from one meaningful photo, not a
                    large album of almost-right images. Choose a photo where the face,
                    eyes, and expression are clear. Tell us whether the portrait is for
                    a partner, parent, friend, child, pet owner, or business gift so the
                    final artwork can match the occasion.
                  </p>
                </div>
                <div className="rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
                  <h3 className="text-lg font-bold text-gray-900">
                    How to plan timing and delivery
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-gray-700">
                    For birthdays, weddings, Christmas, and anniversaries, leave time
                    for preview feedback, printing, packaging, and delivery. If the date
                    is important, mention it before checkout. Clear timing helps avoid
                    rushed artwork and gives you a calmer gift experience.
                  </p>
                </div>
              </div>

`;

    return {
      applied: true,
      reason: "expanded_homepage_content",
      content: source.replace(marker, expansion + marker),
    };
  }

  const marker = "        {/* Pricing Section with Sofa */}";
  if (!source.includes(marker)) {
    return { applied: false, reason: "homepage_content_target_not_found", content: source };
  }

  const section = `        <section id="rankboost-seo-content" className="py-20 bg-indigo-50/50">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-4xl rounded-3xl border border-indigo-100 bg-white p-8 shadow-sm">
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                Custom portrait guide
              </p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-gray-900 md:text-4xl">
                Custom digital painting portraits from your photo
              </h2>
              <div className="mt-5 space-y-4 text-base leading-8 text-gray-700">
                <p>
                  PopArt.ee turns your favourite photos into custom digital painting
                  portraits for gifts, wall art, family memories, and special
                  occasions. The process is simple: upload a clear photo, choose a
                  canvas size, review the preview, and confirm the final print when
                  the portrait feels right.
                </p>
                <p>
                  A good portrait starts with a sharp image and a story worth keeping.
                  Natural light, visible facial details, and a relaxed expression help
                  the artwork feel personal instead of generic. If you are ordering
                  for a birthday, wedding, anniversary, or holiday gift, add your
                  deadline early so production and delivery can be planned honestly.
                </p>
                <p>
                  Every order is made for real homes: canvas sizes are easy to compare,
                  the preview step protects the result before printing, and delivery
                  can be arranged across Estonia. Start with the photo you love most,
                  then use the order flow below to create a portrait that looks
                  intentional, warm, and ready to give.
                </p>
              </div>
              <a
                href="#order-now"
                className="mt-6 inline-flex rounded-full bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700"
              >
                Start your portrait order
              </a>
            </div>
          </div>
        </section>

`;

  return {
    applied: true,
    reason: "applied_homepage_content",
    content: source.replace(marker, section + marker),
  };
}

async function createArticleFile(input: {
  owner: string;
  repo: string;
  branch: string;
  path: string;
  article: BlogArticle;
  rankboostArticleId?: string;
}) {
  const content = `${JSON.stringify(input.article, null, 2)}\n`;
  const result = await githubRequest(
    `/repos/${input.owner}/${input.repo}/contents/${encodeURIComponent(input.path).replace(/%2F/g, "/")}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message: `Publish RankBoost article: ${input.article.slug}`,
        content: Buffer.from(content, "utf8").toString("base64"),
        branch: input.branch,
        committer: {
          name: "RankBoost Publisher",
          email: "rankboost@popart.ee",
        },
        author: {
          name: "RankBoost Publisher",
          email: "rankboost@popart.ee",
        },
      }),
    }
  );

  if (!result.ok) {
    throw new Error(`github_create_${result.status}`);
  }

  return result.body as { content?: { sha?: string; html_url?: string }; commit?: { sha?: string } };
}

export async function POST(request: NextRequest) {
  const secret = process.env.RANKBOOST_WEBHOOK_SECRET;
  if (!secret) {
    return json(500, { ok: false, error: "rankboost_secret_missing" });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-rankboost-signature");
  if (!verifySignature(rawBody, secret, signature)) {
    return json(401, { ok: false, error: "invalid_signature" });
  }

  let payload: RankBoostPayload;
  try {
    payload = JSON.parse(rawBody) as RankBoostPayload;
  } catch {
    return json(400, { ok: false, error: "invalid_json" });
  }

  if (payload.event === "rankboost.test" || payload.dryRun === true) {
    return json(200, {
      ok: true,
      dryRun: true,
      accepted: true,
      message: "RankBoost webhook is connected.",
    });
  }

  if (payload.event === "site.fix.ready") {
    const owner = process.env.POPART_GITHUB_OWNER || DEFAULT_OWNER;
    const repo = process.env.POPART_GITHUB_REPO || DEFAULT_REPO;
    const branch = process.env.POPART_GITHUB_BRANCH || DEFAULT_BRANCH;
    const target =
      isThinContentFix(payload)
        ? {
            path: "src/app/page.tsx",
            apply: applyHomepageContentFix,
          }
        : isFaqFix(payload)
          ? {
              path: "src/lib/seo/root-schemas.ts",
              apply: applyRootFaqSchemaFix,
            }
          : {
              path: "src/lib/seo/root-metadata.ts",
              apply: (source: string) => applyMetadataFix(source, payload),
            };

    try {
      const current = await readTextFile({ owner, repo, branch, path: target.path });
      const next = target.apply(current.content);

      if (!next.applied) {
        return json(422, {
          ok: false,
          applied: false,
          error: next.reason,
        });
      }

      const updated = await updateTextFile({
        owner,
        repo,
        branch,
        path: target.path,
        sha: current.sha,
        content: next.content,
        message: `Apply RankBoost SEO fix: ${payload.fix?.id ?? payload.task?.id ?? target.path}`,
      });

      return json(200, {
        ok: true,
        applied: true,
        externalId: payload.fix?.id ?? payload.task?.id ?? target.path,
        url: "https://www.popart.ee",
        githubPath: target.path,
        reason: next.reason,
        commitSha: updated.commit?.sha ?? null,
      });
    } catch (error) {
      return json(502, {
        ok: false,
        applied: false,
        error: error instanceof Error ? error.message : "fix_apply_failed",
      });
    }
  }

  if (payload.event !== "article.ready") {
    return json(400, { ok: false, error: "unsupported_event" });
  }

  let article: BlogArticle;
  try {
    article = buildArticle(payload);
  } catch (error) {
    return json(422, {
      ok: false,
      error: error instanceof Error ? error.message : "invalid_article",
    });
  }

  const owner = process.env.POPART_GITHUB_OWNER || DEFAULT_OWNER;
  const repo = process.env.POPART_GITHUB_REPO || DEFAULT_REPO;
  const branch = process.env.POPART_GITHUB_BRANCH || DEFAULT_BRANCH;
  const path = `src/data/blog/${article.locale}/${article.slug}.json`;
  const publicUrl = `https://www.popart.ee/${article.locale}/blog/${article.slug}`;

  try {
    if (await fileExists({ owner, repo, branch, path })) {
      return json(200, {
        ok: true,
        duplicate: true,
        externalId: `${article.locale}/${article.slug}`,
        url: publicUrl,
      });
    }

    const created = await createArticleFile({
      owner,
      repo,
      branch,
      path,
      article,
      rankboostArticleId: payload.article?.id,
    });

    return json(201, {
      ok: true,
      externalId: `${article.locale}/${article.slug}`,
      url: publicUrl,
      githubPath: path,
      commitSha: created.commit?.sha ?? null,
    });
  } catch (error) {
    return json(502, {
      ok: false,
      error: error instanceof Error ? error.message : "github_publish_failed",
    });
  }
}
