"use server";

import { prisma } from "@/lib/prisma";
import { Prisma, TagType } from "@prisma/client";

export interface GetProductsParams {
  categorySlug?: string;
  tagSlugs?: string[];
  search?: string;
  sortBy?: "price-asc" | "price-desc" | "newest";
  inStockOnly?: boolean;
}

import { unstable_cache } from "next/cache";

const getProductsCached = unstable_cache(
  async (params?: GetProductsParams) => {
    try {
      const where: Prisma.ProductWhereInput = {
        status: "ACTIVE",
      };

      if (params?.inStockOnly) {
        where.isAvailable = true;
      }

      if (params?.categorySlug) {
        where.category = {
          slug: params.categorySlug,
        };
      }

      if (params?.tagSlugs && params.tagSlugs.length > 0) {
        where.AND = params.tagSlugs.map((slug) => ({
          tags: {
            some: {
              tag: { slug },
            },
          },
        }));
      }

      if (params?.search) {
        where.OR = [
          { name: { contains: params.search } },
          { description: { contains: params.search } },
        ];
      }

      let orderBy: Prisma.ProductOrderByWithRelationInput = {
        createdAt: "desc", // Default to newest
      };

      if (params?.sortBy === "price-asc") {
        orderBy = { price: "asc" };
      } else if (params?.sortBy === "price-desc") {
        orderBy = { price: "desc" };
      }

      const products = await prisma.product.findMany({
        where,
        orderBy,
        include: {
          category: {
            select: { name: true, slug: true },
          },
          images: {
            where: { isPrimary: true },
            take: 1,
          },
          variants: true,
          tags: {
            include: {
              tag: { select: { name: true, slug: true, type: true } },
            },
          },
        },
      });

      return { products, error: null };
    } catch (error) {
      console.error("Error fetching products:", error);
      return { products: [], error: "Failed to fetch products." };
    }
  },
  ["products-list"],
  { tags: ["products"] }
);

export async function getProducts(params?: GetProductsParams) {
  return getProductsCached(params);
}

const getProductBySlugCached = unstable_cache(
  async (slug: string) => {
    try {
      const product = await prisma.product.findUnique({
        where: { slug, status: "ACTIVE" },
        include: {
          category: true,
          images: {
            orderBy: { isPrimary: "desc" },
          },
          variants: true,
          tags: {
            include: {
              tag: true,
            },
          },
        },
      });

      if (!product) {
        return { product: null, error: "Product not found." };
      }

      return { product, error: null };
    } catch (error) {
      console.error(`Error fetching product by slug (${slug}):`, error);
      return { product: null, error: "Failed to fetch product details." };
    }
  },
  ["product-by-slug"],
  { tags: ["products"] }
);

export async function getProductBySlug(slug: string) {
  return getProductBySlugCached(slug);
}

const getCategoriesCached = unstable_cache(
  async () => {
    try {
      const categories = await prisma.category.findMany({
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { products: { where: { status: "ACTIVE" } } },
          },
        },
      });
      return { categories, error: null };
    } catch (error) {
      console.error("Error fetching categories:", error);
      return { categories: [], error: "Failed to fetch categories." };
    }
  },
  ["categories-list"],
  { tags: ["categories"] }
);

export async function getCategories() {
  return getCategoriesCached();
}

const getTagsCached = unstable_cache(
  async (type?: TagType) => {
    try {
      const tags = await prisma.tag.findMany({
        where: type ? { type } : undefined,
        orderBy: { name: "asc" },
        include: {
          _count: {
            select: { products: true },
          },
        },
      });
      return { tags, error: null };
    } catch (error) {
      console.error("Error fetching tags:", error);
      return { tags: [], error: "Failed to fetch tags." };
    }
  },
  ["tags-list"],
  { tags: ["tags"] }
);

export async function getTags(type?: TagType) {
  return getTagsCached(type);
}
