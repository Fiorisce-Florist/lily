"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { FOOTER_MENU } from "./const";

export function Footer() {
  const pathname = usePathname();
  
  const hiddenRoutes = ["/admin", "/login", "/register"];
  if (pathname && hiddenRoutes.some(route => pathname.startsWith(route))) return null;

  return (
    <footer className="text-cornsilk-100 bg-olive-900">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand & Newsletter */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/">
              <span className="font-fraunces text-h3 text-cornsilk-100 font-bold tracking-tight">
                Fiorisce
              </span>
            </Link>
            <p className="text-b4 font-inter max-w-xs leading-relaxed text-olive-200">
              Bringing the beauty of nature into your everyday life with carefully curated,
              sustainable floral arrangements.
            </p>
            <div className="space-y-4">
              <h3 className="text-b5 font-inter text-cornsilk-200 font-semibold tracking-wider uppercase">
                Subscribe to our newsletter
              </h3>
              <form className="flex max-w-sm gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="text-cornsilk-100 focus-visible:ring-cornsilk-200 dark:border-olive-700 border-olive-700 bg-olive-800 dark:bg-olive-800 placeholder:text-olive-400"
                  required
                />
                <Button
                  type="submit"
                  variant="secondary"
                  className="bg-cornsilk-200 hover:bg-cornsilk-300 text-olive-900"
                >
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-3 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-b4 font-fraunces text-cornsilk-100 font-semibold">Shop</h3>
              <ul className="mt-6 space-y-4">
                {FOOTER_MENU.shop.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-b5 font-inter hover:text-cornsilk-100 text-olive-300 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-b4 font-fraunces text-cornsilk-100 font-semibold">Support</h3>
              <ul className="mt-6 space-y-4">
                {FOOTER_MENU.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-b5 font-inter hover:text-cornsilk-100 text-olive-300 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12 md:mt-0">
              <h3 className="text-b4 font-fraunces text-cornsilk-100 font-semibold">Company</h3>
              <ul className="mt-6 space-y-4">
                {FOOTER_MENU.company.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-b5 font-inter hover:text-cornsilk-100 text-olive-300 transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="mt-12 mb-8 bg-olive-700 dark:bg-olive-700" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-b5 font-inter text-olive-400">
            &copy; {new Date().getFullYear()} Fiorisce Florist. All rights reserved.
          </p>
          <div className="flex gap-6">
            {FOOTER_MENU.social.map((social) => (
              <Link
                key={`${social.name}-${social.href}`}
                href={social.href}
                target="blank"
                className="text-b5 font-inter hover:text-cornsilk-100 text-olive-400 transition-colors"
              >
                {social.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
