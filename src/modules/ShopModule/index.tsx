"use client";

import * as React from "react";
import { ShopHero } from "./sections/shop-hero";
import { ShopToolbar } from "./sections/shop-toolbar";
import { ShopSidebar } from "./sections/shop-sidebar";
import { ShopGrid } from "./sections/shop-grid";
import type { Bouquet } from "./data/bouquets";

export type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "bestseller";

export interface FilterState {
  occasions: string[];
  colors: string[];
  flowers: string[];
  priceRange: [number, number];
  availability: "all" | "in-stock";
}

export interface FilterOptions {
  occasions: string[];
  colors: string[];
  flowers: string[];
  maxPrice: number;
}

const DEFAULT_FILTERS: FilterState = {
  occasions: [],
  colors: [],
  flowers: [],
  priceRange: [0, 1000000],
  availability: "all",
};

export default function ShopModule({ bouquets = [] }: { bouquets: Bouquet[] }) {
  const options = React.useMemo<FilterOptions>(() => {
    return {
      occasions: [...new Set(bouquets.map((b) => b.occasion))],
      colors: [...new Set(bouquets.flatMap((b) => b.colors))].sort(),
      flowers: [...new Set(bouquets.flatMap((b) => b.flowers))].sort(),
      maxPrice: Math.max(0, ...bouquets.map((b) => Number(b.price) || 0)),
    };
  }, [bouquets]);

  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("featured");
  const [filters, setFilters] = React.useState<FilterState>(DEFAULT_FILTERS);
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid");

  const filtered = React.useMemo(() => {
    let result = [...bouquets];

    // Search — name and occasion only (flower type uses sidebar)
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (b) =>
          b.name.toLowerCase().includes(q) ||
          b.occasion.toLowerCase().includes(q) ||
          b.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Occasion filter
    if (filters.occasions.length > 0) {
      result = result.filter((b) => filters.occasions.includes(b.occasion));
    }

    // Flower filter
    if (filters.flowers.length > 0) {
      result = result.filter((b) => b.flowers.some((f) => filters.flowers.includes(f)));
    }

    // Color filter
    if (filters.colors.length > 0) {
      result = result.filter((b) => b.colors.some((c) => filters.colors.includes(c)));
    }

    // Price range
    result = result.filter(
      (b) => b.price >= filters.priceRange[0] && b.price <= filters.priceRange[1]
    );

    // Availability
    if (filters.availability === "in-stock") {
      result = result.filter((b) => b.inStock);
    }

    // Sort
    switch (sort) {
      case "price-asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        result.sort((a, b) => String(b.id).localeCompare(String(a.id)));
        break;
      case "bestseller":
        result.sort((a, b) => b.soldCount - a.soldCount);
        break;
      default:
        break;
    }

    return result;
  }, [query, sort, filters, bouquets]);

  const activeFilterCount =
    filters.occasions.length +
    filters.flowers.length +
    filters.colors.length +
    (filters.availability !== "all" ? 1 : 0) +
    (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000000 ? 1 : 0);

  return (
    <div className="min-h-screen bg-cornsilk-100 dark:bg-neutral-950">
      <ShopHero query={query} onQueryChange={setQuery} />

      <div className="container mx-auto px-4 py-10 sm:px-6 lg:px-8">
        <ShopToolbar
          resultCount={filtered.length}
          sort={sort}
          onSortChange={setSort}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          activeFilterCount={activeFilterCount}
          filters={filters}
          onFiltersChange={setFilters}
          options={options}
        />

        <div className="mt-6 flex gap-8">
          {/* Sidebar — desktop only */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <ShopSidebar filters={filters} onFiltersChange={setFilters} options={options} />
          </aside>

          {/* Product grid */}
          <div className="flex-1 min-w-0">
            <ShopGrid bouquets={filtered} viewMode={viewMode} />
          </div>
        </div>
      </div>
    </div>
  );
}
