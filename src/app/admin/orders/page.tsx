import type { Metadata } from "next";
import { adminGetAllOrders } from "@/app/actions/admin";
import { OrdersView } from "@/modules/AdminModule";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : "";
  const status = typeof searchParams.status === "string" ? searchParams.status : "all";

  const data = await adminGetAllOrders(page, 20, search, status);
  return <OrdersView data={data} search={search} page={page} status={status} />;
}
