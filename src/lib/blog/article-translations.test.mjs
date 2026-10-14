import assert from "node:assert/strict";
import test from "node:test";

import { getArticleTranslationCandidates } from "./article-translations.ts";

test("different article slugs resolve through one reciprocal translation group", () => {
  const expected = {
    et: "personaalne-kingitus-naisele-eestis",
    ru: "personalnyy-podarok-zhenshchine-estonia",
    en: "personal-gift-for-her-estonia",
  };

  assert.deepEqual(
    getArticleTranslationCandidates("et", expected.et),
    expected
  );
  assert.deepEqual(
    getArticleTranslationCandidates("ru", expected.ru),
    expected
  );
  assert.deepEqual(
    getArticleTranslationCandidates("en", expected.en),
    expected
  );
});

test("same-slug candidates are validated uniformly across locales", () => {
  assert.deepEqual(getArticleTranslationCandidates("ru", "shared-slug"), {
    et: "shared-slug",
    ru: "shared-slug",
    en: "shared-slug",
  });
});
