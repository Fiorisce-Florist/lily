import * as React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function CtaSection() {
  return (
    <section className="bg-blush-100 dark:bg-blush-1000 relative overflow-hidden py-24">
      {/* Decorative floral accent */}
      <div className="absolute -left-24 top-0 z-0 h-64 w-64 opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen pointer-events-none">
        <Image
          src="/images/landing/cta-floral-accent.png"
          alt="Floral decorative accent"
          fill
          className="object-contain"
        />
      </div>
      <div className="absolute -right-24 bottom-0 z-0 h-64 w-64 opacity-20 dark:opacity-10 mix-blend-multiply dark:mix-blend-screen pointer-events-none rotate-180">
        <Image
          src="/images/landing/cta-floral-accent.png"
          alt="Floral decorative accent"
          fill
          className="object-contain"
        />
      </div>

      <div className="container relative z-10 mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cornsilk-100/50 dark:bg-neutral-900/80 border-cornsilk-300 dark:border-neutral-800 mx-auto max-w-4xl rounded-3xl border p-8 text-center shadow-sm backdrop-blur-md sm:p-12">
          <h2 className="font-fraunces text-h2 text-neutral-900 dark:text-cornsilk-100 mb-4 font-bold">
            Stay in Bloom
          </h2>
          <p className="font-inter text-b4 text-neutral-600 dark:text-neutral-400 mx-auto mb-8 max-w-xl">
            Join our newsletter to receive updates on new collections, exclusive offers, and floral
            care tips straight to your inbox.
          </p>

          <form className="mx-auto flex w-full max-w-md flex-col gap-3 sm:flex-row">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="bg-cornsilk-100 dark:bg-neutral-950 flex-1 focus-visible:ring-2 focus-visible:ring-blush-500 focus-visible:outline-none"
              required
              aria-label="Email address"
            />
            <Button
              type="submit"
              className="bg-blush-500 hover:bg-blush-600 text-cornsilk-100 w-full sm:w-auto focus-visible:ring-2 focus-visible:ring-blush-500 focus-visible:ring-offset-2 focus-visible:outline-none"
            >
              Subscribe
            </Button>
          </form>

          <p className="font-inter text-b5 text-neutral-500 dark:text-neutral-500 mt-4">
            By subscribing, you agree to our Terms &amp; Conditions and Privacy Policy.
          </p>
        </div>
      </div>
    </section>
  );
}
