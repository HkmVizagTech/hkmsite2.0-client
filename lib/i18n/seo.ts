// Per-language page metadata. Pages keep declaring one (English) metadata
// object; these wrappers turn it into `generateMetadata` so each language gets:
//   - its own canonical (/x for English, /te/x for Telugu) — without this the
//     Telugu page would declare the English one canonical and never be indexed;
//   - hreflang alternates linking the two versions (+ x-default = English);
//   - Telugu title/description where lib/i18n/te has them (same dictionary
//     as the page text, keyed by the English string).
import type { Metadata } from "next";
import { DEFAULT_LOCALE, LANGUAGES, languageOf, type Locale } from "./config";
import { localeOf } from "./server";
import { localizedPath, pageLanguages } from "./routing";
import { makeT } from "./translate";

type Params = { params: Promise<{ lang: string }> };
type Title = Metadata["title"];

function translateTitle(title: Title, t: (s: string) => string): Title {
  if (typeof title === "string") return t(title);
  if (title && typeof title === "object" && "absolute" in title && typeof title.absolute === "string") {
    return { ...title, absolute: t(title.absolute) };
  }
  if (title && typeof title === "object" && "default" in title && typeof title.default === "string") {
    return { ...title, default: t(title.default) };
  }
  return title;
}

function pathOf(u: unknown): string | null {
  if (typeof u === "string") return u.replace(/^https?:\/\/[^/]+/, "") || "/";
  if (u instanceof URL) return u.pathname;
  return null;
}

export function localizeMetadata(meta: Metadata, lang: Locale): Metadata {
  const canonicalPath = pathOf(meta.alternates?.canonical);
  const out: Metadata = { ...meta };
  if (canonicalPath) {
    const en = localizedPath(canonicalPath, DEFAULT_LOCALE);
    const langs = pageLanguages(canonicalPath);
    if (langs.length > 1 && langs.includes(lang)) {
      const languages: Record<string, string> = Object.fromEntries(LANGUAGES.filter((l) => langs.includes(l.code)).map((l) => [l.hreflang, localizedPath(canonicalPath, l.code)]));
      out.alternates = { ...meta.alternates, canonical: localizedPath(canonicalPath, lang), languages: { ...languages, "x-default": en } };
      if (meta.openGraph) {
        const ogPath = pathOf(meta.openGraph.url) || canonicalPath;
        out.openGraph = { ...meta.openGraph, url: localizedPath(ogPath, lang), locale: languageOf(lang).og };
      }
    } else {
      // Not translated yet: other-language copies defer to the English page.
      out.alternates = { ...meta.alternates, canonical: en };
    }
  }
  if (lang !== DEFAULT_LOCALE) {
    const t = makeT(lang);
    out.title = translateTitle(meta.title, t);
    if (typeof meta.description === "string") out.description = t(meta.description);
    if (meta.openGraph) {
      out.openGraph = {
        ...out.openGraph,
        ...(typeof meta.openGraph.title === "string" ? { title: t(meta.openGraph.title) } : {}),
        ...(typeof meta.openGraph.description === "string" ? { description: t(meta.openGraph.description) } : {}),
      };
    }
  }
  return out;
}

/** `export const generateMetadata = localized(baseMetadata);` */
export function localized(meta: Metadata) {
  return async ({ params }: Params): Promise<Metadata> => localizeMetadata(meta, localeOf((await params).lang));
}

/** Wraps an existing generateMetadata: `export const generateMetadata = localizedFn(baseGenerateMetadata);` */
export function localizedFn<P extends Params>(fn: (props: P) => Metadata | Promise<Metadata>) {
  return async (props: P): Promise<Metadata> => localizeMetadata(await fn(props), localeOf((await props.params).lang));
}
