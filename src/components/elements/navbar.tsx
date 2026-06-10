import * as React from "react"
import Link from "next/link"
import { Menu, Search, ShoppingBag, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ThemeToggle } from "./theme-toggle"

const navLinks = [
  { name: "Shop", href: "/shop" },
  { name: "Subscriptions", href: "/subscriptions" },
  { name: "Occasions", href: "/occasions" },
  { name: "Journal", href: "/journal" },
]

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-cornsilk-300 dark:border-neutral-800 bg-cornsilk-100/80 dark:bg-neutral-950/80 backdrop-blur-md">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu */}
        <div className="flex md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-75 sm:w-100">
              <SheetHeader>
                <SheetTitle className="text-left font-fraunces text-h4 text-neutral-900 dark:text-cornsilk-100">
                  Fiorisce
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-h5 font-fraunces text-neutral-800 dark:text-neutral-200 transition-colors hover:text-blush-600 dark:hover:text-blush-400"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Logo */}
        <div className="flex flex-1 justify-center md:justify-start">
          <Link href="/" className="flex items-center gap-2">
            <span className="font-fraunces text-h4 font-bold text-blush-800 dark:text-blush-400 tracking-tight">
              Fiorisce
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-b4 font-inter font-medium text-neutral-700 dark:text-neutral-300 transition-colors hover:text-blush-600 dark:hover:text-blush-400"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          <ThemeToggle/>
          <Button variant="ghost" size="icon" aria-label="Search">
            <Search className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Account" className="hidden sm:inline-flex">
            <User className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
          </Button>
          <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
            <ShoppingBag className="h-5 w-5 text-neutral-700 dark:text-neutral-300" />
            <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-blush-500 text-[10px] font-bold text-cornsilk-100">
              3
            </span>
          </Button>
        </div>
      </div>
    </header>
  )
}
