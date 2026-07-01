"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Package, MapPin, CreditCard } from "lucide-react";
import { adminUpdateOrderStatus } from "@/app/actions/admin";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const ORDER_STATUSES = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "SHIPPED",
  "COMPLETED",
  "CANCELLED",
] as const;

function formatPrice(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(iso));
}

// Minimal types for the view based on adminGetOrder
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function OrderDetailView({ order }: { order: any }) {
  const router = useRouter();
  const [isUpdating, setIsUpdating] = React.useState(false);

  const handleStatusChange = async (value: string) => {
    setIsUpdating(true);
    const result = await adminUpdateOrderStatus(order.id, value);
    setIsUpdating(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Order status updated.");
      router.refresh();
    }
  };

  const shippingAddress = order.address;
  const user = order.user;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/orders"
            className="text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
          >
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
              Order {order.orderNumber}
            </h1>
            <p className="text-sm font-inter text-neutral-500">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Content (Items & Totals) */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
              <h2 className="font-fraunces font-medium text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-neutral-400" />
                Items ({order.items.length})
              </h2>
            </div>
            <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {order.items.map((item: any) => (
                <div key={item.id} className="p-6 flex gap-4">
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-neutral-900 dark:text-white">
                      {item.productName}
                    </p>
                    {item.variantName && (
                      <p className="text-sm text-neutral-500">Size: {item.variantName}</p>
                    )}
                    <p className="text-sm font-inter text-neutral-500">
                      Qty: {item.quantity} × {formatPrice(Number(item.price))}
                    </p>
                  </div>
                  <div className="text-right font-medium">
                    {formatPrice(Number(item.price) * item.quantity)}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-neutral-50 dark:bg-neutral-950 p-6 space-y-2 text-sm font-inter border-t border-neutral-200 dark:border-neutral-800">
              <div className="flex justify-between">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatPrice(Number(order.subtotal))}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Shipping</span>
                <span>{formatPrice(Number(order.shippingCost))}</span>
              </div>
              <div className="flex justify-between font-medium text-base pt-2">
                <span>Total</span>
                <span>{formatPrice(Number(order.totalAmount))}</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm">
              <h2 className="font-fraunces font-medium mb-2">Customer Notes</h2>
              <p className="text-sm font-inter text-neutral-600 dark:text-neutral-300 whitespace-pre-wrap">
                {order.notes}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar (Status, Customer, Address) */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-fraunces font-medium">Order Status</h2>
            <div className="flex items-center gap-2">
              {isUpdating && <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />}
              <Select value={order.status} onValueChange={handleStatusChange} disabled={isUpdating}>
                <SelectTrigger className="w-full font-inter">
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
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-fraunces font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neutral-400" />
              Shipping Details
            </h2>
            <div className="text-sm font-inter space-y-1">
              {shippingAddress ? (
                <>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {shippingAddress.recipientName}
                  </p>
                  <p className="text-neutral-500">{shippingAddress.phone}</p>
                  <p className="text-neutral-500 mt-2">{shippingAddress.address}</p>
                  <p className="text-neutral-500">
                    {shippingAddress.city}, {shippingAddress.postalCode}
                  </p>
                </>
              ) : (
                <p className="text-neutral-500 italic">No shipping address provided.</p>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-fraunces font-medium flex items-center gap-2">
              <Package className="h-4 w-4 text-neutral-400" />
              Delivery Details
            </h2>
            <div className="text-sm font-inter space-y-3">
              <div>
                <p className="text-neutral-500 mb-1">Method</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {order.deliveryMethod === "GOSEND" ? "GoSend (Self-order)" : "Pick Up"}
                </p>
              </div>
              <div>
                <p className="text-neutral-500 mb-1">Pickup / Delivery Date</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "N/A"}
                </p>
              </div>
              {order.deliveryTime && (
                <div>
                  <p className="text-neutral-500 mb-1">Time</p>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {order.deliveryTime}
                  </p>
                </div>
              )}
              {order.includePaperBag && (
                <div>
                  <p className="text-neutral-500 mb-1">Paper Bag</p>
                  <p className="font-medium text-neutral-900 dark:text-white">Included</p>
                </div>
              )}
              {order.messageCard && (
                <div>
                  <p className="text-neutral-500 mb-1">Message Card</p>
                  <p className="font-medium text-neutral-900 dark:text-white italic">
                    &quot;{order.messageCard}&quot;
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm space-y-4">
            <h2 className="font-fraunces font-medium flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-neutral-400" />
              Payment & Customer
            </h2>
            <div className="text-sm font-inter space-y-3">
              <div>
                <p className="text-neutral-500 mb-1">Customer</p>
                <p className="font-medium text-neutral-900 dark:text-white">
                  {user?.name || "Guest User"}
                </p>
                <p className="text-neutral-500">{user?.email}</p>
              </div>
              {order.payment && (
                <div>
                  <p className="text-neutral-500 mb-1">Payment Method</p>
                  <p className="font-medium text-neutral-900 dark:text-white">
                    {order.payment.paymentMethod}
                  </p>
                  <p className="text-neutral-500 text-xs">Status: {order.payment.status}</p>
                  {order.payment.receiptUrl && (
                    <div className="mt-2">
                      <a 
                        href={order.payment.receiptUrl} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blush-500 hover:text-blush-600 text-sm font-medium underline"
                      >
                        View Transfer Receipt
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
