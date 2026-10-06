import type { Locale } from "./config";
import { te } from "./te";

export type Dictionary = Record<string, string>;
export type TFunction = (text: string, vars?: Record<string, string | number>) => string;

const DICTS: Record<Locale, Dictionary | null> = { en: null, te };

const fill = (s: string, vars?: Record<string, string | number>) =>
  vars ? s.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m)) : s;

/**
 * t("Donate Now") → "ఇప్పుడే దానం చేయండి" in Telugu, "Donate Now" in English.
 * Placeholders: t("Pay {amount} with PhonePe", { amount: "₹2,000" }).
 * Untranslated text falls back to the English source.
 */
export function makeT(locale: Locale): TFunction {
  const dict = DICTS[locale];
  return (text, vars) => fill((dict && dict[text]) || text, vars);
}
