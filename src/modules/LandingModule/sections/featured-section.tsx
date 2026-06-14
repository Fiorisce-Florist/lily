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
import { Button } from "@/components/ui/button";

const products = [
  // 3 Fresh Flowers
  {
    id: "ff1",
    name: "Joyful Affection (L)",
    price: "RP 495.000",
    image: "/images/landing/ff_joyful_affection.png",
    slug: "joyful-affection-l",
  },
  {
    id: "ff2",
    name: "Sweet Promise (M)",
    price: "RP 265.000",
    image: "/images/landing/ff_sweet_promises.png",
    slug: "sweet-promise-m",
  },
  {
    id: "ff3",
    name: "Pure Love (L)",
    price: "RP 365.000",
    image: "/images/landing/ff_pure_love.png",
    slug: "pure-love-l",
  },
  // 2 Artificial Flowers
  {
    id: "af1",
    name: "Cotton Pearl (XL)",
    price: "RP 515.000",
    image: "/images/landing/af_cotton_pearl.png",
    slug: "cotton-pearl-xl",
  },
  {
    id: "af2",
    name: "Enchanted (L)",
    price: "RP 405.000",
    image: "/images/landing/af_enchanted.png",
    slug: "enchanted-l",
  },
  // 2 Papan Bunga
  {
    id: "pb1",
    name: "Bunga 2 Titik",
    price: "RP 1.500.000",
    image: "/images/landing/pb_bunga-2-titik.png",
    slug: "bunga-2-titik",
  },
  {
    id: "pb2",
    name: "Bunga 2 Titik, 2 Kuping",
    price: "RP 2.000.000",
    image: "/images/landing/pb_2-titik-2-kuping.png",
    slug: "bunga-2-titik-2-kuping",
  },
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
                <Link
                  href={`/shop/products/${product.slug}`}
                  className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 focus-visible:ring-offset-2 rounded-lg"
                >
                  <div className="bg-cornsilk-300 dark:bg-neutral-800 relative mb-4 aspect-3/4 overflow-hidden rounded-lg">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <h3 className="font-fraunces text-b5 sm:text-b4 text-neutral-900 dark:text-cornsilk-100 group-hover:text-blush-600 font-semibold uppercase tracking-wider transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="font-inter text-b5 text-neutral-500 dark:text-neutral-400">
                      {product.price}
                    </p>
                  </div>
                </Link>
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
