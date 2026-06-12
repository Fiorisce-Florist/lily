"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, Package, CheckCircle2, Clock, Truck, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MOCK_ORDERS } from "@/modules/OrderModule/data/mock-orders";

interface OrderDetailModuleProps {
  orderNumber: string;
}

export function OrderDetailModule({ orderNumber }: OrderDetailModuleProps) {
  // If we simulate a newly created order from Checkout
  const isNewOrder = orderNumber === "ORD-89234";
  
  // Find order or create a mock new one
  const order = isNewOrder 
    ? {
        id: "ord_new",
        orderNumber: "ORD-89234",
        subtotal: 1550000,
        shippingCost: 0,
        totalAmount: 1550000,
        status: "PAID" as const,
        createdAt: new Date().toISOString(),
        items: [
          {
            id: "item_new_1",
            productId: "p_1",
            productName: "Blush Reverie",
            quantity: 1,
            unitPrice: 850000,
            image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=600&q=80",
          },
          {
            id: "item_new_2",
            productId: "p_5",
            productName: "Lily and Dew",
            quantity: 1,
            unitPrice: 700000,
            image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=80",
          }
        ]
      }
    : MOCK_ORDERS.find((o) => o.orderNumber === orderNumber);

  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <Package className="h-12 w-12 text-neutral-300 mb-4" />
        <h2 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">Order Not Found</h2>
        <p className="text-neutral-500 mt-2 mb-6">We couldn't find order {orderNumber}.</p>
        <Link href="/orders">
          <Button variant="primary">Back to Orders</Button>
        </Link>
      </div>
    );
  }

  const formatPrice = (v: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(v);
  };

  const formatDate = (isoString: string) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
    }).format(new Date(isoString));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
      case "PROCESSING":
        return "bg-camel-100 text-camel-800 dark:bg-camel-900/40 dark:text-camel-400 border-camel-200 dark:border-camel-800/50";
      case "PAID":
      case "SHIPPED":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-400 border-blue-200 dark:border-blue-800/50";
      case "COMPLETED":
        return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-200 dark:border-green-800/50";
      case "CANCELLED":
        return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 border-red-200 dark:border-red-800/50";
      default:
        return "";
    }
  };

  // Timeline mock steps based on status
  const steps = [
    { label: "Order Placed", active: true, icon: CheckCircle2 },
    { label: "Payment Confirmed", active: ["PAID", "PROCESSING", "SHIPPED", "COMPLETED"].includes(order.status), icon: CheckCircle2 },
    { label: "Processing", active: ["PROCESSING", "SHIPPED", "COMPLETED"].includes(order.status), icon: Clock },
    { label: "Shipped", active: ["SHIPPED", "COMPLETED"].includes(order.status), icon: Truck },
    { label: "Delivered", active: order.status === "COMPLETED", icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/orders" className="inline-flex items-center gap-2 text-b4 font-inter text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-cornsilk-100 mb-6 transition-colors">
          <ChevronLeft className="h-4 w-4" />
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
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Invoice
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-8">
          {/* Tracking Timeline */}
          {order.status !== "CANCELLED" && (
            <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
              <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
                Tracking Status
              </h2>
              <div className="relative flex justify-between items-start mt-8 mb-4">
                {/* Connecting line */}
                <div className="absolute top-4 left-0 w-full h-1 bg-cornsilk-100 dark:bg-neutral-800 rounded-full -z-10" />
                <div className="absolute top-4 left-0 h-1 bg-blush-400 dark:bg-blush-600 rounded-full -z-10 transition-all" style={{ width: `${(steps.filter(s => s.active).length - 1) * 25}%` }} />
                
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  return (
                    <div key={idx} className="flex flex-col items-center gap-3 bg-white dark:bg-neutral-900 px-2 text-center w-20">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center ${step.active ? 'bg-blush-100 text-blush-600 dark:bg-blush-900/50 dark:text-blush-400 border-2 border-blush-300 dark:border-blush-700' : 'bg-cornsilk-100 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-500'}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <span className={`text-xs font-inter font-medium leading-tight ${step.active ? 'text-neutral-900 dark:text-cornsilk-100' : 'text-neutral-400 dark:text-neutral-500'}`}>
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
                <li key={item.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Order Summary */}
          <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
            <h2 className="text-h6 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-b5 font-inter text-neutral-600 dark:text-neutral-400">
                <span>Subtotal</span>
                <span className="font-jetbrains font-medium text-neutral-800 dark:text-cornsilk-100">{formatPrice(order.subtotal)}</span>
              </div>
              <div className="flex justify-between items-center text-b5 font-inter text-neutral-600 dark:text-neutral-400">
                <span>Shipping</span>
                <span className="font-jetbrains font-medium text-neutral-800 dark:text-cornsilk-100">{order.shippingCost === 0 ? "Free" : formatPrice(order.shippingCost)}</span>
              </div>
              <Separator className="my-4 border-cornsilk-200 dark:border-neutral-700" />
              <div className="flex justify-between items-center">
                <span className="text-b4 font-inter font-semibold text-neutral-900 dark:text-cornsilk-100">Total</span>
                <span className="text-b4 font-jetbrains font-bold text-neutral-900 dark:text-cornsilk-100">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </section>

          {/* Customer Details */}
          <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
            <h2 className="text-h6 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
              Customer Details
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-b5 font-inter font-medium text-neutral-900 dark:text-cornsilk-100 mb-2">Shipping Address</h3>
                <p className="text-b5 font-inter text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  Jane Doe<br />
                  Jl. Sudirman No. 1<br />
                  Tower A, Unit 12<br />
                  Jakarta Selatan, 12190
                </p>
              </div>
              <div>
                <h3 className="text-b5 font-inter font-medium text-neutral-900 dark:text-cornsilk-100 mb-2">Contact Information</h3>
                <p className="text-b5 font-inter text-neutral-600 dark:text-neutral-400">
                  jane.doe@example.com<br />
                  +62 812 3456 7890
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
