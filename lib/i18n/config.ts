// Site languages. English is the source text; other languages are
// dictionaries keyed by that exact English string (lib/i18n/<code>/*), so a
// missing translation simply shows the English — nothing ever breaks.
//
// The choice lives in a cookie (hk_lang) and the page is served from /<code>/x.
// To add a language: add it to LANGUAGES below, create lib/i18n/<code>/index.ts
// and register it in lib/i18n/translate.ts. Routing, the switcher, hreflang
// and the sitemap all follow this list.

export const LANGUAGES = [
  { code: "en", native: "English", english: "English", hreflang: "en-IN", og: "en_IN" },
  { code: "te", native: "తెలుగు", english: "Telugu", hreflang: "te-IN", og: "te_IN" },
  { code: "hi", native: "हिन्दी", english: "Hindi", hreflang: "hi-IN", og: "hi_IN" },
  { code: "ta", native: "தமிழ்", english: "Tamil", hreflang: "ta-IN", og: "ta_IN" },
  { code: "kn", native: "ಕನ್ನಡ", english: "Kannada", hreflang: "kn-IN", og: "kn_IN" },
  { code: "ml", native: "മലയാളം", english: "Malayalam", hreflang: "ml-IN", og: "ml_IN" },
  { code: "or", native: "ଓଡ଼ିଆ", english: "Odia", hreflang: "or-IN", og: "or_IN" },
  { code: "bn", native: "বাংলা", english: "Bengali", hreflang: "bn-IN", og: "bn_IN" },
  { code: "mr", native: "मराठी", english: "Marathi", hreflang: "mr-IN", og: "mr_IN" },
  { code: "gu", native: "ગુજરાતી", english: "Gujarati", hreflang: "gu-IN", og: "gu_IN" },
] as const;

export type Locale = (typeof LANGUAGES)[number]["code"];
export const LOCALES = LANGUAGES.map((l) => l.code) as readonly Locale[];
export const DEFAULT_LOCALE: Locale = "en";
export const LOCALE_COOKIE = "hk_lang";

export const isLocale = (v: unknown): v is Locale => typeof v === "string" && (LOCALES as readonly string[]).includes(v);
export const languageOf = (code: Locale) => LANGUAGES.find((l) => l.code === code)!;

/** Short label for the header button, e.g. "EN", "తె", "हि". */
export const SHORT_LABEL: Record<Locale, string> = {
  en: "EN", te: "తె", hi: "हि", ta: "த", kn: "ಕ", ml: "മ", or: "ଓ", bn: "বা", mr: "म", gu: "ગુ",
};
