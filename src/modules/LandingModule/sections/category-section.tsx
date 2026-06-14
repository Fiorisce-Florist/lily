import * as React from "react";
import Image from "next/image";
import Link from "next/link";

const categories = [
  { name: "Fresh Flowers", slug: "fresh-flowers", image: "/images/landing/cat-bouquet.png" },
  { name: "Artificial Flowers", slug: "artificial-flowers", image: "/images/landing/cat-flower-box-2.png" },
  { name: "Papan Bunga", slug: "papan-bunga", image: "/images/landing/cat-standing-flower-2.png" },
];

export function CategorySection() {
  return (
    <section id="explore-collection" className="bg-cornsilk-100 dark:bg-neutral-950 py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="font-fraunces text-h2 text-neutral-900 dark:text-cornsilk-100 mb-4 font-bold">
            Explore Our Collections
          </h2>
          <p className="font-inter text-b4 text-neutral-600 dark:text-neutral-400 mx-auto max-w-2xl">
            From elegant fresh arrangements to lasting artificial blooms and grand papan bunga, find the perfect floral expression for any moment.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:gap-8">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/shop?category=${category.slug}`}
              className="group relative block aspect-[4/5] md:aspect-square overflow-hidden rounded-xl"
            >
              <div className="absolute inset-0 z-10 bg-neutral-900/20 transition-colors duration-300 group-hover:bg-neutral-900/40" />
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
                <h3 className="font-fraunces text-h4 text-cornsilk-100 bg-neutral-900/40 w-full rounded-lg py-3 text-center font-semibold drop-shadow-md backdrop-blur-sm transition-all duration-300 group-hover:bg-neutral-900/60">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
