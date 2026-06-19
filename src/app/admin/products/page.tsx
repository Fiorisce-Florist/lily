import type { Metadata } from "next";
import { adminGetAllProducts } from "@/app/actions/admin";
import { ProductsView } from "@/modules/AdminModule";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage() {
  const products = await adminGetAllProducts();
  return <ProductsView products={products} />;
}
