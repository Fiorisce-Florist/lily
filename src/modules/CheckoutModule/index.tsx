"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import {
  CreditCard,
  ChevronLeft,
  Loader2,
  Package,
  MapPin,
  PlusCircle,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useCart } from "@/context/cart-context";
import { useSession } from "@/lib/auth-client";
import { createOrder } from "@/app/actions/orders";
import type { CreateOrderFormData } from "@/app/actions/orders";
import type { ProfileData, AddressData } from "@/app/actions/profile";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(v: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}
// ─── Order Summary Panel ──────────────────────────────────────────────────────

function OrderSummaryPanel({
  isLoading,
  subtotal,
  items,
  deliveryMethod,
  includePaperBag,
}: {
  isLoading: boolean;
  subtotal: number;
  items: {
    id: string;
    productId: string;
    quantity: number;
    price: number;
    variant?: { variantName: string } | null;
    product: {
      name: string;
      images: { imageUrl: string; isPrimary: boolean }[];
      variants?: { variantName: string }[];
      category?: { slug: string } | null;
    };
  }[];
  deliveryMethod: "PICKUP" | "GOSEND" | "FIORISCE_DELIVERY";
  includePaperBag: boolean;
}) {
  let paperBagCost = 0;
  let paperBagLabel = "Standard Size";
  if (includePaperBag || deliveryMethod === "GOSEND") {
    let hasLarge = false;
    let hasMedium = false;
    for (const item of items) {
      const vName =
        item.variant?.variantName?.toLowerCase() ||
        item.product?.variants?.[0]?.variantName?.toLowerCase() ||
        "";
      if (vName === "l" || vName === "large") hasLarge = true;
      else if (vName === "m" || vName === "medium") hasMedium = true;
    }
    if (hasLarge) {
      paperBagCost = 8000;
      paperBagLabel = "Large (+Rp8.000)";
    } else if (hasMedium) {
      paperBagCost = 7000;
      paperBagLabel = "Medium (+Rp7.000)";
    } else {
      paperBagCost = 5000;
      paperBagLabel = "Small (+Rp5.000)";
    }
  }

  const subtotalWithBag = subtotal + paperBagCost;
  const total = subtotalWithBag;

  if (isLoading) {
    return (
      <div className="rounded-3xl border border-cornsilk-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-sm p-6 space-y-4">
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
    <div className="rounded-3xl border border-cornsilk-200 bg-white dark:border-neutral-800 dark:bg-neutral-900 overflow-hidden shadow-sm">
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
          {(includePaperBag || deliveryMethod === "GOSEND") && (
            <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
              <span>Paper Bag ({paperBagLabel})</span>
              <span className="font-jetbrains">{formatPrice(paperBagCost)}</span>
            </div>
          )}
          <div className="flex justify-between text-neutral-600 dark:text-neutral-400">
            <span>Delivery Method</span>
            <span className="font-jetbrains text-olive-600 dark:text-olive-400">
              {deliveryMethod === "GOSEND"
                ? "GoSend (Ordered by User)"
                : deliveryMethod === "FIORISCE_DELIVERY"
                  ? "Fiorisce Delivery"
                  : "Pick Up (Free)"}
            </span>
          </div>
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

// ─── Saved Address Picker ─────────────────────────────────────────────────────

function SavedAddressPicker({
  addresses,
  selectedId,
  onSelect,
  onUseNew,
}: {
  addresses: AddressData[];
  selectedId: string | null;
  onSelect: (addr: AddressData) => void;
  onUseNew: () => void;
}) {
  if (addresses.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-b6 font-inter font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
        Saved addresses
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {addresses.map((addr) => {
          const isSelected = selectedId === addr.id;
          return (
            <button
              key={addr.id}
              type="button"
              onClick={() => onSelect(addr)}
              className={`w-full text-left rounded-2xl border-2 p-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-400 ${
                isSelected
                  ? "border-blush-400 bg-blush-50/60 dark:bg-blush-900/10 dark:border-blush-700"
                  : "border-neutral-200 dark:border-neutral-700 hover:border-blush-300 dark:hover:border-blush-800 bg-white dark:bg-neutral-900"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <MapPin
                  className={`h-4 w-4 mt-0.5 shrink-0 ${
                    isSelected ? "text-blush-500" : "text-neutral-400 dark:text-neutral-500"
                  }`}
                />
                {isSelected && <CheckCircle2 className="h-4 w-4 text-blush-500 shrink-0" />}
              </div>
              <address className="not-italic mt-2 text-b5 font-inter leading-relaxed">
                <p className="font-semibold text-neutral-900 dark:text-cornsilk-100">
                  {addr.recipientName}
                </p>
                <p className="text-neutral-600 dark:text-neutral-400">{addr.address}</p>
                <p className="text-neutral-600 dark:text-neutral-400">
                  {addr.city}, {addr.postalCode}
                </p>
                <p className="text-neutral-400 dark:text-neutral-500 text-b6">{addr.phone}</p>
              </address>
            </button>
          );
        })}

        {/* "Enter a new address" option */}
        <button
          type="button"
          onClick={onUseNew}
          className={`w-full text-left rounded-2xl border-2 border-dashed p-4 transition-all duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-400 flex flex-col items-center justify-center gap-2 min-h-30 ${
            selectedId === null
              ? "border-blush-400 bg-blush-50/60 dark:bg-blush-900/10 dark:border-blush-700"
              : "border-neutral-200 dark:border-neutral-700 hover:border-blush-300 dark:hover:border-blush-800"
          }`}
        >
          <PlusCircle
            className={`h-5 w-5 ${selectedId === null ? "text-blush-500" : "text-neutral-400"}`}
          />
          <span className="text-b5 font-inter font-medium text-neutral-600 dark:text-neutral-400">
            Enter a new address
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Main Module ──────────────────────────────────────────────────────────────

interface CheckoutModuleProps {
  profile: ProfileData | null;
  addresses: AddressData[];
}

export function CheckoutModule({ profile, addresses }: CheckoutModuleProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, isPending } = useSession();
  const status = isPending ? "loading" : session ? "authenticated" : "unauthenticated";

  const { items: allItems, isLoading: cartLoading, refetch } = useCart();

  // Filter items based on URL query parameter `?items=id1,id2`
  const selectedItemIdsParam = searchParams.get("items");
  const selectedItemIds = React.useMemo(() => {
    return selectedItemIdsParam ? selectedItemIdsParam.split(",") : [];
  }, [selectedItemIdsParam]);

  const items = React.useMemo(() => {
    if (selectedItemIds.length === 0) return allItems;
    return allItems.filter((item) => selectedItemIds.includes(item.id));
  }, [allItems, selectedItemIds]);

  // Recalculate subtotal for selected items
  const subtotal = React.useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const [isProcessing, setIsProcessing] = React.useState(false);

  // ── Derive initial contact from profile ──────────────────────────────────
  const nameParts = (profile?.name ?? session?.user?.name ?? "").split(" ");
  const initialFirst = nameParts[0] ?? "";
  const initialLast = nameParts.slice(1).join(" ");
  const initialEmail = profile?.email ?? session?.user?.email ?? "";
  const initialPhone = profile?.phone ?? "";

  // ── Form state ─────────────────────────────────────────────────────────
  const [form, setForm] = React.useState<CreateOrderFormData>({
    firstName: initialFirst,
    lastName: initialLast,
    email: initialEmail,
    phone: initialPhone,
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    deliveryMethod: "PICKUP",
    deliveryDate: "",
    deliveryTime: "",
    messageCard: "",
    includePaperBag: false,
  });

  // Track which saved address is selected (null = enter new)
  // Start with null; if there are saved addresses, the user chooses.
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(
    addresses.length > 0 ? addresses[0].id : null
  );

  // Pre-fill address form when a saved address is picked
  React.useEffect(() => {
    if (selectedAddressId === null) {
      // User chose "new address" — clear address fields only
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((prev) => ({
        ...prev,
        phone: prev.phone || initialPhone,
        address: "",
        apartment: "",
        city: "",
        postalCode: "",
      }));
      return;
    }
    const addr = addresses.find((a) => a.id === selectedAddressId);
    if (!addr) return;
    setForm((prev) => ({
      ...prev,
      phone: prev.phone || addr.phone,
      address: addr.address,
      apartment: "",
      city: addr.city,
      postalCode: addr.postalCode,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddressId]);

  // Pre-fill first saved address on mount (only once)
  React.useEffect(() => {
    if (addresses.length > 0) {
      const addr = addresses[0];
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((prev) => ({
        ...prev,
        phone: prev.phone || addr.phone,
        address: addr.address,
        city: addr.city,
        postalCode: addr.postalCode,
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPapanBungaOnly =
    items.length > 0 && items.every((i) => i.product.category?.slug === "papan-bunga");

  React.useEffect(() => {
    if (isPapanBungaOnly && form.deliveryMethod !== "FIORISCE_DELIVERY") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm((prev) => ({ ...prev, deliveryMethod: "FIORISCE_DELIVERY" }));
    } else if (!isPapanBungaOnly && form.deliveryMethod === "FIORISCE_DELIVERY") {
      setForm((prev) => ({ ...prev, deliveryMethod: "PICKUP" }));
    }
  }, [isPapanBungaOnly, form.deliveryMethod]);

  const set =
    <K extends keyof CreateOrderFormData>(key: K) =>
    (v: CreateOrderFormData[K]) =>
      setForm((prev) => ({ ...prev, [key]: v }));

  const handleSelectAddress = (addr: AddressData) => {
    setSelectedAddressId(addr.id);
  };

  const handleUseNew = () => {
    setSelectedAddressId(null);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }
    if (!form.deliveryDate) {
      toast.error("Please select a pickup/delivery date.");
      return;
    }

    setIsProcessing(true);

    try {
      const payload = {
        ...form,
        addressId: selectedAddressId,
        selectedItemIds: items.map((i) => i.id),
      };
      const result = await createOrder(payload);

      if (result.error) {
        toast.error(result.error);
        return;
      }

      toast.success("Order placed successfully! Redirecting…");
      refetch();
      router.push(`/orders/${result.orderNumber}`);
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // ── Auth guard ──────────────────────────────────────────────────────────
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

  // ── Empty cart guard ────────────────────────────────────────────────────
  if (!cartLoading && items.length === 0) {
    return (
      <div className="min-h-screen bg-cornsilk-50 dark:bg-neutral-950 flex items-center justify-center">
        <div className="text-center space-y-4 px-4">
          <h2 className="text-h2 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
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

  const isAddressFormVisible = selectedAddressId === null || addresses.length === 0;

  return (
    <div className="min-h-screen bg-cornsilk-50 dark:bg-neutral-950 pb-20">
      {/* Minimal Header */}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-8 sm:pt-12">
        <Link
          href="/cart"
          className="flex mb-4 items-center gap-2 group text-b4 font-inter text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-cornsilk-100 transition-colors"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transform transition-all" />
          Back to Cart
        </Link>
        <form
          onSubmit={handlePlaceOrder}
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12"
        >
          {/* Left Column: Forms */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-8">
            {/* 1. Contact Information — pre-filled from profile */}
            <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
                  1. Contact Information
                </h2>
                {profile && (
                  <Link
                    href="/profile"
                    className="text-b6 font-inter text-blush-500 hover:text-blush-600 hover:underline underline-offset-4 transition-colors"
                  >
                    Edit in Profile →
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  id="firstName"
                  label="First Name"
                  required
                  value={form.firstName}
                  onChange={set("firstName")}
                  placeholder="Jane"
                />
                <Field
                  id="lastName"
                  label="Last Name"
                  required
                  value={form.lastName}
                  onChange={set("lastName")}
                  placeholder="Doe"
                />
                <Field
                  id="email"
                  label="Email Address"
                  required
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="jane@example.com"
                  className="sm:col-span-2"
                />
                <Field
                  id="phone"
                  label="Phone Number"
                  required
                  type="tel"
                  value={form.phone}
                  onChange={set("phone")}
                  placeholder="+62 812 3456 7890"
                  className="sm:col-span-2"
                />
              </div>
            </section>

            {/* 2. Delivery Method & Customization */}
            <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-cornsilk-200 dark:border-neutral-800 shadow-sm space-y-6">
              <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
                2. Delivery & Customization
              </h2>

              <div className="space-y-4">
                <Label className="text-b5">Delivery Method</Label>
                {isPapanBungaOnly ? (
                  <div className="p-4 bg-blush-50 dark:bg-blush-950/30 text-blush-800 dark:text-blush-200 rounded-xl border border-blush-200 dark:border-blush-900">
                    <p className="font-semibold mb-1">Free Delivery by Fiorisce</p>
                    <p className="text-sm">
                      Papan Bunga includes free delivery. Please provide the delivery address below.
                    </p>
                  </div>
                ) : (
                  <>
                    <RadioGroup
                      value={form.deliveryMethod}
                      onValueChange={(val: "PICKUP" | "GOSEND") => set("deliveryMethod")(val)}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                    >
                      <div
                        className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer ${form.deliveryMethod === "PICKUP" ? "border-blush-500 bg-blush-50 dark:bg-blush-900/10" : "border-neutral-200 dark:border-neutral-700"}`}
                      >
                        <RadioGroupItem value="PICKUP" id="delivery-pickup" />
                        <Label htmlFor="delivery-pickup" className="cursor-pointer flex-1">
                          Pick Up
                          <p className="text-b6 text-neutral-500 font-normal">
                            Pick up at our store
                          </p>
                        </Label>
                      </div>
                      <div
                        className={`flex items-center space-x-3 border p-4 rounded-xl cursor-pointer ${form.deliveryMethod === "GOSEND" ? "border-blush-500 bg-blush-50 dark:bg-blush-900/10" : "border-neutral-200 dark:border-neutral-700"}`}
                      >
                        <RadioGroupItem value="GOSEND" id="delivery-gosend" />
                        <Label htmlFor="delivery-gosend" className="cursor-pointer flex-1">
                          GoSend
                          <p className="text-b6 text-neutral-500 font-normal">
                            Order courier yourself
                          </p>
                        </Label>
                      </div>
                    </RadioGroup>

                    {form.deliveryMethod === "GOSEND" && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/30 text-blue-800 dark:text-blue-200 rounded-xl text-sm mt-2">
                        <p className="font-semibold mb-1">Instruction for GoSend:</p>
                        <p>
                          Please order a GoSend / GrabExpress courier yourself to pick up the
                          flowers at our store.
                        </p>
                        <a
                          href="https://maps.app.goo.gl/4HAzwzqoAbfYGrbR8"
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 mt-2 text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          <MapPin className="h-4 w-4" /> Open in Google Maps
                        </a>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Field
                  id="deliveryDate"
                  label="Pickup / Delivery Date"
                  required
                  type="date"
                  value={form.deliveryDate}
                  onChange={set("deliveryDate")}
                />
                <Field
                  id="deliveryTime"
                  label="Pickup / Delivery Time (Optional)"
                  type="time"
                  value={form.deliveryTime || ""}
                  onChange={set("deliveryTime")}
                />
              </div>

              <div className="space-y-2 pt-2">
                <Label htmlFor="messageCard" className="flex justify-between items-end">
                  <span>Message Card (Optional)</span>
                  <span
                    className={`text-xs ${(form.messageCard?.match(/\\S+/g)?.length || 0) > 30 ? "text-red-500 font-bold" : "text-neutral-400"}`}
                  >
                    {form.messageCard?.match(/\\S+/g)?.length || 0} / 30 words
                  </span>
                </Label>
                <Textarea
                  id="messageCard"
                  placeholder="Write your greeting card message here..."
                  rows={3}
                  value={form.messageCard}
                  onChange={(e) => set("messageCard")(e.target.value)}
                />
              </div>

              {!isPapanBungaOnly && (
                <div className="flex items-start gap-3 pt-2">
                  <Checkbox
                    id="includePaperBag"
                    checked={form.deliveryMethod === "GOSEND" || form.includePaperBag}
                    disabled={form.deliveryMethod === "GOSEND"}
                    onCheckedChange={(c) => set("includePaperBag")(!!c)}
                    className="mt-1"
                  />
                  <div>
                    <Label
                      htmlFor="includePaperBag"
                      className="cursor-pointer font-medium text-neutral-900 dark:text-neutral-100"
                    >
                      Include Paper Bag
                    </Label>
                    <p className="text-b6 text-neutral-500 mt-0.5">
                      Required for GoSend. Size adjusts automatically.
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* 3. Shipping Address */}
            {isPapanBungaOnly && (
              <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
                <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
                  3. Shipping Address
                </h2>

                {/* Saved address picker */}
                <SavedAddressPicker
                  addresses={addresses}
                  selectedId={selectedAddressId}
                  onSelect={handleSelectAddress}
                  onUseNew={handleUseNew}
                />

                {/* Manual address form — shown when "new address" or no saved addresses */}
                {isAddressFormVisible && (
                  <div
                    className={`space-y-4 ${addresses.length > 0 ? "mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800" : ""}`}
                  >
                    {addresses.length > 0 && (
                      <p className="text-b6 font-inter font-semibold uppercase tracking-widest text-neutral-400 dark:text-neutral-500">
                        New address details
                      </p>
                    )}
                    <Field
                      id="address"
                      label="Street Address"
                      required
                      value={form.address || ""}
                      onChange={set("address")}
                      placeholder="Jl. Sudirman No. 1"
                    />
                    <Field
                      id="apartment"
                      label="Apartment, suite, etc. (optional)"
                      value={form.apartment ?? ""}
                      onChange={set("apartment")}
                      placeholder="Tower A, Unit 12"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field
                        id="city"
                        label="City"
                        required
                        value={form.city || ""}
                        onChange={set("city")}
                        placeholder="Jakarta Selatan"
                      />
                      <Field
                        id="postalCode"
                        label="Postal Code"
                        required
                        value={form.postalCode || ""}
                        onChange={set("postalCode")}
                        placeholder="12190"
                      />
                    </div>
                  </div>
                )}

                {/* When saved address is selected — show read-only preview with edit hint */}
                {!isAddressFormVisible && selectedAddressId && (
                  <div className="mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-4">
                    {/* Still allow editing address + apartment for this order */}
                    <Field
                      id="apartment"
                      label="Apartment, suite, etc. (optional)"
                      value={form.apartment ?? ""}
                      onChange={set("apartment")}
                      placeholder="Tower A, Unit 12"
                    />
                  </div>
                )}
              </section>
            )}

            {/* 4. Payment note */}
            <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-cornsilk-200 dark:border-neutral-800 shadow-sm">
              <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-4">
                4. Payment
              </h2>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-cornsilk-50 dark:bg-neutral-800 border border-cornsilk-200 dark:border-neutral-700">
                <CreditCard className="h-5 w-5 text-camel-600 dark:text-camel-400 shrink-0" />
                <p className="text-b5 font-inter text-neutral-700 dark:text-neutral-300">
                  Clicking <strong>&quot;Place Order & Pay&quot;</strong> will create your order.
                  You will then be provided with a QRIS code to manually complete your payment.
                </p>
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-4 lg:sticky lg:top-24 lg:self-start">
            <OrderSummaryPanel
              isLoading={cartLoading || status === "loading"}
              subtotal={subtotal}
              items={items}
              deliveryMethod={form.deliveryMethod}
              includePaperBag={form.includePaperBag}
            />

            <Button
              type="submit"
              disabled={isProcessing || cartLoading || items.length === 0}
              variant="primary"
              className="w-full py-5 text-b4 font-inter font-semibold rounded-2xl shadow-md transition-all active:scale-[0.98]"
            >
              {isProcessing || cartLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                "Place Order & Pay"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
