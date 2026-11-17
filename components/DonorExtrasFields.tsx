"use client";

import { useId, useState } from "react";
import { User, Calendar, Cake, Heart, Flower2, Sparkles, Gift, ChevronDown } from "lucide-react";
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
  // Opt-in: replaces the fixed "Date of Birth" with an occasion picker (Birthday,
  // Wedding anniversary, Death anniversary, Other). The date field then asks for
  // the right date - date of birth, of the wedding, or of passing - and "Other"
  // lets the donor type their own occasion. Callers that don't pass
  // `onOccasionChange` keep the old Sevak Name + Date of Birth pair unchanged.
  occasion?: string;
  occasionNote?: string;
  onOccasionChange?: (v: string) => void;
  onOccasionNoteChange?: (v: string) => void;
}

const OCCASIONS = [
  { value: "birthday", label: "Birthday", icon: Cake, name: "Whose birthday?", namePh: "Name of the person", date: "Date of birth" },
  { value: "wedding_anniversary", label: "Wedding anniversary", icon: Heart, name: "Names of the couple", namePh: "e.g. Ramesh & Lakshmi", date: "Date of wedding" },
  { value: "death_anniversary", label: "In memory", icon: Flower2, name: "In loving memory of", namePh: "Name of the departed soul", date: "Date of passing" },
  { value: "other", label: "Other occasion", icon: Sparkles, name: "Name for the dedication", namePh: "Who is this seva for?", date: "Date" },
] as const;

export default function DonorExtrasFields({
  sevakName,
  dob,
  onSevakNameChange,
  onDobChange,
  variant = "default",
  collapsible = false,
  occasion = "",
  occasionNote = "",
  onOccasionChange,
  onOccasionNoteChange,
}: Props) {
  const t = useT();
  const [expanded, setExpanded] = useState(!collapsible || Boolean(sevakName || dob || occasion));
  const occasionMode = Boolean(onOccasionChange);
  const picked = OCCASIONS.find((o) => o.value === occasion);
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

  const today = new Date().toISOString().slice(0, 10);
  const OccasionIcon = picked?.icon ?? Gift;
  const pick = (next: string) => {
    onOccasionChange?.(next);
    // A different occasion means a different date and name; never carry them over.
    onDobChange("");
    onSevakNameChange("");
    if (next !== "other") onOccasionNoteChange?.("");
  };

  const occasionFields = (
    <div className={`rounded-2xl border bg-white transition-colors ${expanded ? "border-vk-200" : "border-vk-100"}`}>
      <label className="flex cursor-pointer items-center gap-3 px-3.5 py-3">
        <span aria-hidden className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-vk-50 text-vk-600 min-[360px]:flex">
          <Gift className="h-[18px] w-[18px]" />
        </span>
        <input
          type="checkbox"
          checked={expanded}
          onChange={(e) => {
            const on = e.target.checked;
            setExpanded(on);
            if (!on) {
              // Closing it clears everything, so nothing stale is ever submitted.
              onSevakNameChange("");
              onDobChange("");
              onOccasionChange?.("");
              onOccasionNoteChange?.("");
            }
          }}
          role="switch"
          aria-checked={expanded}
          className="peer sr-only"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[14px] font-semibold leading-snug text-vk-900">{t("Dedicate this seva")}</span>
          <span className="block text-[12px] leading-snug text-ink/55">{t("Birthday, anniversary or in memory of a loved one")}</span>
        </span>
        <span aria-hidden className="relative h-6 w-11 shrink-0 rounded-full bg-vk-100 ring-1 ring-vk-200 transition-colors peer-checked:bg-vk-500 peer-checked:ring-vk-500 peer-focus-visible:ring-2 peer-focus-visible:ring-vk-500 peer-focus-visible:ring-offset-2 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-transform peer-checked:after:translate-x-5" />
      </label>

      {expanded && (
      <div className="border-t border-vk-100 px-3.5 pb-3.5 pt-3">
      <label htmlFor={`${uid}-occasion`} className={labelCls}>{t("Occasion")}</label>
      <div className="relative">
        <OccasionIcon aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-500" />
        <select
          id={`${uid}-occasion`}
          value={occasion}
          onChange={(e) => pick(e.target.value)}
          className={`vk-input cursor-pointer appearance-none !pl-10 !pr-10 ${occasion ? "text-ink" : "text-ink/50"}`}
        >
          <option value="" disabled>{t("Choose an occasion")}</option>
          {OCCASIONS.map((o) => (
            <option key={o.value} value={o.value}>{t(o.label)}</option>
          ))}
        </select>
        <ChevronDown aria-hidden className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-vk-500" />
      </div>

      {picked && (
        <div className="mt-3 space-y-3 rounded-xl bg-vk-50/70 p-3">
          {occasion === "other" && (
            <div>
              <label htmlFor={`${uid}-occasion-note`} className={labelCls}>{t("What is the occasion?")} <span className="font-normal text-ink/45">{t("(optional)")}</span></label>
              <input
                id={`${uid}-occasion-note`}
                type="text"
                maxLength={80}
                placeholder={t("e.g. Housewarming, Graduation, New business")}
                value={occasionNote}
                onChange={(e) => onOccasionNoteChange?.(e.target.value)}
                className={`${inputCls} !pl-3.5`}
              />
            </div>
          )}
          <div>
            <label htmlFor={`${uid}-sevak`} className={labelCls}>{t(picked.name)}</label>
            <div className={wrapperCls}>
              <User className={iconCls} />
              <input
                id={`${uid}-sevak`}
                type="text"
                placeholder={t(picked.namePh)}
                value={sevakName}
                onChange={(e) => onSevakNameChange(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label htmlFor={`${uid}-dob`} className={labelCls}>{t(picked.date)} <span className="font-normal text-ink/45">{t("(optional)")}</span></label>
            <div className={wrapperCls}>
              <Calendar className={iconCls} />
              <input
                id={`${uid}-dob`}
                type="date"
                max={occasion === "other" ? undefined : today}
                value={dob}
                onChange={(e) => onDobChange(e.target.value)}
                className={inputCls}
              />
            </div>
          </div>
        </div>
      )}
      </div>
      )}
    </div>
  );

  const fields = occasionMode ? occasionFields : (
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

  if (!collapsible || occasionMode) return fields;

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
              onOccasionChange?.("");
              onOccasionNoteChange?.("");
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
