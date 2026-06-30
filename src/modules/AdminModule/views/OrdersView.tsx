import { AdminOrdersTable } from "@/modules/AdminModule/components/admin-orders-table";
import type { adminGetAllOrders } from "@/app/actions/admin";

type OrdersList = Awaited<ReturnType<typeof adminGetAllOrders>>;

import { AdminPagination } from "@/modules/AdminModule/components/admin-pagination";

export function OrdersView({
  data,
  search,
  page,
  status,
}: {
  data: OrdersList;
  search: string;
  page: number;
  status: string;
}) {
  const { orders, totalCount, totalPages } = data;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
          Orders
        </h1>
        <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400 mt-1">
          {totalCount} order{totalCount !== 1 ? "s" : ""} total
        </p>
      </div>

      {/* We need to pass search, page, status into AdminOrdersTable or let it handle its own client state or we can just keep it as is if we update it */}
      <AdminOrdersTable orders={orders} search={search} status={status} />

      {totalPages > 1 && <AdminPagination currentPage={page} totalPages={totalPages} />}
    </div>
  );
}
