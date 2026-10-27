// URL shape of the two languages:
//   English  /x        (the internal route is /en/x — next.config.ts rewrites to it)
//   Telugu   /te/x
// Shared by the language switch, metadata (canonical + hreflang) and the
// sitemap so they can never disagree. Staff tools (/admin, /donations/admin)
// and /api are never localised; the rewrites in next.config.ts skip them.
import { DEFAULT_LOCALE, type Locale } from "./config";

/**
 * Pages whose content is actually translated into Telugu. Only these get a
 * Telugu canonical, hreflang and sitemap entry; any other /te/ page is still
 * served (menus and buttons in Telugu) but points Google at the English page,
 * so a mostly-English "Telugu" copy is never indexed as a duplicate. Add a
 * path here once its page text goes through t().
 */
export const TE_INDEXABLE = ["/", "/iskcon-vizag-temple", "/vaikuntham", "/pitru-paksha", "/vaikuntha-ekadashi", "/diwali"];
export const isTeIndexable = (path: string) => TE_INDEXABLE.includes(stripLocale(path));

/** "/te/gau-seva" -> "/gau-seva", "/te" -> "/", "/gau-seva" -> "/gau-seva". */
export function stripLocale(path: string): string {
  const m = path.match(/^\/(en|te)(?=\/|$)/);
  if (!m) return path || "/";
  const rest = path.slice(m[0].length);
  return rest || "/";
}

/** Public URL of `path` in `lang` ("/gau-seva", "te" -> "/te/gau-seva"). */
export function localizedPath(path: string, lang: Locale): string {
  const base = stripLocale(path.startsWith("/") ? path : `/${path}`);
  if (lang === DEFAULT_LOCALE) return base;
  return base === "/" ? `/${lang}` : `/${lang}${base}`;
}
