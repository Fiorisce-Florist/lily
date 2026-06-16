import ShopModule from "@/modules/ShopModule";
import { Metadata } from "next";
import { getProducts } from "@/app/actions/products";
import type { Bouquet } from "@/modules/ShopModule/data/bouquets";
import { mapProductToBouquet } from "@/lib/product-mapper";

export const metadata: Metadata = {
  title: "Fiorisce",
  description:
    "Discover handcrafted bouquets for every occasion. Filter by occasion, color, and price. Fresh daily arrangements delivered.",
};

export default async function ShopPage() {
  const { products } = await getProducts();
  const bouquets: Bouquet[] = (products || []).map(mapProductToBouquet);

  return <ShopModule bouquets={bouquets} />;
}
