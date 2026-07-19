"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/config/use-language";

const occasions = [
  {
    slug: "birthday",
    image: "/images/landing/occasion-birthday-rev.jpeg",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
    rowSpan: "row-span-1 md:row-span-2",
  },
  {
    slug: "anniversary",
    image: "/images/landing/occasion-anniversary-rev.jpeg",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
    rowSpan: "row-span-1",
  },
  {
    slug: "wedding",
    image: "/images/landing/occasion-wedding-rev.jpeg",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
    rowSpan: "row-span-1 md:row-span-2",
  },
  {
    slug: "sympathy",
    image: "/images/landing/occasion-sympathy-rev.jpeg",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-4",
    rowSpan: "row-span-1",
  },
  {
    slug: "congratulations",
    image: "/images/landing/occasion-congrats-rev.jpeg",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-6",
    rowSpan: "row-span-1",
  },
  {
    slug: "grand-opening",
    image: "/images/landing/occasion-grandopening-rev2.jpeg",
    colSpan: "col-span-12 md:col-span-6 lg:col-span-6",
    rowSpan: "row-span-1",
  },
] as const;

export function OccasionSection() {
  const { dictionary } = useLanguage();

  return (
    <section className="bg-camel-100 dark:bg-neutral-900 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-fraunces text-h2 text-neutral-900 dark:text-cornsilk-100 mb-4 font-bold">
            {dictionary.landing.occasions.title}
          </h2>
          <p className="font-inter text-b4 max-md:text-b5 text-neutral-600 dark:text-neutral-400 mx-auto max-w-2xl">
            {dictionary.landing.occasions.description}
          </p>
        </div>

        <div className="grid grid-cols-12 auto-rows-[200px] md:auto-rows-[240px] lg:auto-rows-[280px] gap-4 sm:gap-6">
          {occasions.map((occasion) => (
            <Link
              key={occasion.slug}
              href={`/shop?occasion=${occasion.slug}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-500 focus-visible:ring-offset-2",
                occasion.colSpan,
                occasion.rowSpan
              )}
            >
              <div className="absolute inset-0 z-10 bg-linear-to-t from-neutral-900/90 via-neutral-900/30 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
              <Image
                src={occasion.image}
                alt={dictionary.landing.occasions.items[occasion.slug]}
                fill
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 flex flex-col justify-end p-6 sm:p-8">
                <div className="transform transition-transform duration-500 ease-out group-hover:-translate-y-2">
                  <h3 className="font-fraunces text-2xl sm:text-3xl text-cornsilk-100 font-medium tracking-wide">
                    {dictionary.landing.occasions.items[occasion.slug]}
                  </h3>
                  <div className="mt-3 overflow-hidden">
                    <span className="flex items-center text-sm font-medium text-cornsilk-100/90 transform translate-y-full opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
                      {dictionary.common.shopCollection} <ArrowRight className="ml-2 h-4 w-4" />
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
