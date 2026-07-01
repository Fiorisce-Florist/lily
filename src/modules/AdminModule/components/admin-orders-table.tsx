"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminUpdateOrderStatus } from "@/app/actions/admin";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
] as const;





interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  customerName: string;
  customerEmail: string;
  paymentStatus: string | null;
  paymentMethod: string | null;
  itemCount: number;
}

function StatusUpdater({ orderId, currentStatus }: { orderId: string; currentStatus: string }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleValueChange = async (value: string) => {
    setIsUpdating(true);
    const result = await adminUpdateOrderStatus(orderId, value);
    setIsUpdating(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Order status updated.");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center gap-2">
      {isUpdating && <Loader2 className="h-3 w-3 animate-spin text-neutral-400 shrink-0" />}
      <Select value={currentStatus} onValueChange={handleValueChange} disabled={isUpdating}>
        <SelectTrigger className="h-8 text-xs font-inter w-32.5">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          {ORDER_STATUSES.map((s) => (
            <SelectItem key={s} value={s}>
              {s}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

import { AdminSearch } from "@/modules/AdminModule/components/admin-search";
import { useSearchParams, usePathname } from "next/navigation";
import { formatPrice, formatShortDate, getStatusColor } from "@/lib/formatters";


export function AdminOrdersTable({
  orders,
  search = "",
  status = "all",
}: {
  orders: Order[];
  search?: string;
  status?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const handleStatusFilterChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "ALL") {
      params.set("status", value);
    } else {
      params.delete("status");
    }
    params.set("page", "1"); // Reset pagination
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <div className="flex-1">
          <AdminSearch placeholder="Search by order # or customer…" initialValue={search} />
        </div>
        <Select value={status.toUpperCase()} onValueChange={handleStatusFilterChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Statuses</SelectItem>
            {ORDER_STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCart className="h-12 w-12 text-neutral-300 mb-4" />
          <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            No orders found
          </h2>
          <p className="text-b5 font-inter text-neutral-500 mt-2">
            {search || (status && status !== "ALL" && status !== "all")
              ? "Try adjusting your search or filter."
              : "No orders have been placed yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                {["Order", "Customer", "Items", "Amount", "Payment", "Date", "Status"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-b6 font-inter font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {orders.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-jetbrains font-medium text-blue-600 hover:underline dark:text-blue-400"
                    >
                      {order.orderNumber}
                    </Link>
                  </td>
                  <td className="px-6 py-4 max-w-40">
                    <p className="font-inter font-medium text-neutral-800 dark:text-neutral-200 truncate">
                      {order.customerName}
                    </p>
                    <p className="text-b6 font-inter text-neutral-400 truncate">
                      {order.customerEmail}
                    </p>
                  </td>
                  <td className="px-6 py-4 font-inter text-neutral-600 dark:text-neutral-400">
                    {order.itemCount}
                  </td>
                  <td className="px-6 py-4 font-jetbrains font-medium text-neutral-900 dark:text-cornsilk-100 whitespace-nowrap">
                    {formatPrice(order.totalAmount)}
                  </td>
                  <td className="px-6 py-4">
                    {order.paymentStatus ? (
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-inter font-medium ${
                          getStatusColor(order.paymentStatus)
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-inter text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {formatShortDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <StatusUpdater orderId={order.id} currentStatus={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
