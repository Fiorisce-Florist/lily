"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ShoppingBag,
  Truck,
  Minus,
  Plus,
  Package,
  RotateCcw,
  Clock,
  MapPin,
  ZoomIn,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { Bouquet } from "@/modules/ShopModule/data/bouquets";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { useCart } from "@/context/cart-context";
import { useState } from "react";
import { ProductCard } from "@/components/elements/product-card";
import { cn } from "@/lib/utils";

// ─── Constants ────────────────────────────────────────────────────────────────

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
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}

// Removed unused StarRating component

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ImageGallery({ bouquet, selectedImage }: { bouquet: Bouquet; selectedImage?: string }) {
  const displayImage = selectedImage || bouquet.image || "/placeholder-image.png";
  const [imgLoaded, setImgLoaded] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  // We use key={displayImage} on the Image component itself below.
  // Instead of setting state in effect, we can just rely on the onLoad handler
  // which will fire when the new image loads. However, to hide the old image immediately,
  // we can use a ref or just let it swap. To avoid the lint error, we remove the useEffect.

  return (
    <div className="flex flex-col w-full">
      <div
        className="relative overflow-hidden rounded-2xl bg-cornsilk-100 dark:bg-neutral-800 aspect-4/5 w-full cursor-zoom-in group"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        {!imgLoaded && <Skeleton className="absolute inset-0 rounded-2xl" />}

        {displayImage && displayImage !== "/placeholder-image.png" ? (
          <Image
            key={displayImage}
            src={displayImage}
            alt={bouquet.name}
            fill
            onLoad={() => setImgLoaded(true)}
            className={`object-cover transition-all duration-700 ${
              zoomed ? "scale-110" : "scale-100"
            } ${imgLoaded ? "opacity-100" : "opacity-0"}`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="h-16 w-16 text-neutral-300" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

        {/* Zoom hint */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ZoomIn className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-300" />
          <span className="text-[11px] font-inter text-neutral-600 dark:text-neutral-300">
            Hover to zoom
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Product Info ─────────────────────────────────────────────────────────────

function ProductInfo({
  bouquet,
  selectedVariantId,
  setSelectedVariantId,
}: {
  bouquet: Bouquet;
  selectedVariantId: string;
  setSelectedVariantId: (id: string) => void;
}) {
  const variants = bouquet.variants || [];
  const defaultVariant = variants.length > 0 ? variants[0] : null;

  const [quantity, setQuantity] = useState(1);
  const wishlisted = false;
  const { addItem } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || defaultVariant;
  const displayPrice = selectedVariant ? selectedVariant.price : bouquet.price;

  const displayOriginal = bouquet.originalPrice
    ? Math.round(
        bouquet.originalPrice * (selectedVariant ? selectedVariant.price / bouquet.price : 1)
      )
    : undefined;

  const discountPct = displayOriginal ? Math.round((1 - displayPrice / displayOriginal) * 100) : 0;

  async function handleAddToCart() {
    if (isAddingToCart) return;
    setIsAddingToCart(true);
    await addItem(bouquet.id as string, quantity, selectedVariantId || undefined);
    setIsAddingToCart(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {bouquet.isBestseller && (
          <Badge variant="default" id="badge-bestseller">
            Bestseller
          </Badge>
        )}
        {bouquet.isNew && (
          <Badge variant="success" id="badge-new">
            New Arrival
          </Badge>
        )}
        <Badge variant="outline" id="badge-occasion">
          {bouquet.occasion}
        </Badge>
        {discountPct > 0 && (
          <Badge variant="secondary" id="badge-discount">
            {discountPct}% off
          </Badge>
        )}
      </div>

      {/* Name */}
      <div>
        <h1
          className="text-h1 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 leading-tight"
          id="product-name"
        >
          {bouquet.name}
        </h1>

        {/* Rating */}
        <div className="mt-2 flex items-center gap-3">
          <span className="text-b5 font-inter text-neutral-400">
            {bouquet.soldCount.toLocaleString()} sold
          </span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-baseline gap-3">
        <span
          className="text-h3 font-jetbrains font-bold text-neutral-900 dark:text-cornsilk-100"
          id="product-price"
        >
          {formatPrice(displayPrice)}
        </span>
        {displayOriginal && (
          <span className="text-h5 font-inter text-neutral-400 line-through">
            {formatPrice(displayOriginal)}
          </span>
        )}
        {discountPct > 0 && (
          <span className="text-b5 font-inter font-semibold text-olive-700 dark:text-olive-300">
            Save {discountPct}%
          </span>
        )}
      </div>

      {/* Short description */}
      <p className="text-b4 font-inter text-neutral-600 dark:text-neutral-300 leading-relaxed">
        {bouquet.description}
      </p>

      <Separator />

      {/* Flower chips */}
      <div>
        <p className="text-b6 font-inter font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
          Contains
        </p>
        <div className="flex flex-wrap gap-2">
          {bouquet.flowers.map((flower) => (
            <span
              key={flower}
              className="flex items-center gap-1.5 rounded-full border border-cornsilk-400 dark:border-neutral-700 bg-cornsilk-100 dark:bg-neutral-800 px-3 py-1 text-b5 font-inter text-neutral-700 dark:text-neutral-200"
            >
              {flower}
            </span>
          ))}
        </div>
      </div>

      {/* Colors */}
      <div>
        <p className="text-b6 font-inter font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
          Color palette
        </p>
        <div className="flex flex-wrap gap-2">
          {bouquet.colors.map((color) => (
            <span
              key={color}
              className="flex items-center gap-1.5 rounded-full border border-cornsilk-300 dark:border-neutral-700 bg-cornsilk-50 dark:bg-neutral-800 px-2.5 py-1 text-b5 font-inter text-neutral-600 dark:text-neutral-300"
            >
              <span
                className={cn(
                  "h-3 w-3 rounded-full shrink-0",
                  COLOR_DOT[color] ?? "bg-neutral-300"
                )}
              />
              {color}
            </span>
          ))}
        </div>
      </div>

      <Separator />

      {/* Size selector */}
      {variants.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-b6 font-inter font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
              Bouquet size
            </p>
            <span className="text-b6 font-inter text-neutral-400">
              Selected:{" "}
              <strong className="text-neutral-700 dark:text-neutral-200 uppercase">
                {selectedVariant?.name || "Standard"}
              </strong>
            </span>
          </div>
          <div className="flex flex-wrap gap-3" role="group" aria-label="Select bouquet size">
            {variants.map((opt) => (
              <button
                key={opt.id}
                id={`size-${opt.name.replace(/\s+/g, "-")}`}
                onClick={() => setSelectedVariantId(opt.id)}
                aria-pressed={selectedVariantId === opt.id}
                className={`flex-1 min-w-20 flex flex-col items-center gap-1 rounded-xl border-2 py-3 px-2 transition-all duration-200 ${
                  selectedVariantId === opt.id
                    ? "border-blush-500 bg-blush-50 dark:bg-blush-950/30"
                    : "border-cornsilk-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-blush-300"
                }`}
              >
                <span
                  className={`text-b5 font-inter font-semibold uppercase ${selectedVariantId === opt.id ? "text-blush-600 dark:text-blush-400" : "text-neutral-700 dark:text-neutral-200"}`}
                >
                  {opt.name}
                </span>
                <span
                  className={`text-[11px] font-jetbrains ${selectedVariantId === opt.id ? "text-blush-500" : "text-neutral-400"}`}
                >
                  {formatPrice(opt.price)}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity selector */}
      <div>
        <p className="text-b6 font-inter font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500 mb-3">
          Quantity
        </p>
        <div className="flex items-center gap-4">
          <div className="flex items-center rounded-xl border border-cornsilk-300 dark:border-neutral-700 overflow-hidden">
            <button
              id="qty-minus"
              aria-label="Decrease quantity"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="flex h-10 w-10 items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-cornsilk-100 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span
              id="qty-display"
              className="flex h-10 w-12 items-center justify-center text-b4 font-jetbrains font-semibold text-neutral-800 dark:text-cornsilk-100 border-x border-cornsilk-300 dark:border-neutral-700"
            >
              {quantity}
            </span>
            <button
              id="qty-plus"
              aria-label="Increase quantity"
              onClick={() => setQuantity((q) => Math.min(10, q + 1))}
              disabled={quantity >= 10}
              className="flex h-10 w-10 items-center justify-center text-neutral-600 dark:text-neutral-300 hover:bg-cornsilk-100 dark:hover:bg-neutral-800 disabled:opacity-40 transition-colors"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <span className="text-b5 font-inter text-neutral-400">
            Total:{" "}
            <strong className="font-jetbrains text-neutral-700 dark:text-neutral-200">
              {formatPrice(displayPrice * quantity)}
            </strong>
          </span>
        </div>
      </div>

      {/* Add to Cart + Wishlist */}
      <div className="flex gap-3">
        <Button
          id="add-to-cart-detail"
          variant={bouquet.inStock ? "primary" : "outline"}
          size="lg"
          disabled={!bouquet.inStock || isAddingToCart}
          onClick={handleAddToCart}
          className={`flex-1 transition-all duration-300 ${addedToCart ? "bg-olive-500 hover:bg-olive-600" : ""}`}
        >
          {isAddingToCart ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <ShoppingBag className="h-5 w-5" />
          )}
          {!bouquet.inStock
            ? "Sold Out"
            : addedToCart
              ? "Added to Cart ✓"
              : isAddingToCart
                ? "Adding..."
                : "Add to Cart"}
        </Button>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild></TooltipTrigger>
            <TooltipContent>
              {wishlisted ? "Remove from wishlist" : "Save to wishlist"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Stock indicator */}
      {bouquet.inStock ? (
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-olive-500 animate-pulse" />
          <span className="text-b5 font-inter text-olive-700 dark:text-olive-400">
            In stock — ready to arrange today
          </span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-400" />
          <span className="text-b5 font-inter text-neutral-400">Currently out of stock</span>
        </div>
      )}
    </div>
  );
}

// ─── Tabs Section ─────────────────────────────────────────────────────────────

function DetailsTab({ bouquet }: { bouquet: Bouquet }) {
  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Long description */}
      <div>
        <h3 className="text-h5 font-fraunces font-semibold text-neutral-800 dark:text-cornsilk-100 mb-3">
          About this arrangement
        </h3>
        <p className="text-b5 font-inter text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {bouquet.description} Each bouquet is hand-arranged by our skilled florists on the day of
          delivery to ensure maximum freshness. We source only the finest seasonal blooms from
          trusted local and international growers committed to sustainable practices. Every stem is
          inspected for quality before being artfully composed into this signature arrangement. The
          result is a living artwork that brings joy, fragrance, and a touch of nature&apos;s beauty
          to any space.
        </p>
      </div>
    </div>
  );
}

function DeliveryTab() {
  return (
    <div className="flex flex-col gap-6 pt-4">
      {/* Delivery options */}
      <div>
        <h3 className="text-h5 font-fraunces font-semibold text-neutral-800 dark:text-cornsilk-100 mb-4">
          Delivery options
        </h3>
        <div className="flex flex-col gap-3">
          {[
            {
              icon: <Truck className="h-5 w-5" />,
              title: "Standard Delivery",
              desc: "Delivered within 2–3 business days",
              price: "Rp 25.000",
              free: "Free over Rp 500k",
              id: "delivery-standard",
            },
            {
              icon: <Clock className="h-5 w-5" />,
              title: "Same-Day Delivery",
              desc: "Order before 2 pm for delivery today",
              price: "Rp 50.000",
              free: null,
              id: "delivery-sameday",
            },
            {
              icon: <MapPin className="h-5 w-5" />,
              title: "Express Delivery",
              desc: "Next-morning delivery guaranteed",
              price: "Rp 75.000",
              free: null,
              id: "delivery-express",
            },
          ].map((opt) => (
            <div
              key={opt.id}
              id={opt.id}
              className="flex items-start gap-4 rounded-xl border border-cornsilk-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-4"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blush-100 dark:bg-blush-950/40 text-blush-600 dark:text-blush-400">
                {opt.icon}
              </span>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-b4 font-inter font-semibold text-neutral-800 dark:text-neutral-200">
                    {opt.title}
                  </p>
                  <span className="text-b5 font-jetbrains font-semibold text-neutral-700 dark:text-neutral-200">
                    {opt.price}
                  </span>
                </div>
                <p className="text-b5 font-inter text-neutral-500 dark:text-neutral-400 mt-0.5">
                  {opt.desc}
                </p>
                {opt.free && (
                  <p className="text-b6 font-inter text-olive-600 dark:text-olive-400 mt-1">
                    🌿 {opt.free}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Returns */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <RotateCcw className="h-5 w-5 text-blush-500" />
          <h3 className="text-h5 font-fraunces font-semibold text-neutral-800 dark:text-cornsilk-100">
            Returns & Freshness Guarantee
          </h3>
        </div>
        <p className="text-b4 font-inter text-neutral-600 dark:text-neutral-300 leading-relaxed">
          We stand behind every bouquet we send. If your flowers arrive damaged, wilted, or not as
          described, please contact us within 24 hours of delivery with a photo. We will arrange a
          complimentary replacement or issue a full refund — no questions asked. Our mission is to
          bring joy, and we will make it right every time.
        </p>
      </div>

      {/* Package info */}
      <div className="flex items-start gap-4 rounded-xl bg-cornsilk-50 dark:bg-neutral-800/50 border border-cornsilk-200 dark:border-neutral-700 p-4">
        <Package className="h-5 w-5 text-camel-600 dark:text-camel-400 mt-0.5 shrink-0" />
        <div>
          <p className="text-b4 font-inter font-semibold text-neutral-700 dark:text-neutral-200">
            Eco-conscious packaging
          </p>
          <p className="text-b5 font-inter text-neutral-500 dark:text-neutral-400 mt-1">
            All our bouquets are wrapped in recycled paper and biodegradable ribbon. We never use
            plastic foam or non-recyclable fillers.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Related Products ─────────────────────────────────────────────────────────

function RelatedProducts({ bouquet, allBouquets }: { bouquet: Bouquet; allBouquets: Bouquet[] }) {
  const related = allBouquets
    .filter(
      (b) =>
        b.id !== bouquet.id &&
        (b.occasion === bouquet.occasion || b.flowers.some((f) => bouquet.flowers.includes(f)))
    )
    .slice(0, 4);

  if (related.length === 0) return null;

  return (
    <section id="related-products" className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-h3 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          You might also love
        </h2>
        <Link
          href="/shop"
          className="text-b5 font-inter text-blush-500 hover:text-blush-600 transition-colors hover:underline underline-offset-4"
        >
          View all
        </Link>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory -mx-2 px-2">
        {related.map((b) => (
          <ProductCard key={b.id} product={b} className="w-72 shrink-0 snap-start" />
        ))}
      </div>
    </section>
  );
}

// ─── Main Module ──────────────────────────────────────────────────────────────

export function ProductDetailModule({
  bouquet,
  relatedBouquets = [],
}: {
  bouquet: Bouquet;
  relatedBouquets?: Bouquet[];
}) {
  const variants = bouquet.variants || [];
  const defaultVariant = variants.length > 0 ? variants[0] : null;

  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    defaultVariant ? defaultVariant.id : ""
  );

  const selectedVariant = variants.find((v) => v.id === selectedVariantId) || defaultVariant;

  return (
    <TooltipProvider>
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        {/* Hero gradient */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-linear-to-b from-cornsilk-100/60 to-transparent dark:from-neutral-900/60 dark:to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Breadcrumb
            className="mb-8"
            items={[{ label: "Shop", href: "/shop" }, { label: bouquet.name }]}
          />

          {/* 2-column product section */}
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            {/* Left — Gallery */}
            <div className="w-full lg:w-[55%]">
              <ImageGallery bouquet={bouquet} selectedImage={selectedVariant?.imageUrl} />
            </div>

            {/* Right — Info */}
            <div className="w-full lg:w-[45%]">
              <ProductInfo
                bouquet={bouquet}
                selectedVariantId={selectedVariantId}
                setSelectedVariantId={setSelectedVariantId}
              />
            </div>
          </div>

          {/* Tabs */}
          {/* Details */}
          <section id="product-details" className="mt-16">
            <div className="w-full">
              <DetailsTab bouquet={bouquet} />
            </div>
          </section>

          {/* Related products */}
          <RelatedProducts bouquet={bouquet} allBouquets={relatedBouquets} />
        </div>
      </main>
    </TooltipProvider>
  );
}
