"use client";

import { useMemo, useRef, useState } from "react";
import { CheckCircle2, FolderUp, Loader2, Upload, XCircle, AlertTriangle, MinusCircle } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { authFetch } from "@/lib/authClient";

/**
 * Bulk-import a folder of blog drafts in one go.
 *
 * Expected folder layout (what content-drafts/blogs uses):
 *   index.json            — [{ slug, title, excerpt, category, tags[], metaTitle,
 *                              metaDescription, file, coverImageFile? }]
 *   <slug>.html           — article body HTML (the `file` field)
 *   covers/<slug>.webp    — optional cover image (the `coverImageFile` field)
 *
 * Each article is created through the same POST /blogs endpoint the editor
 * uses, one after another. Slugs that already exist on the site are skipped,
 * so running the import twice never creates duplicates.
 */

interface DraftEntry {
  slug: string;
  title: string;
  excerpt?: string;
  category?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
  file: string;
  coverImageFile?: string;
}

type RowState = "ready" | "missing" | "exists" | "uploading" | "done" | "failed";

interface Row {
  entry: DraftEntry;
  html?: string;
  cover?: File;
  coverUrl?: string;
  words: number;
  state: RowState;
  message?: string;
}

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  apiUrl: string;
  validCategories: string[];
  onImported: () => void;
}

const baseName = (p: string) => p.split(/[\\/]/).pop() || p;

