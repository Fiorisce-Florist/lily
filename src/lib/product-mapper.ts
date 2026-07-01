/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Bouquet } from "@/modules/ShopModule/data/bouquets";

export function mapProductToBouquet(p: any): Bouquet {
  const tags = p.tags?.map((t: any) => t.tag) || [];
  const colors = tags.filter((t: any) => t.type === "COLOR").map((t: any) => t.name);
  const flowers = tags.filter((t: any) => t.type === "FLOWER").map((t: any) => t.name);
  const occasions = tags.filter((t: any) => t.type === "OCCASION").map((t: any) => t.name);
  const generalTags = tags.filter((t: any) => t.type === "GENERAL").map((t: any) => t.name);

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category?.name || "",
    categorySlug: p.category?.slug || "",
    price: Number(p.price) || 0,
    occasion: occasions[0] || "",
    colors,
    flowers,
    tags: generalTags,
    inStock: p.isAvailable,
    soldCount: 0,
    rating: 5.0,
    reviewCount: 0,
    isNew: generalTags.includes("New Arrival"),
    isBestseller: generalTags.includes("Best Seller"),
    image: p.images?.[0]?.imageUrl || "",
    description: p.description || "",
    variants:
      p.variants?.map((v: any) => ({
        id: v.id,
        name: v.variantName,
        price: (Number(p.price) || 0) + (Number(v.additionalPrice) || 0),
        isAvailable: v.isAvailable,
        imageUrl: v.imageUrl ?? undefined,
        stemsQuantity: v.stemsQuantity ?? undefined,
      })) || [],
  };
}
