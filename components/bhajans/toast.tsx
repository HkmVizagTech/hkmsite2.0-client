"use client";

import { useEffect, useState } from "react";
import { Check, AlertCircle } from "lucide-react";

type Kind = "ok" | "error";
interface ToastMsg {
  id: number;
  text: string;
  kind: Kind;
}

const EVT = "bhajan-toast";
let seq = 0;

/** Show a small toast from anywhere (client only). A <ToastHost /> must be mounted (PlayerProvider does it). */
export function showToast(text: string, kind: Kind = "ok"): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<ToastMsg>(EVT, { detail: { id: ++seq, text, kind } }));
}

export function ToastHost() {
  const [items, setItems] = useState<ToastMsg[]>([]);
  useEffect(() => {
    const timers = new Set<number>();
    const on = (e: Event) => {
      const t = (e as CustomEvent<ToastMsg>).detail;
      setItems((l) => [...l.slice(-2), t]);
      const h = window.setTimeout(() => setItems((l) => l.filter((x) => x.id !== t.id)), 3200);
      timers.add(h);
    };
    window.addEventListener(EVT, on);
    return () => {
      window.removeEventListener(EVT, on);
      timers.forEach((h) => window.clearTimeout(h));
    };
  }, []);
  if (!items.length) return null;
  return (
    <div
      aria-live="polite"
      role="status"
      className="pointer-events-none fixed inset-x-0 bottom-[calc(var(--bottom-nav-space,0px)+var(--player-h,0px)+16px)] z-[90] flex flex-col items-center gap-2 px-4"
    >
      {items.map((t) => (
        <div key={t.id} className="bh-toast pointer-events-auto flex max-w-full items-center gap-2 rounded-full bg-[#0b1745] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_8px_20px_-10px_rgba(11,23,69,.5)]">
          {t.kind === "error" ? <AlertCircle className="h-4 w-4 shrink-0 text-[#F6C752]" aria-hidden /> : <Check className="h-4 w-4 shrink-0 text-[#F6C752]" aria-hidden />}
          <span className="min-w-0 break-words">{t.text}</span>
        </div>
      ))}
      <style>{`@keyframes bh-toast{from{transform:translateY(8px);opacity:0}to{transform:none;opacity:1}}.bh-toast{animation:bh-toast .18s ease-out both}@media(prefers-reduced-motion:reduce){.bh-toast{animation:none}}`}</style>
    </div>
  );
}
