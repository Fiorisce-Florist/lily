"use client";

import * as React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { FilterState, FilterOptions } from "../index";

interface ShopSidebarProps {
  filters: FilterState;
  onFiltersChange: (f: FilterState) => void;
  options: FilterOptions;
}

// ── Flower badge config ──────────────────────────────────────────────────────

const FLOWER_META: Record<string, { label: string }> = {
  Rose: { label: "Rose" },
  Peony: { label: "Peony" },
  Lily: { label: "Lily" },
  Sunflower: { label: "Sunflower" },
  Daisy: { label: "Daisy" },
  Lavender: { label: "Lavender" },
  Wildflower: { label: "Wildflower" },
  "Baby's Breath": { label: "Baby's Breath" },
  Ranunculus: { label: "Ranunculus" },
  Eucalyptus: { label: "Eucalyptus" },
  "Bird of Paradise": { label: "Bird of Paradise" },
  Protea: { label: "Protea" },
  "Sweet Pea": { label: "Sweet Pea" },
  Cosmos: { label: "Cosmos" },
  Foxglove: { label: "Foxglove" },
  Scabiosa: { label: "Scabiosa" },
  "Dried Grass": { label: "Dried Grass" },
};

// ── Color dot config ─────────────────────────────────────────────────────────

const COLOR_DOT: Record<string, string> = {
  Pink: "bg-pink-300",
  White: "bg-neutral-100 border border-neutral-300",
  Green: "bg-green-400",
  Yellow: "bg-yellow-300",
  Orange: "bg-orange-400",
  Purple: "bg-purple-400",
  Red: "bg-red-500",
  Burgundy: "bg-rose-900",
  Peach: "bg-orange-200",
  Blue: "bg-blue-400",
  Black: "bg-neutral-950",
  HotPink: "bg-pink-600",
  Custom: "bg-neutral-600"
};

function formatPrice(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}

// ── Section wrapper ──────────────────────────────────────────────────────────

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="text-h7 font-inter font-semibold tracking-widest text-neutral-400 dark:text-neutral-500 uppercase mb-3">
        {title}
      </h3>
      {children}
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────

