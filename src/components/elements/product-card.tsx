import * as React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface ProductCardProps {
  product: {
    id?: string | number;
    name: string;
    slug: string;
    image: string;
    price: number | string;
    originalPrice?: number | string;
    inStock?: boolean;
    isBestseller?: boolean;
    isNew?: boolean;
    occasion?: string;
    description?: string;
    tags?: string[];
  };
  list?: boolean;
  className?: string;
}

function formatPrice(v: number | string) {
  if (typeof v === "string") return v;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}

export function ProductCard({ product, list, className }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const inStock = product.inStock !== false;

  if (list) {
    return (
      <article
        id={`product-${product.slug}`}
        className={cn(
          "group flex gap-5 rounded-2xl border border-cornsilk-300 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900",
          className
        )}
      >
        {/* Image */}
        <Link
          href={`/shop/${product.slug}`}
          className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl block"
        >
          {!imgLoaded && <Skeleton className="absolute inset-0" />}
          <img
            src={product.image}
            alt={product.name}
            onLoad={() => setImgLoaded(true)}
            className={cn(
              "h-full w-full object-cover transition-all duration-500 group-hover:scale-105",
              imgLoaded ? "opacity-100" : "opacity-0"
            )}
          />
          {!inStock && (
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
                  {product.isBestseller && (
                    <Badge variant="default" className="text-[10px]">
                      Bestseller
                    </Badge>
                  )}
                  {product.isNew && (
                    <Badge variant="success" className="text-[10px]">
                      New
                    </Badge>
                  )}
                  {product.occasion && (
                    <Badge variant="secondary" className="text-[10px]">
                      {product.occasion}
                    </Badge>
                  )}
                </div>
                <Link href={`/shop/${product.slug}`}>
                  <h3 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 hover:text-blush-600 dark:hover:text-blush-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
              </div>
            </div>
            {product.description && (
              <p className="text-b6 mt-1 text-neutral-500 dark:text-neutral-400 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-h5 font-inter font-semibold text-neutral-900 dark:text-cornsilk-100">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-b6 font-inter text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
            <Button
              variant="primary"
              size="sm"
              disabled={!inStock}
              id={`add-to-cart-${product.slug}`}
              className="z-10"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="hidden sm:inline-block ml-2">
                {inStock ? "Add to Cart" : "Sold Out"}
              </span>
            </Button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      id={`product-${product.slug}`}
      className={cn(
        "group relative flex h-full flex-col rounded-2xl border border-cornsilk-300 bg-white overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 dark:border-neutral-800 dark:bg-neutral-900",
        className
      )}
    >
      {/* Image */}
      <Link
        href={`/shop/${product.slug}`}
        className="relative block aspect-4/5 sm:aspect-4/3 overflow-hidden bg-cornsilk-100 dark:bg-neutral-800"
      >
        {!imgLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
        <img
          src={product.image}
          alt={product.name}
          onLoad={() => setImgLoaded(true)}
          className={cn(
            "h-full w-full object-cover transition-all duration-500 group-hover:scale-105",
            imgLoaded ? "opacity-100" : "opacity-0"
          )}
        />

        {/* Overlay actions on hover */}
        <div className="absolute inset-0 flex items-end justify-center gap-2 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-linear-to-t from-black/20 to-transparent"></div>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.isBestseller && (
            <Badge variant="default" className="text-[10px] shadow">
              Bestseller
            </Badge>
          )}
          {product.isNew && (
            <Badge variant="success" className="text-[10px] shadow">
              New
            </Badge>
          )}
          {product.originalPrice &&
            typeof product.price === "number" &&
            typeof product.originalPrice === "number" && (
              <Badge variant="secondary" className="text-[10px] shadow">
                {Math.round((1 - product.price / product.originalPrice) * 100)}% off
              </Badge>
            )}
        </div>

        {/* Out of stock overlay */}
        {!inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-neutral-900/60 backdrop-blur-sm">
            <span className="rounded-full bg-white/90 dark:bg-neutral-800/90 px-4 py-1.5 text-b6 font-inter font-medium text-neutral-700 dark:text-neutral-300 shadow">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {product.occasion && (
          <div className="flex items-start justify-between gap-2 mb-1">
            <Badge variant="outline" className="text-[10px]">
              {product.occasion}
            </Badge>
          </div>
        )}

        <Link href={`/shop/${product.slug}`}>
          <h3 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 leading-tight hover:text-blush-600 dark:hover:text-blush-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-b6 mt-1 text-neutral-500 dark:text-neutral-400 line-clamp-2 flex-1">
            {product.description}
          </p>
        )}

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {product.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-cornsilk-200 px-2 py-0.5 text-[10px] font-inter text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Price + CTA */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-h5 font-inter font-semibold text-neutral-900 dark:text-cornsilk-100">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-b6 font-inter text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <Button
            variant="primary"
            size="sm"
            disabled={!inStock}
            id={`add-to-cart-${product.slug}`}
            className="z-10"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:ml-2">Add</span>
          </Button>
        </div>
      </div>
    </article>
  );
}
