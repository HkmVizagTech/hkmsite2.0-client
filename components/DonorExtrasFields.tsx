"use client";

import { User, Calendar } from "lucide-react";

interface Props {
  sevakName: string;
  dob: string;
  onSevakNameChange: (v: string) => void;
  onDobChange: (v: string) => void;
  variant?: "default" | "amber";
}

export default function DonorExtrasFields({ sevakName, dob, onSevakNameChange, onDobChange, variant = "default" }: Props) {
  const isAmber = variant === "amber";
  const wrapperCls = isAmber
    ? "relative flex items-center rounded-lg border border-amber-300 bg-white/90 shadow-sm focus-within:border-amber-500 transition-colors"
    : "relative flex items-center rounded-lg border border-border bg-white dark:bg-card focus-within:border-gold transition-colors";
  const labelCls = isAmber
    ? "mb-1 block text-[11px] font-semibold text-amber-900"
    : "mb-1 block text-[11px] font-medium text-muted-foreground";
  const iconCls = isAmber
    ? "pointer-events-none absolute left-3 h-4 w-4 text-amber-600/60"
    : "pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground";
  const inputCls = isAmber
    ? "h-10 w-full bg-transparent pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-amber-800/50"
    : "h-10 w-full bg-transparent pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground";

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className={labelCls}>
          Sevak Name <span className="font-normal">(optional)</span>
        </label>
        <div className={wrapperCls}>
          <User className={iconCls} />
          <input
            type="text"
            placeholder="Name for seva dedication"
            value={sevakName}
            onChange={(e) => onSevakNameChange(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label className={labelCls}>
          Date of Birth <span className="font-normal">(optional)</span>
        </label>
        <div className={wrapperCls}>
          <Calendar className={iconCls} />
          <input
            type="date"
            value={dob}
            onChange={(e) => onDobChange(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );
}
