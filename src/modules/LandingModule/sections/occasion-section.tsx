import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const occasions = [
  { name: "Birthday", slug: "birthday", image: "/images/landing/occasion-birthday-v3.png", colSpan: "col-span-12 md:col-span-6 lg:col-span-4", rowSpan: "row-span-2" },
  { name: "Anniversary", slug: "anniversary", image: "/images/landing/occasion-anniversary-new.png", colSpan: "col-span-12 md:col-span-6 lg:col-span-4", rowSpan: "row-span-1" },
  { name: "Congratulations", slug: "congratulations", image: "/images/landing/occasion-congrats-new.png", colSpan: "col-span-6 md:col-span-6 lg:col-span-4", rowSpan: "row-span-1" },
  { name: "Sympathy", slug: "sympathy", image: "/images/landing/occasion-sympathy-new.png", colSpan: "col-span-6 md:col-span-6 lg:col-span-4", rowSpan: "row-span-1" },
  { name: "Wedding", slug: "wedding", image: "/images/landing/occasion-wedding-new.png", colSpan: "col-span-12 md:col-span-6 lg:col-span-4", rowSpan: "row-span-2" },
  { name: "Grand Opening", slug: "grand-opening", image: "/images/landing/occasion-grand-opening-new.png", colSpan: "col-span-12 lg:col-span-4", rowSpan: "row-span-1" },
];

export function OccasionSection() {
  return (
    <section className="bg-camel-100 dark:bg-neutral-900 py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="font-fraunces text-h2 text-neutral-900 dark:text-cornsilk-100 mb-4 font-bold">
            For Every Moment
          </h2>
          <p className="font-inter text-b4 text-neutral-600 dark:text-neutral-400 mx-auto max-w-2xl">
            Whether it&apos;s a celebration, a milestone, or a gesture of comfort, we have the perfect floral arrangement to express your feelings.
          </p>
        </div>

        <div className="grid grid-cols-12 auto-rows-[220px] gap-4 sm:gap-6">
          {occasions.map((occasion) => (
            <Link
              key={occasion.slug}
              href={`/shop?occasion=${occasion.slug}`}
              className={cn(
                "group relative overflow-hidden rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 focus-visible:ring-offset-2",
                occasion.colSpan,
                occasion.rowSpan
              )}
            >
              <div className="absolute inset-0 z-10 bg-neutral-900/30 transition-colors duration-300 group-hover:bg-neutral-900/50" />
              <Image
                src={occasion.image}
                alt={occasion.name}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                <h3 className="font-fraunces text-h4 text-cornsilk-100 border-cornsilk-100/50 border-2 px-6 py-3 font-semibold tracking-wide uppercase backdrop-blur-sm transition-all duration-300 group-hover:border-cornsilk-100 group-hover:bg-cornsilk-100/10 rounded-lg text-center">
                  {occasion.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
