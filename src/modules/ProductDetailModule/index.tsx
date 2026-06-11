"use client";

import * as React from "react";
import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Star,
  Truck,
  Calendar,
  Leaf,
  Minus,
  Plus,
  Package,
  RotateCcw,
  Clock,
  MapPin,
  ZoomIn,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import type { Bouquet } from "@/modules/ShopModule/data/bouquets";
import { ALL_BOUQUETS } from "@/modules/ShopModule/data/bouquets";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}

const FLOWER_EMOJI: Record<string, string> = {
  Rose: "🌹",
  Peony: "🌸",
  Lily: "🌷",
  Sunflower: "🌻",
  Daisy: "🌼",
  Lavender: "💜",
  Wildflower: "🌿",
  "Baby's Breath": "🤍",
  Ranunculus: "🏵️",
  Eucalyptus: "🍃",
  "Bird of Paradise": "🦜",
  Protea: "🌺",
  "Sweet Pea": "🌱",
  Cosmos: "✨",
  Foxglove: "🎐",
  Scabiosa: "🔮",
  "Dried Grass": "🌾",
};

function getFlowerEmoji(flower: string) {
  return FLOWER_EMOJI[flower] ?? "🌸";
}

type Size = "small" | "standard" | "grand";
const SIZE_OPTIONS: { key: Size; label: string; multiplier: number }[] = [
  { key: "small", label: "Small", multiplier: 0.8 },
  { key: "standard", label: "Standard", multiplier: 1.0 },
  { key: "grand", label: "Grand", multiplier: 1.4 },
];

// Alternative Unsplash angles for the gallery
function buildGalleryImages(baseUrl: string): string[] {
  // Extract base without query params and build 4 variants
  const alt1 = "https://images.unsplash.com/photo-1519378058457-4c29a0a2efac?w=600&q=80";
  const alt2 = "https://images.unsplash.com/photo-1490750967868-88df5691cc64?w=600&q=80";
  return [baseUrl, baseUrl.replace("w=600", "w=200").replace("w=600", "w=600"), alt1, alt2];
}

// ─── Star Rating ──────────────────────────────────────────────────────────────

function StarRating({ rating, size = 16 }: { rating: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = i <= Math.floor(rating);
        const half = !filled && i - 0.5 <= rating;
        return (
          <Star
            key={i}
            style={{ width: size, height: size }}
            className={
              filled || half
                ? "fill-camel-500 text-camel-500"
                : "text-cornsilk-400 fill-cornsilk-300"
            }
          />
        );
      })}
    </div>
  );
}

// ─── Image Gallery ────────────────────────────────────────────────────────────

