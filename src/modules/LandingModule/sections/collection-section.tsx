import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Package } from "lucide-react";
import type { LandingProduct } from "@/app/actions/landing";

interface CollectionSectionProps {
  title: string;
  href: string;
  products: LandingProduct[];
  variant?: "light" | "warm" | "muted";
  imageFit?: "cover" | "contain";
}

const bgVariants = {
  light: "bg-cornsilk-100 dark:bg-neutral-1000",
  warm: "bg-camel-100 dark:bg-neutral-900",
  muted: "bg-cornsilk-200 dark:bg-neutral-1000",
};

export function CollectionSection({
  title,
  href,
  products,
  variant = "light",
  imageFit = "contain",
}: CollectionSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className={cn("py-20", bgVariants[variant])}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header with decorative lines */}
        <div className="mb-12 flex items-center justify-center gap-6">
          <div className="h-px w-16 bg-camel-400 hidden sm:block" />
          <h2 className="font-fraunces text-h3 text-neutral-900 dark:text-cornsilk-100 uppercase tracking-widest font-medium text-center">
            {title}
          </h2>
          <div className="h-px w-16 bg-camel-400 hidden sm:block" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4 lg:gap-8 mb-12">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/shop/${product.slug}`}
              className="group block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-500 focus-visible:ring-offset-2 rounded-lg"
            >
              <div className=" relative mb-4 aspect-3/4 overflow-hidden rounded-lg">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 50vw, 25vw"
                    className={cn(
                      "transition-transform duration-700 group-hover:scale-105",
                      imageFit === "contain" ? "object-contain" : "object-cover"
                    )}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-10 w-10 text-neutral-400" />
                  </div>
                )}
              </div>
              <div className="space-y-1 text-center">
                <h3 className="font-fraunces text-b5 sm:text-b4 text-neutral-900 dark:text-cornsilk-100 group-hover:text-blush-600 font-semibold uppercase tracking-wider transition-colors line-clamp-2">
                  {product.name}
                </h3>
                <p className="font-inter text-b5 text-neutral-500 dark:text-neutral-400">
                  {product.formattedPrice}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button variant="outline" size="lg" className="uppercase tracking-widest px-8  " asChild>
            <Link href={href}>View All Product</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
