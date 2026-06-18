"use client";

import * as React from "react";
import { ProductCard } from "@/components/elements/product-card";
import type { Bouquet } from "../data/bouquets";

interface ShopGridProps {
  bouquets: Bouquet[];
  viewMode: "grid" | "list";
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl mb-4">🌸</div>
      <h3 className="text-h4 font-fraunces font-semibold text-neutral-700 dark:text-cornsilk-200">
        No products found
      </h3>
      <p className="text-b5 mt-2 text-neutral-500 dark:text-neutral-400 max-w-xs">
        Try adjusting your search or filters to discover more arrangements.
      </p>
    </div>
  );
}

export function ShopGrid({ bouquets, viewMode }: ShopGridProps) {
  if (bouquets.length === 0) return <EmptyState />;

  if (viewMode === "list") {
    return (
      <div className="flex flex-col gap-4">
        {bouquets.map((b) => (
          <ProductCard key={b.id} product={b} list />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {bouquets.map((b) => (
        <ProductCard key={b.id} product={b} />
      ))}
    </div>
  );
}