function ImageGallery({ bouquet }: { bouquet: Bouquet }) {
  const images = buildGalleryImages(bouquet.image);
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [imgLoaded, setImgLoaded] = React.useState(false);
  const [zoomed, setZoomed] = React.useState(false);

  const prev = () => setActiveIdx((i) => (i - 1 + images.length) % images.length);
  const next = () => setActiveIdx((i) => (i + 1) % images.length);

  // reset loading state on image change
  React.useEffect(() => {
    setImgLoaded(false);
  }, [activeIdx]);

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Main image */}
      <div
        className="relative overflow-hidden rounded-2xl bg-cornsilk-100 dark:bg-neutral-800 aspect-4/5 w-full cursor-zoom-in group"
        onMouseEnter={() => setZoomed(true)}
        onMouseLeave={() => setZoomed(false)}
      >
        {!imgLoaded && <Skeleton className="absolute inset-0 rounded-2xl" />}

        <img
          src={images[activeIdx]}
          alt={`${bouquet.name} — view ${activeIdx + 1}`}
          onLoad={() => setImgLoaded(true)}
          className={`h-full w-full object-cover transition-all duration-700 ${
            zoomed ? "scale-110" : "scale-100"
          } ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-linear-to-t from-black/10 via-transparent to-transparent pointer-events-none" />

        {/* Zoom hint */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm px-2.5 py-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <ZoomIn className="h-3.5 w-3.5 text-neutral-600 dark:text-neutral-300" />
          <span className="text-[11px] font-inter text-neutral-600 dark:text-neutral-300">
            Hover to zoom
          </span>
        </div>

        {/* Prev/Next arrows */}
        <button
          id="gallery-prev"
          onClick={prev}
          aria-label="Previous image"
          className="absolute left-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-md text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          id="gallery-next"
          onClick={next}
          aria-label="Next image"
          className="absolute right-3 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm shadow-md text-neutral-700 dark:text-neutral-200 hover:bg-white dark:hover:bg-neutral-800 transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight className="h-4 w-4" />
        </button>

        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              id={`gallery-dot-${i}`}
              onClick={() => setActiveIdx(i)}
              aria-label={`View image ${i + 1}`}
              className={`rounded-full transition-all duration-300 ${
                i === activeIdx ? "bg-white w-5 h-2" : "bg-white/60 w-2 h-2 hover:bg-white/90"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-2.5">
        {images.map((src, i) => (
          <button
            key={i}
            id={`gallery-thumb-${i}`}
            onClick={() => setActiveIdx(i)}
            aria-label={`Thumbnail ${i + 1}`}
            className={`relative aspect-square overflow-hidden rounded-xl transition-all duration-200 ${
              i === activeIdx
                ? "ring-2 ring-blush-500 ring-offset-2 ring-offset-white dark:ring-offset-neutral-900"
                : "opacity-70 hover:opacity-100"
            }`}
          >
            <img
              src={src}
              alt={`${bouquet.name} thumbnail ${i + 1}`}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Product Info ─────────────────────────────────────────────────────────────

function ProductInfo({ bouquet }: { bouquet: Bouquet }) {
  const [selectedSize, setSelectedSize] = React.useState<Size>("standard");
  const [quantity, setQuantity] = React.useState(1);
  const [wishlisted, setWishlisted] = React.useState(false);
  const [addedToCart, setAddedToCart] = React.useState(false);

  const sizeMultiplier = SIZE_OPTIONS.find((s) => s.key === selectedSize)?.multiplier ?? 1;
  const displayPrice = Math.round(bouquet.price * sizeMultiplier);
  const displayOriginal = bouquet.originalPrice
    ? Math.round(bouquet.originalPrice * sizeMultiplier)
    : undefined;

  const discountPct = displayOriginal ? Math.round((1 - displayPrice / displayOriginal) * 100) : 0;

  function handleAddToCart() {
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
          <StarRating rating={bouquet.rating} size={16} />
          <span className="text-b5 font-inter font-semibold text-neutral-700 dark:text-neutral-200">
            {bouquet.rating}
          </span>
          <span className="text-b5 font-inter text-neutral-400">
            ({bouquet.reviewCount} reviews)
          </span>
          <Separator orientation="vertical" className="h-4" />
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
              <span>{getFlowerEmoji(flower)}</span>
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
              className="rounded-full border border-cornsilk-300 dark:border-neutral-700 bg-cornsilk-50 dark:bg-neutral-800 px-3 py-1 text-b5 font-inter text-neutral-600 dark:text-neutral-300"
            >
              {color}
            </span>
          ))}
        </div>
      </div>

      <Separator />

      {/* Size selector */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-b6 font-inter font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
            Bouquet size
          </p>
          <span className="text-b6 font-inter text-neutral-400">
            Selected:{" "}
            <strong className="text-neutral-700 dark:text-neutral-200">
              {SIZE_OPTIONS.find((s) => s.key === selectedSize)?.label}
            </strong>
          </span>
        </div>
        <div className="flex gap-3" role="group" aria-label="Select bouquet size">
          {SIZE_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              id={`size-${opt.key}`}
              onClick={() => setSelectedSize(opt.key)}
              aria-pressed={selectedSize === opt.key}
              className={`flex-1 flex flex-col items-center gap-1 rounded-xl border-2 py-3 px-2 transition-all duration-200 ${
                selectedSize === opt.key
                  ? "border-blush-500 bg-blush-50 dark:bg-blush-950/30"
                  : "border-cornsilk-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:border-blush-300"
              }`}
            >
              <span
                className={`text-b5 font-inter font-semibold ${selectedSize === opt.key ? "text-blush-600 dark:text-blush-400" : "text-neutral-700 dark:text-neutral-200"}`}
              >
                {opt.label}
              </span>
              <span
                className={`text-[11px] font-jetbrains ${selectedSize === opt.key ? "text-blush-500" : "text-neutral-400"}`}
              >
                {formatPrice(Math.round(bouquet.price * opt.multiplier))}
              </span>
            </button>
          ))}
        </div>
      </div>

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
          disabled={!bouquet.inStock}
          onClick={handleAddToCart}
          className={`flex-1 transition-all duration-300 ${addedToCart ? "bg-olive-500 hover:bg-olive-600" : ""}`}
        >
          <ShoppingBag className="h-5 w-5" />
          {!bouquet.inStock ? "Sold Out" : addedToCart ? "Added to Cart ✓" : "Add to Cart"}
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

      {/* Delivery info strip */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: <Truck className="h-4 w-4" />, text: "Free delivery over Rp 500k" },
          { icon: <Calendar className="h-4 w-4" />, text: "Same-day before 2 pm" },
          { icon: <Leaf className="h-4 w-4" />, text: "Fresh & sustainably sourced" },
        ].map((tile, i) => (
          <div
            key={i}
            id={`delivery-tile-${i}`}
            className="flex flex-col items-center gap-1.5 rounded-xl border border-cornsilk-300 dark:border-neutral-700 bg-cornsilk-50 dark:bg-neutral-800/50 p-3 text-center"
          >
            <span className="text-blush-500 dark:text-blush-400">{tile.icon}</span>
            <span className="text-[11px] font-inter text-neutral-600 dark:text-neutral-300 leading-tight">
              {tile.text}
            </span>
          </div>
        ))}
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

const HARDCODED_REVIEWS = [
  {
    name: "Anindya R.",
    date: "May 2025",
    rating: 5,
    text: "Absolutely stunning arrangement! The flowers arrived fresh and the packaging was beautiful. I ordered this for my anniversary dinner and it made the whole evening magical.",
    initial: "A",
    color: "bg-blush-200 text-blush-700",
  },
  {
    name: "Marcus T.",
    date: "April 2025",
    rating: 5,
    text: "Second time ordering from Fiorisce and they never disappoint. The bouquet lasted over two weeks with proper care. My partner was overjoyed.",
    initial: "M",
    color: "bg-olive-200 text-olive-700",
  },
  {
    name: "Sari W.",
    date: "March 2025",
    rating: 4,
    text: "Lovely flowers, very true to the photos. Delivery was right on time. Took off one star only because the wrapping was slightly damaged, but the flowers themselves were perfect.",
    initial: "S",
    color: "bg-camel-200 text-camel-700",
  },
];

function DetailsTab({ bouquet }: { bouquet: Bouquet }) {
  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Long description */}
      <div>
        <h3 className="text-h5 font-fraunces font-semibold text-neutral-800 dark:text-cornsilk-100 mb-3">
          About this arrangement
        </h3>
        <p className="text-b4 font-inter text-neutral-600 dark:text-neutral-300 leading-relaxed">
          {bouquet.description} Each bouquet is hand-arranged by our skilled florists on the day of
          delivery to ensure maximum freshness. We source only the finest seasonal blooms from
          trusted local and international growers committed to sustainable practices. Every stem is
          inspected for quality before being artfully composed into this signature arrangement. The
          result is a living artwork that brings joy, fragrance, and a touch of nature&apos;s beauty
          to any space.
        </p>
      </div>

      {/* Flower table */}
      <div>
        <h3 className="text-h5 font-fraunces font-semibold text-neutral-800 dark:text-cornsilk-100 mb-3">
          Flower composition
        </h3>
        <div className="overflow-hidden rounded-xl border border-cornsilk-300 dark:border-neutral-700">
          <table className="w-full text-b5 font-inter">
            <thead>
              <tr className="bg-cornsilk-100 dark:bg-neutral-800 border-b border-cornsilk-300 dark:border-neutral-700">
                <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-300">
                  Flower
                </th>
                <th className="px-4 py-3 text-left font-semibold text-neutral-600 dark:text-neutral-300">
                  Type
                </th>
              </tr>
            </thead>
            <tbody>
              {bouquet.flowers.map((flower, i) => (
                <tr
                  key={flower}
                  className={`border-b border-cornsilk-200 dark:border-neutral-800 last:border-0 ${
                    i % 2 === 0
                      ? "bg-white dark:bg-neutral-900"
                      : "bg-cornsilk-50 dark:bg-neutral-800/50"
                  }`}
                >
                  <td className="px-4 py-3 font-medium text-neutral-800 dark:text-neutral-200">
                    <span className="mr-2">{getFlowerEmoji(flower)}</span>
                    {flower}
                  </td>
                  <td className="px-4 py-3 text-neutral-500 dark:text-neutral-400 capitalize">
                    {flower.includes("Grass") || flower.includes("Eucalyptus")
                      ? "Foliage / filler"
                      : "Feature bloom"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Care instructions */}
      <div>
        <h3 className="text-h5 font-fraunces font-semibold text-neutral-800 dark:text-cornsilk-100 mb-3">
          Care instructions
        </h3>
        <ul className="flex flex-col gap-3">
          {[
            "Trim 2–3 cm off the stems at a 45° angle immediately upon arrival.",
            "Place in a clean vase with fresh, cool water — change every 2 days.",
            "Keep away from direct sunlight, drafts, and ripening fruit.",
            "Remove any leaves that sit below the waterline to prevent bacterial growth.",
            "Mist delicate petals lightly in warm weather to maintain hydration.",
          ].map((tip, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blush-100 dark:bg-blush-950/40 text-[11px] font-jetbrains font-semibold text-blush-600 dark:text-blush-400">
                {i + 1}
              </span>
              <span className="text-b4 font-inter text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {tip}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ReviewsTab({ bouquet }: { bouquet: Bouquet }) {
  return (
    <div className="flex flex-col gap-8 pt-4">
      {/* Overall rating */}
      <div className="flex items-center gap-8 rounded-2xl border border-cornsilk-300 dark:border-neutral-700 bg-cornsilk-50 dark:bg-neutral-800/50 p-6">
        <div className="flex flex-col items-center gap-1">
          <span className="text-[3rem] font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 leading-none">
            {bouquet.rating}
          </span>
          <StarRating rating={bouquet.rating} size={18} />
          <span className="text-b6 font-inter text-neutral-400 mt-1">
            Based on {bouquet.reviewCount} reviews
          </span>
        </div>
        <Separator orientation="vertical" className="h-20" />
        <div className="flex flex-1 flex-col gap-1.5">
          {[5, 4, 3, 2, 1].map((stars) => {
            const pct = stars === 5 ? 72 : stars === 4 ? 20 : stars === 3 ? 6 : stars === 2 ? 1 : 1;
            return (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-[11px] font-inter text-neutral-400 w-3">{stars}</span>
                <Star className="h-3 w-3 fill-camel-400 text-camel-400" />
                <div className="flex-1 h-1.5 rounded-full bg-cornsilk-200 dark:bg-neutral-700 overflow-hidden">
                  <div className="h-full rounded-full bg-camel-400" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[11px] font-inter text-neutral-400 w-6">{pct}%</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review cards */}
      <div className="flex flex-col gap-4">
        {HARDCODED_REVIEWS.map((review, i) => (
          <article
            key={i}
            id={`review-card-${i}`}
            className="rounded-2xl border border-cornsilk-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 p-5"
          >
            <div className="flex items-start gap-4">
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-b4 font-fraunces font-semibold ${review.color}`}
              >
                {review.initial}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div>
                    <p className="text-b4 font-inter font-semibold text-neutral-800 dark:text-neutral-100">
                      {review.name}
                    </p>
                    <p className="text-b6 font-inter text-neutral-400">{review.date}</p>
                  </div>
                  <StarRating rating={review.rating} size={14} />
                </div>
                <p className="mt-3 text-b4 font-inter text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  {review.text}
                </p>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Write a review */}
      <Button id="write-review-btn" variant="outline" size="md" className="self-start">
        Write a Review
      </Button>
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

function RelatedProducts({ bouquet }: { bouquet: Bouquet }) {
  const related = ALL_BOUQUETS.filter(
    (b) =>
      b.id !== bouquet.id &&
      (b.occasion === bouquet.occasion || b.flowers.some((f) => bouquet.flowers.includes(f)))
  ).slice(0, 4);

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
          View all →
        </Link>
      </div>

      <div className="flex gap-5 overflow-x-auto pb-4 scroll-smooth snap-x snap-mandatory -mx-2 px-2">
        {related.map((b) => (
          <RelatedCard key={b.id} bouquet={b} />
        ))}
      </div>
    </section>
  );
}

function RelatedCard({ bouquet }: { bouquet: Bouquet }) {
  const [imgLoaded, setImgLoaded] = React.useState(false);

  return (
    <article
      id={`related-${bouquet.slug}`}
      className="group relative flex w-56 shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-cornsilk-300 dark:border-neutral-700 bg-white dark:bg-neutral-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
    >
      <Link href={`/shop/${bouquet.slug}`} className="block" tabIndex={-1} aria-hidden="true">
        <div className="relative aspect-square overflow-hidden bg-cornsilk-100 dark:bg-neutral-800">
          {!imgLoaded && <Skeleton className="absolute inset-0 rounded-none" />}
          <img
            src={bouquet.image}
            alt={bouquet.name}
            onLoad={() => setImgLoaded(true)}
            className={`h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${
              imgLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
          {bouquet.isBestseller && (
            <div className="absolute top-2 left-2">
              <Badge variant="default" className="text-[10px] shadow">
                Bestseller
              </Badge>
            </div>
          )}
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-3">
        <Link href={`/shop/${bouquet.slug}`}>
          <h3 className="text-b4 font-fraunces font-semibold text-neutral-800 dark:text-cornsilk-100 hover:text-blush-600 dark:hover:text-blush-400 transition-colors line-clamp-1">
            {bouquet.name}
          </h3>
        </Link>
        <p className="text-b6 font-inter text-neutral-400 mt-0.5 line-clamp-1">
          {bouquet.occasion}
        </p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-b4 font-jetbrains font-semibold text-neutral-800 dark:text-cornsilk-100">
            {formatPrice(bouquet.price)}
          </span>
          <Button
            id={`related-add-${bouquet.slug}`}
            variant="primary"
            size="sm"
            disabled={!bouquet.inStock}
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </article>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export function ProductDetailModule({ bouquet }: { bouquet: Bouquet }) {
  return (
    <TooltipProvider>
      <main className="min-h-screen bg-white dark:bg-neutral-950">
        {/* Hero gradient */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-80 bg-linear-to-b from-cornsilk-100/60 to-transparent dark:from-neutral-900/60 dark:to-transparent" />

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex items-center gap-2 text-b5 font-inter text-neutral-400"
          >
            <Link href="/" className="hover:text-blush-500 transition-colors">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/shop" className="hover:text-blush-500 transition-colors">
              Shop
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-neutral-700 dark:text-neutral-200 font-medium">
              {bouquet.name}
            </span>
          </nav>

          {/* 2-column product section */}
          <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
            {/* Left — Gallery */}
            <div className="w-full lg:w-[55%]">
              <ImageGallery bouquet={bouquet} />
            </div>

            {/* Right — Info */}
            <div className="w-full lg:w-[45%]">
              <ProductInfo bouquet={bouquet} />
            </div>
          </div>

          {/* Tabs */}
          <section id="product-tabs" className="mt-16">
            <Tabs defaultValue="details">
              <TabsList className="w-full justify-start gap-1 h-auto p-1.5">
                <TabsTrigger value="details" id="tab-details" className="px-5 py-2">
                  Details & Care
                </TabsTrigger>
                <TabsTrigger value="reviews" id="tab-reviews" className="px-5 py-2">
                  Reviews ({bouquet.reviewCount})
                </TabsTrigger>
                <TabsTrigger value="delivery" id="tab-delivery" className="px-5 py-2">
                  Delivery & Returns
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details">
                <DetailsTab bouquet={bouquet} />
              </TabsContent>
              <TabsContent value="reviews">
                <ReviewsTab bouquet={bouquet} />
              </TabsContent>
              <TabsContent value="delivery">
                <DeliveryTab />
              </TabsContent>
            </Tabs>
          </section>

          {/* Related products */}
          <RelatedProducts bouquet={bouquet} />
        </div>
      </main>
    </TooltipProvider>
  );
}
