import type { Metadata } from "next";
import { adminGetAllOrders } from "@/app/actions/admin";
import { OrdersView } from "@/modules/AdminModule";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await adminGetAllOrders();
  return <OrdersView orders={orders} />;
}
