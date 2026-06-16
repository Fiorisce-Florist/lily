"use client";

import * as React from "react";
import { Cross, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface ShopHeroProps {
  query: string;
  onQueryChange: (q: string) => void;
}

const SUGGESTIONS = ["Roses", "Wedding", "Birthday", "Sunflower", "Lavender", "Peony"];

export function ShopHero({ query, onQueryChange }: ShopHeroProps) {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-blush-100 via-cornsilk-100 to-camel-100 dark:from-neutral-900 dark:via-neutral-950 dark:to-neutral-900">
      {/* Decorative petals */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-blush-200/40 blur-3xl dark:bg-blush-900/20" />
        <div className="absolute -bottom-8 -left-8 h-48 w-48 rounded-full bg-camel-200/40 blur-3xl dark:bg-camel-900/20" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-cornsilk-200/30 blur-3xl dark:bg-cornsilk-900/10" />
      </div>

      <div className="relative container mx-auto px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-h1 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
            Discover Your
            <span className="relative ml-3 inline-block">
              <span className="relative z-10 text-blush-600 dark:text-blush-400">Bouquet</span>
              <span
                aria-hidden
                className="absolute bottom-1 left-0 h-3 w-full -rotate-1 bg-blush-200/60 dark:bg-blush-800/40"
              />
            </span>
          </h1>
          <p className="text-b4 mt-4 text-neutral-600 dark:text-neutral-400">
            Handcrafted with seasonal blooms — find the perfect arrangement for every moment.
          </p>

          {/* Search bar */}
          <div className="relative mt-8 mx-auto max-w-xl">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400 dark:text-neutral-500"
              aria-hidden
            />
            <Input
              id="shop-search"
              type="search"
              placeholder="Search roses, birthday, lavender…"
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              className="h-14 rounded-2xl pl-6 pr-4 text-b4 shadow-md border-cornsilk-300 bg-white/90 dark:bg-neutral-900/90 dark:border-neutral-700 backdrop-blur-sm focus:ring-blush-500"
              aria-label="Search bouquets"
            />
          </div>

          {/* Quick suggestions */}
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                id={`suggestion-${s.toLowerCase()}`}
                onClick={() => onQueryChange(s)}
                className={cn(
                  "text-b6 font-inter rounded-full px-3 py-1.5 transition-all border",
                  query.toLowerCase() === s.toLowerCase()
                    ? "bg-blush-500 text-cornsilk-100 border-blush-500"
                    : "bg-white/70 border-cornsilk-300 text-neutral-600 hover:bg-cornsilk-200 hover:border-cornsilk-400 dark:bg-neutral-800/70 dark:border-neutral-700 dark:text-neutral-300 dark:hover:bg-neutral-700"
                )}
              >
                {s}
              </button>
            ))}
            {query && (
              <button
                onClick={() => onQueryChange("")}
                className="flex items-center gap-1 text-b4 font-inter rounded-full px-3 py-1.5 border border-blush-300 text-blush-600 hover:bg-blush-50 transition-all dark:border-blush-700 dark:text-blush-400 dark:hover:bg-blush-900/20"
              >
                Clear
                <X className="w-4 h-4"/>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
