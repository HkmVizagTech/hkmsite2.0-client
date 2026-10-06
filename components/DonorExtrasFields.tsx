"use client";

import { useId, useState } from "react";
import { User, Calendar } from "lucide-react";
import { useT } from "@/components/i18n/LocaleProvider";

interface Props {
  sevakName: string;
  dob: string;
  onSevakNameChange: (v: string) => void;
  onDobChange: (v: string) => void;
  variant?: "default" | "amber";
  // Opt-in only. When true, the Sevak Name + DOB inputs are hidden behind a
  // "This donation is in the memory/honor of someone..." checkbox instead of
  // always showing — many donors don't have this info and the extra fields
  // were adding friction. Defaults to false so any existing caller that
  // doesn't pass this prop keeps its exact current behavior unchanged.
  collapsible?: boolean;
}

export default function DonorExtrasFields({
  sevakName,
  dob,
  onSevakNameChange,
  onDobChange,
  variant = "default",
  collapsible = false,
}: Props) {
  const t = useT();
  const [expanded, setExpanded] = useState(!collapsible || Boolean(sevakName || dob));
  const isAmber = variant === "amber";
  const uid = useId();

  const wrapperCls = isAmber
    ? "relative flex items-center rounded-lg border border-amber-300 bg-white/90 shadow-sm focus-within:border-amber-500 transition-colors"
    : "relative";
  const labelCls = isAmber
    ? "mb-1 block text-[11px] font-semibold text-amber-900"
    : "mb-1.5 block text-[13px] font-semibold text-ink/80";
  const iconCls = isAmber
    ? "pointer-events-none absolute left-3 h-4 w-4 text-amber-600/60"
    : "pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-400";
  const inputCls = isAmber
    ? "h-10 w-full bg-transparent pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-amber-800/50"
    : "vk-input pl-10";
  const checkboxLabelCls = isAmber
    ? "flex cursor-pointer items-start gap-2.5 text-sm text-amber-900"
    : "flex cursor-pointer items-start gap-2.5 text-[13px] font-medium leading-snug text-ink";
  const checkboxCls = isAmber
    ? "mt-0.5 h-4 w-4 shrink-0 rounded border-border text-primary focus:ring-primary"
    : "mt-0.5 h-4 w-4 shrink-0 rounded accent-vk-700";

  const fields = (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label htmlFor={`${uid}-sevak`} className={labelCls}>
          {t("Sevak Name")} <span className="font-normal">{t("(optional)")}</span>
        </label>
        <div className={wrapperCls}>
          <User className={iconCls} />
          <input
            id={`${uid}-sevak`}
            type="text"
            placeholder={t("Name for seva dedication")}
            value={sevakName}
            onChange={(e) => onSevakNameChange(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
      <div>
        <label htmlFor={`${uid}-dob`} className={labelCls}>
          {t("Date of Birth")} <span className="font-normal">{t("(optional)")}</span>
        </label>
        <div className={wrapperCls}>
          <Calendar className={iconCls} />
          <input
            id={`${uid}-dob`}
            type="date"
            value={dob}
            onChange={(e) => onDobChange(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>
    </div>
  );

  if (!collapsible) return fields;

  return (
    <div className="space-y-3">
      <label className={checkboxLabelCls}>
        <input
          type="checkbox"
          checked={expanded}
          onChange={(e) => {
            const checked = e.target.checked;
            setExpanded(checked);
            if (!checked) {
              // Clear so an unchecked box never silently submits stale values.
              onSevakNameChange("");
              onDobChange("");
            }
          }}
          className={checkboxCls}
        />
        <span>{t("This Donation is in the memory/honor of someone or performed on a specific occasion")}</span>
      </label>
      {expanded && fields}
    </div>
  );
}
