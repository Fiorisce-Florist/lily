"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginModule() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-h3 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Welcome back
        </h1>
        <p className="mt-2 text-b4 font-inter text-neutral-600 dark:text-neutral-400">
          Sign in to your account to track orders and manage your wishlist.
        </p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            className="bg-white dark:bg-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              href="#"
              className="text-b6 font-inter text-blush-600 dark:text-blush-400 hover:text-blush-700 dark:hover:text-blush-300 hover:underline underline-offset-4"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            type="password"
            id="password"
            name="password"
            required
            className="bg-white dark:bg-neutral-900"
          />
        </div>

        <Button type="submit" variant="primary" className="w-full h-12 text-b4 mt-2">
          Sign In
        </Button>
      </form>

      <div className="mt-8 text-center text-b5 font-inter text-neutral-600 dark:text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-semibold text-blush-600 dark:text-blush-400 hover:text-blush-700 dark:hover:text-blush-300 hover:underline underline-offset-4 transition-colors"
        >
          Create account
        </Link>
      </div>
    </>
  );
}
