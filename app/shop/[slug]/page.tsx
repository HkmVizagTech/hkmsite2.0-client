import type { Metadata } from "next";
import ProductPageClient from "@/components/shop/ProductPageClient";
import { SITE_URL, SHOP_NAME, ORG_NAME } from "@/lib/seo";

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
    return {
      title: "Product · ISKCON Vizag Shop — Matchless Gifts",
      robots: { index: false, follow: true },
    };
  }
  const description = product.shortDescription || product.description || "";
  return {
    title: `${product.name} — ISKCON Vizag Shop`,
    description: description.slice(0, 160),
    keywords: ["ISKCON Vizag shop", "Hare Krishna Movement shop", product.category || "", "temple shop", "devotional gifts"].filter(Boolean),
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title: `${product.name} — ${SHOP_NAME} · ${ORG_NAME}`,
      description: description.slice(0, 200),
      type: "website",
      locale: "en_IN",
      siteName: `${SHOP_NAME} — ISKCON Vizag Shop`,
      url: `${SITE_URL}/shop/${product.slug}`,
      images: product.images?.length ? [product.images[0]] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: description.slice(0, 200),
    },
    robots: { index: true, follow: true },
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
    { "@type": "ListItem", position: 1, name: "ISKCON Vizag Shop", item: `${SITE_URL}/shop` },
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
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd(product)) }} />
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd(product)) }} />
        </>
      )}
      <ProductPageClient />
    </>
  );
}