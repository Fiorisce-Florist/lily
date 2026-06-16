"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { ALL_BOUQUETS } from "@/modules/ShopModule/data/bouquets";
import { CartItems } from "./sections/cart-items";
import { CartSummary } from "./sections/cart-summary";
import { EmptyCart } from "./components/empty-cart";

export interface CartItemType {
  bouquet: (typeof ALL_BOUQUETS)[0];
  quantity: number;
  size: string;
}

const MOCK_ITEMS: CartItemType[] = [
  { bouquet: ALL_BOUQUETS[0], quantity: 1, size: "Standard" },
  { bouquet: ALL_BOUQUETS[2], quantity: 2, size: "Grand" },
  { bouquet: ALL_BOUQUETS[3], quantity: 1, size: "Small" },
];

const SIZE_MULTIPLIER: Record<string, number> = {
  Small: 0.8,
  Standard: 1.0,
  Grand: 1.4,
};

export function CartModule() {
  const [items, setItems] = React.useState<CartItemType[]>(MOCK_ITEMS);
  const [wishlisted, setWishlisted] = React.useState<Set<string | number>>(new Set());
  // All items selected by default
  const [selectedIds, setSelectedIds] = React.useState<Set<string | number>>(
    new Set(MOCK_ITEMS.map((i) => i.bouquet.id))
  );

  const allSelected = items.length > 0 && items.every((i) => selectedIds.has(i.bouquet.id));
  const someSelected = items.some((i) => selectedIds.has(i.bouquet.id));

  const toggleSelected = (id: string | number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(items.map((i) => i.bouquet.id)));
    }
  };

  const updateQuantity = (id: string | number, delta: number) => {
    setItems((prev) =>
      prev.map((item) =>
        item.bouquet.id === id
          ? { ...item, quantity: Math.min(10, Math.max(1, item.quantity + delta)) }
          : item
      )
    );
  };

  const removeItem = (id: string | number) => {
    setItems((prev) => prev.filter((item) => item.bouquet.id !== id));
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  };

  const clearCart = () => {
    setItems([]);
    setSelectedIds(new Set());
  };

  const toggleWishlist = (id: string | number) => {
    setWishlisted((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const effectivePrice = (item: CartItemType) =>
    Math.round(item.bouquet.price * (SIZE_MULTIPLIER[item.size] ?? 1));

  // Totals only over selected items
  const selectedItems = items.filter((i) => selectedIds.has(i.bouquet.id));
  const subtotal = selectedItems.reduce(
    (acc, item) => acc + effectivePrice(item) * item.quantity,
    0
  );
  const shipping = subtotal >= 500000 ? 0 : subtotal > 0 ? 50000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-cornsilk-100 dark:bg-neutral-950">
      {/* Hero band */}
      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Breadcrumb
          className="mb-4"
          items={[{ label: "Shop", href: "/shop" }, { label: "Cart" }]}
        />

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blush-100 dark:bg-blush-900/30">
              <ShoppingBag className="h-5 w-5 text-blush-600 dark:text-blush-400" />
            </div>
            <div>
              <h1 className="text-h3 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
                Your Cart
              </h1>
              {items.length > 0 && (
                <p className="text-b6 font-inter text-neutral-500 dark:text-neutral-400">
                  {items.length} {items.length === 1 ? "item" : "items"}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* Body */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Items */}
            <div className="lg:col-span-7 xl:col-span-8">
              <CartItems
                items={items.map((item) => ({
                  ...item,
                  bouquet: { ...item.bouquet, price: effectivePrice(item) },
                }))}
                updateQuantity={updateQuantity}
                removeItem={removeItem}
                toggleWishlist={toggleWishlist}
                wishlisted={wishlisted}
                selectedIds={selectedIds}
                toggleSelected={toggleSelected}
                allSelected={allSelected}
                someSelected={someSelected}
                toggleSelectAll={toggleSelectAll}
              />
            </div>

            {/* Summary */}
            <div className="lg:col-span-5 xl:col-span-4">
              <CartSummary
                subtotal={subtotal}
                shipping={shipping}
                total={total}
                selectedCount={selectedItems.reduce((a, i) => a + i.quantity, 0)}
                itemCount={items.reduce((a, i) => a + i.quantity, 0)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
