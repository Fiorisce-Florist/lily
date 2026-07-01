"use server";

import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/formatters";


// ─── Shared include shape ─────────────────────────────────────────────────────

const productInclude = {
  images: { where: { isPrimary: true }, take: 1 },
  category: { select: { name: true, slug: true } },
  variants: { select: { additionalPrice: true } },
} as const;

// ─── Product card shape returned to the landing page ─────────────────────────

export interface LandingProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  formattedPrice: string;
  image: string;
  category: string;
  categorySlug: string;
}



function toCard(p: {
  id: string;
  name: string;
  slug: string;
  price: { toString(): string };
  images: { imageUrl: string }[];
  category: { name: string; slug: string };
  variants?: { additionalPrice: { toString(): string } }[];
}): LandingProduct {
  let price = Number(p.price.toString());
  const hasVariants = p.variants && p.variants.length > 0;
  
  if (hasVariants) {
    price = price + Math.min(...p.variants!.map((v) => Number(v.additionalPrice.toString())));
  }

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price,
    formattedPrice: (hasVariants ? "From " : "") + formatPrice(price),
    image: p.images[0]?.imageUrl ?? "",
    category: p.category.name,
    categorySlug: p.category.slug,
  };
}

// ─── getFeaturedProducts ──────────────────────────────────────────────────────
// Returns up to `limit` bestseller-tagged products, falling back to newest.

export async function getFeaturedProducts(limit = 8): Promise<LandingProduct[]> {
  try {
    // Try bestseller tag first
    const bestsellers = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        isAvailable: true,
        tags: {
          some: {
            tag: {
              OR: [
                { slug: "best-seller" },
                { slug: "bestseller" },
                { name: { contains: "Best Seller" } },
              ],
            },
          },
        },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: productInclude,
    });

    // If we have enough, return them
    if (bestsellers.length >= 2) {
      return bestsellers.map(toCard);
    }

    // Fallback: newest active products
    const newest = await prisma.product.findMany({
      where: { status: "ACTIVE", isAvailable: true },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: productInclude,
    });

    return newest.map(toCard);
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return [];
  }
}

// ─── getProductsByCategory ────────────────────────────────────────────────────
// Returns up to `limit` active products by category slug.

export async function getProductsByCategory(
  categorySlug: string,
  limit = 4
): Promise<LandingProduct[]> {
  try {
    const products = await prisma.product.findMany({
      where: {
        status: "ACTIVE",
        isAvailable: true,
        category: { slug: categorySlug },
      },
      take: limit,
      orderBy: { createdAt: "desc" },
      include: productInclude,
    });

    return products.map(toCard);
  } catch (error) {
    console.error(`Error fetching products for category "${categorySlug}":`, error);
    return [];
  }
}
