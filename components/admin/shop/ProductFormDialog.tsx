"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Loader2, Plus, Star, Trash2, Upload, X } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authFetch } from "@/lib/authClient";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

export interface ShopVariant {
  _id?: string;
  label: string;
  sku?: string;
  price: number;
  mrp?: number;
  stock: number;
  weightGrams?: number;
}

export interface ShopProduct {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  category: string;
  images: string[];
  hasVariants: boolean;
  price?: number;
  mrp?: number;
  stock?: number;
  variants: ShopVariant[];
  weightGrams?: number;
  status: "active" | "draft";
  featured: boolean;
  tags: string[];
  sortOrder: number;
  totalStock: number;
}

export interface ShopCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  sortOrder: number;
  status: "active" | "draft";
}

// Variant rows are held as strings while the dialog is open so a half-typed
// price ("12.") doesn't get coerced to NaN and wipe the field under the
// admin's cursor. They're converted to numbers once, on submit.
interface VariantRow {
  _id?: string;
  label: string;
  sku: string;
  price: string;
  mrp: string;
  stock: string;
  weightGrams: string;
}

const emptyVariant = (): VariantRow => ({
  label: "",
  sku: "",
  price: "",
  mrp: "",
  stock: "0",
  weightGrams: "",
});

const num = (v: string) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: ShopProduct | null;
  categories: ShopCategory[];
  onSaved: () => void;
  /** Called after an inline-created category so the parent can refresh its list. */
  onCategoryCreated?: () => void;
}

