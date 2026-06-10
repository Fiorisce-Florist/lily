import * as React from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  shop: [
    { name: "All Flowers", href: "#" },
    { name: "Subscriptions", href: "#" },
    { name: "Gift Cards", href: "#" },
    { name: "Vases & Pots", href: "#" },
  ],
  support: [
    { name: "FAQ", href: "#" },
    { name: "Shipping & Returns", href: "#" },
    { name: "Care Guide", href: "#" },
    { name: "Contact Us", href: "#" },
  ],
  company: [
    { name: "Our Story", href: "#" },
    { name: "Journal", href: "#" },
    { name: "Sustainability", href: "#" },
    { name: "Careers", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer className="bg-olive-900 text-cornsilk-100">
      <div className="container mx-auto px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Brand & Newsletter */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/">
              <span className="font-fraunces text-h3 font-bold tracking-tight text-cornsilk-100">
                Fiorisce
              </span>
            </Link>
            <p className="text-b4 font-inter text-olive-200 leading-relaxed max-w-xs">
              Bringing the beauty of nature into your everyday life with carefully curated, sustainable floral arrangements.
            </p>
            <div className="space-y-4">
              <h3 className="text-b5 font-inter font-semibold tracking-wider uppercase text-cornsilk-200">
                Subscribe to our newsletter
              </h3>
              <form className="flex max-w-sm gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-olive-800 border-olive-700 text-cornsilk-100 placeholder:text-olive-400 focus-visible:ring-cornsilk-200"
                  required
                />
                <Button type="submit" variant="secondary" className="bg-cornsilk-200 text-olive-900 hover:bg-cornsilk-300">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          {/* Links Grid */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0 md:grid-cols-3">
            <div>
              <h3 className="text-b4 font-fraunces font-semibold text-cornsilk-100">Shop</h3>
              <ul className="mt-6 space-y-4">
                {footerLinks.shop.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-b5 font-inter text-olive-300 hover:text-cornsilk-100 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-b4 font-fraunces font-semibold text-cornsilk-100">Support</h3>
              <ul className="mt-6 space-y-4">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-b5 font-inter text-olive-300 hover:text-cornsilk-100 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-12 md:mt-0">
              <h3 className="text-b4 font-fraunces font-semibold text-cornsilk-100">Company</h3>
              <ul className="mt-6 space-y-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-b5 font-inter text-olive-300 hover:text-cornsilk-100 transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator className="mt-12 mb-8 bg-olive-700" />

        {/* Bottom Section */}
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          <p className="text-b5 font-inter text-olive-400">
            &copy; {new Date().getFullYear()} Fiorisce Florist. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-b5 font-inter text-olive-400 hover:text-cornsilk-100 transition-colors">
              Instagram
            </Link>
            <Link href="#" className="text-b5 font-inter text-olive-400 hover:text-cornsilk-100 transition-colors">
              Facebook
            </Link>
            <Link href="#" className="text-b5 font-inter text-olive-400 hover:text-cornsilk-100 transition-colors">
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
