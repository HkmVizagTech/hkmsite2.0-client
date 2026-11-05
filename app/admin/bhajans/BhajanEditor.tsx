"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authFetch, getToken } from "@/lib/authClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import SyncLyrics from "./SyncLyrics";
import {
  ArrowLeft, Save, Loader2, Upload, X, ArrowUp, ArrowDown, Plus, Trash2, ChevronDown, ChevronUp, Music2, ClipboardPaste, Timer,
} from "lucide-react";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

type Lang = "en" | "te" | "hi";
const LANGS: Lang[] = ["en", "te", "hi"];
const LANG_NAME: Record<Lang, string> = { en: "English", te: "Telugu", hi: "Hindi" };
const TEXT_LABEL: Record<Lang, string> = {
  en: "English transliteration (one line per row)",
  te: "Telugu lines",
  hi: "Hindi lines",
};

interface TrackForm {
  key: string;
  singer: string;
  url: string;
  duration: number;
  bytes: number;
  verseTimes: number[];
  uploading?: boolean;
  progress?: number;
}
interface VerseForm {
  key: string;
  text: Record<Lang, string>;
  translation: Record<Lang, string>;
  wbw: { word: string; meaning: string }[];
  open: boolean;
  showLangs: Record<Lang, boolean>;
  showWbw: boolean;
}
interface FormState {
  title: string;
  slug: string;
  artist: string;
  subtitle: string;
  isPublished: boolean;
  isFeatured: boolean;
  sortOrder: string;
  categories: string[];
  moods: string[];
  festivals: string[];
  languages: Lang[];
  coverImage: string;
  tracks: TrackForm[];
  verses: VerseForm[];
}
interface MetaOption { slug: string; label: string }
interface Meta { categories: MetaOption[]; moods: MetaOption[]; festivals: MetaOption[] }

let keyCounter = 0;
const nk = () => `k${Date.now().toString(36)}${keyCounter++}`;

const emptyVerse = (open = true): VerseForm => ({
  key: nk(),
  text: { en: "", te: "", hi: "" },
  translation: { en: "", te: "", hi: "" },
  wbw: [],
  open,
  showLangs: { en: true, te: false, hi: false },
  showWbw: false,
});

const emptyForm = (): FormState => ({
  title: "", slug: "", artist: "", subtitle: "", isPublished: true, isFeatured: false, sortOrder: "0",
  categories: [], moods: [], festivals: [], languages: ["en"], coverImage: "", tracks: [], verses: [],
});

const slugify = (s: string) =>
  s.toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

const toLines = (s: string) => s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);

/** Server document -> form state. */
function fromDoc(d: any, openAll: boolean): FormState {
  const verses: VerseForm[] = (d.verses || []).map((v: any) => {
    const text: Record<Lang, string> = { en: "", te: "", hi: "" };
    const translation: Record<Lang, string> = { en: "", te: "", hi: "" };
    LANGS.forEach((l) => {
      text[l] = Array.isArray(v.text?.[l]) ? v.text[l].join("\n") : "";
      translation[l] = typeof v.translation?.[l] === "string" ? v.translation[l] : "";
    });
    const wbw = Array.isArray(v.wordByWord?.en) ? v.wordByWord.en.map((r: any) => ({ word: r.word || "", meaning: r.meaning || "" })) : [];
    const showLangs = {} as Record<Lang, boolean>;
    LANGS.forEach((l) => (showLangs[l] = l === "en" || !!text[l] || !!translation[l]));
    return { key: nk(), text, translation, wbw, open: openAll, showLangs, showWbw: wbw.length > 0 };
  });
  return {
    title: d.title || "",
    slug: d.slug || "",
    artist: d.artist || "",
    subtitle: d.subtitle || "",
    isPublished: d.isPublished !== false,
    isFeatured: !!d.isFeatured,
    sortOrder: String(d.sortOrder ?? 0),
    categories: d.categories || [],
    moods: d.moods || [],
    festivals: d.festivals || [],
    languages: (d.languages || []).filter((l: string) => (LANGS as string[]).includes(l)),
    coverImage: d.coverImage || "",
    tracks: [...(d.tracks || [])]
      .sort((a: any, b: any) => (a.order ?? 0) - (b.order ?? 0))
      .map((t: any) => ({ key: nk(), singer: t.singer || "", url: t.url || "", duration: t.duration || 0, bytes: t.bytes || 0, verseTimes: Array.isArray(t.verseTimes) ? t.verseTimes.filter((n: any) => Number.isFinite(n)) : [] })),
    verses,
  };
}

