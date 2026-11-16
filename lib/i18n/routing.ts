// URL shape of the languages:
//   English  /x        (the internal route is /en/x — next.config.ts rewrites to it)
//   others   /<code>/x (e.g. /te/x, /hi/x)
// Shared by the language switch, metadata (canonical + hreflang) and the
// sitemap so they can never disagree. Staff tools (/admin, /donations/admin)
// and /api are never localised; the rewrites in next.config.ts skip them.
import { DEFAULT_LOCALE, LOCALES, type Locale } from "./config";

/**
 * Pages whose content is actually translated (their page text goes through t()).
 * Only these get a per-language canonical, hreflang and sitemap entry; any other
 * /<code>/ page is still served (menus and buttons translated) but points Google
 * at the English page, so a mostly-English copy is never indexed as a duplicate.
 */
export const TRANSLATED_PAGES = ["/", "/iskcon-vizag-temple", "/vaikuntham", "/pitru-paksha", "/vaikuntha-ekadashi", "/diwali", "/understand-gita", "/srila-prabhupada"];
export const isTranslatedPage = (path: string) => TRANSLATED_PAGES.includes(stripLocale(path));
/** Languages other than English (each has its own /<code>/ URLs). */
export const OTHER_LOCALES = LOCALES.filter((l) => l !== DEFAULT_LOCALE);

const LOCALE_PREFIX = new RegExp(`^/(${LOCALES.join("|")})(?=/|$)`);

/** "/te/gau-seva" -> "/gau-seva", "/te" -> "/", "/gau-seva" -> "/gau-seva". */
export function stripLocale(path: string): string {
  const m = path.match(LOCALE_PREFIX);
  if (!m) return path || "/";
  const rest = path.slice(m[0].length);
  return rest || "/";
}

/** Public URL of `path` in `lang` ("/gau-seva", "hi" -> "/hi/gau-seva"). */
export function localizedPath(path: string, lang: Locale): string {
  const base = stripLocale(path.startsWith("/") ? path : `/${path}`);
  if (lang === DEFAULT_LOCALE) return base;
  return base === "/" ? `/${lang}` : `/${lang}${base}`;
}
