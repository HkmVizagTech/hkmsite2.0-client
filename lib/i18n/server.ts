// Server components only. The language comes from the URL segment
// (app/[lang]/…), not a cookie, so every page can be prerendered once per
// language and served from the CDN cache. The rewrites in next.config.ts map
// /x to /en/x (or to /te/x for a visitor who chose Telugu).
import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";
import { makeT, type TFunction } from "./translate";

/** The page's language from its `[lang]` route param. */
export function localeOf(lang: unknown): Locale {
  return isLocale(lang) ? lang : DEFAULT_LOCALE;
}

/** Translator for server components: `const t = getT(lang);` */
export function getT(lang: unknown): TFunction {
  return makeT(localeOf(lang));
}
