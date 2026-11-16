// Telugu versions of the temple guide content (/te/temples/...). Filled per temple after the English text is
// fact-checked; any field left out falls back to English. Please have a Telugu reader check before publishing.
import type { Temple } from "./templesData";
import { TEMPLES_TE_1 } from "./templesTe1";
import { TEMPLES_TE_2 } from "./templesTe2";

export type TempleTe = Partial<Pick<Temple,
  "name" | "deity" | "town" | "district" | "summary" | "history" | "highlights" | "festivals" | "timings" | "timingsNote" | "fromVizag" | "howToReach" | "address" | "faqs"
>>;

export const TEMPLES_TE: Record<string, TempleTe> = { ...TEMPLES_TE_1, ...TEMPLES_TE_2 };

/** The temple with its Telugu fields applied when the page is Telugu. */
export function localizeTemple(t: Temple, lang: string): Temple {
  if (lang !== "te") return t;
  const te = TEMPLES_TE[t.slug];
  return te ? { ...t, ...te, howToReach: { ...t.howToReach, ...te.howToReach } } : t;
}
