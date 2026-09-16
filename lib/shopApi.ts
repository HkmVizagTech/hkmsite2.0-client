// Types and fetch helpers for Matchless Gifts (the temple shop).
//
// Everything the storefront knows about money comes from here, and every
// price shown is the one the server sent. The cart in localStorage stores
// only ids and quantities — never prices — so a stale cart from last week
// can't show (or charge) last week's price. /shop/cart/quote is what turns
// a cart into rupees, and the same server code runs again at checkout.

import { donorFetch } from "@/lib/donorAuthClient";

export const SHOP_API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

export interface ProductVariant {
  _id: string;
  label: string;
  price: number;
  mrp?: number;
  stock: number;
  inStock: boolean;
  weightGrams?: number;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description?: string;
  category?: string;
  images: string[];
  hasVariants: boolean;
  price?: number;
  mrp?: number;
  stock: number;
  priceMin: number;
  priceMax: number;
  inStock: boolean;
  featured: boolean;
  freeShipping?: boolean;
  tags: string[];
  weightGrams?: number;
  variants: ProductVariant[];
}

export interface ShopCategory {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount: number;
}

export interface ShopSettings {
  shopEnabled: boolean;
  flatShippingCharge: number;
  freeShippingAbove: number;
  announcement?: string;
  supportMobile?: string;
  deliveryEstimate?: string;
}

export interface QuotedItem {
  productId: string;
  productName: string;
  slug: string;
  image?: string;
  variantId: string | null;
  variantLabel: string | null;
  unitPrice: number;
  mrp?: number;
  quantity: number;
  lineTotal: number;
  freeShipping?: boolean;
}

export interface CartProblem {
  productId: string;
  variantId?: string;
  reason: string;
  available?: number;
  message: string;
}

export interface CartQuote {
  items: QuotedItem[];
  problems: CartProblem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  freeShippingAbove: number;
  shopEnabled: boolean;
}

export interface ShopOrder {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerMobile: string;
  items: QuotedItem[];
  subtotal: number;
  shippingCharge: number;
  total: number;
  shippingAddress: { street?: string; city?: string; state?: string; pincode?: string; country?: string };
  paymentStatus: "pending" | "paid" | "failed" | "refunded";
  fulfilmentStatus: "placed" | "packed" | "shipped" | "delivered" | "cancelled";
  tracking?: { courier?: string; trackingNumber?: string; url?: string };
  statusHistory?: { status: string; note?: string; at: string }[];
  createdAt: string;
  paidAt?: string;
}

async function asJson(res: Response) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.success === false) {
    throw new Error(data.message || "Something went wrong. Please try again.");
  }
  return data;
}

export async function fetchProducts(params: {
  category?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; pagination: { page: number; pages: number; total: number } }> {
  const qs = new URLSearchParams();
  if (params.category && params.category !== "all") qs.set("category", params.category);
  if (params.search) qs.set("search", params.search);
  if (params.sort) qs.set("sort", params.sort);
  if (params.page) qs.set("page", String(params.page));
  if (params.limit) qs.set("limit", String(params.limit));
  const data = await asJson(await fetch(`${SHOP_API}/shop/products?${qs.toString()}`));
  return { products: data.products || [], pagination: data.pagination };
}

export async function fetchProduct(slug: string): Promise<{ product: Product; related: Product[] }> {
  const data = await asJson(await fetch(`${SHOP_API}/shop/products/${slug}`));
  return { product: data.product, related: data.related || [] };
}

export async function fetchCategories(): Promise<ShopCategory[]> {
  const data = await asJson(await fetch(`${SHOP_API}/shop/categories`));
  return data.categories || [];
}

export async function fetchShopSettings(): Promise<ShopSettings> {
  const data = await asJson(await fetch(`${SHOP_API}/shop/settings`));
  return data.settings;
}

export async function quoteCart(
  items: { productId: string; variantId: string | null; quantity: number }[]
): Promise<CartQuote> {
  const res = await fetch(`${SHOP_API}/shop/cart/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ items }),
  });
  return (await asJson(res)) as CartQuote;
}

export async function fetchMyOrders(): Promise<ShopOrder[]> {
  const data = await asJson(await donorFetch(`${SHOP_API}/shop/my-orders`));
  return data.orders || [];
}

export async function fetchMyOrder(orderNumber: string): Promise<ShopOrder> {
  const data = await asJson(await donorFetch(`${SHOP_API}/shop/my-orders/${orderNumber}`));
  return data.order;
}

// Display helpers — kept here so the card, the product page and the cart
// all describe a discount the same way.
export function discountPercent(price?: number, mrp?: number): number | null {
  if (!price || !mrp || mrp <= price) return null;
  return Math.round(((mrp - price) / mrp) * 100);
}

export function formatINR(amount: number): string {
  return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
}

// A variant product shows a range ("₹80 – ₹330"); a simple one shows its
// single price.
export function displayPrice(product: Product): string {
  if (product.hasVariants && product.priceMin !== product.priceMax) {
    return `${formatINR(product.priceMin)} – ${formatINR(product.priceMax)}`;
  }
  return formatINR(product.hasVariants ? product.priceMin : product.price || 0);
}
