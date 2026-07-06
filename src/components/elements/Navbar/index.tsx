"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  LucidePackage,
  LucideUserCircle,
  Menu,
  ShoppingBag,
  LogOut,
  ShieldCheck,
  Globe2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "../theme-toggle";
import { NAV_MENU } from "./const";
import { useCart } from "@/context/cart-context";
import { LANGUAGE_CONFIG, setStoredLanguage } from "@/config/language";
import { useLanguage } from "@/config/use-language";

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

function LanguageSelector({ compact = false }: { compact?: boolean }) {
  const { language, dictionary } = useLanguage();

  const handleChange = (nextLanguage: string) => {
    const match = LANGUAGE_CONFIG.options.find((option) => option.code === nextLanguage);
    if (!match) return;

    setStoredLanguage(match.code);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={compact ? "md" : "icon"}
          aria-label={dictionary.language.label}
          className={compact ? "justify-start rounded-xl px-0 text-h5 font-fraunces" : ""}
        >
          <Globe2 className="h-5 w-5" />
          <span className={compact ? "font-fraunces" : "sr-only"}>{dictionary.language.label}</span>
          {!compact && <span className="font-jetbrains text-[11px] font-semibold">{language}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align={compact ? "start" : "end"} className="w-40">
        <DropdownMenuLabel>{dictionary.language.label}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup value={language} onValueChange={handleChange}>
          {LANGUAGE_CONFIG.options.map((option) => (
            <DropdownMenuRadioItem key={option.code} value={option.code} className="cursor-pointer">
              <span>{option.code}</span>
              <span className="text-neutral-500 dark:text-neutral-400">
                {dictionary.language.options[option.code]}
              </span>
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

export function Navbar() {
  const pathname = usePathname();
  const { data, isPending } = useSession();
  const session = data;
  const isLoggedIn = !isPending && !!session;
  const isAdmin = session?.user?.role === "ADMIN";
  const { items } = useCart();
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const { dictionary } = useLanguage();

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
                    <SheetClose asChild key={link.name}>
                      <Link
                        href={link.href}
                        className={`text-h5 font-fraunces transition-colors hover:text-blush-600 dark:hover:text-blush-400 ${
                          isActive
                            ? "text-blush-600 dark:text-blush-400 font-semibold"
                            : "text-neutral-800 dark:text-neutral-200"
                        }`}
                      >
                        {dictionary.navigation[link.key]}
                      </Link>
                    </SheetClose>
                  );
                })}

                <LanguageSelector compact />

                {/* Mobile account links */}
                <div className="h-px w-full bg-neutral-200 dark:bg-neutral-800 my-2" />
                {isLoggedIn ? (
                  <>
                    {isAdmin && (
                      <SheetClose asChild>
                        <Link
                          href="/admin"
                          className="text-h5 font-fraunces text-neutral-700 dark:text-neutral-200 hover:text-blush-600 dark:hover:text-blush-400 transition-colors"
                        >
                          {dictionary.navigation.adminPanel}
                        </Link>
                      </SheetClose>
                    )}
                    <SheetClose asChild>
                      <Link
                        href="/profile"
                        className="text-h5 font-fraunces text-neutral-700 dark:text-neutral-200 hover:text-blush-600 dark:hover:text-blush-400 transition-colors"
                      >
                        {dictionary.navigation.myProfile}
                      </Link>
                    </SheetClose>
                    <SheetClose asChild>
                      <Link
                        href="/orders"
                        className="text-h5 font-fraunces text-neutral-700 dark:text-neutral-200 hover:text-blush-600 dark:hover:text-blush-400 transition-colors"
                      >
                        {dictionary.navigation.myOrders}
                      </Link>
                    </SheetClose>
                    <button
                      onClick={async () => {
                        await signOut();
                        window.location.href = "/";
                      }}
                      className="text-h5 font-fraunces text-red-500 text-left hover:text-red-600 transition-colors"
                    >
                      {dictionary.navigation.logOut}
                    </button>
                  </>
                ) : (
                  <SheetClose asChild>
                    <Link
                      href="/login"
                      className="text-h5 font-fraunces text-blush-600 dark:text-blush-400 hover:text-blush-700 transition-colors"
                    >
                      {dictionary.navigation.signIn}
                    </Link>
                  </SheetClose>
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
                {dictionary.navigation[link.key]}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex flex-1 items-center justify-end gap-2 md:gap-4">
          <LanguageSelector />
          <ThemeToggle />

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={dictionary.navigation.account}
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
                        {session.user?.name ?? dictionary.navigation.account}
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
                          {dictionary.navigation.adminPanel}
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer w-full">
                        <LucideUserCircle />
                        {dictionary.navigation.myProfile}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer w-full">
                        <LucidePackage />
                        {dictionary.navigation.myOrders}
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={async () => {
                      await signOut();
                      window.location.href = "/";
                    }}
                    className="cursor-pointer text-sm w-full text-red-500 dark:text-red-400 focus:text-red-600"
                  >
                    <LogOut />
                    {dictionary.navigation.logOut}
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuLabel className="font-fraunces">
                    {dictionary.navigation.welcome}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      href="/login"
                      className="cursor-pointer w-full text-blush-600 dark:text-blush-400"
                    >
                      {dictionary.navigation.signIn}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/register" className="cursor-pointer w-full">
                      {dictionary.navigation.createAccount}
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Cart */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={dictionary.navigation.cart}
            className="relative"
            asChild
          >
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
