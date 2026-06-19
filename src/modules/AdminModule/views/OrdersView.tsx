import { AdminOrdersTable } from "@/modules/AdminModule/components/admin-orders-table";
import type { adminGetAllOrders } from "@/app/actions/admin";

type OrdersList = Awaited<ReturnType<typeof adminGetAllOrders>>;

export function OrdersView({ orders }: { orders: OrdersList }) {
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
