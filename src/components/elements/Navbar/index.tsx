import * as React from "react";
import Link from "next/link";
import { Menu, ShoppingBag, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ThemeToggle } from "../theme-toggle";
import { NAV_MENU } from "./const";

export function Navbar() {
  return (
    <header className="border-cornsilk-300 bg-cornsilk-100/80 sticky top-0 z-50 w-full border-b backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
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
                <SheetTitle className="font-fraunces text-h4 dark:text-cornsilk-100 text-left text-neutral-900">
                  Fiorisce
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-8">
                {NAV_MENU.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-h5 font-fraunces hover:text-blush-600 dark:hover:text-blush-400 text-neutral-800 transition-colors dark:text-neutral-200"
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
            <span className="font-fraunces text-h4 text-blush-800 dark:text-blush-400 font-bold tracking-tight">
              Fiorisce
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden flex-1 items-center justify-center gap-8 md:flex">
          {NAV_MENU.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-b4 font-inter hover:text-blush-600 dark:hover:text-blush-400 font-medium text-neutral-700 transition-colors dark:text-neutral-300"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            aria-label="Account"
            className="hidden sm:inline-flex"
          >
            <User className="h-5 w-5" />
          </Button>
          <Link href={"/cart"}>
          <Button variant="ghost" size="icon" aria-label="Cart" className="relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="bg-blush-500 text-cornsilk-100 absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
              3
            </span>
          </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
