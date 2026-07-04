"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Package } from "lucide-react";
import type { LandingProduct } from "@/app/actions/landing";

interface FeaturedSectionProps {
  products: LandingProduct[];
}

export function FeaturedSection({ products }: FeaturedSectionProps) {
  // Don't render section if there are no products
  if (products.length === 0) return null;

  return (
    <section className="bg-camel-100 dark:bg-neutral-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Carousel
          opts={{
            align: "start",
            loop: products.length > 4,
          }}
          className="w-full relative group"
        >
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="font-fraunces text-h2 text-neutral-900 dark:text-cornsilk-100 mb-4 font-bold">
                Best Sellers
              </h2>
              <p className="font-inter text-b4 text-neutral-600 dark:text-neutral-400">
                Our most loved arrangements, handcrafted with care.
              </p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <Link
                href="/shop"
                className="font-inter text-b4 text-blush-600 hover:text-blush-700 dark:text-blush-400 font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-500 rounded-sm"
              >
                View All
              </Link>
              <div className="flex gap-2">
                <CarouselPrevious className="static translate-y-0 translate-x-0 bg-white dark:bg-neutral-800 hover:bg-blush-50 dark:hover:bg-neutral-700 hover:text-blush-600 border-cornsilk-200 dark:border-neutral-700" />
                <CarouselNext className="static translate-y-0 translate-x-0 bg-white dark:bg-neutral-800 hover:bg-blush-50 dark:hover:bg-neutral-700 hover:text-blush-600 border-cornsilk-200 dark:border-neutral-700" />
              </div>
            </div>
          </div>

          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 basis-1/2 lg:basis-1/4">
                <Link
                  href={`/shop/${product.slug}`}
                  className="group/card block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-500 focus-visible:ring-offset-2 rounded-lg"
                >
                  <div className=" relative mb-4 aspect-3/4 overflow-hidden rounded-lg">
                    {product.image ? (
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-contain transition-transform duration-700 group-hover/card:scale-105"
                        sizes="(max-width: 640px) 50vw, 25vw"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <Package className="h-10 w-10 text-neutral-400" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1 text-center">
                    <h3 className="font-fraunces text-b5 sm:text-b4 text-neutral-900 dark:text-cornsilk-100 group-hover/card:text-blush-600 font-semibold uppercase tracking-wider transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="font-inter text-b5 text-neutral-500 dark:text-neutral-400">
                      {product.formattedPrice}
                    </p>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>

          <div className="mt-8 flex justify-end gap-2 md:hidden">
            <CarouselPrevious className="static translate-y-0 translate-x-0 bg-white dark:bg-neutral-800 hover:bg-blush-50 border-cornsilk-200 dark:border-neutral-700" />
            <CarouselNext className="static translate-y-0 translate-x-0 bg-white dark:bg-neutral-800 hover:bg-blush-50 border-cornsilk-200 dark:border-neutral-700" />
          </div>
        </Carousel>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/shop"
            className="font-inter text-b4 text-blush-600 hover:text-blush-700 inline-block font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-500 rounded-sm"
          >
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
