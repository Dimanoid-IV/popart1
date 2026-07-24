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
    const path = "src/lib/seo/root-metadata.ts";

    try {
      const current = await readTextFile({ owner, repo, branch, path });
      const next = applyMetadataFix(current.content, payload);

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
        path,
        sha: current.sha,
        content: next.content,
        message: `Apply RankBoost SEO fix: ${payload.fix?.id ?? payload.task?.id ?? "metadata"}`,
      });

      return json(200, {
        ok: true,
        applied: true,
        externalId: payload.fix?.id ?? payload.task?.id ?? path,
        url: "https://www.popart.ee",
        githubPath: path,
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
