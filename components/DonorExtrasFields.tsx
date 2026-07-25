"use client";

import { User, Calendar } from "lucide-react";

interface Props {
  sevakName: string;
  dob: string;
  onSevakNameChange: (v: string) => void;
  onDobChange: (v: string) => void;
}

export default function DonorExtrasFields({ sevakName, dob, onSevakNameChange, onDobChange }: Props) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div>
        <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
          Sevak Name <span className="font-normal">(optional)</span>
        </label>
        <div className="relative flex items-center rounded-lg border border-border bg-card focus-within:border-gold transition-colors">
          <User className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Name for seva dedication"
            value={sevakName}
            onChange={(e) => onSevakNameChange(e.target.value)}
            className="h-10 w-full bg-transparent pl-9 pr-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div>
        <label className="mb-1 block text-[11px] font-medium text-muted-foreground">
          Date of Birth <span className="font-normal">(optional)</span>
        </label>
        <div className="relative flex items-center rounded-lg border border-border bg-card focus-within:border-gold transition-colors">
          <Calendar className="pointer-events-none absolute left-3 h-4 w-4 text-muted-foreground" />
          <input
            type="date"
            value={dob}
            onChange={(e) => onDobChange(e.target.value)}
            className="h-10 w-full bg-transparent pl-9 pr-3 text-sm text-foreground outline-none"
          />
        </div>
      </div>
    </div>
  );
}
