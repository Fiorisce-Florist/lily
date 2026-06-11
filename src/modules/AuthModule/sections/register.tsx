"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export function RegisterModule() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [errors, setErrors] = React.useState<FormErrors>({});

  const validateForm = (formData: FormData): boolean => {
    const newErrors: FormErrors = {};
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const phone = formData.get("phone") as string;
    const password = formData.get("password") as string;

    // Name validation
    if (!name || name.trim().length < 2) {
      newErrors.name = "Please enter your full name.";
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    // Phone validation (optional, but if provided must be valid)
    if (phone && phone.trim().length > 0) {
      // Allows optional +, followed by 9 to 14 digits (with optional spaces)
      const phoneRegex = /^\+?[\d\s]{9,15}$/;
      if (!phoneRegex.test(phone.replace(/\s/g, ""))) {
        newErrors.phone = "Please enter a valid phone number (e.g., +6281234567890).";
      }
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain at least one letter and one number.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});
    const formData = new FormData(e.currentTarget);

    if (!validateForm(formData)) {
      return;
    }

    setIsSubmitting(true);
    // Simulate API call for now
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);

    // TODO: Connect to server action or API route
  };

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

      <form className="space-y-5" onSubmit={handleSubmit} noValidate>
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            type="text"
            id="name"
            name="name"
            placeholder="Jane Doe"
            required
            className={`bg-white dark:bg-neutral-900 ${errors.name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && (
            <p id="name-error" className="text-b6 font-inter text-red-500 mt-1">
              {errors.name}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            required
            className={`bg-white dark:bg-neutral-900 ${errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
          />
          {errors.email && (
            <p id="email-error" className="text-b6 font-inter text-red-500 mt-1">
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number <span className="text-neutral-400 font-normal">(optional)</span></Label>
          <Input
            type="tel"
            id="phone"
            name="phone"
            placeholder="+62 812 3456 7890"
            className={`bg-white dark:bg-neutral-900 ${errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            aria-invalid={!!errors.phone}
            aria-describedby={errors.phone ? "phone-error" : undefined}
          />
          {errors.phone && (
            <p id="phone-error" className="text-b6 font-inter text-red-500 mt-1">
              {errors.phone}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            name="password"
            required
            className={`bg-white dark:bg-neutral-900 ${errors.password ? "border-red-500 focus-visible:ring-red-500" : ""}`}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
          {errors.password && (
            <p id="password-error" className="text-b6 font-inter text-red-500 mt-1">
              {errors.password}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          variant="primary" 
          className="w-full h-12 text-b4 mt-2 relative overflow-hidden"
          disabled={isSubmitting}
        >
          <span className={isSubmitting ? "opacity-0" : "opacity-100 transition-opacity"}>
            Create Account
          </span>
          {isSubmitting && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="h-5 w-5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
            </div>
          )}
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
