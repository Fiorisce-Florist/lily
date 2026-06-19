"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { adminUpdateOrderStatus } from "@/app/actions/admin";
import { Input } from "@/components/ui/input";
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

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-camel-700 bg-camel-100 dark:text-camel-300 dark:bg-camel-900/30",
  PAID: "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30",
  PROCESSING: "text-violet-700 bg-violet-100 dark:text-violet-300 dark:bg-violet-900/30",
  SHIPPED: "text-indigo-700 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/30",
  COMPLETED: "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30",
  CANCELLED: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30",
};

function formatPrice(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

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

export function AdminOrdersTable({ orders }: { orders: Order[] }) {
  const [search, setSearch] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<string>("ALL");

  const filtered = React.useMemo(() => {
    return orders.filter((o) => {
      const matchSearch =
        !search ||
        o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
        o.customerName.toLowerCase().includes(search.toLowerCase()) ||
        o.customerEmail.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orders, search, statusFilter]);

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <Input
          type="text"
          placeholder="Search by order # or customer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
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

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ShoppingCart className="h-12 w-12 text-neutral-300 mb-4" />
          <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            No orders found
          </h2>
          <p className="text-b5 font-inter text-neutral-500 mt-2">
            {search || statusFilter !== "ALL"
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
              {filtered.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <span className="font-jetbrains font-medium text-neutral-900 dark:text-cornsilk-100">
                      {order.orderNumber}
                    </span>
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
                          STATUS_COLORS[order.paymentStatus] ?? ""
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    ) : (
                      <span className="text-neutral-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-inter text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {formatDate(order.createdAt)}
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
