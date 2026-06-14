"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CreditCard, Landmark, QrCode, ChevronLeft, ShieldCheck, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

// For demo purposes
const MOCK_TOTAL = 1550000;

export function CheckoutModule() {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = React.useState(false);

  const formatPrice = (v: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(v);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Order placed successfully!");
      // Redirect to the newly created order details page
      router.push("/orders/ORD-89234");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-cornsilk-50 dark:bg-neutral-950 pb-20">
      {/* Minimal Header */}
      <header className="border-b border-cornsilk-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-2 text-b4 font-inter text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-cornsilk-100 transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Cart
          </Link>
          <Link href="/">
            <span className="font-fraunces text-h4 text-blush-800 dark:text-blush-400 font-bold tracking-tight">
              Fiorisce
            </span>
          </Link>
          <div className="flex items-center gap-2 text-b6 font-inter text-neutral-400">
            <ShieldCheck className="h-4 w-4" />
            <span className="hidden sm:inline">Secure Checkout</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-8 sm:pt-12">
        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* Contact Info */}
            <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
              <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
                1. Contact Information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required defaultValue="Jane" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required defaultValue="Doe" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" required defaultValue="jane.doe@example.com" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" type="tel" required defaultValue="+62 812 3456 7890" />
                </div>
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
              <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
                2. Shipping Address
              </h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address</Label>
                  <Input id="address" required defaultValue="Jl. Sudirman No. 1" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
                  <Input id="apartment" defaultValue="Tower A, Unit 12" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" required defaultValue="Jakarta Selatan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code</Label>
                    <Input id="postalCode" required defaultValue="12190" />
                  </div>
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
              <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
                3. Payment Method
              </h2>
              <RadioGroup defaultValue="credit-card" className="space-y-4">
                {/* Credit Card */}
                <div className="flex items-center space-x-2 border border-cornsilk-200 dark:border-neutral-800 p-4 rounded-2xl hover:bg-cornsilk-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <RadioGroupItem value="credit-card" id="credit-card" />
                  <Label
                    htmlFor="credit-card"
                    className="flex flex-1 items-center justify-between cursor-pointer pl-2"
                  >
                    <span className="font-inter font-medium text-neutral-900 dark:text-cornsilk-100">
                      Credit Card
                    </span>
                    <CreditCard className="h-5 w-5 text-neutral-400" />
                  </Label>
                </div>

                {/* Bank Transfer */}
                <div className="flex items-center space-x-2 border border-cornsilk-200 dark:border-neutral-800 p-4 rounded-2xl hover:bg-cornsilk-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <RadioGroupItem value="bank-transfer" id="bank-transfer" />
                  <Label
                    htmlFor="bank-transfer"
                    className="flex flex-1 items-center justify-between cursor-pointer pl-2"
                  >
                    <span className="font-inter font-medium text-neutral-900 dark:text-cornsilk-100">
                      Bank Transfer
                    </span>
                    <Landmark className="h-5 w-5 text-neutral-400" />
                  </Label>
                </div>

                {/* QR Code */}
                <div className="flex items-center space-x-2 border border-cornsilk-200 dark:border-neutral-800 p-4 rounded-2xl hover:bg-cornsilk-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <RadioGroupItem value="qr" id="qr" />
                  <Label
                    htmlFor="qr"
                    className="flex flex-1 items-center justify-between cursor-pointer pl-2"
                  >
                    <span className="font-inter font-medium text-neutral-900 dark:text-cornsilk-100">
                      QRIS / E-Wallet
                    </span>
                    <QrCode className="h-5 w-5 text-neutral-400" />
                  </Label>
                </div>
              </RadioGroup>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="rounded-3xl border border-cornsilk-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-sm sticky top-24">
              <div className="bg-linear-to-r from-camel-100 to-cornsilk-100 dark:from-neutral-800 dark:to-neutral-800 px-6 py-4 border-b border-cornsilk-200 dark:border-neutral-700">
                <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
                  Order Summary
                </h2>
              </div>

              <div className="p-6 space-y-4">
                {/* Item mock */}
                <div className="flex items-center justify-between text-b5 font-inter text-neutral-700 dark:text-neutral-300">
                  <span>Blush Reverie (Standard) x 1</span>
                  <span>{formatPrice(850000)}</span>
                </div>
                <div className="flex items-center justify-between text-b5 font-inter text-neutral-700 dark:text-neutral-300">
                  <span>Lily and Dew (Small) x 1</span>
                  <span>{formatPrice(700000)}</span>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <span className="text-b5 font-inter text-neutral-600 dark:text-neutral-400">
                    Subtotal
                  </span>
                  <span className="text-b5 font-jetbrains font-medium text-neutral-800 dark:text-cornsilk-100">
                    {formatPrice(1550000)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-b5 font-inter text-neutral-600 dark:text-neutral-400">
                    Shipping
                  </span>
                  <span className="text-b5 font-jetbrains font-medium text-olive-700 dark:text-olive-400">
                    Free
                  </span>
                </div>

                <Separator className="my-4" />

                <div className="flex justify-between items-center">
                  <span className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
                    Total
                  </span>
                  <span className="text-h4 font-jetbrains font-bold text-neutral-900 dark:text-cornsilk-100">
                    {formatPrice(MOCK_TOTAL)}
                  </span>
                </div>

                <Button
                  type="submit"
                  disabled={isProcessing}
                  variant="primary"
                  className="w-full mt-6 py-5 text-b4 font-inter font-semibold rounded-2xl shadow-md transition-all active:scale-[0.98]"
                >
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
