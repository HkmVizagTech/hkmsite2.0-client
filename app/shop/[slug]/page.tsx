import type { Metadata } from "next";
import ProductPageClient from "@/components/shop/ProductPageClient";
import JsonLd from "@/components/seo/JsonLd";
import { SITE_URL, SHOP_NAME, ORG_NAME, pageSeo, clampDescription } from "@/lib/seo";

const SHOP_API = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "") || "http://localhost:8080";

interface Product {
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
  variants: { _id: string; label: string; price: number; stock: number; inStock: boolean }[];
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${SHOP_API}/shop/products/${encodeURIComponent(slug)}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return (data.product as Product) || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) {
    return { title: `Product — ${SHOP_NAME}`, robots: { index: false, follow: true } };
  }
  const description = clampDescription(product.shortDescription || product.description) ||
    `${product.name} from ${SHOP_NAME}, the store of ${ORG_NAME}.`;
  return {
    ...pageSeo({
      title: product.name,
      description,
      path: `/shop/${product.slug}`,
      image: product.images?.[0],
      keywords: [product.name, product.category || "", SHOP_NAME, "ISKCON Gambheeram Visakhapatnam shop", "devotional gifts"].filter(Boolean),
    }),
  };
}

function productJsonLd(product: Product) {
  const price = product.hasVariants ? product.priceMin : product.price;
  const availability = product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock";
  const offers = product.hasVariants
    ? (product.variants || [])
        .filter((v) => v.inStock)
        .map((v) => ({
          "@type": "Offer",
          name: v.label,
          price: v.price,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          itemCondition: "https://schema.org/NewCondition",
        }))
    : [
        {
          "@type": "Offer",
          price,
          priceCurrency: "INR",
          availability,
          itemCondition: "https://schema.org/NewCondition",
        },
      ];
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${SITE_URL}/shop/${product.slug}#product`,
    name: product.name,
    description: product.shortDescription || product.description,
    image: product.images || [],
    category: product.category || undefined,
    brand: { "@type": "Brand", name: SHOP_NAME },
    offers,
    isRelatedTo: { "@id": `${SITE_URL}/shop#store` },
  };
}

const breadcrumbJsonLd = (product: Product) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    { "@type": "ListItem", position: 1, name: SHOP_NAME, item: `${SITE_URL}/shop` },
    ...(product.category
      ? [
          {
            "@type": "ListItem",
            position: 2,
            name: product.category.replace(/-/g, " "),
            item: `${SITE_URL}/shop?category=${encodeURIComponent(product.category)}`,
          },
        ]
      : []),
    { "@type": "ListItem", position: product.category ? 3 : 2, name: product.name, item: `${SITE_URL}/shop/${product.slug}` },
  ],
});

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return (
    <>
      {product && (
        <>
          <JsonLd data={breadcrumbJsonLd(product)} />
          <JsonLd data={productJsonLd(product)} />
        </>
      )}
      <ProductPageClient
        seoPreview={
          product
            ? { name: product.name, description: clampDescription(product.shortDescription || product.description, 220) }
            : undefined
        }
      />
    </>
  );
}