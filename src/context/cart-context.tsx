"use client";

import * as React from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import type { CartItemData } from "@/app/actions/cart";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartContextValue {
  items: CartItemData[];
  itemCount: number;
  subtotal: number;
  isLoading: boolean;
  addItem: (productId: string, quantity?: number) => Promise<void>;
  updateItem: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refetch: () => Promise<void>;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = React.createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const status = isPending ? "loading" : session ? "authenticated" : "unauthenticated";
  const [items, setItems] = React.useState<CartItemData[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);

  // ── Derived values ──────────────────────────────────────────────────────────
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // ── Fetch cart from server ──────────────────────────────────────────────────
  const fetchCart = React.useCallback(async () => {
    if (status !== "authenticated") {
      setItems([]);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/cart", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setItems(data.cart?.items ?? []);
    } catch {
      // Silently fail — cart may simply not exist yet
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, [status]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCart();
  }, [fetchCart, session]);

  // ── Actions ─────────────────────────────────────────────────────────────────

  const addItem = React.useCallback(
    async (productId: string, quantity: number = 1) => {
      if (status !== "authenticated") {
        toast.error("Please sign in to add items to your cart.");
        return;
      }
      // Optimistic update: bump quantity if already in cart
      setItems((prev) => {
        const idx = prev.findIndex((i) => i.productId === productId);
        if (idx !== -1) {
          return prev.map((i, index) =>
            index === idx ? { ...i, quantity: Math.min(10, i.quantity + quantity) } : i
          );
        }
        return prev; // Can't fully optimise without product data; server re-fetch will handle it
      });

      try {
        const res = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId, quantity }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to add item");
        }
        toast.success("Added to cart!");
        await fetchCart(); // Re-fetch to get accurate server state
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Could not add to cart.";
        toast.error(message);
        await fetchCart(); // Revert optimistic update
      }
    },
    [status, fetchCart]
  );

  const updateItem = React.useCallback(
    async (itemId: string, quantity: number) => {
      // Optimistic update
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, quantity } : i)));

      try {
        const res = await fetch(`/api/cart/items/${itemId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ quantity }),
        });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to update item");
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Could not update quantity.";
        toast.error(message);
        await fetchCart(); // Revert
      }
    },
    [fetchCart]
  );

  const removeItem = React.useCallback(
    async (itemId: string) => {
      // Optimistic update
      setItems((prev) => prev.filter((i) => i.id !== itemId));

      try {
        const res = await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.error ?? "Failed to remove item");
        }
        toast.success("Item removed from cart.");
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "Could not remove item.";
        toast.error(message);
        await fetchCart(); // Revert
      }
    },
    [fetchCart]
  );

  const clearCart = React.useCallback(async () => {
    const previous = items;
    setItems([]);

    try {
      const res = await fetch("/api/cart/clear", { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? "Failed to clear cart");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not clear cart.";
      toast.error(message);
      setItems(previous); // Revert
    }
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isLoading,
        addItem,
        updateItem,
        removeItem,
        clearCart,
        refetch: fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
