import type { Acharya } from "@/lib/acharyas";

/**
 * One acharya's text in another language. Any field left out falls back to English, so a partly translated
 * acharya still shows correctly. Arrays (biography, teachings, qualities, timeline, books, pastimes) must have the
 * same length and order as the English, with only the text translated (images, slugs and dates in digits stay).
 */
export type AcharyaTr = Partial<Pick<Acharya,
  "name" | "shortName" | "title" | "sampradaya" | "years" | "appearance" | "disappearance" | "summary" |
  "biography" | "teachings" | "qualities" | "timeline" | "books" | "pastimes"
>> & {
  /** Search-result title in this language (≤ 60 characters). */
  seoTitle?: string;
  /** Search-result description in this language (≤ 155 characters, ends on a whole word). */
  seoDescription?: string;
};

export type AcharyasTranslation = Record<string, AcharyaTr>;
