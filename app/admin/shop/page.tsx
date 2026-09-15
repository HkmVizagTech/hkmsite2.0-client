"use client";

import { useCallback, useEffect, useState } from "react";
import {
  Check,
  Loader2,
  PackagePlus,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Star,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { authFetch } from "@/lib/authClient";
import ProductFormDialog, {
  type ShopCategory,
  type ShopProduct,
} from "@/components/admin/shop/ProductFormDialog";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

const LOW_STOCK_THRESHOLD = 5;

const rupees = (n: number) => `₹${Number(n || 0).toLocaleString("en-IN")}`;

// A variant product has no single price, so the table shows the spread the
// customer will actually see on the storefront rather than an arbitrary one.
const priceLabel = (p: ShopProduct) => {
  if (!p.hasVariants) return rupees(p.price ?? 0);
  const prices = (p.variants || []).map((v) => Number(v.price) || 0);
  if (prices.length === 0) return "—";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max ? rupees(min) : `${rupees(min)} – ${rupees(max)}`;
};

const StockCell = ({ value }: { value: number }) => {
  if (value <= 0) {
    return <Badge variant="destructive">Out of stock</Badge>;
  }
  if (value <= LOW_STOCK_THRESHOLD) {
    return (
      <Badge className="border-transparent bg-amber-100 text-amber-800 hover:bg-amber-100">
        Low · {value}
      </Badge>
    );
  }
  return <span className="text-sm font-medium">{value}</span>;
};

export default function AdminShopProductsPage() {
  const [products, setProducts] = useState<ShopProduct[]>([]);
  const [categories, setCategories] = useState<ShopCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ShopProduct | null>(null);
  const [deleting, setDeleting] = useState<ShopProduct | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  // Inline restock for simple products: the row id currently being edited,
  // plus the draft value. Variant products can't be restocked inline (there's
  // no single number to edit) and open the dialog below instead.
  const [restockingId, setRestockingId] = useState<string | null>(null);
  const [restockValue, setRestockValue] = useState("");
  const [restockBusy, setRestockBusy] = useState(false);
  const [variantRestock, setVariantRestock] = useState<ShopProduct | null>(null);

  const loadCategories = useCallback(async () => {
    try {
      const res = await authFetch(`${API_URL}/shop-admin/categories`);
      const data = await res.json();
      if (res.ok && data.success) setCategories(data.categories || []);
    } catch {
      // Categories are only used to populate filters and the product form's
      // dropdown — a failure here shouldn't blank out the product table.
    }
  }, []);

  const loadProducts = useCallback(async () => {
    setError(null);
    try {
      const params = new URLSearchParams();
      if (search.trim()) params.set("search", search.trim());
      if (categoryFilter !== "all") params.set("category", categoryFilter);
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await authFetch(`${API_URL}/shop-admin/products?${params.toString()}`);
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not load products.");
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err?.message || "Could not load products. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Debounced so typing in the search box doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(loadProducts, 300);
    return () => clearTimeout(t);
  }, [loadProducts]);

  const saveStock = async (product: ShopProduct, stock: number, variantId?: string) => {
    setRestockBusy(true);
    try {
      const res = await authFetch(`${API_URL}/shop-admin/products/${product._id}/stock`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(variantId ? { stock, variantId } : { stock }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not update stock.");
      toast({ title: "Stock updated." });
      setRestockingId(null);
      await loadProducts();
    } catch (err: any) {
      toast({ title: err?.message || "Could not update stock.", variant: "destructive" });
    } finally {
      setRestockBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      const res = await authFetch(`${API_URL}/shop-admin/products/${deleting._id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not delete the product.");
      toast({ title: "Product deleted." });
      setDeleting(null);
      await loadProducts();
    } catch (err: any) {
      toast({ title: err?.message || "Could not delete the product.", variant: "destructive" });
    } finally {
      setDeletingBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-heading text-2xl font-bold text-foreground">Shop</h1>
          <p className="text-sm text-muted-foreground">Products and categories for the temple shop.</p>
        </div>
      </div>

      <Tabs defaultValue="products">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-4 space-y-4">
          <Card>
            <CardContent className="flex flex-wrap items-end gap-3 p-4">
              <div className="relative min-w-[220px] flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name, SKU or tag"
                  className="pl-9"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categories.map((c) => (
                    <SelectItem key={c._id} value={c.slug}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon" aria-label="Refresh" onClick={loadProducts}>
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Button
                className="gap-1.5"
                onClick={() => {
                  setEditing(null);
                  setFormOpen(true);
                }}
              >
                <Plus className="h-4 w-4" /> Add product
              </Button>
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>
          )}

          <Card>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : products.length === 0 ? (
                <p className="py-16 text-center text-sm text-muted-foreground">
                  No products match these filters.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[70px]">Image</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((p) => (
                        <TableRow key={p._id}>
                          <TableCell>
                            {p.images?.[0] ? (
                              /* Plain <img>: R2 URLs would need the bucket host
                                 whitelisted in next.config for next/image. */
                              /* eslint-disable-next-line @next/next/no-img-element */
                              <img
                                src={p.images[0]}
                                alt=""
                                className="h-11 w-11 rounded-md border border-border object-cover"
                              />
                            ) : (
                              <div className="flex h-11 w-11 items-center justify-center rounded-md border border-dashed border-border">
                                <PackagePlus className="h-4 w-4 text-muted-foreground" />
                              </div>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium">{p.name}</span>
                              {p.featured && <Star className="h-3.5 w-3.5 fill-gold text-gold" />}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {p.hasVariants ? `${p.variants?.length || 0} variants` : "Single price"} · /shop/{p.slug}
                            </p>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {categories.find((c) => c.slug === p.category)?.name || p.category || "—"}
                          </TableCell>
                          <TableCell className="text-sm font-medium">{priceLabel(p)}</TableCell>
                          <TableCell>
                            {restockingId === p._id ? (
                              <div className="flex items-center gap-1">
                                <Input
                                  type="number"
                                  min={0}
                                  value={restockValue}
                                  onChange={(e) => setRestockValue(e.target.value)}
                                  className="h-8 w-20"
                                  autoFocus
                                />
                                <Button
                                  size="icon"
                                  className="h-8 w-8"
                                  disabled={restockBusy}
                                  aria-label="Save stock"
                                  onClick={() => saveStock(p, Number(restockValue) || 0)}
                                >
                                  {restockBusy ? (
                                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                  ) : (
                                    <Check className="h-3.5 w-3.5" />
                                  )}
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  aria-label="Cancel"
                                  onClick={() => setRestockingId(null)}
                                >
                                  <X className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                className="flex items-center gap-2 text-left"
                                title="Click to restock"
                                onClick={() => {
                                  if (p.hasVariants) {
                                    setVariantRestock(p);
                                  } else {
                                    setRestockingId(p._id);
                                    setRestockValue(String(p.stock ?? 0));
                                  }
                                }}
                              >
                                <StockCell value={p.totalStock ?? 0} />
                                <RefreshCw className="h-3 w-3 text-muted-foreground" />
                              </button>
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge variant={p.status === "active" ? "default" : "secondary"}>
                              {p.status === "active" ? "Active" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label="Edit product"
                              onClick={() => {
                                setEditing(p);
                                setFormOpen(true);
                              }}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label="Delete product"
                              onClick={() => setDeleting(p)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="mt-4">
          <CategoriesPanel categories={categories} onChanged={loadCategories} />
        </TabsContent>
      </Tabs>

      <ProductFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        product={editing}
        categories={categories}
        onSaved={loadProducts}
      />

      <VariantRestockDialog
        product={variantRestock}
        onOpenChange={(open) => !open && setVariantRestock(null)}
        onSave={saveStock}
        busy={restockBusy}
      />

      <AlertDialog open={Boolean(deleting)} onOpenChange={(open) => !open && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{deleting?.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              This removes the product from the shop permanently. Past orders keep their own copy of the item, so
              order history is not affected. If you only want to hide it, set the status to Draft instead.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deletingBusy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingBusy ? "Deleting..." : "Delete product"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function VariantRestockDialog({
  product,
  onOpenChange,
  onSave,
  busy,
}: {
  product: ShopProduct | null;
  onOpenChange: (open: boolean) => void;
  onSave: (product: ShopProduct, stock: number, variantId?: string) => Promise<void>;
  busy: boolean;
}) {
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!product) return;
    const next: Record<string, string> = {};
    (product.variants || []).forEach((v) => {
      if (v._id) next[v._id] = String(v.stock ?? 0);
    });
    setValues(next);
  }, [product]);

  if (!product) return null;

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Restock {product.name}</DialogTitle>
          <DialogDescription>
            Each variant holds its own stock, so set the new count per variant. Saving replaces the count, it does
            not add to it.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          {(product.variants || []).map((v) => (
            <div key={v._id} className="flex items-center gap-3">
              <span className="flex-1 text-sm font-medium">{v.label}</span>
              <Input
                type="number"
                min={0}
                className="w-24"
                value={values[v._id || ""] ?? ""}
                onChange={(e) => setValues((prev) => ({ ...prev, [v._id || ""]: e.target.value }))}
              />
              <Button
                size="sm"
                disabled={busy}
                onClick={() => onSave(product, Number(values[v._id || ""]) || 0, v._id)}
              >
                Save
              </Button>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function CategoriesPanel({
  categories,
  onChanged,
}: {
  categories: ShopCategory[];
  onChanged: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ShopCategory | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [sortOrder, setSortOrder] = useState("0");
  const [status, setStatus] = useState<"active" | "draft">("active");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<ShopCategory | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const openForm = (category: ShopCategory | null) => {
    setEditing(category);
    setError(null);
    setName(category?.name || "");
    setDescription(category?.description || "");
    setImage(category?.image || "");
    setSortOrder(String(category?.sortOrder ?? 0));
    setStatus(category?.status === "draft" ? "draft" : "active");
    setOpen(true);
  };

  const save = async () => {
    if (!name.trim()) {
      setError("Category name is required.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const body: Record<string, unknown> = {
        name: name.trim(),
        description: description.trim(),
        image: image.trim(),
        sortOrder: Number(sortOrder) || 0,
      };
      if (editing) body.status = status;
      const res = await authFetch(
        editing ? `${API_URL}/shop-admin/categories/${editing._id}` : `${API_URL}/shop-admin/categories`,
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Could not save the category.");
      toast({ title: editing ? "Category updated." : "Category created." });
      setOpen(false);
      onChanged();
    } catch (err: any) {
      setError(err?.message || "Could not save the category.");
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      const res = await authFetch(`${API_URL}/shop-admin/categories/${deleting._id}`, { method: "DELETE" });
      const data = await res.json();
      // The backend refuses with 400 when products still point at this
      // category — surface that message verbatim, it names the blocker.
      if (!res.ok || !data.success) throw new Error(data.message || "Could not delete the category.");
      toast({ title: "Category deleted." });
      setDeleting(null);
      onChanged();
    } catch (err: any) {
      toast({ title: err?.message || "Could not delete the category.", variant: "destructive" });
    } finally {
      setDeletingBusy(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button className="gap-1.5" onClick={() => openForm(null)}>
          <Plus className="h-4 w-4" /> Add category
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {categories.length === 0 ? (
            <p className="py-16 text-center text-sm text-muted-foreground">No categories yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>URL slug</TableHead>
                    <TableHead>Order</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((c) => (
                    <TableRow key={c._id}>
                      <TableCell>
                        <span className="font-medium">{c.name}</span>
                        {c.description && (
                          <p className="text-xs text-muted-foreground">{c.description}</p>
                        )}
                      </TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{c.slug}</TableCell>
                      <TableCell className="text-sm">{c.sortOrder}</TableCell>
                      <TableCell>
                        <Badge variant={c.status === "active" ? "default" : "secondary"}>
                          {c.status === "active" ? "Active" : "Draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="icon" variant="ghost" aria-label="Edit category" onClick={() => openForm(c)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" aria-label="Delete category" onClick={() => setDeleting(c)}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
            <DialogDescription>
              {editing
                ? "Renaming a category keeps its existing URL slug, so links already shared keep working."
                : "The URL slug is generated from the name."}
            </DialogDescription>
          </DialogHeader>

          {error && (
            <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">{error}</div>
          )}

          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="category-name">Name</Label>
              <Input id="category-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Books" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category-description">Description</Label>
              <Textarea
                id="category-description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="category-image">Image URL</Label>
              <Input id="category-image" value={image} onChange={(e) => setImage(e.target.value)} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="category-sort">Sort order</Label>
                <Input
                  id="category-sort"
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                />
              </div>
              {editing && (
                <div className="space-y-1.5">
                  <Label htmlFor="category-status">Status</Label>
                  <Select value={status} onValueChange={(v) => setStatus(v as "active" | "draft")}>
                    <SelectTrigger id="category-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft (hidden)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={saving}>
              Cancel
            </Button>
            <Button onClick={save} disabled={saving} className="gap-1.5">
              {saving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {editing ? "Save changes" : "Create category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={Boolean(deleting)} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &ldquo;{deleting?.name}&rdquo;?</AlertDialogTitle>
            <AlertDialogDescription>
              Categories still used by a product can&apos;t be deleted — move those products to another category
              first.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingBusy}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deletingBusy}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingBusy ? "Deleting..." : "Delete category"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
