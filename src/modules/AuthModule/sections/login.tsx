"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginModule() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };
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

      <form className="space-y-5" onSubmit={handleSubmit}>
        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 dark:bg-red-900/20 rounded-md">
            {error}
          </div>
        )}
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

        <Button
          type="submit"
          variant="primary"
          className="w-full h-12 text-b4 mt-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing In..." : "Sign In"}
        </Button>
      </form>

      <div className="mt-6 flex items-center justify-between">
        <div className="w-full h-[1px] bg-neutral-200 dark:bg-neutral-800"></div>
        <span className="px-4 text-b5 font-inter text-neutral-500 dark:text-neutral-400">or</span>
        <div className="w-full h-[1px] bg-neutral-200 dark:bg-neutral-800"></div>
      </div>

      <Button
        type="button"
        variant="outline"
        className="w-full h-12 text-b4 mt-6 flex items-center justify-center gap-2"
        onClick={handleGoogleSignIn}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
          <path d="M1 1h22v22H1z" fill="none" />
        </svg>
        Continue with Google
      </Button>

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