export default function ProductFormDialog({ open, onOpenChange, product, categories, onSaved, onCategoryCreated }: Props) {
  const editing = Boolean(product);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [hasVariants, setHasVariants] = useState(false);
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [stock, setStock] = useState("0");
  const [variants, setVariants] = useState<VariantRow[]>([emptyVariant()]);
  const [weightGrams, setWeightGrams] = useState("");
  const [status, setStatus] = useState<"active" | "draft">("draft");
  const [featured, setFeatured] = useState(false);
  const [tags, setTags] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [regenerateSlug, setRegenerateSlug] = useState(false);

  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Categories created inline from this dialog (added here rather than on the
  // Categories tab). Merged into the dropdown so the admin can pick them in
  // the same session, and onCategoryCreated refreshes the parent's list too.
  const [extraCategories, setExtraCategories] = useState<ShopCategory[]>([]);
  const [newCategoryOpen, setNewCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);

  const allCategories = useMemo(() => {
    const seen = new Set(categories.map((c) => c.slug));
    return [...categories, ...extraCategories.filter((c) => !seen.has(c.slug))];
  }, [categories, extraCategories]);

  // Reset from scratch every time the dialog opens, rather than on `product`
  // changing — otherwise closing the dialog and reopening "Add product"
  // straight after an edit would still show the edited product's fields.
  useEffect(() => {
    if (!open) return;
    setError(null);
    setRegenerateSlug(false);
    if (product) {
      setName(product.name || "");
      setShortDescription(product.shortDescription || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setImages(product.images || []);
      setHasVariants(Boolean(product.hasVariants));
      setPrice(product.price != null ? String(product.price) : "");
      setMrp(product.mrp != null ? String(product.mrp) : "");
      setStock(product.stock != null ? String(product.stock) : "0");
      setVariants(
        product.variants?.length
          ? product.variants.map((v) => ({
              _id: v._id,
              label: v.label || "",
              sku: v.sku || "",
              price: v.price != null ? String(v.price) : "",
              mrp: v.mrp != null ? String(v.mrp) : "",
              stock: v.stock != null ? String(v.stock) : "0",
              weightGrams: v.weightGrams != null ? String(v.weightGrams) : "",
            }))
          : [emptyVariant()],
      );
      setWeightGrams(product.weightGrams != null ? String(product.weightGrams) : "");
      setStatus(product.status === "active" ? "active" : "draft");
      setFeatured(Boolean(product.featured));
      setTags((product.tags || []).join(", "));
      setSortOrder(String(product.sortOrder ?? 0));
    } else {
      setName("");
      setShortDescription("");
      setDescription("");
      setCategory(categories[0]?.slug || "");
      setImages([]);
      setHasVariants(false);
      setPrice("");
      setMrp("");
      setStock("0");
      setVariants([emptyVariant()]);
      setWeightGrams("");
      setStatus("draft");
      setFeatured(false);
      setTags("");
      setSortOrder("0");
    }
  }, [open, product, categories]);

  const uploadImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of Array.from(files)) {
        const form = new FormData();
        form.append("file", file);
        const res = await authFetch(`${API_URL}/shop-admin/upload-image`, { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok || !data.secure_url) throw new Error(data.message || "Upload failed");
        uploaded.push(data.secure_url);
      }
      setImages((prev) => [...prev, ...uploaded]);
    } catch (err: any) {
      toast({ title: err?.message || "Could not upload one of the images.", variant: "destructive" });
    } finally {
      setUploading(false);
      // Clearing the input lets the admin re-pick the same file after a
      // failed upload; the browser fires no change event otherwise.
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const validate = (): string | null => {
    if (!name.trim()) return "Product name is required.";
    if (!category) return "Pick a category.";
    if (hasVariants) {
      const filled = variants.filter((v) => v.label.trim());
      if (filled.length === 0) return "Add at least one variant with a label.";
      const bad = filled.find((v) => v.price.trim() === "" || num(v.price) < 0);
      if (bad) return `Variant "${bad.label}" needs a price of ₹0 or more.`;
    } else {
      if (price.trim() === "" || num(price) < 0) return "Enter a price of ₹0 or more.";
    }
    return null;
  };

  // MRP below price would render a negative "discount" on the storefront, but
  // it's sometimes a deliberate placeholder while a product is still a draft,
  // so this warns and lets the save through.
  const mrpWarnings = (): string[] => {
    const out: string[] = [];
    if (hasVariants) {
      variants.forEach((v) => {
        if (v.mrp.trim() && num(v.mrp) <= num(v.price)) {
          out.push(`${v.label || "Variant"}: MRP is not above the selling price.`);
        }
      });
    } else if (mrp.trim() && num(mrp) <= num(price)) {
      out.push("MRP is not above the selling price.");
    }
    return out;
  };

  const createCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return;
    setCreatingCategory(true);
    try {
      const res = await authFetch(`${API_URL}/shop-admin/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, sortOrder: 0 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success || !data.category)
        throw new Error(data.message || "Could not create category.");
      const created = data.category as ShopCategory;
      setExtraCategories((prev) =>
        prev.some((c) => c.slug === created.slug) ? prev : [...prev, created]
      );
      setCategory(created.slug);
      setNewCategoryName("");
      setNewCategoryOpen(false);
      toast({ title: `Category "${created.name}" created and selected.` });
      onCategoryCreated?.();
    } catch (err: any) {
      toast({ title: err?.message || "Could not create category.", variant: "destructive" });
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleSubmit = async () => {
    const problem = validate();
    if (problem) {
      setError(problem);
      return;
    }
    setError(null);
    mrpWarnings().forEach((w) => toast({ title: w }));

    const body: Record<string, unknown> = {
      name: name.trim(),
      shortDescription: shortDescription.trim(),
      description: description.trim(),
      category,
      images,
      hasVariants,
      weightGrams: weightGrams.trim() ? num(weightGrams) : 0,
      status,
      featured,
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      sortOrder: num(sortOrder),
    };

    if (hasVariants) {
      body.variants = variants
        .filter((v) => v.label.trim())
        .map((v) => {
          const row: Record<string, unknown> = {
            label: v.label.trim(),
            sku: v.sku.trim(),
            price: num(v.price),
            stock: num(v.stock),
            weightGrams: v.weightGrams.trim() ? num(v.weightGrams) : 0,
          };
          if (v.mrp.trim()) row.mrp = num(v.mrp);
          // A new row has no _id yet; sending an empty one would make the
          // backend try to match an existing subdocument.
          if (v._id) row._id = v._id;
          return row;
        });
    } else {
      body.price = num(price);
      body.stock = num(stock);
      if (mrp.trim()) body.mrp = num(mrp);
      body.variants = [];
    }

    if (editing && regenerateSlug) body.regenerateSlug = true;

    setSaving(true);
    try {
      const res = await authFetch(
        editing ? `${API_URL}/shop-admin/products/${product!._id}` : `${API_URL}/shop-admin/products`,
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not save the product.");
      toast({ title: editing ? "Product updated." : "Product created." });
      onOpenChange(false);
      onSaved();
    } catch (err: any) {
      setError(err?.message || "Could not save the product.");
    } finally {
      setSaving(false);
    }
  };

  const updateVariant = (index: number, patch: Partial<VariantRow>) =>
    setVariants((prev) => prev.map((v, i) => (i === index ? { ...v, ...patch } : v)));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editing ? "Edit product" : "Add product"}</DialogTitle>
          <DialogDescription>
            Drafts stay hidden from the shop until you set the status to Active.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>
        )}

        <div className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="product-name">Name</Label>
              <Input
                id="product-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Bhagavad Gita As It Is"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="product-category">Category</Label>
                <button
                  type="button"
                  onClick={() => setNewCategoryOpen((v) => !v)}
                  className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <Plus className="h-3 w-3" /> New category
                </button>
              </div>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger id="product-category">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {allCategories.map((c) => (
                    <SelectItem key={c._id} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {newCategoryOpen && (
                <div className="flex gap-2 pt-1">
                  <Input
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        createCategory();
                      }
                    }}
                    placeholder="e.g. Tulasi Mala"
                    autoFocus
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={createCategory}
                    disabled={creatingCategory || !newCategoryName.trim()}
                    className="shrink-0 gap-1"
                  >
                    {creatingCategory && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Create
                  </Button>
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="product-status">Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as "active" | "draft")}>
                <SelectTrigger id="product-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft (hidden)</SelectItem>
                  <SelectItem value="active">Active (live in shop)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="product-short">Short description</Label>
              <Input
                id="product-short"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="One line shown on the product card"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="product-description">Description</Label>
              <Textarea
                id="product-description"
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Full description shown on the product page"
              />
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Images</Label>
                <p className="text-xs text-muted-foreground">
                  The first image is the one shown on cards and in the cart. To reorder, remove an image and add it again.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="gap-1.5"
              >
                {uploading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                Upload
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => uploadImages(e.target.files)}
              />
            </div>

            {images.length === 0 ? (
              <p className="rounded-lg border border-dashed border-border py-6 text-center text-sm text-muted-foreground">
                No images yet.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {images.map((url, i) => (
                  <div key={`${url}-${i}`} className="relative">
                    {/* Plain <img>: these are R2 URLs, and next/image would need
                        the bucket host whitelisted in next.config. */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt=""
                      className="h-24 w-24 rounded-lg border border-border object-cover"
                    />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-gold px-1.5 py-0.5 text-[10px] font-bold text-foreground">
                        Primary
                      </span>
                    )}
                    <button
                      type="button"
                      aria-label="Remove image"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground shadow-sm"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Separator />

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div>
              <Label htmlFor="product-variants">This product has size/weight variants</Label>
              <p className="text-xs text-muted-foreground">
                e.g. 250g / 500g / 1kg, each with its own price and stock.
              </p>
            </div>
            <Switch id="product-variants" checked={hasVariants} onCheckedChange={setHasVariants} />
          </div>

          {hasVariants ? (
            <div className="space-y-3">
              {variants.map((v, i) => (
                <div key={v._id || i} className="rounded-lg border border-border p-3">
                  <div className="grid gap-3 sm:grid-cols-6">
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={v.label}
                        onChange={(e) => updateVariant(i, { label: e.target.value })}
                        placeholder="500 g"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Price ₹</Label>
                      <Input
                        type="number"
                        min={0}
                        value={v.price}
                        onChange={(e) => updateVariant(i, { price: e.target.value })}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">MRP ₹</Label>
                      <Input
                        type="number"
                        min={0}
                        value={v.mrp}
                        onChange={(e) => updateVariant(i, { mrp: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs">Stock</Label>
                      <Input
                        type="number"
                        min={0}
                        value={v.stock}
                        onChange={(e) => updateVariant(i, { stock: e.target.value })}
                      />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Remove variant"
                        onClick={() => setVariants((prev) => prev.filter((_, idx) => idx !== i))}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                    <div className="space-y-1.5 sm:col-span-3">
                      <Label className="text-xs">SKU (optional)</Label>
                      <Input value={v.sku} onChange={(e) => updateVariant(i, { sku: e.target.value })} />
                    </div>
                    <div className="space-y-1.5 sm:col-span-3">
                      <Label className="text-xs">Weight (grams, for shipping)</Label>
                      <Input
                        type="number"
                        min={0}
                        value={v.weightGrams}
                        onChange={(e) => updateVariant(i, { weightGrams: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5"
                onClick={() => setVariants((prev) => [...prev, emptyVariant()])}
              >
                <Plus className="h-3.5 w-3.5" /> Add variant
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-4">
              <div className="space-y-1.5">
                <Label htmlFor="product-price">Price ₹</Label>
                <Input
                  id="product-price"
                  type="number"
                  min={0}
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="product-mrp">MRP ₹</Label>
                <Input
                  id="product-mrp"
                  type="number"
                  min={0}
                  value={mrp}
                  onChange={(e) => setMrp(e.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="product-stock">Stock</Label>
                <Input
                  id="product-stock"
                  type="number"
                  min={0}
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="product-weight">Weight (g)</Label>
                <Input
                  id="product-weight"
                  type="number"
                  min={0}
                  value={weightGrams}
                  onChange={(e) => setWeightGrams(e.target.value)}
                />
              </div>
            </div>
          )}

          <Separator />

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="product-tags">Tags</Label>
              <Input
                id="product-tags"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="Comma separated: gita, books, gift"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="product-sort">Sort order</Label>
              <Input
                id="product-sort"
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">Lower numbers appear first.</p>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="flex items-center gap-2">
              <Star className={`h-4 w-4 ${featured ? "fill-gold text-gold" : "text-muted-foreground"}`} />
              <div>
                <Label htmlFor="product-featured">Featured</Label>
                <p className="text-xs text-muted-foreground">Shown in the highlighted row on the shop home page.</p>
              </div>
            </div>
            <Switch id="product-featured" checked={featured} onCheckedChange={setFeatured} />
          </div>

          {editing && (
            <label className="flex items-start gap-2 rounded-lg border border-border p-3 text-sm">
              <input
                type="checkbox"
                checked={regenerateSlug}
                onChange={(e) => setRegenerateSlug(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-[hsl(var(--primary))]"
              />
              <span>
                Update the URL slug to match the new name
                <span className="mt-0.5 block text-xs text-muted-foreground">
                  Off by default: the current link is <span className="font-mono">/shop/{product?.slug}</span>, and
                  changing it breaks any link already shared on WhatsApp, in emails or on social media.
                </span>
              </span>
            </label>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving || uploading} className="gap-1.5">
            {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {editing ? "Save changes" : "Create product"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
