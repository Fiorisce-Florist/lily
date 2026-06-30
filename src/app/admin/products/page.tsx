import type { Metadata } from "next";
import { adminGetAllProducts } from "@/app/actions/admin";
import { ProductsView } from "@/modules/AdminModule";

export const metadata: Metadata = { title: "Products" };

export default async function AdminProductsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : "";

  const data = await adminGetAllProducts(page, 20, search);
  return <ProductsView data={data} search={search} page={page} />;
}
