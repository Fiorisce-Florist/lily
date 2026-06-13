"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const products = [
  // 3 Fresh Flowers
  { id: "ff1", name: "Joyful Affection (L)", price: "RP 495.000", image: "/images/landing/ff_joyful_affection.png", slug: "joyful-affection-l" },
  { id: "ff2", name: "Sweet Promise (M)", price: "RP 265.000", image: "/images/landing/ff_sweet_promises.png", slug: "sweet-promise-m" },
  { id: "ff3", name: "Pure Love (L)", price: "RP 365.000", image: "/images/landing/ff_pure_love.png", slug: "pure-love-l" },
  // 2 Artificial Flowers
  { id: "af1", name: "Cotton Pearl (XL)", price: "RP 515.000", image: "/images/landing/af_cotton_pearl.png", slug: "cotton-pearl-xl" },
  { id: "af2", name: "Enchanted (L)", price: "RP 405.000", image: "/images/landing/af_enchanted.png", slug: "enchanted-l" },
  // 2 Papan Bunga
  { id: "pb1", name: "Bunga 2 Titik", price: "RP 1.500.000", image: "/images/landing/pb_bunga-2-titik.png", slug: "bunga-2-titik" },
  { id: "pb2", name: "Bunga 2 Titik, 2 Kuping", price: "RP 2.000.000", image: "/images/landing/pb_2-titik-2-kuping.png", slug: "bunga-2-titik-2-kuping" },
];

export function FeaturedSection() {
  return (
    <section className="bg-camel-100 dark:bg-neutral-900 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <h2 className="font-fraunces text-h2 text-neutral-900 dark:text-cornsilk-100 mb-4 font-bold">
              Best Sellers
            </h2>
            <p className="font-inter text-b4 text-neutral-600 dark:text-neutral-400">
              Our most loved arrangements, handcrafted with care.
            </p>
          </div>
          <Link
            href="/shop"
            className="font-inter text-b4 text-blush-600 hover:text-blush-700 dark:text-blush-400 hidden font-medium transition-colors md:inline-flex focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 rounded-sm"
          >
            View All
          </Link>
        </div>

        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 basis-1/2 lg:basis-1/4">
                <Card className="bg-cornsilk-100 dark:bg-neutral-800 group h-full overflow-hidden border-none shadow-sm">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Link
                      href={`/shop/products/${product.slug}`}
                      className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 block h-full"
                    >
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </Link>
                    <div className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100">
                      <Button
                        size="icon"
                        className="bg-blush-500 hover:bg-blush-600 text-cornsilk-100 h-10 w-10 rounded-full shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 focus-visible:ring-offset-2"
                      >
                        <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                        <span className="sr-only">Add {product.name} to cart</span>
                      </Button>
                    </div>
                  </div>
                  <CardContent className="p-4 sm:p-5">
                    <Link href={`/shop/products/${product.slug}`}>
                      <h3 className="font-fraunces text-b4 text-neutral-900 dark:text-cornsilk-100 group-hover:text-blush-600 mb-1 font-semibold transition-colors">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="font-inter text-b5 text-olive-700 dark:text-olive-400 font-medium">
                      {product.price}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="mt-8 flex justify-end gap-2 md:hidden">
            <CarouselPrevious className="static translate-y-0" />
            <CarouselNext className="static translate-y-0" />
          </div>
          <div className="hidden md:block">
            <CarouselPrevious className="bg-cornsilk-100 dark:bg-neutral-800 -left-4 lg:-left-12" />
            <CarouselNext className="bg-cornsilk-100 dark:bg-neutral-800 -right-4 lg:-right-12" />
          </div>
        </Carousel>

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/shop"
            className="font-inter text-b4 text-blush-600 hover:text-blush-700 inline-block font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 rounded-sm"
          >
            View All Best Sellers
          </Link>
        </div>
      </div>
    </section>
  );
}
