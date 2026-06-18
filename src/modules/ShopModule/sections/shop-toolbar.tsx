"use client";

import * as React from "react";
import { LayoutGrid, List, SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShopSidebar } from "./shop-sidebar";
import type { SortKey, FilterState } from "../index";
import { cn } from "@/lib/utils";

interface ShopToolbarProps {
  resultCount: number;
  sort: SortKey;
  onSortChange: (s: SortKey) => void;
  viewMode: "grid" | "list";
  onViewModeChange: (v: "grid" | "list") => void;
  activeFilterCount: number;
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any; // Using any or importing FilterOptions from index
}

export function ShopToolbar({
  resultCount,
  sort,
  onSortChange,
  viewMode,
  onViewModeChange,
  activeFilterCount,
  filters,
  onFiltersChange,
  options,
}: ShopToolbarProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cornsilk-300 pb-4 dark:border-neutral-800">
      {/* Left — result count */}
      <p className="text-b5 font-inter text-neutral-500 dark:text-neutral-400">
        <span className="font-semibold text-neutral-800 dark:text-cornsilk-200">{resultCount}</span>{" "}
        {resultCount === 1 ? "bouquet" : "bouquets"} found
      </p>

      <div className="flex items-center gap-2">
        {/* Mobile filter sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="relative lg:hidden"
              id="mobile-filter-trigger"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
              {activeFilterCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blush-500 text-[10px] font-bold text-white">
                  {activeFilterCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="font-fraunces text-h5 text-neutral-900 dark:text-cornsilk-100">
                Filters
              </SheetTitle>
            </SheetHeader>
            <div className="mt-6">
              <ShopSidebar filters={filters} onFiltersChange={onFiltersChange} options={options} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Active filter count badge on desktop */}
        {activeFilterCount > 0 && (
          <span className="hidden lg:inline-flex items-center gap-1 text-b6 font-inter rounded-full bg-blush-100 px-2.5 py-1 text-blush-700 dark:bg-blush-900/40 dark:text-blush-300">
            {activeFilterCount} active
            <button
              onClick={() =>
                onFiltersChange({
                  categories: [],
                  occasions: [],
                  colors: [],
                  flowers: [],
                  sizes: [],
                  priceRange: [0, 1000000],
                  availability: "all",
                })
              }
              className="ml-0.5 hover:text-blush-900"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        )}

        {/* Sort */}
        <Select value={sort} onValueChange={(v) => onSortChange(v as SortKey)}>
          <SelectTrigger className="h-9 w-44 text-b5" id="sort-select">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="bestseller">Best Selling</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>

        {/* View mode */}
        <div className="flex rounded-lg border border-cornsilk-300 dark:border-neutral-700 overflow-hidden">
          <button
            id="view-grid"
            onClick={() => onViewModeChange("grid")}
            className={cn(
              "flex h-9 w-9 items-center justify-center transition-colors",
              viewMode === "grid"
                ? "bg-blush-500 text-white"
                : "text-neutral-500 hover:bg-cornsilk-200 dark:hover:bg-neutral-800"
            )}
            aria-label="Grid view"
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
          <button
            id="view-list"
            onClick={() => onViewModeChange("list")}
            className={cn(
              "flex h-9 w-9 items-center justify-center transition-colors border-l border-cornsilk-300 dark:border-neutral-700",
              viewMode === "list"
                ? "bg-blush-500 text-white"
                : "text-neutral-500 hover:bg-cornsilk-200 dark:hover:bg-neutral-800"
            )}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