/** Form state -> request body (also the basis for the unsaved-changes check). */
function buildPayload(f: FormState) {
  const verses = f.verses
    .map((v) => {
      const text: Partial<Record<Lang, string[]>> = {};
      const translation: Partial<Record<Lang, string>> = {};
      LANGS.forEach((l) => {
        const lines = toLines(v.text[l]);
        if (lines.length) text[l] = lines;
        if (v.translation[l].trim()) translation[l] = v.translation[l].trim();
      });
      const wbw = v.wbw.filter((r) => r.word.trim() || r.meaning.trim()).map((r) => ({ word: r.word.trim(), meaning: r.meaning.trim() }));
      return { text, translation, wordByWord: wbw.length ? { en: wbw } : {} };
    })
    .filter((v) => Object.keys(v.text).length || Object.keys(v.translation).length || Object.keys(v.wordByWord).length)
    .map((v, i) => ({ number: i + 1, ...v }));

  const used = new Set<string>(f.languages);
  verses.forEach((v) => (Object.keys(v.text) as Lang[]).forEach((l) => used.add(l)));

  const lyricsText = verses
    .map((v) =>
      [...LANGS.flatMap((l) => v.text[l] || []), ...(v.translation.en ? [v.translation.en] : [])].join("\n")
    )
    .join("\n\n");

  const body: Record<string, any> = {
    title: f.title.trim(),
    artist: f.artist.trim(),
    subtitle: f.subtitle.trim(),
    isPublished: f.isPublished,
    isFeatured: f.isFeatured,
    sortOrder: Number(f.sortOrder) || 0,
    categories: f.categories,
    moods: f.moods,
    festivals: f.festivals,
    languages: LANGS.filter((l) => used.has(l)),
    coverImage: f.coverImage.trim(),
    tracks: f.tracks
      .filter((t) => t.url && !t.uploading)
      .map((t, i) => ({ singer: t.singer.trim(), url: t.url.trim(), duration: Math.round(t.duration || 0), bytes: t.bytes || 0, order: i, verseTimes: (t.verseTimes || []).slice(0, verses.length) })),
    verses,
    lyricsText,
  };
  if (f.slug.trim()) body.slug = slugify(f.slug);
  return body;
}

/** Upload with progress (fetch cannot report upload progress, XHR can). */
function uploadWithProgress(path: string, file: File, onProgress: (pct: number) => void): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", `${API_URL}${path}`);
    xhr.withCredentials = true;
    const token = getToken();
    if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(Math.round((e.loaded / e.total) * 100));
    xhr.onerror = () => reject(new Error("Network error during upload"));
    xhr.onload = () => {
      let json: any = {};
      try { json = JSON.parse(xhr.responseText); } catch {}
      if (xhr.status >= 200 && xhr.status < 300) resolve(json);
      else reject(new Error(json.message || `Upload failed (status ${xhr.status})`));
    };
    const fd = new FormData();
    fd.append("file", file);
    xhr.send(fd);
  });
}

function readAudioDuration(file: File): Promise<number> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const a = new Audio();
    const done = (d: number) => { URL.revokeObjectURL(url); resolve(Number.isFinite(d) ? d : 0); };
    a.preload = "metadata";
    a.onloadedmetadata = () => done(a.duration);
    a.onerror = () => done(0);
    a.src = url;
  });
}

const fmtDur = (s: number) => (s > 0 ? `${Math.floor(s / 60)}:${String(Math.round(s % 60)).padStart(2, "0")}` : "–");
const fmtBytes = (b: number) => (b ? (b < 1048576 ? `${Math.round(b / 1024)} KB` : `${(b / 1048576).toFixed(1)} MB`) : "");

const fieldCls = "text-base sm:text-sm";

