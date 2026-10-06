// Site languages. English is the source text; other languages are
// dictionaries keyed by that exact English string (lib/i18n/te/*), so a
// missing translation simply shows the English — nothing ever breaks.
//
// The choice lives in a cookie and the page is rendered on the server in
// that language (same URL, like GVD's हिंदी switch).

export const LOCALES = ["en", "te"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "hk_lang";

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (LOCALES as readonly string[]).includes(v);

/** Label shown on the switch for the OTHER language. */
export const SWITCH_LABEL: Record<Locale, string> = { en: "తెలుగు", te: "English" };
