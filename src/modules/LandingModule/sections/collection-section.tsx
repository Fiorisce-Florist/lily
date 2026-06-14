import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: string;
  image: string;
  slug: string;
}

interface CollectionSectionProps {
  title: string;
  href: string;
  products: Product[];
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
  imageFit = "cover",
}: CollectionSectionProps) {
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
              href={`/shop/products/${product.slug}`}
              className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 focus-visible:ring-offset-2 rounded-lg"
            >
              <div className="bg-cornsilk-300 dark:bg-neutral-800 relative mb-4 aspect-3/4 overflow-hidden rounded-lg">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className={cn(
                    "transition-transform duration-700 group-hover:scale-105",
                    imageFit === "contain" ? "object-contain p-4" : "object-cover"
                  )}
                />
              </div>
              <div className="space-y-1 text-left">
                <h3 className="font-fraunces text-b5 sm:text-b4 text-neutral-900 dark:text-cornsilk-100 group-hover:text-blush-600 font-semibold uppercase tracking-wider transition-colors">
                  {product.name}
                </h3>
                <p className="font-inter text-b5 text-neutral-500 dark:text-neutral-400">
                  {product.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Button
            variant="outline"
            size="lg"
            className="border-neutral-900 text-neutral-900 hover:bg-neutral-900 hover:text-cornsilk-100 dark:border-cornsilk-100 dark:text-cornsilk-100 dark:hover:bg-cornsilk-100 dark:hover:text-neutral-900 transition-colors uppercase tracking-widest px-8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 focus-visible:ring-offset-2"
            asChild
          >
            <Link href={href}>View All Product</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
