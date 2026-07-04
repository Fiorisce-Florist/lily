import * as React from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/formatters";


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
    variants?: { price: number | string }[];
  };
  list?: boolean;
  className?: string;
}



export function ProductCard({ product, list, className }: ProductCardProps) {
  const [imgLoaded, setImgLoaded] = React.useState(false);

  const inStock = product.inStock !== false;

  let displayPrice = formatPrice(product.price);
  if (product.variants && product.variants.length > 0) {
    const minVariantPrice = Math.min(...product.variants.map((v) => Number(v.price)));
    displayPrice = `From ${formatPrice(minVariantPrice)}`;
  }

  if (list) {
    return (
      <article
        id={`product-${product.slug}`}
        className={cn(
          "group relative flex gap-5 rounded-2xl border border-cornsilk-300 bg-white p-4 transition-shadow hover:shadow-md dark:border-neutral-800 dark:bg-neutral-900",
          className
        )}
      >
        {/* Image */}
        <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-xl block">
          {product.image ? (
            <>
              {!imgLoaded && <Skeleton className="absolute inset-0" />}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.name}
                onLoad={() => setImgLoaded(true)}
                className={cn(
                  "h-full w-full object-contain transition-all duration-500 group-hover:scale-105",
                  imgLoaded ? "opacity-100" : "opacity-0"
                )}
              />
            </>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
              <ShoppingBag className="h-8 w-8 text-neutral-400" />
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 dark:bg-neutral-900/60 backdrop-blur-sm">
              <span className="text-b6 font-inter font-medium text-neutral-600 dark:text-neutral-400">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-1 flex-col gap-1 min-w-0">
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
                <Link href={`/shop/${product.slug}`} className="after:absolute after:inset-0 z-0">
                  <h3 className="text-h3 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 group-hover:text-blush-600 dark:group-hover:text-blush-400 transition-colors">
                    {product.name}
                  </h3>
                </Link>
              </div>
            </div>
            {product.description && (
              <p className="text-b6 mt-1 text-neutral-500 dark:text-neutral-400 line-clamp-2 wrap-break-word">
                {product.description}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between mt-1">
            <div className="flex items-baseline gap-2">
              <span className="text-h5 font-inter font-semibold text-neutral-900 dark:text-cornsilk-100">
                {displayPrice}
              </span>
              {product.originalPrice && (
                <span className="text-b6 font-inter text-neutral-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
            </div>
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
      <div className="relative block aspect-4/5 sm:aspect-4/3 overflow-hidden ">
        {product.image ? (
          <>
            {!imgLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={product.image}
              alt={product.name}
              onLoad={() => setImgLoaded(true)}
              className={cn(
                "h-full w-full object-contain transition-all duration-500 group-hover:scale-105",
                imgLoaded ? "opacity-100" : "opacity-0"
              )}
            />
          </>
        ) : (
          <div className="h-full w-full flex items-center justify-center bg-neutral-100 dark:bg-neutral-800">
            <ShoppingBag className="h-10 w-10 text-neutral-400" />
          </div>
        )}

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
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {product.occasion && (
          <div className="flex items-start justify-between gap-2 mb-1">
            <Badge variant="outline" className="text-[10px]">
              {product.occasion}
            </Badge>
          </div>
        )}

        <Link href={`/shop/${product.slug}`} className="after:absolute after:inset-0 z-0">
          <h3 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 leading-tight group-hover:text-blush-600 dark:group-hover:text-blush-400 transition-colors">
            {product.name}
          </h3>
        </Link>
        {product.description && (
          <p className="text-b6 mt-1 text-neutral-500 dark:text-neutral-400 line-clamp-2 wrap-break-word">
            {product.description}
          </p>
        )}

        {/* Price + CTA */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-h5 font-inter font-semibold text-neutral-900 dark:text-cornsilk-100">
              {displayPrice}
            </span>
            {product.originalPrice && (
              <span className="text-b6 font-inter text-neutral-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
