"use client";

import { Tag, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { formatPrice } from "@/lib/formatters";

interface CartSummaryProps {
  subtotal: number;
  shipping: number;
  total: number;
  itemCount: number;
  selectedCount: number;
}

export function CartSummary({
  subtotal,
  shipping,
  total,
  itemCount,
  selectedCount,
}: CartSummaryProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [promoCode, _setPromoCode] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_promoError, setPromoError] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function _handleApplyPromo() {
    if (promoCode.toUpperCase() === "FIORISCE") {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setPromoApplied(false);
    }
  }

  return (
    <div className="rounded-3xl border border-cornsilk-300 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-sm sticky top-8">
      {/* Header */}
      <div className="bg-linear-to-r from-blush-100 to-cornsilk-100 dark:from-neutral-800 dark:to-neutral-800 px-6 py-4 border-b border-cornsilk-200 dark:border-neutral-700">
        <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Order Summary
        </h2>
        <p className="text-b6 font-inter text-neutral-500 dark:text-neutral-400 mt-0.5">
          {selectedCount > 0 ? (
            <>
              {selectedCount} of {itemCount} {itemCount === 1 ? "item" : "items"} selected
            </>
          ) : (
            <span className="text-neutral-400 dark:text-neutral-500">No items selected</span>
          )}
        </p>
      </div>

      <div className="p-6 space-y-5">
        {/* Price breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-b5 font-inter text-neutral-600 dark:text-neutral-400">
              Subtotal
            </span>
            <span className="text-b5 font-jetbrains font-medium text-neutral-800 dark:text-cornsilk-100">
              {formatPrice(subtotal)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-b5 font-inter text-neutral-600 dark:text-neutral-400">
              Shipping
            </span>
            <span
              className={cn(
                "text-b5 font-jetbrains font-medium",
                "text-olive-700 dark:text-olive-400"
              )}
            >
              {shipping === 0 ? "Free" : formatPrice(shipping)}
            </span>
          </div>

          {promoApplied && (
            <div className="flex justify-between items-center">
              <span className="text-b5 font-inter text-olive-700 dark:text-olive-400 flex items-center gap-1">
                <Tag className="h-3 w-3" />
                Promo (FIORISCE)
              </span>
              <span className="text-b5 font-jetbrains font-medium text-olive-700 dark:text-olive-400">
                -{formatPrice(subtotal * 0.1)}
              </span>
            </div>
          )}
        </div>

        <Separator className="bg-cornsilk-200 dark:bg-neutral-700" />

        {/* Total */}
        <div className="flex justify-between items-center">
          <span className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            Total
          </span>
          <span className="text-h4 font-jetbrains font-bold text-neutral-900 dark:text-cornsilk-100">
            {formatPrice(promoApplied ? total - subtotal * 0.1 : total)}
          </span>
        </div>

        <Separator className="bg-cornsilk-200 dark:bg-neutral-700" />

        {/* CTA */}
        <Button
          id="proceed-to-checkout"
          variant="primary"
          disabled={selectedCount === 0}
          onClick={() => {
            if (selectedCount > 0) {
              window.location.href = "/checkout";
            }
          }}
          className="w-full group py-5 text-b4 font-inter font-semibold rounded-2xl shadow-md shadow-blush-200/50 dark:shadow-black/30 transition-all duration-200 active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
        >
          {selectedCount === 0
            ? "Select items to checkout"
            : `Checkout ${selectedCount} ${selectedCount === 1 ? "item" : "items"}`}
          {selectedCount > 0 && (
            <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transform transition-all" />
          )}
        </Button>

        {/* Trust badges */}
        <div className="flex items-center justify-center gap-1.5 text-b6 font-inter text-neutral-400 dark:text-neutral-500">
          <ShieldCheck className="h-3.5 w-3.5" />
          Secure & encrypted checkout
        </div>
      </div>
    </div>
  );
}
