"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterModule() {
  return (
    <>
      <div className="mb-8">
        <h1 className="text-h3 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Create account
        </h1>
        <p className="mt-2 text-b4 font-inter text-neutral-600 dark:text-neutral-400">
          Join Fiorisce to discover curated, fresh, and beautifully arranged blooms.
        </p>
      </div>

      <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Jane Doe"
            required
            className="bg-white dark:bg-neutral-900"
          />
        </div>

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
          <Label htmlFor="phone">Phone Number <span className="text-neutral-400 font-normal">(optional)</span></Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+62 812 3456 7890"
            className="bg-white dark:bg-neutral-900"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            required
            className="bg-white dark:bg-neutral-900"
          />
        </div>

        <Button type="submit" variant="primary" className="w-full h-12 text-b4 mt-2">
          Create Account
        </Button>
      </form>

      <div className="mt-8 text-center text-b5 font-inter text-neutral-600 dark:text-neutral-400">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-blush-600 dark:text-blush-400 hover:text-blush-700 dark:hover:text-blush-300 hover:underline underline-offset-4 transition-colors"
        >
          Sign in
        </Link>
      </div>
    </>
  );
}
