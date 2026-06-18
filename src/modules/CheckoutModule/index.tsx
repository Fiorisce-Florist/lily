"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CreditCard, ChevronLeft, ShieldCheck, Loader2, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { useSession } from "next-auth/react";
import { createOrder } from "@/app/actions/orders";
import type { CreateOrderFormData } from "@/app/actions/orders";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}

const SHIPPING_THRESHOLD = 500_000;
const SHIPPING_FEE = 50_000;

function calcShipping(subtotal: number): number {
  return subtotal >= SHIPPING_THRESHOLD ? 0 : subtotal > 0 ? SHIPPING_FEE : 0;
}

// ─── Snap loader ──────────────────────────────────────────────────────────────

function loadSnapScript(): Promise<void> {
  return new Promise((resolve) => {
    if (document.getElementById("midtrans-snap")) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.id = "midtrans-snap";
    script.src =
      process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
        ? "https://app.midtrans.com/snap/snap.js"
        : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute(
      "data-client-key",
      process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY ?? ""
    );
    script.onload = () => resolve();
    document.head.appendChild(script);
  });
}

// ─── Order Summary Panel ──────────────────────────────────────────────────────

function OrderSummaryPanel({
  isLoading,
  subtotal,
  items,
}: {
  isLoading: boolean;
  subtotal: number;
  items: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    product: { name: string; images: { imageUrl: string; isPrimary: boolean }[] };
  }[];
}) {
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-cornsilk-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-sm sticky top-24 p-6 space-y-4">
        <Skeleton className="h-6 w-40 rounded" />
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-4 w-full rounded" />
              <Skeleton className="h-3 w-1/2 rounded" />
            </div>
            <Skeleton className="h-4 w-16 rounded" />
          </div>
        ))}
        <Skeleton className="h-px w-full" />
        <Skeleton className="h-12 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-cornsilk-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-sm sticky top-24">
      <div className="bg-linear-to-r from-camel-100 to-cornsilk-100 dark:from-neutral-800 dark:to-neutral-800 px-6 py-4 border-b border-cornsilk-200 dark:border-neutral-700">
        <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Order Summary
        </h2>
      </div>

      <div className="p-6 space-y-4">
        {/* Items */}
        <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
          {items.map((item) => {
            const image = item.product.images[0]?.imageUrl ?? "";
            return (
              <div key={item.id} className="flex items-center gap-3">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cornsilk-100 dark:bg-neutral-800">
                  {image ? (
                    <Image
                      src={image}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                      sizes="48px"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-5 w-5 text-neutral-300" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-b5 font-inter font-medium text-neutral-900 dark:text-cornsilk-100 truncate">
                    {item.product.name}
                  </p>
                  <p className="text-b6 font-inter text-neutral-500 dark:text-neutral-400">
                    Qty {item.quantity}
                  </p>
                </div>
                <span className="text-b5 font-jetbrains text-neutral-800 dark:text-cornsilk-200 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            );
          })}
        </div>

        <Separator />

        <div className="space-y-2 text-b5 font-inter">
          <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
            <span>Subtotal</span>
            <span className="font-jetbrains">{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
            <span>Shipping</span>
            <span className="font-jetbrains">
              {shipping === 0 ? (
                <span className="text-olive-600 dark:text-olive-400">Free</span>
              ) : (
                formatPrice(shipping)
              )}
            </span>
          </div>
          {shipping > 0 && (
            <p className="text-[11px] text-neutral-400 dark:text-neutral-500">
              Free shipping on orders over {formatPrice(SHIPPING_THRESHOLD)}
            </p>
          )}
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <span className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            Total
          </span>
          <span className="text-h5 font-jetbrains font-bold text-neutral-900 dark:text-cornsilk-100">
            {formatPrice(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Field component ──────────────────────────────────────────────────────────

function Field({
  id,
  label,
  required,
  type = "text",
  placeholder,
  value,
  onChange,
  className,
}: {
  id: string;
  label: string;
  required?: boolean;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <Label htmlFor={id}>
        {label}
        {required && <span className="text-blush-500 ml-0.5">*</span>}
      </Label>
      <Input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ─── Main Module ──────────────────────────────────────────────────────────────

export function CheckoutModule() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { items, subtotal, isLoading: cartLoading, refetch } = useCart();
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Form state
  const [form, setForm] = React.useState<CreateOrderFormData>({
    firstName: "",
    lastName: "",
    email: session?.user?.email ?? "",
    phone: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
  });

  // Sync email from session
  React.useEffect(() => {
    if (session?.user?.email) {
      setForm((prev) => ({ ...prev, email: session.user!.email! }));
    }
    if (session?.user?.name) {
      const [first, ...rest] = session.user.name.split(" ");
      setForm((prev) => ({
        ...prev,
        firstName: prev.firstName || first,
        lastName: prev.lastName || rest.join(" "),
      }));
    }
  }, [session]);

  const set = (key: keyof CreateOrderFormData) => (v: string) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsProcessing(true);

    try {
      const result = await createOrder(form);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      // Load Midtrans Snap and open popup
      if (result.snapToken) {
        await loadSnapScript();

        (window as any).snap.pay(result.snapToken, {
          onSuccess: () => {
            toast.success("Payment successful! Redirecting…");
            refetch();
            router.push(`/orders/${result.orderNumber}`);
          },
          onPending: () => {
            toast("Payment pending — we'll notify you when confirmed.");
            refetch();
            router.push(`/orders/${result.orderNumber}`);
          },
          onError: () => {
            toast.error("Payment failed. Your order is saved — try paying again from My Orders.");
            refetch();
            router.push(`/orders/${result.orderNumber}`);
          },
          onClose: () => {
            toast("Payment window closed. Your order is saved — complete payment from My Orders.");
            refetch();
            router.push(`/orders/${result.orderNumber}`);
          },
        });
      } else {
        // Snap token unavailable (e.g., Midtrans error) — still redirect to order
        toast.success("Order placed! Complete payment from My Orders.");
        refetch();
        router.push(`/orders/${result.orderNumber}`);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Auth guard ──────────────────────────────────────────────────────────────
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-cornsilk-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <h2 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            Sign in to checkout
          </h2>
          <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400">
            You need to be signed in to place an order.
          </p>
          <Button variant="primary" asChild>
            <Link href="/login?callbackUrl=/checkout">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  // ── Empty cart guard ────────────────────────────────────────────────────────
  if (!cartLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-cornsilk-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <h2 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            Your cart is empty
          </h2>
          <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400">
            Add some beautiful bouquets before checking out.
          </p>
          <Button variant="primary" asChild>
            <Link href="/shop">Browse Bouquets</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cornsilk-50 dark:bg-neutral-950 pb-20">
      {/* Minimal Header */}
      <header className="border-b border-cornsilk-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/cart"
            className="flex items-center gap-2 group text-b4 font-inter text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-cornsilk-100 transition-colors"
          >
            <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transform transition-all" />
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
                <Field id="firstName" label="First Name" required value={form.firstName} onChange={set("firstName")} placeholder="Jane" />
                <Field id="lastName" label="Last Name" required value={form.lastName} onChange={set("lastName")} placeholder="Doe" />
                <Field id="email" label="Email Address" required type="email" value={form.email} onChange={set("email")} placeholder="jane@example.com" className="sm:col-span-2" />
                <Field id="phone" label="Phone Number" required type="tel" value={form.phone} onChange={set("phone")} placeholder="+62 812 3456 7890" className="sm:col-span-2" />
              </div>
            </section>

            {/* Shipping Address */}
            <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
              <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
                2. Shipping Address
              </h2>
              <div className="space-y-4">
                <Field id="address" label="Street Address" required value={form.address} onChange={set("address")} placeholder="Jl. Sudirman No. 1" />
                <Field id="apartment" label="Apartment, suite, etc. (optional)" value={form.apartment ?? ""} onChange={set("apartment")} placeholder="Tower A, Unit 12" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field id="city" label="City" required value={form.city} onChange={set("city")} placeholder="Jakarta Selatan" />
                  <Field id="postalCode" label="Postal Code" required value={form.postalCode} onChange={set("postalCode")} placeholder="12190" />
                </div>
              </div>
            </section>

            {/* Payment note */}
            <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
              <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-4">
                3. Payment
              </h2>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-cornsilk-50 dark:bg-neutral-800 border border-cornsilk-200 dark:border-neutral-700">
                <CreditCard className="h-5 w-5 text-camel-600 dark:text-camel-400 shrink-0" />
                <p className="text-b5 font-inter text-neutral-700 dark:text-neutral-300">
                  Clicking <strong>"Place Order"</strong> will open the Midtrans payment window. You can pay via credit card, bank transfer, e-wallet, or QRIS.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4">
            <OrderSummaryPanel
              isLoading={cartLoading || status === "loading"}
              subtotal={subtotal}
              items={items}
            />

            <Button
              type="submit"
              disabled={isProcessing || cartLoading || items.length === 0}
              variant="primary"
              className="w-full py-5 text-b4 font-inter font-semibold rounded-2xl shadow-md transition-all active:scale-[0.98]"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing…
                </span>
              ) : (
                "Place Order & Pay"
              )}
            </Button>

            <p className="text-center text-b6 font-inter text-neutral-400 dark:text-neutral-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5" />
              Payments secured by Midtrans
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
