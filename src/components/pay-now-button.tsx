"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { CreditCard, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getSnapToken } from "@/app/actions/orders";

// ─── Snap loader (same as CheckoutModule) ─────────────────────────────────────

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

// ─── PayNowButton ─────────────────────────────────────────────────────────────

interface PayNowButtonProps {
  orderNumber: string;
  className?: string;
}

export function PayNowButton({ orderNumber, className }: PayNowButtonProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handlePayNow = async () => {
    setIsLoading(true);

    try {
      const { snapToken, error } = await getSnapToken(orderNumber);

      if (error || !snapToken) {
        toast.error(error ?? "Could not initiate payment.");
        setIsLoading(false);
        return;
      }

      await loadSnapScript();

      (window as any).snap.pay(snapToken, {
        onSuccess: () => {
          toast.success("Payment successful!");
          router.refresh();
        },
        onPending: () => {
          toast("Payment pending — we'll update your order when confirmed.");
          router.refresh();
        },
        onError: () => {
          toast.error("Payment failed. Please try again.");
          setIsLoading(false);
        },
        onClose: () => {
          toast("Payment window closed.");
          setIsLoading(false);
        },
      });
    } catch {
      toast.error("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="primary"
      onClick={handlePayNow}
      disabled={isLoading}
      className={`flex items-center gap-2 ${className ?? ""}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading…
        </>
      ) : (
        <>
          <CreditCard className="h-4 w-4" />
          Pay Now
        </>
      )}
    </Button>
  );
}
