import type { Metadata } from "next";
import { adminGetAllOrders } from "@/app/actions/admin";
import { AdminOrdersTable } from "@/components/admin/admin-orders-table";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage() {
  const orders = await adminGetAllOrders();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
          Orders
        </h1>
        <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400 mt-1">
          {orders.length} order{orders.length !== 1 ? "s" : ""} total
        </p>
      </div>

      <AdminOrdersTable orders={orders} />
    </div>
  );
}
