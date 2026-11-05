import { Fragment } from "react";

/** Wraps case-insensitive matches of `term` in <mark>. Safe for any input (no regex injection). */
export default function Highlight({ text, term }: { text: string; term?: string }) {
  const t = (term || "").trim();
  if (t.length < 2 || !text) return <>{text}</>;
  const lower = text.toLowerCase();
  const needle = t.toLowerCase();
  const out: React.ReactNode[] = [];
  let from = 0;
  for (let at = lower.indexOf(needle); at !== -1; at = lower.indexOf(needle, from)) {
    if (at > from) out.push(<Fragment key={`t${from}`}>{text.slice(from, at)}</Fragment>);
    out.push(<mark key={`m${at}`} className="rounded-sm bg-[#FDF3D2] px-0.5 text-inherit">{text.slice(at, at + needle.length)}</mark>);
    from = at + needle.length;
  }
  if (!out.length) return <>{text}</>;
  if (from < text.length) out.push(<Fragment key="end">{text.slice(from)}</Fragment>);
  return <>{out}</>;
}

export function matchesIn(term: string | undefined, ...fields: string[]): boolean {
  const t = (term || "").trim().toLowerCase();
  return t.length >= 2 && fields.some((f) => (f || "").toLowerCase().includes(t));
}
