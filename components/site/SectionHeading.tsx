import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { ReactNode } from "react";

interface SectionHeadingProps {
  /** Small uppercase pill above the title ("Seva Opportunities"). */
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: "left" | "center";
  /** Optional "View All" style action shown beside a left-aligned heading. */
  action?: { href: string; label: string };
  /** Render for dark backgrounds. */
  light?: boolean;
  className?: string;
  /** Heading level — h2 by default; pages pass "h1" for their main title. */
  as?: "h1" | "h2" | "h3";
}

/**
 * GVD-standard section header: eyebrow pill → tight display title →
 * muted lead, with an optional "View All" action. Every redesigned
 * section starts with this so the rhythm stays identical site-wide.
 */
export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "left",
  action,
  light = false,
  className = "",
  as: Tag = "h2",
}: SectionHeadingProps) {
  const centered = align === "center";
  return (
    <div
      className={`mb-8 flex flex-col gap-4 md:mb-10 ${
        centered ? "items-center text-center" : "md:flex-row md:items-end md:justify-between"
      } ${className}`}
    >
      <div className={centered ? "mx-auto max-w-3xl" : "max-w-3xl"}>
        {eyebrow && (
          <span className={`${light ? "vk-pill-light" : "vk-pill"} mb-3`}>{eyebrow}</span>
        )}
        <Tag className={`vk-h2 ${light ? "!text-white" : ""} ${Tag === "h1" ? "md:!text-5xl" : ""}`}>
          {title}
        </Tag>
        {subtitle && (
          <p
            className={`mt-3 text-[15px] leading-relaxed md:text-base ${
              light ? "text-white/80" : "text-muted-foreground"
            } ${centered ? "mx-auto max-w-2xl" : "max-w-2xl"}`}
          >
            {subtitle}
          </p>
        )}
      </div>
      {action && !centered && (
        <Link
          href={action.href}
          className={`group inline-flex shrink-0 items-center gap-1.5 self-start rounded-xl px-4 py-2 text-sm font-semibold transition-colors md:self-auto ${
            light
              ? "border border-white/40 text-white hover:bg-white/10"
              : "bg-vk-700 text-white shadow-sm hover:bg-vk-600"
          }`}
        >
          {action.label}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