export function ShopSidebar({ filters, onFiltersChange, options }: ShopSidebarProps) {
  function toggleCategory(cat: string) {
    const next = filters.categories.includes(cat)
      ? filters.categories.filter((c) => c !== cat)
      : [...filters.categories, cat];
    onFiltersChange({ ...filters, categories: next });
  }

  function toggleOccasion(occ: string) {
    const next = filters.occasions.includes(occ)
      ? filters.occasions.filter((o) => o !== occ)
      : [...filters.occasions, occ];
    onFiltersChange({ ...filters, occasions: next });
  }

  function toggleFlower(flower: string) {
    const next = filters.flowers.includes(flower)
      ? filters.flowers.filter((f) => f !== flower)
      : [...filters.flowers, flower];
    onFiltersChange({ ...filters, flowers: next });
  }

  function toggleColor(color: string) {
    const next = filters.colors.includes(color)
      ? filters.colors.filter((c) => c !== color)
      : [...filters.colors, color];
    onFiltersChange({ ...filters, colors: next });
  }

  function toggleSize(size: string) {
    const next = filters.sizes.includes(size)
      ? filters.sizes.filter((s) => s !== size)
      : [...filters.sizes, size];
    onFiltersChange({ ...filters, sizes: next });
  }

  return (
    <div className="space-y-5 rounded-2xl border border-cornsilk-300 bg-white p-5 dark:border-neutral-800 dark:bg-neutral-900">
      {/* ── Flower Type ───────────────────────────────────────────────── */}
      <FilterSection title="Flower Type">
        <div className="flex flex-wrap gap-2">
          {options.flowers.map((flower) => {
            const active = filters.flowers.includes(flower);
            const meta = FLOWER_META[flower] || { label: flower };
            return (
              <button
                key={flower}
                id={`flower-${flower.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => toggleFlower(flower)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-b6 font-inter transition-all duration-150 select-none",
                  active
                    ? "border-blush-500 bg-blush-500 text-white shadow-sm shadow-blush-200 dark:shadow-blush-900/40"
                    : "border-cornsilk-300 bg-cornsilk-100 text-neutral-600 hover:border-blush-300 hover:bg-blush-50 hover:text-blush-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-blush-700 dark:hover:bg-blush-900/20 dark:hover:text-blush-300"
                )}
              >
                <span>{meta.label}</span>
              </button>
            );
          })}
        </div>
        {filters.flowers.length > 0 && (
          <button
            onClick={() => onFiltersChange({ ...filters, flowers: [] })}
            className="mt-2 text-b6 font-inter text-blush-500 hover:text-blush-700 dark:text-blush-400 transition-colors"
          >
            Clear flower filter
          </button>
        )}
      </FilterSection>

      <Separator className="bg-cornsilk-200 dark:bg-neutral-800" />

      {/* ── Product Type (Category) ──────────────────────────────────────────────────── */}
      {options.categories.length > 0 && (
        <>
          <FilterSection title="Product Type">
            <ul className="space-y-2.5">
              {options.categories.map((cat) => (
                <li key={cat} className="flex items-center gap-2.5">
                  <Checkbox
                    id={`category-${cat}`}
                    checked={filters.categories.includes(cat)}
                    onCheckedChange={() => toggleCategory(cat)}
                  />
                  <Label
                    htmlFor={`category-${cat}`}
                    className="text-b5 font-inter text-neutral-700 dark:text-neutral-300 cursor-pointer leading-none"
                  >
                    {cat}
                  </Label>
                </li>
              ))}
            </ul>
            {filters.categories.length > 0 && (
              <button
                onClick={() => onFiltersChange({ ...filters, categories: [] })}
                className="mt-2 text-b6 font-inter text-blush-500 hover:text-blush-700 dark:text-blush-400 transition-colors"
              >
                Clear product type filter
              </button>
            )}
          </FilterSection>
          <Separator className="bg-cornsilk-200 dark:bg-neutral-800" />
        </>
      )}

      {/* ── Occasion ──────────────────────────────────────────────────── */}
      <FilterSection title="Occasion">
        <ul className="space-y-2.5">
          {options.occasions.map((occ) => (
            <li key={occ} className="flex items-center gap-2.5">
              <Checkbox
                id={`occasion-${occ}`}
                checked={filters.occasions.includes(occ)}
                onCheckedChange={() => toggleOccasion(occ)}
              />
              <Label
                htmlFor={`occasion-${occ}`}
                className="text-b5 font-inter text-neutral-700 dark:text-neutral-300 cursor-pointer leading-none"
              >
                {occ}
              </Label>
            </li>
          ))}
        </ul>
      </FilterSection>

      <Separator className="bg-cornsilk-200 dark:bg-neutral-800" />

      {/* ── Size ──────────────────────────────────────────────────────── */}
      <FilterSection title="Size">
        <div className="flex flex-wrap gap-2">
          {options.sizes.map((size) => {
            const active = filters.sizes.includes(size);
            return (
              <button
                key={size}
                id={`size-${size.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => toggleSize(size)}
                aria-pressed={active}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-b6 font-inter transition-all uppercase duration-150 select-none",
                  active
                    ? "border-blush-500 bg-blush-500 text-white shadow-sm shadow-blush-200 dark:shadow-blush-900/40"
                    : "border-cornsilk-300 bg-cornsilk-100 text-neutral-600 hover:border-blush-300 hover:bg-blush-50 hover:text-blush-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:border-blush-700 dark:hover:bg-blush-900/20 dark:hover:text-blush-300"
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <Separator className="bg-cornsilk-200 dark:bg-neutral-800" />

      {/* ── Price Range ───────────────────────────────────────────────── */}
      <FilterSection title="Price Range">
        <Slider
          id="price-range-slider"
          min={0}
          max={options.maxPrice}
          step={25000}
          value={[filters.priceRange[0], filters.priceRange[1]]}
          onValueChange={([min, max]) => onFiltersChange({ ...filters, priceRange: [min, max] })}
          className="mt-4"
        />
        <div className="mt-3 flex justify-between">
          <span className="text-b6 font-jetbrains text-neutral-500">
            {formatPrice(filters.priceRange[0])}
          </span>
          <span className="text-b6 font-jetbrains text-neutral-500">
            {formatPrice(filters.priceRange[1])}
          </span>
        </div>
      </FilterSection>

      <Separator className="bg-cornsilk-200 dark:bg-neutral-800" />

      {/* ── Color ─────────────────────────────────────────────────────── */}
      <FilterSection title="Color">
        <div className="flex flex-wrap gap-2">
          {options.colors.map((color) => {
            const active = filters.colors.includes(color);
            return (
              <button
                key={color}
                id={`color-${color.toLowerCase()}`}
                onClick={() => toggleColor(color)}
                aria-pressed={active}
                className={cn(
                  "flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-b6 font-inter transition-all",
                  active
                    ? "border-blush-500 bg-blush-50 text-blush-700 dark:bg-blush-900/40 dark:text-blush-300"
                    : "border-cornsilk-300 text-neutral-600 hover:border-cornsilk-500 dark:border-neutral-700 dark:text-neutral-400"
                )}
              >
                <span
                  className={cn(
                    "h-3 w-3 rounded-full shrink-0",
                    COLOR_DOT[color] ?? "bg-neutral-300"
                  )}
                />
                {color}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <Separator className="bg-cornsilk-200 dark:bg-neutral-800" />

      {/* ── Availability ──────────────────────────────────────────────── */}
      <FilterSection title="Availability">
        <div className="space-y-2.5">
          {(["all", "in-stock"] as const).map((val) => (
            <div key={val} className="flex items-center gap-2.5">
              <Checkbox
                id={`avail-${val}`}
                checked={filters.availability === val}
                onCheckedChange={() => onFiltersChange({ ...filters, availability: val })}
              />
              <Label
                htmlFor={`avail-${val}`}
                className="text-b5 font-inter text-neutral-700 dark:text-neutral-300 cursor-pointer leading-none"
              >
                {val === "all" ? "All items" : "In stock only"}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