export default function BlogBulkImport({ open, onOpenChange, apiUrl, validCategories, onImported }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [publish, setPublish] = useState(true);
  const [authorName, setAuthorName] = useState("Hare Krishna Movement Vizag");
  const [running, setRunning] = useState(false);
  const [checking, setChecking] = useState(false);

  const counts = useMemo(() => {
    const c = { ready: 0, done: 0, failed: 0, exists: 0, missing: 0 };
    rows.forEach((r) => {
      if (r.state === "ready") c.ready++;
      else if (r.state === "done") c.done++;
      else if (r.state === "failed") c.failed++;
      else if (r.state === "exists") c.exists++;
      else if (r.state === "missing") c.missing++;
    });
    return c;
  }, [rows]);

  const update = (i: number, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const handleFiles = async (list: FileList | null) => {
    setError("");
    setRows([]);
    if (!list || list.length === 0) return;
    const files = Array.from(list);
    const byName = new Map<string, File>();
    files.forEach((f) => byName.set(baseName(f.name).toLowerCase(), f));

    const indexFile = files.find((f) => baseName(f.name).toLowerCase() === "index.json");
    if (!indexFile) {
      setError("index.json not found. Select the whole drafts folder (it must contain index.json).");
      return;
    }
    let entries: DraftEntry[];
    try {
      entries = JSON.parse(await indexFile.text());
      if (!Array.isArray(entries)) throw new Error("index.json must be an array");
    } catch (e: any) {
      setError(`Could not read index.json: ${e.message}`);
      return;
    }

    const built: Row[] = [];
    for (const entry of entries) {
      const htmlFile = byName.get(baseName(entry.file || `${entry.slug}.html`).toLowerCase());
      const cover = entry.coverImageFile ? byName.get(baseName(entry.coverImageFile).toLowerCase()) : undefined;
      const html = htmlFile ? await htmlFile.text() : undefined;
      const words = html ? html.replace(/<[^>]*>/g, " ").split(/\s+/).filter(Boolean).length : 0;
      const problems: string[] = [];
      if (!entry.title) problems.push("no title");
      if (!html) problems.push(`${entry.file || entry.slug + ".html"} not found`);
      if (entry.category && !validCategories.includes(entry.category)) problems.push(`unknown category "${entry.category}"`);
      built.push({
        entry,
        html,
        cover,
        coverUrl: cover ? URL.createObjectURL(cover) : undefined,
        words,
        state: problems.length ? "missing" : "ready",
        message: problems.join(", ") || (entry.coverImageFile && !cover ? "cover image not found — will import without cover" : undefined),
      });
    }
    setRows(built);

    // Skip anything already on the site (public lookup by slug).
    setChecking(true);
    await Promise.all(
      built.map(async (r, i) => {
        if (r.state !== "ready") return;
        try {
          const res = await fetch(`${apiUrl}/blogs/${encodeURIComponent(r.entry.slug)}`);
          if (res.ok) update(i, { state: "exists", message: "already on the site — will be skipped" });
        } catch {
          /* network hiccup — leave as ready; server keeps slugs unique anyway */
        }
      })
    );
    setChecking(false);
  };

  const runImport = async () => {
    setRunning(true);
    let created = 0;
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if (r.state !== "ready" || !r.html) continue;
      update(i, { state: "uploading", message: undefined });
      try {
        const fd = new FormData();
        fd.append("title", r.entry.title);
        fd.append("slug", r.entry.slug);
        fd.append("excerpt", r.entry.excerpt || "");
        fd.append("content", r.html);
        fd.append("category", r.entry.category || "Spiritual Knowledge");
        fd.append("tags", (r.entry.tags || []).join(", "));
        fd.append("status", publish ? "published" : "draft");
        fd.append("featured", "false");
        fd.append("metaTitle", r.entry.metaTitle || "");
        fd.append("metaDescription", r.entry.metaDescription || r.entry.excerpt || "");
        fd.append("authorName", authorName || "Admin");
        fd.append("authorBio", "");
        fd.append("authorSlug", "");
        if (r.cover) fd.append("coverImage", r.cover);

        const res = await authFetch(`${apiUrl}/blogs`, { method: "POST", body: fd, credentials: "include" });
        const json = await res.json().catch(() => ({}));
        if (res.ok) {
          created++;
          update(i, { state: "done", message: publish ? "published" : "saved as draft" });
        } else {
          update(i, { state: "failed", message: json?.errors?.[0]?.msg || json?.message || `HTTP ${res.status}` });
        }
      } catch (e: any) {
        update(i, { state: "failed", message: e.message || "network error" });
      }
    }
    setRunning(false);
    if (created > 0) onImported();
  };

  const reset = () => {
    rows.forEach((r) => r.coverUrl && URL.revokeObjectURL(r.coverUrl));
    setRows([]);
    setError("");
    if (inputRef.current) inputRef.current.value = "";
  };

  const icon = (s: RowState) => {
    switch (s) {
      case "done":
        return <CheckCircle2 className="h-5 w-5 text-emerald-600" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-600" />;
      case "uploading":
        return <Loader2 className="h-5 w-5 animate-spin text-vk-600" />;
      case "missing":
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case "exists":
        return <MinusCircle className="h-5 w-5 text-muted-foreground" />;
      default:
        return <span className="h-2.5 w-2.5 rounded-full bg-vk-400" />;
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (running) return;
        if (!o) reset();
        onOpenChange(o);
      }}
    >
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-hidden p-0">
        <div className="flex max-h-[90vh] flex-col">
          <DialogHeader className="border-b p-5">
            <DialogTitle className="flex items-center gap-2">
              <FolderUp className="h-5 w-5 text-vk-600" /> Bulk import blog drafts
            </DialogTitle>
            <DialogDescription>
              Select the drafts folder (with <code>index.json</code>, the article <code>.html</code> files and{" "}
              <code>covers/</code>). Every article is created in one go; ones already on the site are skipped.
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 overflow-y-auto p-5">
            <div className="flex flex-wrap items-center gap-3">
              <input
                ref={inputRef}
                type="file"
                multiple
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
                {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
              />
              <Button type="button" variant="outline" onClick={() => inputRef.current?.click()} disabled={running}>
                <FolderUp className="mr-2 h-4 w-4" /> Choose drafts folder
              </Button>
              {rows.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {rows.length} articles · {counts.ready} ready
                  {counts.exists ? ` · ${counts.exists} already on site` : ""}
                  {counts.missing ? ` · ${counts.missing} with problems` : ""}
                  {counts.done ? ` · ${counts.done} imported` : ""}
                  {counts.failed ? ` · ${counts.failed} failed` : ""}
                  {checking ? " · checking site…" : ""}
                </span>
              )}
            </div>
            {error && <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            {rows.length > 0 && (
              <ul className="mt-4 divide-y rounded-xl border">
                {rows.map((r, i) => (
                  <li key={r.entry.slug || i} className="flex items-center gap-3 p-3">
                    <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-muted">
                      {r.coverUrl && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.coverUrl} alt="" className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{r.entry.title}</p>
                      <p className="truncate text-xs text-muted-foreground">
                        {r.entry.category} · {r.words.toLocaleString("en-IN")} words · /blogs/{r.entry.slug}
                      </p>
                      {r.message && (
                        <p
                          className={`truncate text-xs ${
                            r.state === "failed" ? "text-red-600" : r.state === "done" ? "text-emerald-700" : "text-amber-700"
                          }`}
                        >
                          {r.message}
                        </p>
                      )}
                    </div>
                    <div className="flex w-6 shrink-0 justify-center">{icon(r.state)}</div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {rows.length > 0 && (
            <div className="flex flex-wrap items-center gap-4 border-t bg-muted/30 p-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={publish}
                  onChange={(e) => setPublish(e.target.checked)}
                  disabled={running}
                  className="h-4 w-4"
                />
                Publish immediately (unticked = save as drafts)
              </label>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Author</span>
                <Input
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  disabled={running}
                  className="h-9 w-56"
                />
              </div>
              <Button
                type="button"
                className="ml-auto"
                onClick={runImport}
                disabled={running || checking || counts.ready === 0}
              >
                {running ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                {running ? "Importing…" : `Import ${counts.ready} article${counts.ready === 1 ? "" : "s"}`}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
