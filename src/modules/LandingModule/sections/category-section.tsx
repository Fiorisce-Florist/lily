"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguage } from "@/config/use-language";

const categories = [
  { slug: "fresh-flowers", image: "/images/landing/fresh.png" },
  {
    slug: "artificial-flowers",
    image: "/images/landing/artificial.png",
  },
  { slug: "papan-bunga", image: "/images/landing/papan-bunga.png" },
] as const;

export function CategorySection() {
  const { dictionary } = useLanguage();

  return (
    <section id="explore-collection" className="bg-cornsilk-100 dark:bg-neutral-950 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 flex flex-col items-center text-center">
          <p className="font-inter text-[11px] sm:text-xs text-camel-600 dark:text-camel-400 mb-4 font-semibold uppercase tracking-[0.2em]">
            {dictionary.landing.categories.eyebrow}
          </p>
          <h2 className="font-fraunces text-h2 md:text-h1 text-neutral-900 dark:text-cornsilk-100 mb-6 font-bold tracking-tight">
            {dictionary.landing.categories.title}
          </h2>
          <div className="h-px w-24 bg-camel-300 dark:bg-camel-800 mb-6" />
          <p className="font-inter text-b3 max-md:text-b5 text-neutral-600 dark:text-neutral-400 max-w-2xl leading-relaxed">
            {dictionary.landing.categories.description}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group relative block aspect-3/4 overflow-hidden rounded-2xl shadow-lg transition-shadow duration-500 hover:shadow-2xl dark:shadow-none"
            >
              {/* Image */}
              <Image
                src={category.image}
                alt={dictionary.landing.categories.items[category.slug]}
                fill
                className="object-cover transition-transform duration-1000 ease-[cubic-bezier(0.25,0.1,0.25,1)] group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />

              {/* Gradient Overlay for Text Readability */}
              <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-black/20 to-black/5 opacity-80 transition-opacity duration-500 group-hover:opacity-90" />

              {/* Inner delicate frame */}
              <div className="absolute inset-4 z-20 pointer-events-none rounded-xl border border-white/20 transition-all duration-500 group-hover:inset-3 group-hover:border-white/40" />

              {/* Content */}
              <div className="absolute inset-0 z-30 flex flex-col items-center justify-end p-8 text-center pb-12">
                <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
                  <h3 className="font-fraunces text-3xl sm:text-4xl text-white font-semibold tracking-wide drop-shadow-md">
                    {dictionary.landing.categories.items[category.slug]}
                  </h3>

                  <div className="mt-4 overflow-hidden h-6 flex justify-center">
                    <span className="font-inter inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-camel-300 opacity-0 transform translate-y-full transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      {dictionary.common.viewCollection}{" "}
                      <span aria-hidden="true" className="text-sm">
                        &rarr;
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
