"use client";

import * as React from "react";
import Link from "next/link";
import { ShoppingBag, Heart, Star, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Bouquet } from "../data/bouquets";

interface ShopGridProps {
  bouquets: Bouquet[];
  viewMode: "grid" | "list";
}

function formatPrice(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}

function BouquetCard({ bouquet, list }: { bouquet: Bouquet; list?: boolean }) {
  const [liked, setLiked] = React.useState(false);
  const [imgLoaded, setImgLoaded] = React.useState(false);

  if (list) {
    return (
      <article
        id={`bouquet-${bouquet.slug}`}
        className="group flex gap-5 rounded-2xl border border-cornsilk-300 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900"
      >
        {/* Image */}
        <Link href={`/shop/${bouquet.slug}`} className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl block">
          {!imgLoaded && <Skeleton className="absolute inset-0" />}
          <img
            src={bouquet.image}
            alt={bouquet.name}
            onLoad={() => setImgLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-all duration-500 group-hover:scale-105",
              imgLoaded ? "opacity-100" : "opacity-0"
            )}
          />
          {!bouquet.inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm">
              <span className="text-b6 font-inter font-medium text-neutral-600 dark:text-neutral-400">
                Sold Out
              </span>
            </div>
          )}
        </Link>

        {/* Info */}
        <div className="flex flex-1 flex-col justify-between min-w-0">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div>
                <div className="flex gap-1.5 mb-1 flex-wrap">
                  {bouquet.isBestseller && (
                    <Badge variant="default" className="text-[10px]">Bestseller</Badge>
                  )}
                  {bouquet.isNew && (
                    <Badge variant="success" className="text-[10px]">New</Badge>
                  )}
                  <Badge variant="secondary" className="text-[10px]">{bouquet.occasion}</Badge>
                </div>
                <Link href={`/shop/${bouquet.slug}`}>
                  <h3 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 hover:text-blush-600 dark:hover:text-blush-400 transition-colors">
                    {bouquet.name}
                  </h3>
                </Link>
              </div>
              <button
                onClick={() => setLiked((p) => !p)}
                aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
                className="shrink-0 text-neutral-400 hover:text-blush-500 transition-colors"
              >
                <Heart className={cn("h-5 w-5", liked && "fill-blush-500 text-blush-500")} />
              </button>
            </div>
            <p className="text-b6 mt-1 text-neutral-500 dark:text-neutral-400 line-clamp-2">
              {bouquet.description}
            </p>
            <div className="mt-1.5 flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-camel-500 text-camel-500" />
              <span className="text-b6 font-inter font-medium text-neutral-700 dark:text-neutral-300">
                {bouquet.rating}
              </span>
              <span className="text-b6 text-neutral-400">({bouquet.reviewCount})</span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-h5 font-inter font-semibold text-neutral-900 dark:text-cornsilk-100">
                {formatPrice(bouquet.price)}
              </span>
              {bouquet.originalPrice && (
                <span className="text-b6 font-inter text-neutral-400 line-through">
                  {formatPrice(bouquet.originalPrice)}
                </span>
              )}
            </div>
            <Button
              variant="primary"
              size="sm"
              disabled={!bouquet.inStock}
              id={`add-to-cart-${bouquet.slug}`}
            >
              <ShoppingBag className="h-4 w-4" />
              {bouquet.inStock ? "Add to Cart" : "Sold Out"}
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      id={`bouquet-${bouquet.slug}`}
      className="group relative flex flex-col rounded-2xl border border-cornsilk-300 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900"
    >
      {/* Image */}
      <Link href={`/shop/${bouquet.slug}`} className="relative block aspect-4/3 overflow-hidden bg-cornsilk-100 dark:bg-neutral-800">
        {!imgLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
        <img
          src={bouquet.image}
          alt={bouquet.name}
          onLoad={() => setImgLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-all duration-500 group-hover:scale-105",
            imgLoaded ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Overlay actions on hover */}
        <div className="absolute inset-0 flex items-end justify-center gap-2 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-linear-to-t from-black/20 to-transparent">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-700 shadow"
            aria-label="View product"
          >
            <Eye className="h-4 w-4" />
          </span>
        </div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {bouquet.isBestseller && <Badge variant="default" className="text-[10px] shadow">Bestseller</Badge>}
          {bouquet.isNew && <Badge variant="success" className="text-[10px] shadow">New</Badge>}
          {bouquet.originalPrice && (
            <Badge variant="secondary" className="text-[10px] shadow">
              {Math.round((1 - bouquet.price / bouquet.originalPrice) * 100)}% off
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={() => setLiked((p) => !p)}
          aria-label={liked ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-2.5 right-2.5 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 shadow transition-all hover:bg-white"
        >
          <Heart className={cn("h-4 w-4", liked ? "fill-blush-500 text-blush-500" : "text-neutral-400")} />
        </button>

        {/* Out of stock overlay */}
        {!bouquet.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-neutral-900/60 backdrop-blur-sm">
            <span className="rounded-full bg-white/90 dark:bg-neutral-800/90 px-4 py-1.5 text-b6 font-inter font-medium text-neutral-700 dark:text-neutral-300 shadow">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2 mb-1">
          <Badge variant="outline" className="text-[10px]">{bouquet.occasion}</Badge>
          <div className="flex items-center gap-0.5 shrink-0">
            <Star className="h-3.5 w-3.5 fill-camel-500 text-camel-500" />
            <span className="text-b6 font-inter text-neutral-600 dark:text-neutral-400">
              {bouquet.rating} ({bouquet.reviewCount})
            </span>
          </div>
        </div>

        <Link href={`/shop/${bouquet.slug}`}>
          <h3 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 leading-tight hover:text-blush-600 dark:hover:text-blush-400 transition-colors">
            {bouquet.name}
          </h3>
        </Link>
        <p className="text-b6 mt-1 text-neutral-500 dark:text-neutral-400 line-clamp-2 flex-1">
          {bouquet.description}
        </p>

        {/* Tags */}
        <div className="mt-2 flex flex-wrap gap-1">
          {bouquet.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-cornsilk-200 px-2 py-0.5 text-[10px] font-inter text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-h5 font-inter font-semibold text-neutral-900 dark:text-cornsilk-100">
              {formatPrice(bouquet.price)}
            </span>
            {bouquet.originalPrice && (
              <span className="text-b6 font-inter text-neutral-400 line-through">
                {formatPrice(bouquet.originalPrice)}
              </span>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            disabled={!bouquet.inStock}
            id={`add-to-cart-${bouquet.slug}`}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <div className="text-5xl mb-4">🌸</div>
      <h3 className="text-h4 font-fraunces font-semibold text-neutral-700 dark:text-cornsilk-200">
        No bouquets found
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
          <BouquetCard key={b.id} bouquet={b} list />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {bouquets.map((b) => (
        <BouquetCard key={b.id} bouquet={b} />
      ))}
    </div>
  );
}
