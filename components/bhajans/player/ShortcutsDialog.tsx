"use client";

import { useEffect, useRef } from "react";
import { X } from "lucide-react";

const ROWS: [string, string][] = [
  ["Space", "Play / pause"],
  ["J  /  L", "Back / forward 10 seconds"],
  ["←  /  →", "Back / forward 5 seconds"],
  ["N  /  P", "Next / previous track"],
  ["M", "Mute / unmute"],
  ["S", "Shuffle on / off"],
  ["R", "Repeat off / all / one"],
  ["Q", "Show / hide the queue"],
  ["/", "Search (on the Bhajans page)"],
  ["?", "Show this list"],
];

export default function ShortcutsDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    return () => prev?.focus?.();
  }, []);
  return (
    <div className="fixed inset-0 z-[95] flex items-end justify-center bg-[#0b1745]/40 p-0 sm:items-center sm:p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Keyboard shortcuts"
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 text-ink sm:rounded-3xl"
      >
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-xl font-bold">Keyboard shortcuts</h2>
          <button ref={ref} type="button" onClick={onClose} aria-label="Close" className="inline-flex h-11 w-11 items-center justify-center rounded-full hover:bg-vk-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-vk-500">
            <X className="h-5 w-5" aria-hidden />
          </button>
        </div>
        <dl className="mt-3 divide-y divide-vk-100">
          {ROWS.map(([k, d]) => (
            <div key={k} className="flex items-center justify-between gap-4 py-2.5">
              <dt><kbd className="rounded-md border border-vk-200 bg-vk-50 px-2 py-1 font-mono text-[13px] font-semibold text-vk-800">{k}</kbd></dt>
              <dd className="text-right text-sm text-ink/80">{d}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
