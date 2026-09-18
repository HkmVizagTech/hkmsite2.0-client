"use client";

/**
 * SimpleTextEditor — a featherweight rich-text editor for short structured
 * blocks like "Product information". Native contentEditable with a small
 * toolbar: Bold, Italic and a bullet-list toggle. Every Enter / Shift+Enter
 * starts a new point (a fresh <p>), which is exactly the shape admins want
 * for label:value rows. Output is plain HTML.
 *
 * Usage:
 *   <SimpleTextEditor value={html} onChange={setHtml} placeholder="…" />
 */

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { Bold, Italic, List } from "lucide-react";

interface SimpleTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  className?: string;
}

// Browsers wrap new lines inconsistently (<div> vs <p>); keep the output
// uniform so the storefront can style every point the same way.
const normalizeHtml = (raw: string) =>
  raw
    .replace(/<div([^>]*)>/gi, "<p$1>")
    .replace(/<\/div>/gi, "</p>")
    .replace(/<br\s*\/?>/gi, "\n")
    .trim();

function ToolbarBtn({
  active,
  onClick,
  label,
  children,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      title={label}
      // Keep the text selection alive while the button is clicked, so the
      // bold/italic/list applies exactly where the cursor is.
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
        active
          ? "bg-gold/15 text-primary"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

export default function SimpleTextEditor({
  value,
  onChange,
  placeholder = "",
  className,
}: SimpleTextEditorProps) {
  const elRef = useRef<HTMLDivElement>(null);
  const [focused, setFocused] = useState(false);
  const [states, setStates] = useState({ bold: false, italic: false, list: false });

  // Push an externally-changed value (opening a different product) into the
  // field — but never while the admin is typing inside it.
  useEffect(() => {
    const el = elRef.current;
    if (!el || document.activeElement === el) return;
    if (normalizeHtml(el.innerHTML) !== normalizeHtml(value || "")) {
      el.innerHTML = value || "";
    }
  }, [value]);

  const refreshStates = () => {
    setStates({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      list: document.queryCommandState("insertUnorderedList"),
    });
  };

  const emit = () => {
    onChange(normalizeHtml(elRef.current?.innerHTML || ""));
  };

  const run = (command: string) => {
    elRef.current?.focus();
    document.execCommand(command);
    emit();
    refreshStates();
  };

  return (
    <div
      className={`overflow-hidden rounded-xl border bg-background transition-colors ${
        focused ? "border-gold" : "border-border"
      } ${className ?? ""}`}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border bg-muted/40 px-2 py-1.5">
        <ToolbarBtn active={states.bold} onClick={() => run("bold")} label="Bold">
          <Bold className="h-4 w-4" />
        </ToolbarBtn>
        <ToolbarBtn active={states.italic} onClick={() => run("italic")} label="Italic">
          <Italic className="h-4 w-4" />
        </ToolbarBtn>
        <span className="mx-1 h-4 w-px bg-border" />
        <ToolbarBtn active={states.list} onClick={() => run("insertUnorderedList")} label="Bullet points">
          <List className="h-4 w-4" />
        </ToolbarBtn>
      </div>

      {/* Editable area — deliberately rendered with no React children so the
          raw HTML set here isn't wiped by re-renders. */}
      <div
        ref={elRef}
        contentEditable
        suppressContentEditableWarning
        data-placeholder={placeholder}
        onInput={emit}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        onKeyUp={refreshStates}
        onMouseUp={refreshStates}
        onKeyDown={(e) => {
          // Shift+Enter = a new point (a fresh paragraph), not a soft line
          // break that would glue two points into one paragraph.
          if (e.key === "Enter" && e.shiftKey) {
            e.preventDefault();
            document.execCommand("insertParagraph");
            emit();
            refreshStates();
          }
        }}
        className="simple-content min-h-24 cursor-text px-3 py-2.5 text-sm leading-relaxed text-foreground outline-none"
      />

      {/* Native-editor styling: visible bullets, labelled empty-state */}
      <style>{`
        .simple-content:empty::before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
        }
        .simple-content p { margin: 0.35rem 0; line-height: 1.6; }
        .simple-content p:first-child { margin-top: 0; }
        .simple-content ul,
        .simple-content ol { margin: 0.35rem 0; padding-left: 1.4rem; }
        .simple-content ul { list-style: disc; }
        .simple-content ol { list-style: decimal; }
        .simple-content li { margin: 0.15rem 0; }
      `}</style>
    </div>
  );
}