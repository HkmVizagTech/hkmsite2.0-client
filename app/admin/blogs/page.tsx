"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Eye,
  Search,
  Calendar,
  Clock,
  FileText,
  Upload,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAdminLoader } from "@/contexts/AdminLoaderContext";

// CKEditor is dynamic — never SSR
const RichTextEditor = dynamic(() => import("@/components/ui/rich-text-editor"), {
  ssr: false,
  loading: () => (
    <div className="text-sm text-muted-foreground px-3 py-12 border rounded-md bg-muted/30 text-center">
      Loading editor…
    </div>
  ),
});

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: string;
  status: "draft" | "published";
  publishedAt?: string;
  readTime: number;
  views: number;
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  "Spirituality",
  "Festivals",
  "Vizag Guide",
  "Recipes",
  "Philosophy",
  "General",
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Blog | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState({ status: "all", category: "", q: "" });
  const { show, hide } = useAdminLoader();

  // Form fields
  const emptyForm = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    coverImage: "",
    category: "General",
    tags: "" as string,
    author: "Admin",
    status: "draft" as "draft" | "published",
    metaTitle: "",
    metaDescription: "",
  };
  const [form, setForm] = useState(emptyForm);
  const coverFileRef = useRef<File | null>(null);

  // ─── Fetch list ────────────────────────────────────────────────────
  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("status", filter.status);
      if (filter.category) params.set("category", filter.category);
      if (filter.q) params.set("q", filter.q);
      params.set("limit", "50");
      const res = await fetch(`${API_URL}/blogs?${params.toString()}`, {
        credentials: "include",
      });
      const json = await res.json();
      if (res.ok) setBlogs(json.blogs || []);
      else toast({ title: "Failed to load blogs", description: json.message, variant: "destructive" });
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.status, filter.category]);

  // ─── Open / Close form ─────────────────────────────────────────────
  const openCreate = () => {
    setForm(emptyForm);
    coverFileRef.current = null;
    setEditing(null);
    setShowForm(true);
  };

  const openEdit = (blog: Blog) => {
    setForm({
      title: blog.title,
      slug: blog.slug,
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      coverImage: blog.coverImage || "",
      category: blog.category || "General",
      tags: (blog.tags || []).join(", "),
      author: blog.author || "Admin",
      status: blog.status,
      metaTitle: (blog as any).metaTitle || "",
      metaDescription: (blog as any).metaDescription || "",
    });
    coverFileRef.current = null;
    setEditing(blog);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditing(null);
    coverFileRef.current = null;
  };

  // ─── Submit ────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent, asStatus?: "draft" | "published") => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast({ title: "Title required", variant: "destructive" });
      return;
    }
    if (!form.content || form.content.replace(/<[^>]*>/g, "").trim().length < 30) {
      toast({ title: "Content too short", description: "Add at least 30 characters of body text.", variant: "destructive" });
      return;
    }

    const finalStatus = asStatus || form.status;
    setSubmitting(true);
    show && show(editing ? "Updating blog…" : "Creating blog…");
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      if (form.slug) fd.append("slug", form.slug);
      fd.append("excerpt", form.excerpt);
      fd.append("content", form.content);
      fd.append("category", form.category);
      fd.append("tags", form.tags);
      fd.append("author", form.author || "Admin");
      fd.append("status", finalStatus);
      fd.append("metaTitle", form.metaTitle);
      fd.append("metaDescription", form.metaDescription);
      // If we kept an existing cover URL and didn't upload a new one, send it back so it isn't cleared
      if (form.coverImage && !coverFileRef.current) {
        fd.append("coverImage", form.coverImage);
      }
      if (coverFileRef.current) {
        fd.append("coverImage", coverFileRef.current); // file under same field name
      }

      const url = editing ? `${API_URL}/blogs/${editing._id}` : `${API_URL}/blogs`;
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, { method, body: fd, credentials: "include" });
      const json = await res.json();

      if (res.ok) {
        toast({
          title: editing ? "Blog updated" : "Blog created",
          description: finalStatus === "published" ? "Now live on the website." : "Saved as draft.",
        });
        closeForm();
        fetchBlogs();
      } else {
        const msg = json.errors?.[0]?.msg || json.message || "Save failed";
        toast({ title: "Failed to save", description: msg, variant: "destructive" });
      }
    } catch (e: any) {
      toast({ title: "Network error", description: e.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
      hide && hide();
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────
  const handleDelete = async (blog: Blog) => {
    if (!confirm(`Delete "${blog.title}"? This cannot be undone.`)) return;
    show && show("Deleting…");
    try {
      const res = await fetch(`${API_URL}/blogs/${blog._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        toast({ title: "Deleted" });
        fetchBlogs();
      } else {
        toast({ title: "Delete failed", variant: "destructive" });
      }
    } finally {
      hide && hide();
    }
  };

  // ─── Filtered (client-side search by title) ────────────────────────
  const visible = blogs.filter((b) =>
    filter.q ? b.title.toLowerCase().includes(filter.q.toLowerCase()) : true
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" /> Blogs
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Write and publish blog articles. Uses a rich-text editor with image upload.
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-md">
          <Plus className="w-4 h-4 mr-2" /> New Post
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-5">
        <CardContent className="p-4 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title…"
              value={filter.q}
              onChange={(e) => setFilter((f) => ({ ...f, q: e.target.value }))}
              className="pl-9"
            />
          </div>
          <select
            value={filter.status}
            onChange={(e) => setFilter((f) => ({ ...f, status: e.target.value }))}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="all">All status</option>
            <option value="published">Published</option>
            <option value="draft">Drafts</option>
          </select>
          <select
            value={filter.category}
            onChange={(e) => setFilter((f) => ({ ...f, category: e.target.value }))}
            className="h-9 px-3 rounded-md border border-input bg-background text-sm"
          >
            <option value="">All categories</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* List */}
      {loading ? (
        <div className="text-center text-muted-foreground py-16">Loading…</div>
      ) : visible.length === 0 ? (
        <Card>
          <CardContent className="text-center py-16">
            <FileText className="w-12 h-12 mx-auto text-muted-foreground/40 mb-3" />
            <p className="text-sm text-muted-foreground">No blogs yet. Click "New Post" to start.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {visible.map((blog) => (
            <Card key={blog._id} className="overflow-hidden hover:shadow-md transition">
              {blog.coverImage ? (
                <div
                  className="aspect-[16/9] bg-cover bg-center"
                  style={{ backgroundImage: `url(${blog.coverImage})` }}
                />
              ) : (
                <div className="aspect-[16/9] bg-muted flex items-center justify-center text-muted-foreground">
                  <FileText className="w-8 h-8 opacity-30" />
                </div>
              )}
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={blog.status === "published" ? "default" : "secondary"}>
                    {blog.status}
                  </Badge>
                  <Badge variant="outline">{blog.category}</Badge>
                </div>
                <h3 className="font-semibold text-base line-clamp-2 mb-1">{blog.title}</h3>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3 min-h-[2.4em]">
                  {blog.excerpt || "—"}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-muted-foreground mb-3">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {blog.publishedAt
                      ? new Date(blog.publishedAt).toLocaleDateString()
                      : new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {blog.readTime} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Eye className="w-3 h-3" /> {blog.views}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 flex-1"
                    onClick={() => openEdit(blog)}
                  >
                    <Pencil className="w-3.5 h-3.5 mr-1.5" /> Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => handleDelete(blog)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Form modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center overflow-y-auto p-4"
            onClick={(e) => e.target === e.currentTarget && closeForm()}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.96, opacity: 0, y: 10 }}
              className="bg-background w-full max-w-4xl rounded-xl shadow-2xl my-8"
            >
              {/* Modal header */}
              <div className="flex items-center justify-between p-5 border-b">
                <h2 className="text-lg font-semibold">
                  {editing ? "Edit Blog Post" : "New Blog Post"}
                </h2>
                <button
                  onClick={closeForm}
                  className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form className="p-5 space-y-4" onSubmit={(e) => handleSubmit(e)}>
                {/* Title */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Title <span className="text-red-500">*</span>
                  </label>
                  <Input
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Catchy blog post title…"
                    className="mt-1.5 text-lg font-semibold"
                    required
                  />
                </div>

                {/* Slug + category + status row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Slug (URL)
                    </label>
                    <Input
                      value={form.slug}
                      onChange={(e) => setForm({ ...form, slug: e.target.value })}
                      placeholder="auto-from-title"
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Category
                    </label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="mt-1.5 h-10 w-full px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Author
                    </label>
                    <Input
                      value={form.author}
                      onChange={(e) => setForm({ ...form, author: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Excerpt (used in cards &amp; SEO)
                  </label>
                  <Textarea
                    value={form.excerpt}
                    onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                    placeholder="A short 1-2 sentence summary…"
                    rows={2}
                    className="mt-1.5 resize-none"
                    maxLength={500}
                  />
                </div>

                {/* Cover image */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Cover Image
                  </label>
                  <div className="mt-1.5 flex items-center gap-3">
                    {form.coverImage && (
                      <div
                        className="w-24 h-16 rounded-md bg-cover bg-center border"
                        style={{ backgroundImage: `url(${form.coverImage})` }}
                      />
                    )}
                    <label className="flex-1 flex items-center gap-2 px-3 py-2 border border-dashed rounded-md cursor-pointer hover:bg-muted/50 transition">
                      <Upload className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {coverFileRef.current
                          ? coverFileRef.current.name
                          : form.coverImage
                          ? "Replace cover image"
                          : "Click to upload cover image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const f = e.target.files?.[0];
                          if (f) {
                            coverFileRef.current = f;
                            // local preview
                            const url = URL.createObjectURL(f);
                            setForm((cur) => ({ ...cur, coverImage: url }));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Tags (comma-separated)
                  </label>
                  <Input
                    value={form.tags}
                    onChange={(e) => setForm({ ...form, tags: e.target.value })}
                    placeholder="krishna, ekadashi, festival"
                    className="mt-1.5"
                  />
                </div>

                {/* Rich text editor */}
                <div>
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Content <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1.5">
                    <RichTextEditor
                      value={form.content}
                      onChange={(html) => setForm((cur) => ({ ...cur, content: html }))}
                    />
                  </div>
                </div>

                {/* SEO collapsible */}
                <details className="border rounded-md">
                  <summary className="px-4 py-2.5 text-sm font-medium cursor-pointer select-none hover:bg-muted/50">
                    SEO Settings (optional)
                  </summary>
                  <div className="p-4 pt-2 space-y-3 border-t">
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Meta Title
                      </label>
                      <Input
                        value={form.metaTitle}
                        onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                        placeholder="Defaults to post title"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                        Meta Description
                      </label>
                      <Textarea
                        value={form.metaDescription}
                        onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                        placeholder="Defaults to excerpt"
                        rows={2}
                        className="mt-1.5 resize-none"
                      />
                    </div>
                  </div>
                </details>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-4 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={closeForm}
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={submitting}
                    onClick={(e) => handleSubmit(e, "draft")}
                  >
                    Save Draft
                  </Button>
                  <Button
                    type="button"
                    disabled={submitting}
                    onClick={(e) => handleSubmit(e, "published")}
                  >
                    {submitting ? "Saving…" : editing && editing.status === "published" ? "Update" : "Publish"}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
