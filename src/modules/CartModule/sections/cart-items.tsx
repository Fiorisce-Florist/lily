"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { CartItemType } from "../index";

function formatPrice(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}

interface CartItemsProps {
  items: CartItemType[];
  updateQuantity: (id: string | number, delta: number) => void;
  removeItem: (id: string | number) => void;
  toggleWishlist: (id: string | number) => void;
  wishlisted: Set<string | number>;
  selectedIds: Set<string | number>;
  toggleSelected: (id: string | number) => void;
  allSelected: boolean;
  someSelected: boolean;
  toggleSelectAll: () => void;
}

export function CartItems({
  items,
  updateQuantity,
  removeItem,
  toggleWishlist,
  wishlisted,
  selectedIds,
  toggleSelected,
  allSelected,
  someSelected,
  toggleSelectAll,
}: CartItemsProps) {
  const selectedCount = items.filter((i) => selectedIds.has(i.bouquet.id)).length;

  return (
    <div className="space-y-4">
      {/* ── Select-all toolbar ─────────────────────────────────── */}
      <div className="flex items-center justify-between rounded-xl border border-cornsilk-300 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
        <label className="flex cursor-pointer items-center gap-3 select-none">
          <Checkbox
            id="select-all"
            checked={allSelected}
            /* indeterminate when some (but not all) are checked */
            data-state={allSelected ? "checked" : someSelected ? "indeterminate" : "unchecked"}
            onCheckedChange={toggleSelectAll}
            className="data-[state=indeterminate]:bg-blush-500 data-[state=indeterminate]:border-blush-500"
            aria-label="Select all items"
          />
          <span className="text-b5 font-inter font-medium text-neutral-700 dark:text-neutral-300">
            {allSelected
              ? "All selected"
              : someSelected
                ? `${selectedCount} of ${items.length} selected`
                : "Select all"}
          </span>
        </label>

        {someSelected && !allSelected && (
          <button
            onClick={toggleSelectAll}
            className="text-b6 font-inter text-blush-500 hover:text-blush-700 dark:text-blush-400 transition-colors"
          >
            Select all
          </button>
        )}
      </div>

      {/* ── Item cards ─────────────────────────────────────────── */}
      {items.map((item) => {
        const isSelected = selectedIds.has(item.bouquet.id);
        const isWishlisted = wishlisted.has(item.bouquet.id);
        const lineTotal = item.bouquet.price * item.quantity;

        return (
          <article
            key={item.bouquet.id}
            className={cn(
              "group relative flex gap-4 sm:gap-5 rounded-2xl border bg-white p-4 sm:p-5 transition-all duration-200 dark:bg-neutral-900",
              isSelected
                ? "border-blush-300 shadow-sm shadow-blush-100/60 dark:border-blush-800 dark:shadow-blush-900/20"
                : "border-cornsilk-300 opacity-60 dark:border-neutral-800"
            )}
          >
            {/* Checkbox column */}
            <div className="flex shrink-0 items-start pt-1">
              <Checkbox
                id={`select-item-${item.bouquet.id}`}
                checked={isSelected}
                onCheckedChange={() => toggleSelected(item.bouquet.id)}
                aria-label={`Select ${item.bouquet.name}`}
              />
            </div>

            {/* Image */}
            <Link
              href={`/shop/${item.bouquet.slug}`}
              className="relative h-28 w-28 sm:h-32 sm:w-32 shrink-0 overflow-hidden rounded-xl bg-cornsilk-100 dark:bg-neutral-800"
              tabIndex={isSelected ? 0 : -1}
            >
              <Image
                src={item.bouquet.image}
                alt={item.bouquet.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {!item.bouquet.inStock && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm">
                  <span className="text-b6 font-inter font-medium text-neutral-600">Sold Out</span>
                </div>
              )}
            </Link>

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between min-w-0">
              {/* Top row */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link href={`/shop/${item.bouquet.slug}`}>
                    <h3 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 hover:text-blush-600 dark:hover:text-blush-400 transition-colors truncate">
                      {item.bouquet.name}
                    </h3>
                  </Link>

                  <p className="text-b5 font-inter text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Size:{" "}
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">
                      {item.size}
                    </span>
                  </p>

                  {/* Flower chips */}
                  <div className="mt-2 flex flex-wrap gap-1">
                    {item.bouquet.flowers.slice(0, 3).map((f) => (
                      <Badge key={f} variant={"outline"} className="text-m3">
                        {f}
                      </Badge>
                    ))}
                  </div>
                </div>
                <button
                  id={`remove-${item.bouquet.id}`}
                  onClick={() => removeItem(item.bouquet.id)}
                  className="flex items-center gap-1 text-b6 font-inter text-neutral-400 hover:text-red-500 transition-colors"
                  aria-label={`Remove ${item.bouquet.name} from cart`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>

              {/* Bottom row — stepper + price + remove */}
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                {/* Quantity stepper */}
                <div className="flex items-center rounded-full border border-cornsilk-300 bg-cornsilk-50 dark:border-neutral-700 dark:bg-neutral-800 overflow-hidden">
                  <Button
                    variant="ghost"
                    size="icon"
                    id={`qty-minus-${item.bouquet.id}`}
                    className="h-8 w-8 rounded-none text-neutral-600 hover:text-neutral-900 hover:bg-cornsilk-200 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-700"
                    onClick={() => updateQuantity(item.bouquet.id, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-9 text-center text-b5 font-jetbrains font-semibold text-neutral-900 dark:text-cornsilk-100 select-none">
                    {item.quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    id={`qty-plus-${item.bouquet.id}`}
                    className="h-8 w-8 rounded-none text-neutral-600 hover:text-neutral-900 hover:bg-cornsilk-200 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-700"
                    onClick={() => updateQuantity(item.bouquet.id, 1)}
                    disabled={item.quantity >= 10}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>

                {/* Line total */}
                <div className="text-right">
                  <p className="text-h5 font-jetbrains font-semibold text-neutral-900 dark:text-cornsilk-100">
                    {formatPrice(lineTotal)}
                  </p>
                </div>
              </div>
            </div>
          </article>
        );
      })}

      {/* Back to shop */}
      <div className="pt-1">
        <Link
          href="/shop"
          className="inline-flex group items-center gap-1.5 text-b5 font-inter text-neutral-500 hover:text-blush-600 dark:hover:text-blush-400 transition-colors"
        >
          <ChevronRight className="h-3.5 w-3.5 rotate-180 group-hover:-translate-x-1 transform transition-all" />
          Continue shopping
        </Link>
      </div>

      <Separator className="bg-cornsilk-200 dark:bg-neutral-800" />
    </div>
  );
}
