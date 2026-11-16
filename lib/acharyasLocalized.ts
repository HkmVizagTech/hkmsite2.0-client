import "server-only";
import { ACHARYAS, type Acharya } from "@/lib/acharyas";
import type { AcharyaTr, AcharyasTranslation } from "@/lib/acharyas-i18n/types";

// Per-language acharya text, loaded on the server only (each visitor's page carries only its own language).
const LOADERS: Record<string, () => Promise<AcharyasTranslation>> = {
  te: () => import("@/lib/acharyas-i18n/te").then((m) => m.acharyasTE),
  hi: () => import("@/lib/acharyas-i18n/hi").then((m) => m.acharyasHI),
  ta: () => import("@/lib/acharyas-i18n/ta").then((m) => m.acharyasTA),
  kn: () => import("@/lib/acharyas-i18n/kn").then((m) => m.acharyasKN),
  ml: () => import("@/lib/acharyas-i18n/ml").then((m) => m.acharyasML),
  or: () => import("@/lib/acharyas-i18n/or").then((m) => m.acharyasOR),
  bn: () => import("@/lib/acharyas-i18n/bn").then((m) => m.acharyasBN),
  mr: () => import("@/lib/acharyas-i18n/mr").then((m) => m.acharyasMR),
  gu: () => import("@/lib/acharyas-i18n/gu").then((m) => m.acharyasGU),
};

export type LocalAcharya = Acharya & { seoTitle?: string; seoDescription?: string };

function merge(a: Acharya, tr?: AcharyaTr): LocalAcharya {
  if (!tr) return a;
  const sameLen = <T,>(en: T[], x?: T[]) => (x && x.length === en.length ? x : en);
  return {
    ...a,
    ...Object.fromEntries(Object.entries(tr).filter(([, v]) => v !== undefined && !Array.isArray(v))),
    biography: sameLen(a.biography, tr.biography),
    teachings: sameLen(a.teachings, tr.teachings),
    qualities: sameLen(a.qualities, tr.qualities),
    timeline: sameLen(a.timeline, tr.timeline),
    books: sameLen(a.books, tr.books),
    pastimes: a.pastimes ? sameLen(a.pastimes, tr.pastimes).map((p, i) => ({ ...p, image: a.pastimes![i].image })) : undefined,
    appearance: tr.appearance ? { ...a.appearance, ...tr.appearance } : a.appearance,
    disappearance: tr.disappearance ? { ...a.disappearance, ...tr.disappearance } : a.disappearance,
  } as LocalAcharya;
}

/** All acharyas in `lang` (English fields where a translation is missing). */
export async function acharyasIn(lang: string): Promise<LocalAcharya[]> {
  const load = LOADERS[lang];
  const tr = load ? await load().catch(() => ({} as AcharyasTranslation)) : undefined;
  return ACHARYAS.map((a) => merge(a, tr?.[a.slug]));
}

/** Light copy for lists and cards: drops the long texts, which only the acharya's own page needs. */
export function lite(a: Acharya): Acharya {
  return { ...a, biography: [], teachings: [], qualities: [], timeline: [], books: [], pastimes: undefined };
}

/** Whether `lang` has this acharya translated (used to decide hreflang/indexing). */
export async function isTranslated(lang: string, slug: string) {
  const load = LOADERS[lang];
  if (!load) return lang === "en";
  const tr = await load().catch(() => ({} as AcharyasTranslation));
  return Boolean(tr[slug]?.biography?.length);
}
