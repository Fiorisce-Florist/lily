"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ChevronLeft,
  Package,
  CheckCircle2,
  Clock,
  Truck,
  MapPin,
  AlertCircle,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { OrderData } from "@/app/actions/orders";
import { uploadOrderReceipt } from "@/app/actions/orders";
import { QRCodeCanvas } from "qrcode.react";
import { CldUploadWidget } from "next-cloudinary";
import { toast } from "sonner";
import { formatLongDate, formatPrice, getStatusColor } from "@/lib/formatters";


interface OrderDetailModuleProps {
  order: OrderData | null;
  orderNumber: string;
  error: string | null;
  qrisString?: string;
}

export function OrderDetailModule({
  order,
  orderNumber,
  error,
  qrisString,
}: OrderDetailModuleProps) {
  const [isMounted, setIsMounted] = React.useState(false);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMounted(true);
  }, []);

  const handleDownloadQR = () => {
    const canvas = document.getElementById("qris-canvas") as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = `qris-${orderNumber}.png`;
      a.click();
    }
  };

  if (error || !order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        {error ? (
          <AlertCircle className="h-12 w-12 text-blush-400 mb-4" />
        ) : (
          <Package className="h-12 w-12 text-neutral-300 mb-4" />
        )}
        <h2 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          {error ? "Something went wrong" : "Order Not Found"}
        </h2>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2 mb-6 max-w-sm">
          {error ?? `We couldn't find order ${orderNumber}.`}
        </p>
        <Button variant="primary" asChild>
          <Link href="/orders">Back to Orders</Link>
        </Button>
      </div>
    );
  }

  


  
  // Timeline steps based on status
  const steps = [
    { label: "Order Placed", active: true, icon: CheckCircle2 },
    {
      label: "Payment Confirmed",
      active: ["PAID", "PROCESSING", "SHIPPED", "COMPLETED"].includes(order.status),
      icon: CheckCircle2,
    },
    {
      label: "Processing",
      active: ["PROCESSING", "SHIPPED", "COMPLETED"].includes(order.status),
      icon: Clock,
    },
    { label: "Shipped", active: ["SHIPPED", "COMPLETED"].includes(order.status), icon: Truck },
    { label: "Delivered", active: order.status === "COMPLETED", icon: MapPin },
  ];

  const activeSteps = steps.filter((s) => s.active).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/orders"
          className="inline-flex group items-center gap-2 text-b4 font-inter text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-cornsilk-100 mb-6 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transform transition-all" />
          Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
                Order {order.orderNumber}
              </h1>
              <Badge className={`px-3 py-1 text-sm border ${getStatusColor(order.status)}`}>
                {order.status}
              </Badge>
            </div>
            <p className="text-b4 font-inter text-neutral-600 dark:text-neutral-400">
              Placed on {formatLongDate(order.createdAt)}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Payment pending banner */}
          {order.status === "PENDING" && (
            <section className="bg-camel-50 dark:bg-camel-900/20 border border-camel-200 dark:border-camel-800/50 rounded-3xl p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 flex-1">
                  <CreditCard className="h-5 w-5 text-camel-600 dark:text-camel-400 shrink-0" />
                  <div>
                    <p className="text-b4 font-inter font-semibold text-camel-800 dark:text-camel-300">
                      Payment pending
                    </p>
                    <p className="text-b5 font-inter text-camel-700 dark:text-camel-400 mt-0.5">
                      Complete your payment to confirm this order.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Tracking Timeline */}
          {order.status !== "CANCELLED" && order.status !== "PENDING" && (
            <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
              <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
                Tracking Status
              </h2>
              <div className="relative flex justify-between items-start mt-8 mb-4">
                {/* Connecting line background */}
                <div className="absolute top-4 left-0 w-full h-1 bg-cornsilk-100 dark:bg-neutral-800 rounded-full -z-10" />
                {/* Active portion */}
                <div
                  className="absolute top-4 left-0 h-1 bg-blush-400 dark:bg-blush-600 rounded-full -z-10 transition-all"
                  style={{ width: `${(activeSteps - 1) * 25}%` }}
                />

                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={idx}
                      className="flex flex-col items-center gap-3 bg-white dark:bg-neutral-900 px-2 text-center w-20"
                    >
                      <div
                        className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          step.active
                            ? "bg-blush-100 text-blush-600 dark:bg-blush-900/50 dark:text-blush-400 border-2 border-blush-300 dark:border-blush-700"
                            : "bg-cornsilk-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500"
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <span
                        className={`text-xs font-inter font-medium leading-tight ${
                          step.active
                            ? "text-neutral-900 dark:text-cornsilk-100"
                            : "text-neutral-400 dark:text-neutral-500"
                        }`}
                      >
                        {step.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Items */}
          <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
            <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
              Items Ordered
            </h2>
            <ul className="space-y-6">
              {order.items.map((item) => (
                <li
                  key={item.id}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-cornsilk-100 dark:bg-neutral-800 shrink-0">
                      {item.image ? (
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full w-full">
                          <Package className="h-8 w-8 text-neutral-400" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="text-b4 font-inter font-medium text-neutral-900 dark:text-cornsilk-100">
                        {item.productName}
                      </h4>
                      <p className="text-b5 font-inter text-neutral-500 dark:text-neutral-400 mt-1">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                  </div>
                  <div className="text-right sm:ml-auto w-full sm:w-auto">
                    <p className="text-b4 font-jetbrains font-semibold text-neutral-900 dark:text-cornsilk-100">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                    <p className="text-b6 font-inter text-neutral-400 dark:text-neutral-500 mt-0.5">
                      {formatPrice(item.unitPrice)} each
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
          {/* Payment pending CTA — sidebar */}
          {order.status === "PENDING" && order.payment?.paymentMethod === "QRIS" && (
            <div className="rounded-2xl bg-camel-50 dark:bg-camel-900/20 border border-camel-200 dark:border-camel-800/50 p-4 text-center space-y-4">
              <p className="text-b5 font-inter text-camel-800 dark:text-camel-300">
                Payment is pending for this order. Please scan the QRIS below to pay.
              </p>

              {qrisString ? (
                <div className="space-y-4">
                  <div className="flex justify-center bg-white p-4 rounded-xl mx-auto w-fit shadow-sm border border-neutral-200">
                    <QRCodeCanvas id="qris-canvas" value={qrisString} size={200} />
                  </div>
                  <Button variant="outline" className="w-full" onClick={handleDownloadQR}>
                    Download QR
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-red-500">
                  QRIS string is unavailable. Please contact support.
                </p>
              )}

              {!order.payment?.receiptUrl ? (
                <div className="space-y-2 pt-2 border-t border-camel-200 dark:border-camel-800/50">
                  <p className="text-b6 font-inter text-camel-800 dark:text-camel-300">
                    Upload your transfer receipt once you have paid.
                  </p>
                  {isMounted ? (
                    <CldUploadWidget
                      signatureEndpoint="/api/cloudinary/sign"
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      onSuccess={async (result: any) => {
                        if (result?.info?.secure_url) {
                          try {
                            const res = await uploadOrderReceipt(order.id, result.info.secure_url);
                            if (res.error) throw new Error(res.error);
                            toast.success("Receipt uploaded successfully!");
                          } catch {
                            toast.error("Failed to save receipt. Please try again.");
                          }
                        }
                      }}
                      options={{
                        multiple: false,
                        resourceType: "image",
                      }}
                    >
                      {({ open }) => (
                        <Button variant="primary" className="w-full" onClick={() => open()}>
                          Upload Receipt
                        </Button>
                      )}
                    </CldUploadWidget>
                  ) : (
                    <Button variant="primary" className="w-full" disabled>
                      Upload Receipt
                    </Button>
                  )}
                </div>
              ) : (
                <div className="bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-xl text-sm border border-green-200 dark:border-green-800/50 flex flex-col items-center">
                  <CheckCircle2 className="w-6 h-6 mb-2" />
                  <span className="font-medium">Receipt uploaded!</span>
                  <span className="text-xs mt-1 opacity-80">Awaiting admin verification.</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Order Summary */}
          <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
            <h2 className="text-h6 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-b5 font-inter text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span className="font-jetbrains font-medium text-neutral-800 dark:text-cornsilk-100">
                  {formatPrice(order.subtotal)}
                </span>
              </div>
              {order.payment && (
                <div className="flex justify-between items-center text-b5 font-inter text-neutral-600 dark:text-neutral-400">
                  <span>Payment</span>
                  <Badge
                    className={`text-xs ${
                      order.payment.status === "PAID"
                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-camel-100 text-camel-700 dark:bg-camel-900/30 dark:text-camel-400"
                    }`}
                  >
                    {order.payment.status}
                  </Badge>
                </div>
              )}
              <Separator className="my-4 border-cornsilk-200 dark:border-neutral-700" />
              <div className="flex justify-between items-center">
                <span className="text-b4 font-inter font-semibold text-neutral-900 dark:text-cornsilk-100">
                  Total
                </span>
                <span className="text-b4 font-jetbrains font-bold text-neutral-900 dark:text-cornsilk-100">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </section>

          {/* Delivery & Customization */}
          <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-cornsilk-200 dark:border-neutral-800 shadow-sm mt-6">
            <h2 className="text-h6 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-4">
              Delivery Details
            </h2>
            <div className="space-y-3 text-b5 font-inter text-neutral-600 dark:text-neutral-400">
              <div className="flex justify-between">
                <span>Method</span>
                <span className="font-medium text-neutral-900 dark:text-cornsilk-100">
                  {order.deliveryMethod === "GOSEND" ? "GoSend (Self-order)" : "Pick Up"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Date</span>
                <span className="font-medium text-neutral-900 dark:text-cornsilk-100">
                  {order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : "N/A"}
                </span>
              </div>
              {order.deliveryTime && (
                <div className="flex justify-between">
                  <span>Time</span>
                  <span className="font-medium text-neutral-900 dark:text-cornsilk-100">
                    {order.deliveryTime}
                  </span>
                </div>
              )}
              {order.includePaperBag && (
                <div className="flex justify-between">
                  <span>Paper Bag</span>
                  <span className="font-medium text-neutral-900 dark:text-cornsilk-100">
                    Included
                  </span>
                </div>
              )}
            </div>

            {order.messageCard && (
              <div className="mt-4 pt-4 border-t border-cornsilk-200 dark:border-neutral-800">
                <span className="block text-b6 text-neutral-500 mb-1">Message Card</span>
                <p className="text-b5 text-neutral-900 dark:text-cornsilk-100 italic">
                  &quot;{order.messageCard}&quot;
                </p>
              </div>
            )}
          </section>

          {/* Shipping Address */}
          {order.address && (
            <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
              <h2 className="text-h6 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-4">
                Shipping Address
              </h2>
              <address className="not-italic text-b5 font-inter text-neutral-600 dark:text-neutral-400 leading-relaxed space-y-1">
                <p className="font-medium text-neutral-900 dark:text-cornsilk-100">
                  {order.address.recipientName}
                </p>
                <p>{order.address.address}</p>
                <p>
                  {order.address.city}, {order.address.postalCode}
                </p>
                <p className="text-b6 mt-2">{order.address.phone}</p>
              </address>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
