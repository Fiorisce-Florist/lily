"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LucidePackage,
  LucideUserCircle,
  Menu,
  ShoppingBag,
  LogOut,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "../theme-toggle";
import { NAV_MENU } from "./const";
import { useCart } from "@/context/cart-context";

// ─── User Avatar ──────────────────────────────────────────────────────────────

function UserAvatar({
  name,
  image,
  size = 8,
}: {
  name?: string | null;
  image?: string | null;
  size?: number;
}) {
  const initials = (name ?? "")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeClass = `h-${size} w-${size}`;

  if (image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt={name ?? "Avatar"}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-camel-200 dark:ring-camel-800`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full bg-blush-100 dark:bg-blush-900/40 flex items-center justify-center ring-2 ring-camel-200 dark:ring-camel-800`}
    >
      <span className="text-[11px] font-fraunces font-bold text-blush-700 dark:text-blush-300 leading-none">
        {initials || "?"}
      </span>
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { itemCount } = useCart();

  const isAdmin = session?.user?.role === "ADMIN";
  const isLoggedIn = status === "authenticated" && !!session;

  return (
    <header className="border-cornsilk-300 bg-cornsilk-100/80 sticky top-0 z-50 w-full border-b backdrop-blur-md dark:border-neutral-800 dark:bg-neutral-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Mobile Menu */}
        <div className="flex lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-75 sm:w-100">
              <SheetHeader>
                <SheetTitle className="font-fraunces text-h4 text-blush-800 dark:text-blush-400 text-left">
                  Fiorisce
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 py-8">
                {NAV_MENU.map((link) => {
                  const isActive =
                    pathname === link.href ||
                    (link.href !== "/" && pathname?.startsWith(link.href));
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={`text-h5 font-fraunces transition-colors hover:text-blush-600 dark:hover:text-blush-400 ${
                        isActive
                          ? "text-blush-600 dark:text-blush-400 font-semibold"
                          : "text-neutral-800 dark:text-neutral-200"
                      }`}
                    >
                      {link.name}
                    </Link>
                  );
                })}

                {/* Mobile account links */}
                <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800 my-2" />
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="text-h5 font-fraunces text-neutral-700 dark:text-neutral-200 hover:text-blush-600 dark:hover:text-blush-400 transition-colors"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      href="/profile"
                      className="text-h5 font-fraunces text-neutral-700 dark:text-neutral-200 hover:text-blush-600 dark:hover:text-blush-400 transition-colors"
                    >
                      My Profile
                    </Link>
                    <Link
                      href="/orders"
                      className="text-h5 font-fraunces text-neutral-700 dark:text-neutral-200 hover:text-blush-600 dark:hover:text-blush-400 transition-colors"
                    >
                      My Orders
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="text-h5 font-fraunces text-red-500 text-left hover:text-red-600 transition-colors"
                    >
                      Log Out
                    </button>
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="text-h5 font-fraunces text-blush-600 dark:text-blush-400 hover:text-blush-700 transition-colors"
                  >
                    Sign In
                  </Link>
                )}
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
        <nav className="hidden flex-1 items-center justify-center gap-8 lg:flex">
          {NAV_MENU.map((link) => {
            const isActive =
              pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`text-b4 font-inter font-medium transition-colors hover:text-blush-600 dark:hover:text-blush-400 ${
                  isActive
                    ? "text-blush-600 dark:text-blush-400"
                    : "text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          <ThemeToggle />

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Account"
                className="hidden sm:inline-flex relative p-0.5"
              >
                {isLoggedIn ? (
                  <UserAvatar name={session.user?.name} image={session.user?.image} />
                ) : (
                  <LucideUserCircle className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              {isLoggedIn ? (
                <>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col gap-0.5">
                      <p className="font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 truncate">
                        {session.user?.name ?? "My Account"}
                      </p>
                      <p className="text-[11px] font-inter text-neutral-400 truncate">
                        {session.user?.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin" className="cursor-pointer w-full">
                          <ShieldCheck />
                          Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer w-full">
                        <LucideUserCircle />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer w-full">
                        <LucidePackage />
                        Orders
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="cursor-pointer text-sm w-full text-red-500 dark:text-red-400 focus:text-red-600"
                  >
                    <LogOut />
                    Log Out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="font-fraunces">Welcome</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/login"
                      className="cursor-pointer w-full text-blush-600 dark:text-blush-400"
                    >
                      Sign In
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="cursor-pointer w-full">
                      Create Account
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
          <Button variant="ghost" size="icon" aria-label="Cart" className="relative" asChild>
            <Link href="/cart">
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="bg-blush-500 text-cornsilk-100 absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold">
                  {itemCount > 9 ? "9+" : itemCount}
                </span>
              )}
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