function Field({ label, hint, error, children }: { label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      {children}
      {error ? <p className="text-xs text-red-600">{error}</p> : hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

function Taxonomy({
  title, options, value, onChange,
}: { title: string; options: MetaOption[]; value: string[]; onChange: (v: string[]) => void }) {
  // Keep unknown slugs (not in meta) visible so they are not silently lost.
  const known = new Set(options.map((o) => o.slug));
  const all = [...options, ...value.filter((v) => !known.has(v)).map((v) => ({ slug: v, label: v }))];
  return (
    <div className="space-y-1.5">
      <p className="text-sm font-medium">{title}</p>
      <div className="flex flex-wrap gap-1.5">
        {all.length === 0 && <span className="text-xs text-muted-foreground">No options loaded.</span>}
        {all.map((o) => {
          const on = value.includes(o.slug);
          return (
            <label
              key={o.slug}
              className={`flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs ${
                on ? "border-primary bg-primary/10 font-medium text-primary" : "border-border hover:bg-muted"
              }`}
            >
              <input
                type="checkbox"
                className="h-3.5 w-3.5 accent-[hsl(var(--primary))]"
                checked={on}
                onChange={() => onChange(on ? value.filter((x) => x !== o.slug) : [...value, o.slug])}
              />
              {o.label}
            </label>
          );
        })}
      </div>
    </div>
  );
}

export default function BhajanEditor({ id }: { id?: string }) {
  const router = useRouter();
  const isNew = !id;
  const [form, setForm] = useState<FormState>(emptyForm);
  const [baseline, setBaseline] = useState<string>("");
  const [loading, setLoading] = useState(!isNew);
  const [loadError, setLoadError] = useState("");
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [meta, setMeta] = useState<Meta>({ categories: [], moods: [], festivals: [] });
  const [slugTouched, setSlugTouched] = useState(false);
  const [coverUploading, setCoverUploading] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [syncKey, setSyncKey] = useState<string | null>(null);
  const coverInput = useRef<HTMLInputElement>(null);
  const audioInput = useRef<HTMLInputElement>(null);
  const formRef = useRef(form);
  formRef.current = form;

  const payloadJson = useMemo(() => JSON.stringify(buildPayload(form)), [form]);
  // Verses that will actually be saved (empty ones are dropped), in saved order; times index into these.
  const syncVerses = useMemo(
    () =>
      form.verses
        .filter((v) => LANGS.some((l) => v.text[l].trim() || v.translation[l].trim()) || v.wbw.some((r) => r.word.trim() || r.meaning.trim()))
        .map((v) => ({ preview: LANGS.map((l) => toLines(v.text[l])[0]).find(Boolean) || v.translation.en.trim() || "(no text)" })),
    [form.verses]
  );
  const syncTrack = form.tracks.find((t) => t.key === syncKey);
  const anyUploading = form.tracks.some((t) => t.uploading) || coverUploading;
  const dirty = baseline !== "" && payloadJson !== baseline;

  // Load existing bhajan.
  useEffect(() => {
    if (isNew) {
      setBaseline(JSON.stringify(buildPayload(emptyForm())));
      return;
    }
    let cancelled = false;
    (async () => {
      try {
        const res = await authFetch(`${API_URL}/bhajans/admin/${id}`, { credentials: "include" });
        const json = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(json.message || `Could not load bhajan (status ${res.status})`);
        if (cancelled) return;
        const f = fromDoc(json, (json.verses || []).length <= 8);
        setForm(f);
        setSlugTouched(true);
        setBaseline(JSON.stringify(buildPayload(f)));
      } catch (e: any) {
        if (!cancelled) setLoadError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [id, isNew]);

  // Taxonomy labels come from the server, never hardcoded.
  useEffect(() => {
    fetch(`${API_URL}/bhajans/meta`)
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => {
        if (!m) return;
        const pick = (arr: any[] = []) => arr.map((x) => ({ slug: x.slug, label: x.label || x.slug }));
        setMeta({ categories: pick(m.categories), moods: pick(m.moods), festivals: pick(m.festivals) });
      })
      .catch(() => {});
  }, []);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    if (!dirty && !anyUploading) return;
    const h = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = ""; };
    window.addEventListener("beforeunload", h);
    return () => window.removeEventListener("beforeunload", h);
  }, [dirty, anyUploading]);

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) => setForm((f) => ({ ...f, [k]: v }));
  const clearErr = (k: string) => setErrors((e) => { if (!e[k]) return e; const { [k]: _x, ...rest } = e; return rest; });

  const leave = () => {
    if ((dirty || anyUploading) && !window.confirm("You have unsaved changes. Leave without saving?")) return;
    router.push("/admin/bhajans");
  };

  // ── Cover ──
  const uploadCover = async (file?: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) { toast({ title: "Please choose an image file", variant: "destructive" }); return; }
    setCoverUploading(true);
    try {
      const json = await uploadWithProgress("/bhajans/upload/cover", file, () => {});
      if (!json.url) throw new Error("Server returned no URL");
      set("coverImage", json.url);
    } catch (e: any) {
      toast({ title: "Cover upload failed", description: e.message, variant: "destructive" });
    } finally {
      setCoverUploading(false);
      if (coverInput.current) coverInput.current.value = "";
    }
  };

  // ── Tracks ──
  const patchTrack = (key: string, patch: Partial<TrackForm>) =>
    setForm((f) => ({ ...f, tracks: f.tracks.map((t) => (t.key === key ? { ...t, ...patch } : t)) }));

  const uploadAudio = async (files: FileList | null) => {
    if (!files || !files.length) return;
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("audio/") && !/\.(mp3|m4a|wav|ogg)$/i.test(file.name)) {
        toast({ title: `${file.name} is not an audio file`, variant: "destructive" });
        continue;
      }
      if (file.size > 60 * 1024 * 1024) {
        toast({ title: `${file.name} is larger than 60 MB`, variant: "destructive" });
        continue;
      }
      const key = nk();
      const guessedSinger = "";
      setForm((f) => ({
        ...f,
        tracks: [...f.tracks, { key, singer: guessedSinger, url: "", duration: 0, bytes: file.size, verseTimes: [], uploading: true, progress: 0 }],
      }));
      try {
        const [duration, json] = await Promise.all([
          readAudioDuration(file),
          uploadWithProgress("/bhajans/upload/audio", file, (pct) => patchTrack(key, { progress: pct })),
        ]);
        if (!json.url) throw new Error("Server returned no URL");
        patchTrack(key, { url: json.url, bytes: json.bytes || file.size, duration, uploading: false, progress: 100 });
      } catch (e: any) {
        setForm((f) => ({ ...f, tracks: f.tracks.filter((t) => t.key !== key) }));
        toast({ title: `Upload failed: ${file.name}`, description: e.message, variant: "destructive" });
      }
    }
    if (audioInput.current) audioInput.current.value = "";
  };

  const moveTrack = (i: number, d: -1 | 1) =>
    setForm((f) => {
      const j = i + d;
      if (j < 0 || j >= f.tracks.length) return f;
      const tracks = [...f.tracks];
      [tracks[i], tracks[j]] = [tracks[j], tracks[i]];
      return { ...f, tracks };
    });

  // ── Verses ──
  const patchVerse = (key: string, fn: (v: VerseForm) => VerseForm) =>
    setForm((f) => ({ ...f, verses: f.verses.map((v) => (v.key === key ? fn(v) : v)) }));

  const moveVerse = (i: number, d: -1 | 1) =>
    setForm((f) => {
      const j = i + d;
      if (j < 0 || j >= f.verses.length) return f;
      const verses = [...f.verses];
      [verses[i], verses[j]] = [verses[j], verses[i]];
      return { ...f, verses };
    });

  const applyPaste = (replace: boolean) => {
    const blocks = pasteText.replace(/\r/g, "").split(/\n\s*\n/).map((b) => b.trim()).filter(Boolean);
    if (!blocks.length) { toast({ title: "Nothing to import", description: "Paste lyrics with a blank line between verses." }); return; }
    const verses = blocks.map((b) => {
      const v = emptyVerse(blocks.length <= 8);
      v.text.en = b.split("\n").map((l) => l.trim()).filter(Boolean).join("\n");
      return v;
    });
    setForm((f) => ({ ...f, verses: replace ? verses : [...f.verses, ...verses] }));
    setPasteText("");
    setPasteOpen(false);
    toast({ title: `${verses.length} verse${verses.length === 1 ? "" : "s"} added`, description: "Pasted as English transliteration." });
  };

  // ── Save ──
  const save = async () => {
    const errs: Record<string, string> = {};
    const body = buildPayload(form);
    if (!form.title.trim()) errs.title = "Title is required";
    if (!(body.verses as any[]).length && !(body.tracks as any[]).length) errs.content = "Add at least one verse or one audio track";
    if (form.tracks.some((t) => t.uploading)) errs.content = "Wait for audio uploads to finish";
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast({ title: "Please fix the highlighted fields", description: Object.values(errs)[0], variant: "destructive" });
      if (errs.title) document.getElementById("bhajan-title")?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    setSaving(true);
    try {
      const res = await authFetch(`${API_URL}/bhajans${isNew ? "" : `/${id}`}`, {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (json.errors && typeof json.errors === "object") setErrors(json.errors);
        throw new Error(json.message || json.error || `Save failed (status ${res.status})`);
      }
      toast({ title: isNew ? "Bhajan created" : "Saved", description: json.title || body.title });
      if (isNew && json._id) {
        setBaseline(JSON.stringify(body)); // suppress the unsaved warning
        router.replace(`/admin/bhajans/${json._id}`);
      } else {
        const f = fromDoc(json, formRef.current.verses.length <= 8);
        // Keep the open/closed state of verses the admin was working on.
        f.verses = f.verses.map((v, i) => ({ ...v, open: formRef.current.verses[i]?.open ?? v.open }));
        setForm(f);
        setBaseline(JSON.stringify(buildPayload(f)));
      }
    } catch (e: any) {
      toast({ title: "Failed to save", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <p className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Loading bhajan…
      </p>
    );
  }
  if (loadError) {
    return (
      <Card>
        <CardContent className="space-y-3 py-10 text-center">
          <p className="text-sm text-red-600">{loadError}</p>
          <Button asChild variant="outline"><Link href="/admin/bhajans">Back to bhajans</Link></Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-5 pb-24">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <button onClick={leave} className="mb-1 flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-3.5 w-3.5" /> All bhajans
          </button>
          <h1 className="flex items-center gap-2 text-xl font-bold sm:text-2xl">
            <Music2 className="h-6 w-6 shrink-0 text-primary" />
            <span className="truncate">{isNew ? "Add bhajan" : form.title || "Edit bhajan"}</span>
          </h1>
          {dirty && <p className="mt-0.5 text-xs font-medium text-amber-600">Unsaved changes</p>}
        </div>
        <Button onClick={save} disabled={saving || anyUploading} className="hidden sm:inline-flex">
          {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          {isNew ? "Create bhajan" : "Save changes"}
        </Button>
      </div>

      {errors.content && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{errors.content}</div>
      )}

      {/* Basics */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Basics</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Title *" error={errors.title}>
              <Input
                id="bhajan-title"
                className={fieldCls}
                value={form.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setForm((f) => ({ ...f, title, slug: isNew && !slugTouched ? slugify(title) : f.slug }));
                  clearErr("title");
                }}
                placeholder="e.g. Bhaja Bhakata Vatsala"
              />
            </Field>
            <Field label="Slug" hint={isNew ? "Auto-generated from the title; edit to override. Leave empty to let the server pick." : "Changing the slug changes the public URL."}>
              <Input
                className={fieldCls}
                value={form.slug}
                onChange={(e) => { setSlugTouched(true); set("slug", e.target.value.toLowerCase()); }}
                placeholder="bhaja-bhakata-vatsala"
              />
            </Field>
            <Field label="Composer / artist">
              <Input className={fieldCls} value={form.artist} onChange={(e) => set("artist", e.target.value)} placeholder="e.g. Bhaktivinoda Thakura" />
            </Field>
            <Field label="Subtitle">
              <Input className={fieldCls} value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} placeholder="e.g. from Gitavali" />
            </Field>
            <Field label="Sort order" hint="Lower numbers show first among featured items.">
              <Input className={fieldCls} type="number" inputMode="numeric" value={form.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} />
            </Field>
            <div className="flex flex-wrap items-end gap-6 pb-1">
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.isPublished} onCheckedChange={(v) => set("isPublished", v)} /> Published
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={form.isFeatured} onCheckedChange={(v) => set("isFeatured", v)} /> Featured
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Taxonomy */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Taxonomy</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Taxonomy title="Categories" options={meta.categories} value={form.categories} onChange={(v) => set("categories", v)} />
          <Taxonomy title="Moods" options={meta.moods} value={form.moods} onChange={(v) => set("moods", v)} />
          <Taxonomy title="Festivals" options={meta.festivals} value={form.festivals} onChange={(v) => set("festivals", v)} />
          <Taxonomy
            title="Languages available"
            options={LANGS.map((l) => ({ slug: l, label: LANG_NAME[l] }))}
            value={form.languages}
            onChange={(v) => set("languages", v as Lang[])}
          />
          <p className="text-xs text-muted-foreground">Languages with lyrics entered below are added automatically on save.</p>
        </CardContent>
      </Card>

      {/* Cover */}
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-base">Cover image</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative h-36 w-36 shrink-0 overflow-hidden rounded-xl bg-gradient-to-br from-sky-100 to-blue-200">
              {form.coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.coverImage} alt="Cover preview" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 p-2 text-center text-xs text-blue-500">
                  <Music2 className="h-6 w-6" />
                  Generated art is used when empty
                </div>
              )}
              {coverUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/70"><Loader2 className="h-6 w-6 animate-spin" /></div>
              )}
            </div>
            <div className="flex-1 space-y-3">
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => coverInput.current?.click()} disabled={coverUploading}>
                  <Upload className="mr-1.5 h-4 w-4" /> Upload image
                </Button>
                {form.coverImage && (
                  <Button type="button" variant="outline" size="sm" className="text-red-600 hover:bg-red-50" onClick={() => set("coverImage", "")}>
                    <X className="mr-1.5 h-4 w-4" /> Remove
                  </Button>
                )}
                <input ref={coverInput} type="file" accept="image/*" hidden onChange={(e) => uploadCover(e.target.files?.[0])} />
              </div>
              <Field label="Or paste an image URL" hint="You can copy a link from the Media Library and paste it here.">
                <Input className={fieldCls} value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="https://…" />
              </Field>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audio tracks */}
      <Card>
        <CardHeader className="flex-row items-center justify-between gap-2 space-y-0 pb-3">
          <CardTitle className="text-base">Audio tracks ({form.tracks.length})</CardTitle>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => audioInput.current?.click()}>
              <Upload className="mr-1.5 h-4 w-4" /> Upload audio
            </Button>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => set("tracks", [...form.tracks, { key: nk(), singer: "", url: "", duration: 0, bytes: 0, verseTimes: [] }])}
              title="Add a track by pasting a URL"
            >
              <Plus className="mr-1 h-4 w-4" /> URL
            </Button>
            <input ref={audioInput} type="file" accept="audio/*,.mp3,.m4a,.wav,.ogg" multiple hidden onChange={(e) => uploadAudio(e.target.files)} />
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {form.tracks.length === 0 && (
            <p className="text-sm text-muted-foreground">No recordings yet. Upload mp3, m4a, wav or ogg files (up to 60 MB each).</p>
          )}
          {form.tracks.map((t, i) => (
            <div key={t.key} className="space-y-2 rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">{i + 1}</span>
                <Input
                  className={`${fieldCls} flex-1`}
                  value={t.singer}
                  onChange={(e) => patchTrack(t.key, { singer: e.target.value })}
                  placeholder="Singer name"
                />
                <div className="flex shrink-0 gap-1">
                  <Button type="button" size="sm" variant="outline" className="h-9 px-2" disabled={i === 0} onClick={() => moveTrack(i, -1)} aria-label="Move up">
                    <ArrowUp className="h-4 w-4" />
                  </Button>
                  <Button type="button" size="sm" variant="outline" className="h-9 px-2" disabled={i === form.tracks.length - 1} onClick={() => moveTrack(i, 1)} aria-label="Move down">
                    <ArrowDown className="h-4 w-4" />
                  </Button>
                  <Button
                    type="button" size="sm" variant="outline" className="h-9 px-2 text-red-600 hover:bg-red-50" aria-label="Remove track"
                    onClick={() => { if (!t.url || window.confirm("Remove this track? The audio file is detached when you save.")) set("tracks", form.tracks.filter((x) => x.key !== t.key)); }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              {t.uploading ? (
                <div className="space-y-1">
                  <div className="h-2 overflow-hidden rounded-full bg-muted">
                    <div className="h-full bg-primary transition-all" style={{ width: `${t.progress || 0}%` }} />
                  </div>
                  <p className="text-xs text-muted-foreground">Uploading… {t.progress || 0}% {fmtBytes(t.bytes)}</p>
                </div>
              ) : (
                <>
                  <Input
                    className={fieldCls}
                    value={t.url}
                    onChange={(e) => patchTrack(t.key, { url: e.target.value, duration: 0, verseTimes: [] })}
                    placeholder="Audio URL"
                  />
                  {t.url && (
                    <audio
                      key={t.url}
                      controls
                      preload="metadata"
                      src={t.url}
                      className="h-10 w-full"
                      onLoadedMetadata={(e) => {
                        const d = e.currentTarget.duration;
                        if (Number.isFinite(d) && Math.round(d) !== Math.round(t.duration)) patchTrack(t.key, { duration: d });
                      }}
                    />
                  )}
                  <p className="text-xs text-muted-foreground">
                    Duration {fmtDur(t.duration)}{t.bytes ? ` · ${fmtBytes(t.bytes)}` : ""} (read from the file)
                  </p>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${t.verseTimes.length > 0 ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"}`}>
                      {t.verseTimes.length > 0 ? `Synced ${t.verseTimes.length}/${syncVerses.length}` : "Not synced"}
                    </span>
                    <Button type="button" size="sm" variant="outline" className="h-7 text-xs" disabled={!t.url || syncVerses.length === 0} onClick={() => setSyncKey(t.key)}>
                      <Timer className="mr-1 h-3.5 w-3.5" /> Sync lyrics
                    </Button>
                    {syncVerses.length === 0 && <span className="text-xs text-muted-foreground">Add verses to enable sync</span>}
                  </div>
                </>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Verses */}
      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-2 space-y-0 pb-3">
          <CardTitle className="text-base">Verses ({form.verses.length})</CardTitle>
          <div className="flex flex-wrap gap-2">
            <Button type="button" size="sm" variant="outline" onClick={() => setPasteOpen((o) => !o)}>
              <ClipboardPaste className="mr-1.5 h-4 w-4" /> Paste lyrics
            </Button>
            {form.verses.length > 1 && (
              <Button
                type="button" size="sm" variant="ghost"
                onClick={() => {
                  const anyOpen = form.verses.some((v) => v.open);
                  set("verses", form.verses.map((v) => ({ ...v, open: !anyOpen })));
                }}
              >
                {form.verses.some((v) => v.open) ? "Collapse all" : "Expand all"}
              </Button>
            )}
            <Button type="button" size="sm" onClick={() => set("verses", [...form.verses, emptyVerse()])}>
              <Plus className="mr-1 h-4 w-4" /> Add verse
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {pasteOpen && (
            <div className="space-y-2 rounded-lg border border-dashed border-primary/40 bg-primary/5 p-3">
              <p className="text-sm font-medium">Paste the full lyrics</p>
              <p className="text-xs text-muted-foreground">
                A blank line starts a new verse. Text goes into the English transliteration field; add other scripts per verse afterwards.
              </p>
              <Textarea rows={8} className={fieldCls} value={pasteText} onChange={(e) => setPasteText(e.target.value)} placeholder={"line one\nline two\n\nnext verse…"} />
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={() => applyPaste(false)}>Append as verses</Button>
                {form.verses.length > 0 && (
                  <Button
                    type="button" size="sm" variant="outline"
                    onClick={() => { if (window.confirm("Replace all existing verses?")) applyPaste(true); }}
                  >
                    Replace existing
                  </Button>
                )}
                <Button type="button" size="sm" variant="ghost" onClick={() => setPasteOpen(false)}>Cancel</Button>
              </div>
            </div>
          )}

          {form.verses.length === 0 && !pasteOpen && (
            <p className="text-sm text-muted-foreground">No verses yet. Use “Paste lyrics” for a quick start or “Add verse”.</p>
          )}

          {form.verses.map((v, i) => {
            const preview = toLines(v.text.en)[0] || toLines(v.text.te)[0] || toLines(v.text.hi)[0] || "(empty)";
            return (
              <div key={v.key} className="rounded-lg border">
                <div className="flex items-center gap-2 p-2">
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                    onClick={() => patchVerse(v.key, (x) => ({ ...x, open: !x.open }))}
                    aria-expanded={v.open}
                  >
                    <span className="flex h-6 min-w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 px-1 text-xs font-semibold text-primary">{i + 1}</span>
                    <span className="truncate text-sm text-muted-foreground">{preview}</span>
                    {v.open ? <ChevronUp className="ml-auto h-4 w-4 shrink-0" /> : <ChevronDown className="ml-auto h-4 w-4 shrink-0" />}
                  </button>
                  <div className="flex shrink-0 gap-1">
                    <Button type="button" size="sm" variant="outline" className="h-8 px-2" disabled={i === 0} onClick={() => moveVerse(i, -1)} aria-label="Move verse up">
                      <ArrowUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button type="button" size="sm" variant="outline" className="h-8 px-2" disabled={i === form.verses.length - 1} onClick={() => moveVerse(i, 1)} aria-label="Move verse down">
                      <ArrowDown className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button" size="sm" variant="outline" className="h-8 px-2 text-red-600 hover:bg-red-50" aria-label="Remove verse"
                      onClick={() => {
                        const has = LANGS.some((l) => v.text[l].trim() || v.translation[l].trim()) || v.wbw.length;
                        if (!has || window.confirm(`Remove verse ${i + 1}?`)) set("verses", form.verses.filter((x) => x.key !== v.key));
                      }}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>

                {v.open && (
                  <div className="space-y-4 border-t p-3">
                    {LANGS.filter((l) => v.showLangs[l]).map((l) => (
                      <div key={l} className="space-y-2">
                        <Field label={TEXT_LABEL[l]}>
                          <Textarea
                            rows={Math.max(3, v.text[l].split("\n").length)}
                            className={fieldCls}
                            value={v.text[l]}
                            onChange={(e) => patchVerse(v.key, (x) => ({ ...x, text: { ...x.text, [l]: e.target.value } }))}
                          />
                        </Field>
                        <Field label={`${LANG_NAME[l]} translation`}>
                          <Textarea
                            rows={2}
                            className={fieldCls}
                            value={v.translation[l]}
                            onChange={(e) => patchVerse(v.key, (x) => ({ ...x, translation: { ...x.translation, [l]: e.target.value } }))}
                          />
                        </Field>
                      </div>
                    ))}

                    <div className="flex flex-wrap gap-1.5">
                      {LANGS.filter((l) => !v.showLangs[l]).map((l) => (
                        <Button
                          key={l} type="button" size="sm" variant="outline" className="h-7 text-xs"
                          onClick={() => patchVerse(v.key, (x) => ({ ...x, showLangs: { ...x.showLangs, [l]: true } }))}
                        >
                          <Plus className="mr-1 h-3 w-3" /> {LANG_NAME[l]}
                        </Button>
                      ))}
                      {!v.showWbw && (
                        <Button type="button" size="sm" variant="outline" className="h-7 text-xs" onClick={() => patchVerse(v.key, (x) => ({ ...x, showWbw: true }))}>
                          <Plus className="mr-1 h-3 w-3" /> Word by word
                        </Button>
                      )}
                    </div>

                    {v.showWbw && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Word by word</p>
                        {v.wbw.map((r, ri) => (
                          <div key={ri} className="flex items-center gap-2">
                            <Input
                              className={`${fieldCls} flex-1`}
                              placeholder="word"
                              value={r.word}
                              onChange={(e) => patchVerse(v.key, (x) => ({ ...x, wbw: x.wbw.map((w, wi) => (wi === ri ? { ...w, word: e.target.value } : w)) }))}
                            />
                            <Input
                              className={`${fieldCls} flex-[2]`}
                              placeholder="meaning"
                              value={r.meaning}
                              onChange={(e) => patchVerse(v.key, (x) => ({ ...x, wbw: x.wbw.map((w, wi) => (wi === ri ? { ...w, meaning: e.target.value } : w)) }))}
                            />
                            <Button
                              type="button" size="sm" variant="outline" className="h-9 px-2" aria-label="Remove row"
                              onClick={() => patchVerse(v.key, (x) => ({ ...x, wbw: x.wbw.filter((_, wi) => wi !== ri) }))}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button" size="sm" variant="outline" className="h-8 text-xs"
                          onClick={() => patchVerse(v.key, (x) => ({ ...x, wbw: [...x.wbw, { word: "", meaning: "" }] }))}
                        >
                          <Plus className="mr-1 h-3 w-3" /> Add row
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </CardContent>
      </Card>

      {syncTrack && (
        <SyncLyrics
          title={`${syncTrack.singer || "Track"} · ${form.title}`}
          url={syncTrack.url}
          verses={syncVerses}
          times={syncTrack.verseTimes}
          onChange={(t) => patchTrack(syncTrack.key, { verseTimes: t })}
          onClose={() => setSyncKey(null)}
        />
      )}

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 px-4 py-3 backdrop-blur sm:hidden">
        <Button onClick={save} disabled={saving || anyUploading} className="w-full">
          {saving ? <Loader2 className="mr-1.5 h-4 w-4 animate-spin" /> : <Save className="mr-1.5 h-4 w-4" />}
          {anyUploading ? "Uploading…" : isNew ? "Create bhajan" : "Save changes"}
        </Button>
      </div>
    </div>
  );
}
