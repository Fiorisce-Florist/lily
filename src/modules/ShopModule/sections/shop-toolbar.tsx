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
import { useLanguage } from "@/config/use-language";

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
  const { dictionary } = useLanguage();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cornsilk-300 pb-4 dark:border-neutral-800">
      {/* Left — result count */}
      <p className="text-b5 font-inter text-neutral-500 dark:text-neutral-400">
        <span className="font-semibold text-neutral-800 dark:text-cornsilk-200">{resultCount}</span>{" "}
        {resultCount === 1
          ? dictionary.shopPage.toolbar.bouquetSingular
          : dictionary.shopPage.toolbar.bouquetPlural}{" "}
        {dictionary.shopPage.toolbar.found}
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
              {dictionary.shopPage.toolbar.filters}
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
                {dictionary.shopPage.toolbar.filters}
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
            {activeFilterCount} {dictionary.shopPage.toolbar.active}
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
            <SelectValue placeholder={dictionary.shopPage.toolbar.sortBy} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">{dictionary.shopPage.toolbar.sort.featured}</SelectItem>
            <SelectItem value="bestseller">
              {dictionary.shopPage.toolbar.sort.bestseller}
            </SelectItem>
            <SelectItem value="newest">{dictionary.shopPage.toolbar.sort.newest}</SelectItem>
            <SelectItem value="price-asc">{dictionary.shopPage.toolbar.sort.priceAsc}</SelectItem>
            <SelectItem value="price-desc">{dictionary.shopPage.toolbar.sort.priceDesc}</SelectItem>
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
            aria-label={dictionary.shopPage.toolbar.gridView}
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
            aria-label={dictionary.shopPage.toolbar.listView}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
