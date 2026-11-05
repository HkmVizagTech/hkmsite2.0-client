"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Search, X } from "lucide-react";
import { useBrowse } from "./BrowseContext";

const KEY = "bhajan-recent-searches-v1";
const MAX = 6;

function readRecent(): string[] {
  try {
    const j = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(j) ? j.filter((x) => typeof x === "string").slice(0, MAX) : [];
  } catch {
    return [];
  }
}
function saveRecent(term: string) {
  const t = term.trim();
  if (t.length < 2) return;
  try {
    localStorage.setItem(KEY, JSON.stringify([t, ...readRecent().filter((x) => x.toLowerCase() !== t.toLowerCase())].slice(0, MAX)));
  } catch {
    /* storage unavailable */
  }
}

function isTyping(el: EventTarget | null): boolean {
  const t = el as HTMLElement | null;
  return !!t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable);
}

export default function HeroSearch() {
  const { q, setQ, scrollToResults } = useBrowse();
  const [focused, setFocused] = useState(false);
  const [recent, setRecent] = useState<string[]>([]);
  const input = useRef<HTMLInputElement>(null);
  const box = useRef<HTMLFormElement>(null);

  // "/" focuses the search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "/" || e.ctrlKey || e.metaKey || e.altKey || isTyping(e.target)) return;
      e.preventDefault();
      input.current?.focus();
      input.current?.select();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Save a search once the visitor has settled on it.
  useEffect(() => {
    if (q.trim().length < 3) return;
    const t = setTimeout(() => saveRecent(q), 1500);
    return () => clearTimeout(t);
  }, [q]);

  const open = () => {
    setRecent(readRecent());
    setFocused(true);
  };
  const showRecent = focused && !q.trim() && recent.length > 0;

  return (
    <form
      ref={box}
      role="search"
      onSubmit={(e) => {
        e.preventDefault();
        saveRecent(q);
        setFocused(false);
        input.current?.blur();
        scrollToResults(true);
      }}
      onBlur={(e) => {
        if (!box.current?.contains(e.relatedTarget as Node)) setFocused(false);
      }}
      className="relative mx-auto w-full max-w-xl"
    >
      <label htmlFor="bhajan-search" className="sr-only">Search bhajans by title, composer or lyrics</label>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-vk-600" aria-hidden />
      <input
        ref={input}
        id="bhajan-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        onFocus={open}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setFocused(false);
            input.current?.blur();
          }
        }}
        placeholder="Search a bhajan, composer or lyric"
        autoComplete="off"
        enterKeyHint="search"
        className="h-14 w-full rounded-full bg-white pl-12 pr-14 text-base text-ink shadow-[0_18px_40px_-18px_rgba(0,0,0,.6)] outline-none ring-1 ring-white/40 placeholder:text-ink/55 focus-visible:ring-4 focus-visible:ring-[#F6C752]/70 [&::-webkit-search-cancel-button]:appearance-none"
      />
      {q ? (
        <button type="button" onClick={() => { setQ(""); input.current?.focus(); }} aria-label="Clear search" className="absolute right-1.5 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full text-ink/60 hover:bg-vk-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500">
          <X className="h-5 w-5" aria-hidden />
        </button>
      ) : (
        !focused && <kbd aria-hidden className="pointer-events-none absolute right-4 top-1/2 hidden -translate-y-1/2 rounded-md border border-vk-200 bg-vk-50 px-2 py-0.5 font-mono text-[13px] font-semibold text-vk-700 md:block">/</kbd>
      )}
      {showRecent && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-vk-100 bg-white p-1.5 text-ink shadow-[0_12px_28px_-16px_rgba(11,23,69,.4)]">
          <div className="flex items-center justify-between px-3 pb-1 pt-2">
            <p className="text-[13px] font-bold uppercase tracking-wider text-vk-700">Recent searches</p>
            <button
              type="button"
              onClick={() => {
                try { localStorage.removeItem(KEY); } catch { /* ignore */ }
                setRecent([]);
              }}
              className="min-h-[36px] rounded-md px-2 text-[13px] font-semibold text-vk-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500"
            >
              Clear
            </button>
          </div>
          <ul>
            {recent.map((r) => (
              <li key={r}>
                <button
                  type="button"
                  onClick={() => {
                    setQ(r);
                    setFocused(false);
                    scrollToResults(true);
                  }}
                  className="flex min-h-[44px] w-full items-center gap-3 rounded-lg px-3 text-left text-[15px] hover:bg-vk-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-vk-500"
                >
                  <Clock className="h-4 w-4 shrink-0 text-vk-600" aria-hidden />
                  <span className="min-w-0 truncate">{r}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
