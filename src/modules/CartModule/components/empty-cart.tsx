import { Flower2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      {/* Decorative blobs */}
      <div className="relative mb-8">
        <div className="absolute -inset-6 rounded-full bg-blush-100/60 dark:bg-blush-900/20 blur-2xl" />
        <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blush-100 to-cornsilk-200 dark:from-neutral-800 dark:to-neutral-700 border border-blush-200 dark:border-neutral-600 shadow-inner">
          <Flower2 className="h-12 w-12 text-blush-500 dark:text-blush-400" />
        </div>
      </div>

      <h2 className="text-h2 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
        Your cart is blooming empty
      </h2>
      <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400 mt-3 max-w-sm leading-relaxed">
        Looks like you haven&apos;t added any beautiful bouquets yet. Discover our fresh collection and find the perfect arrangement.
      </p>

      <Button
        asChild
        variant="primary"
        size="lg"
        className="mt-8 rounded-full px-8 shadow-md shadow-blush-200/50 dark:shadow-black/30"
      >
        <Link href="/shop" className="flex items-center gap-2">
          Explore Bouquets
          <ArrowRight className="h-4 w-4" />
        </Link>
      </Button>

      {/* Quick suggestion chips */}
      <div className="mt-6 flex flex-wrap justify-center gap-2">
        {["Roses", "Wedding", "Birthday", "Lavender"].map((s) => (
          <Link
            key={s}
            href={`/shop`}
            className="text-b6 font-inter rounded-full border border-cornsilk-300 bg-white px-3 py-1.5 text-neutral-600 hover:border-blush-300 hover:bg-blush-50 hover:text-blush-700 transition-all dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:border-blush-700 dark:hover:bg-blush-900/20 dark:hover:text-blush-300"
          >
            {s}
          </Link>
        ))}
      </div>
    </div>
  );
}
