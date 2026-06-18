"use client";

import * as React from "react";
import Link from "next/link";
import { PackageOpen, ArrowRight, AlertCircle } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { OrderData } from "@/app/actions/orders";
import { OrderCard } from "./components/order-card";

interface OrderModuleProps {
  orders: OrderData[];
  error: string | null;
}

export function OrderModule({ orders, error }: OrderModuleProps) {
  const hasOrders = orders.length > 0;

  // Helper to render the order list or the empty state
  const renderOrderList = (filteredOrders: OrderData[]) => {
    if (filteredOrders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center border border-dashed border-cornsilk-300 dark:border-neutral-800 rounded-3xl bg-cornsilk-50/50 dark:bg-neutral-900/20 mt-4">
          <div className="h-16 w-16 bg-cornsilk-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
            <PackageOpen className="h-8 w-8 text-camel-600 dark:text-camel-400" />
          </div>
          <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-2">
            No orders found here
          </h2>
          <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400 max-w-sm mb-6">
            Looks like you don&apos;t have any orders in this category yet.
          </p>
          <Button
            asChild
            variant="primary"
            className="h-10 px-6 font-inter flex items-center gap-2"
          >
            <Link href="/shop">
              Start Shopping
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6 mt-4">
        {filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        {/* Header & Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            className="mb-4"
            items={[{ label: "My Account", href: "/profile" }, { label: "Orders" }]}
          />

          <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
            Order History
          </h1>
          <p className="text-b4 font-inter text-neutral-600 dark:text-neutral-400 mt-2">
            View your past orders, track current shipments, and manage your purchase history.
          </p>
        </div>

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-blush-50 dark:bg-blush-900/20 border border-blush-200 dark:border-blush-800 text-blush-700 dark:text-blush-300 mb-6">
            <AlertCircle className="h-5 w-5 shrink-0" />
            <p className="text-b5 font-inter">{error}</p>
          </div>
        )}

        {/* Content */}
        {!hasOrders ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-cornsilk-300 dark:border-neutral-800 rounded-3xl bg-cornsilk-50/50 dark:bg-neutral-900/20">
            <div className="h-20 w-20 bg-cornsilk-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
              <PackageOpen className="h-10 w-10 text-camel-600 dark:text-camel-400" />
            </div>
            <h2 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-2">
              No orders yet
            </h2>
            <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400 max-w-md mb-8">
              Looks like you haven&apos;t placed any orders yet. Discover our collection of
              beautifully curated blooms.
            </p>
            <Button variant="primary" className="h-12 px-8 font-inter flex items-center gap-2" asChild>
              <Link href="/shop">
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="mb-2 overflow-x-auto flex w-full justify-start sm:w-auto sm:inline-flex">
              <TabsTrigger value="all">All Orders</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>

            <TabsContent value="all">{renderOrderList(orders)}</TabsContent>

            <TabsContent value="active">
              {renderOrderList(
                orders.filter((o) =>
                  ["PENDING", "PAID", "PROCESSING", "SHIPPED"].includes(o.status)
                )
              )}
            </TabsContent>

            <TabsContent value="completed">
              {renderOrderList(orders.filter((o) => o.status === "COMPLETED"))}
            </TabsContent>

            <TabsContent value="cancelled">
              {renderOrderList(orders.filter((o) => o.status === "CANCELLED"))}
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
