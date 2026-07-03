"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingBag, Trash2, Minus, Plus, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Skeleton } from "@/components/ui/skeleton";
import { useCart } from "@/context/cart-context";
import { useSession } from "@/lib/auth-client";
import { Checkbox } from "@/components/ui/checkbox";
import type { CartItemData } from "@/app/actions/cart";
import { formatPrice } from "@/lib/formatters";


// ─── Helpers ──────────────────────────────────────────────────────────────────



// ─── Empty Cart ────────────────────────────────────────────────────────────────

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-cornsilk-200 dark:bg-neutral-800">
        <ShoppingBag className="h-10 w-10 text-blush-400 dark:text-blush-500" />
      </div>
      <div>
        <h2 className="text-h2 font-fraunces text-neutral-900 dark:text-cornsilk-100">
          Your cart is empty
        </h2>
        <p className="mt-2 text-b5 font-inter text-neutral-500 dark:text-neutral-400">
          Looks like you haven&apos;t added any bouquets yet.
        </p>
      </div>
      <Button variant="primary" asChild>
        <Link href="/shop">Browse Bouquets</Link>
      </Button>
    </div>
  );
}

// ─── Cart Item Row ─────────────────────────────────────────────────────────────

function CartItemRow({
  item,
  isSelected,
  onToggle,
}: {
  item: CartItemData;
  isSelected: boolean;
  onToggle: (checked: boolean) => void;
}) {
  const { updateItem, removeItem } = useCart();
  const image = item.product.images[0]?.imageUrl ?? "";

  return (
    <div className="flex items-center gap-4 py-5 first:pt-0 border-b border-cornsilk-200 dark:border-neutral-800 last:border-b-0">
      <Checkbox
        checked={isSelected}
        onCheckedChange={(checked) => onToggle(!!checked)}
        className="shrink-0"
      />
      {/* Image */}
      <Link href={`/shop/${item.product.slug}`} className="shrink-0">
        <div className="relative h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-xl bg-cornsilk-100 dark:bg-neutral-800">
          {image ? (
            <Image
              src={image}
              alt={item.product.name}
              fill
              className="object-cover transition-transform hover:scale-105"
              sizes="112px"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <ShoppingBag className="h-8 w-8 text-neutral-300" />
            </div>
          )}
        </div>
      </Link>

      {/* Details */}
      <div className="flex flex-1 flex-col gap-2 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/shop/${item.product.slug}`}
            className="text-b4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 hover:text-blush-600 dark:hover:text-blush-400 transition-colors flex-1 line-clamp-2"
          >
            {item.product.name}
          </Link>
          <button
            onClick={() => removeItem(item.id)}
            aria-label="Remove item"
            className="shrink-0 rounded-lg p-1.5 text-neutral-400 hover:text-blush-600 dark:hover:text-blush-400 hover:bg-blush-50 dark:hover:bg-blush-900/20 transition-colors -mr-1.5"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-0.5">
          <span className="text-b6 font-inter text-neutral-500 dark:text-neutral-400 capitalize">
            {item.product.category.name}
          </span>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(item as any).size && (
            <span className="text-b6 font-inter text-neutral-600 dark:text-neutral-300">
              Size:{" "}
              <span className="font-medium text-neutral-700 dark:text-neutral-200 uppercase">
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(item as any).size}
              </span>
            </span>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
          {/* Quantity stepper */}
          <div className="flex items-center gap-1 rounded-xl border border-cornsilk-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 overflow-hidden">
            <button
              onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
              disabled={item.quantity <= 1}
              aria-label="Decrease quantity"
              className="flex h-8 w-8 items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-cornsilk-100 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-8 text-center text-b5 font-jetbrains font-medium text-neutral-900 dark:text-cornsilk-100">
              {item.quantity}
            </span>
            <button
              onClick={() => updateItem(item.id, Math.min(10, item.quantity + 1))}
              disabled={item.quantity >= 10}
              aria-label="Increase quantity"
              className="flex h-8 w-8 items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-cornsilk-100 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Price */}
          <span className="text-b4 font-jetbrains font-semibold text-neutral-900 dark:text-cornsilk-100 text-right">
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Cart Summary ──────────────────────────────────────────────────────────────

function CartSummaryPanel({
  subtotal,
  onClear,
  isMixedCart,
  selectedIds,
}: {
  subtotal: number;
  onClear: () => void;
  isMixedCart?: boolean;
  selectedIds: string[];
}) {
  const shipping = subtotal >= 500000 ? 0 : subtotal > 0 ? 50000 : 0;
  const total = subtotal + shipping;

  return (
    <div className="sticky top-24 rounded-2xl border border-cornsilk-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm space-y-4">
      <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
        Order Summary
      </h2>

      <div className="space-y-3 text-b5 font-inter">
        <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
          <span>Subtotal</span>
          <span className="font-jetbrains">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between text-neutral-600 dark:text-neutral-400">
          <span>Shipping</span>
          <span className="font-jetbrains">
            {shipping === 0 ? (
              <span className="text-olive-600 dark:text-olive-400">Free</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        {shipping > 0 && (
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
            Free shipping on orders over {formatPrice(500000)}
          </p>
        )}
        <div className="border-t border-cornsilk-200 dark:border-neutral-700 pt-3 flex items-center justify-between font-semibold text-b4 text-neutral-900 dark:text-cornsilk-100">
          <span>Total</span>
          <span className="font-jetbrains">{formatPrice(total)}</span>
        </div>
      </div>

      {isMixedCart && (
        <div className="rounded-lg bg-blush-50 dark:bg-blush-950/30 p-3 mb-2 flex items-start gap-2 border border-blush-200 dark:border-blush-900">
          <AlertCircle className="h-5 w-5 text-blush-600 dark:text-blush-400 shrink-0 mt-0.5" />
          <p className="text-b5 font-inter text-blush-800 dark:text-blush-300">
            Papan Bunga includes free delivery and must be checked out separately from other
            products.
          </p>
        </div>
      )}

      <Button
        variant="primary"
        size="md"
        className="w-full"
        disabled={isMixedCart || selectedIds.length === 0}
        asChild={!isMixedCart && selectedIds.length > 0}
      >
        {isMixedCart || selectedIds.length === 0 ? (
          <span>Proceed to Checkout</span>
        ) : (
          <Link href={`/checkout?items=${selectedIds.join(",")}`}>Proceed to Checkout</Link>
        )}
      </Button>

      <Button
        variant="ghost"
        size="sm"
        className="w-full text-neutral-400 hover:text-blush-600"
        onClick={onClear}
      >
        <Trash2 className="h-4 w-4 mr-1.5" />
        Clear Cart
      </Button>
    </div>
  );
}

// ─── Loading Skeleton ──────────────────────────────────────────────────────────

function CartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
      <div className="lg:col-span-7 xl:col-span-8 space-y-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="flex gap-4 py-5 border-b border-cornsilk-200 dark:border-neutral-800"
          >
            <Skeleton className="h-28 w-28 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-3/4 rounded" />
              <Skeleton className="h-4 w-1/3 rounded" />
              <Skeleton className="h-8 w-28 rounded-xl mt-auto" />
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-5 xl:col-span-4">
        <Skeleton className="h-72 w-full rounded-2xl" />
      </div>
    </div>
  );
}

// ─── Main Module ───────────────────────────────────────────────────────────────

export function CartModule() {
  const { data: session, isPending } = useSession();
  const status = isPending ? "loading" : session ? "authenticated" : "unauthenticated";
  const { items, isLoading, clearCart } = useCart();
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  // Initially select all items when loaded
  React.useEffect(() => {
    if (items.length > 0 && selectedIds.length === 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSelectedIds(items.map((i) => i.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const toggleAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(items.map((i) => i.id));
    } else {
      setSelectedIds([]);
    }
  };

  const toggleItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((i) => i !== id));
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen bg-cornsilk-100 dark:bg-neutral-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Skeleton className="h-5 w-48 rounded mb-6" />
          <Skeleton className="h-8 w-40 rounded mb-8" />
          <CartSkeleton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cornsilk-100 dark:bg-neutral-950">
      {/* Header */}
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
            {(() => {
              const selectedItems = items.filter((i) => selectedIds.includes(i.id));
              const hasPapanBunga = selectedItems.some(
                (i) => i.product.category?.slug === "papan-bunga"
              );
              const hasOther = selectedItems.some(
                (i) => i.product.category?.slug !== "papan-bunga"
              );
              const isMixedCart = hasPapanBunga && hasOther;
              const subtotal = selectedItems.reduce(
                (acc, item) => acc + item.price * item.quantity,
                0
              );

              return (
                <>
                  {/* Items */}
                  <div className="lg:col-span-7 xl:col-span-8">
                    <div className="rounded-2xl border border-cornsilk-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 shadow-sm">
                      <div className="flex items-center gap-4 pb-4 mb-4 border-b border-cornsilk-200 dark:border-neutral-800">
                        <Checkbox
                          checked={items.length > 0 && selectedIds.length === items.length}
                          onCheckedChange={(c) => toggleAll(!!c)}
                          id="select-all"
                        />
                        <label
                          htmlFor="select-all"
                          className="text-b5 font-semibold cursor-pointer"
                        >
                          Select All Items
                        </label>
                      </div>
                      {items.map((item) => (
                        <CartItemRow
                          key={item.id}
                          item={item}
                          isSelected={selectedIds.includes(item.id)}
                          onToggle={(checked) => toggleItem(item.id, checked)}
                        />
                      ))}
                    </div>

                    <div className="mt-4 flex items-center gap-4">
                      <Button variant="link" size="sm" asChild>
                        <Link href="/shop">← Continue Shopping</Link>
                      </Button>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="lg:col-span-5 xl:col-span-4">
                    <CartSummaryPanel
                      subtotal={subtotal}
                      onClear={clearCart}
                      isMixedCart={isMixedCart}
                      selectedIds={selectedIds}
                    />
                  </div>
                </>
              );
            })()}
          </div>
        )}
      </div>
    </div>
  );
}
