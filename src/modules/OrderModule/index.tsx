"use client";

import * as React from "react";
import Link from "next/link";
import { PackageOpen, ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { MOCK_ORDERS } from "./data/mock-orders";
import { OrderCard } from "./components/order-card";

export function OrderModule() {
  const [orders, setOrders] = React.useState(MOCK_ORDERS);

  // In a real app, this would be fetched from the database
  const hasOrders = orders.length > 0;

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl pt-8 sm:pt-12">
        {/* Header & Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb 
            className="mb-4"
            items={[
              { label: "My Account", href: "/profile" },
              { label: "Orders" }
            ]} 
          />
          
          <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
            Order History
          </h1>
          <p className="text-b4 font-inter text-neutral-600 dark:text-neutral-400 mt-2">
            View your past orders, track current shipments, and manage your purchase history.
          </p>
        </div>

        {/* Content */}
        {!hasOrders ? (
          <div className="flex flex-col items-center justify-center py-20 px-4 text-center border border-dashed border-cornsilk-300 dark:border-neutral-800 rounded-3xl bg-cornsilk-50/50 dark:bg-neutral-900/20">
            <div className="h-20 w-20 bg-cornsilk-200 dark:bg-neutral-800 rounded-full flex items-center justify-center mb-6">
              <PackageOpen className="h-10 w-10 text-camel-600 dark:text-camel-400" />
            </div>
            <h2 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-2">
              No orders found
            </h2>
            <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400 max-w-md mb-8">
              Looks like you haven&apos;t placed any orders yet. Discover our collection of beautifully curated blooms.
            </p>
            <Link href="/shop">
              <Button variant="primary" className="h-12 px-8 font-inter flex items-center gap-2">
                Start Shopping
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
