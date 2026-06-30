import Image from "next/image";
import Link from "next/link";
import { Package } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { OrderData } from "@/app/actions/orders";

type OrderStatus = string;

interface OrderCardProps {
  order: OrderData;
}

export function OrderCard({ order }: OrderCardProps) {
  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Format date
  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(isoString));
  };

  // Status badge styling logic
  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case "PENDING":
      case "PROCESSING":
        return (
          <Badge className="text-xs bg-camel-100 text-camel-800 dark:bg-camel-900/40 dark:text-camel-400 hover:bg-camel-200 border-camel-200 dark:border-camel-800/50">
            {status}
          </Badge>
        );
      case "PAID":
      case "SHIPPED":
        return (
          <Badge className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 hover:bg-blue-200 border-blue-200 dark:border-blue-800/50">
            {status}
          </Badge>
        );
      case "COMPLETED":
        return (
          <Badge variant="success" className="text-xs">
            {status}
          </Badge>
        );
      case "CANCELLED":
        return (
          <Badge className="text-xs bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 hover:bg-red-200 border-red-200 dark:border-red-800/50">
            {status}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-xs">
            {status}
          </Badge>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-neutral-900 border border-cornsilk-200 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="bg-cornsilk-50/50 dark:bg-neutral-900/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-cornsilk-200 dark:border-neutral-800">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-h6 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
              Order {order.orderNumber}
            </h3>
            {getStatusBadge(order.status)}
          </div>
          <p className="text-b5 font-inter text-neutral-500 dark:text-neutral-400">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-b6 font-inter text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
            Total Amount
          </p>
          <p className="text-b4 font-jetbrains font-semibold text-neutral-900 dark:text-cornsilk-100">
            {formatCurrency(order.totalAmount)}
          </p>
        </div>
      </div>

      {/* Body: Item Preview */}
      <div className="px-6 py-5">
        <ul className="space-y-4">
          {order.items.slice(0, 2).map((item) => (
            <li key={item.id} className="flex items-center gap-4">
              <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-cornsilk-100 dark:bg-neutral-800 shrink-0">
                {item.image ? (
                  <Image src={item.image} alt={item.productName} fill className="object-cover" />
                ) : (
                  <div className="flex items-center justify-center h-full w-full">
                    <Package className="h-6 w-6 text-neutral-400" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h4 className="text-b4 font-inter font-medium text-neutral-900 dark:text-cornsilk-100 line-clamp-1">
                  {item.productName}
                </h4>
                <p className="text-b5 font-inter text-neutral-500 dark:text-neutral-400 mt-0.5">
                  Qty: {item.quantity} • {formatCurrency(item.unitPrice)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        {order.items.length > 2 && (
          <p className="text-b5 font-inter text-neutral-500 dark:text-neutral-400 mt-4 italic">
            + {order.items.length - 2} more item{order.items.length - 2 !== 1 && "s"}
          </p>
        )}
      </div>

      {/* Footer / Actions */}
      <div className="px-6 py-4 bg-cornsilk-50/30 dark:bg-neutral-900/30 border-t border-cornsilk-100 dark:border-neutral-800 flex items-center justify-between sm:justify-end gap-3">
        <Button asChild variant="primary" size="sm" className="w-full sm:w-auto font-inter">
          <Link href={`/orders/${order.orderNumber}`} className="w-full sm:w-auto">
            Track Order
          </Link>
        </Button>
      </div>
    </div>
  );
}
