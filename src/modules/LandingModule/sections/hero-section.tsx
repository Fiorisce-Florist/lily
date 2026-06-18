"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const heroImages = [
  "/images/landing/hero-bg-1.png",
  "/images/landing/hero-bg-2.png",
  "/images/landing/hero-bg-3.png",
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative flex h-[80vh] min-h-150 w-full items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0 bg-neutral-900">
        {heroImages.map((src, index) => (
          <Image
            key={src}
            src={src}
            alt={`Hero floral arrangement ${index + 1}`}
            fill
            className={`object-cover transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? "opacity-60" : "opacity-0"
            }`}
            priority={index === 0}
          />
        ))}
        <div className="absolute inset-0 bg-blush-900/40 mix-blend-multiply dark:bg-neutral-1000/70" />
      </div>

      <div className="container relative z-10 mx-auto px-4 text-center sm:px-6 lg:px-8">
        <div className="motion-safe:animate-fade-in mx-auto max-w-3xl space-y-8">
          <h1 className="font-fraunces text-h1 max-md:text-h3 text-cornsilk-100 font-bold tracking-tight">
            Where Every Bloom Tells a Story
          </h1>
          <p className="font-inter text-b3 max-md:text-b5 text-cornsilk-200 mx-auto max-w-xl">
            Discover our premium collection of artisanal floral arrangements, curated to bring
            elegance and joy to your most cherished moments.
          </p>
          <div className="flex flex-col justify-center gap-4 pt-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-blush-500 text-cornsilk-100 hover:bg-blush-600 border-none focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-500 focus-visible:ring-offset-2"
              asChild
            >
              <Link href="/shop">Shop Now</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-cornsilk-300 text-cornsilk-100 hover:bg-cornsilk-100/10 hover:text-cornsilk-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-500 focus-visible:ring-offset-2"
              asChild
            >
              <Link href="#explore-collection">Explore Collections</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
