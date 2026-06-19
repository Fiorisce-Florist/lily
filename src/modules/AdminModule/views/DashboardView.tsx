import Link from "next/link";
import { Package, ShoppingCart, Users, TrendingUp, ArrowUpRight, ArrowRight } from "lucide-react";
import type { adminGetDashboardStats } from "@/app/actions/admin";

type DashboardStats = Awaited<ReturnType<typeof adminGetDashboardStats>>;

function formatPrice(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(v);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(iso));
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "text-camel-700 bg-camel-100 dark:text-camel-300 dark:bg-camel-900/30",
  PAID: "text-blue-700 bg-blue-100 dark:text-blue-300 dark:bg-blue-900/30",
  PROCESSING: "text-violet-700 bg-violet-100 dark:text-violet-300 dark:bg-violet-900/30",
  SHIPPED: "text-indigo-700 bg-indigo-100 dark:text-indigo-300 dark:bg-indigo-900/30",
  COMPLETED: "text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30",
  CANCELLED: "text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/30",
};

export function DashboardView({ stats }: { stats: DashboardStats }) {
  const statCards = [
    {
      label: "Total Revenue",
      value: formatPrice(stats.revenue),
      icon: TrendingUp,
      color: "text-olive-600 bg-olive-100 dark:bg-olive-900/30",
      href: "/admin/orders",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders.toLocaleString(),
      icon: ShoppingCart,
      color: "text-blue-600 bg-blue-100 dark:bg-blue-900/30",
      href: "/admin/orders",
    },
    {
      label: "Products",
      value: `${stats.activeProducts} / ${stats.totalProducts}`,
      sublabel: "active",
      icon: Package,
      color: "text-blush-600 bg-blush-100 dark:bg-blush-900/30",
      href: "/admin/products",
    },
    {
      label: "Customers",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      color: "text-camel-600 bg-camel-100 dark:bg-camel-900/30",
      href: "/admin/users",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
          Dashboard
        </h1>
        <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400 mt-1">
          Welcome back — here&apos;s what&apos;s happening with Fiorisce.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="group flex items-center gap-4 bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div
                className={`h-12 w-12 shrink-0 flex items-center justify-center rounded-xl ${card.color}`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="min-w-0">
                <p className="text-b6 font-inter text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                  {card.label}
                </p>
                <p className="text-h4 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100 truncate">
                  {card.value}
                  {card.sublabel && (
                    <span className="text-b5 font-inter font-normal text-neutral-400 ml-1">
                      {card.sublabel}
                    </span>
                  )}
                </p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-neutral-300 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 ml-auto shrink-0 transition-colors" />
            </Link>
          );
        })}
      </div>

      {/* Recent orders */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
          <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            Recent Orders
          </h2>
          <Link
            href="/admin/orders"
            className="flex items-center gap-1 text-b5 font-inter text-blush-600 hover:text-blush-700 dark:text-blush-400 transition-colors"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                {["Order", "Customer", "Items", "Amount", "Date", "Status"].map((h) => (
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
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-b5 font-inter text-neutral-400"
                  >
                    No orders yet.
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link
                        href={`/admin/orders`}
                        className="font-jetbrains font-medium text-blush-600 dark:text-blush-400 hover:underline"
                      >
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4 font-inter text-neutral-700 dark:text-neutral-300 max-w-[150px] truncate">
                      {order.customerName}
                    </td>
                    <td className="px-6 py-4 font-inter text-neutral-600 dark:text-neutral-400">
                      {order.itemCount}
                    </td>
                    <td className="px-6 py-4 font-jetbrains font-medium text-neutral-900 dark:text-cornsilk-100">
                      {new Intl.NumberFormat("id-ID", {
                        style: "currency",
                        currency: "IDR",
                        maximumFractionDigits: 0,
                      }).format(order.totalAmount)}
                    </td>
                    <td className="px-6 py-4 font-inter text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-inter font-medium ${
                          STATUS_COLORS[order.status] ?? "text-neutral-600 bg-neutral-100"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/admin/products/new"
          className="flex items-center gap-4 p-5 bg-blush-600 hover:bg-blush-700 rounded-2xl text-white shadow-sm transition-colors group"
        >
          <Package className="h-6 w-6 shrink-0" />
          <div>
            <p className="font-inter font-semibold">Add New Product</p>
            <p className="text-b5 font-inter text-blush-100">Create a new bouquet listing</p>
          </div>
          <ArrowRight className="h-5 w-5 ml-auto group-hover:translate-x-1 transition-transform" />
        </Link>
        <Link
          href="/admin/orders"
          className="flex items-center gap-4 p-5 bg-white dark:bg-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-700 rounded-2xl border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white shadow-sm transition-colors group"
        >
          <ShoppingCart className="h-6 w-6 shrink-0 text-neutral-500 dark:text-neutral-400" />
          <div>
            <p className="font-inter font-semibold">Manage Orders</p>
            <p className="text-b5 font-inter text-neutral-500 dark:text-neutral-400">
              Update order statuses
            </p>
          </div>
          <ArrowRight className="h-5 w-5 ml-auto text-neutral-400 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
