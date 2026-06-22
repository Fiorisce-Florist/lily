"use server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CartItemData {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    slug: string;
    price: number;
    isAvailable: boolean;
    images: { imageUrl: string; isPrimary: boolean }[];
    variants: { id: string; variantName: string; additionalPrice: number; isAvailable: boolean }[];
    category: { name: string; slug: string };
  };
  size?: string;
}

export interface CartData {
  id: string;
  items: CartItemData[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getOrCreateCart(userId: string): Promise<string> {
  const existing = await prisma.cart.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });

  if (existing) return existing.id;

  const newCart = await prisma.cart.create({
    data: { userId },
    select: { id: true },
  });
  return newCart.id;
}

function cartInclude() {
  return {
    items: {
      include: {
        product: {
          include: {
            images: {
              where: { isPrimary: true },
              take: 1,
            },
            variants: true,
            category: {
              select: { name: true, slug: true },
            },
          },
        },
      },
      orderBy: { id: "asc" as const },
    },
  };
}

// ─── Actions ──────────────────────────────────────────────────────────────────

/** Fetch the current user's cart. Returns null if not authenticated. */
export async function getCart(): Promise<CartData | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return null;

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: cartInclude(),
  });

  if (!cart) return null;

  return {
    id: cart.id,
    items: cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      price: Number(item.price),
      product: {
        id: item.product.id,
        name: item.product.name,
        slug: item.product.slug,
        price: Number(item.product.price),
        isAvailable: item.product.isAvailable,
        images: item.product.images.map((img) => ({
          imageUrl: img.imageUrl,
          isPrimary: img.isPrimary,
        })),
        variants: item.product.variants.map((v) => ({
          id: v.id,
          variantName: v.variantName,
          additionalPrice: Number(v.additionalPrice),
          isAvailable: v.isAvailable,
        })),
        category: item.product.category,
      },
      size: item.product.variants.find(v => Number(item.price) === Number(item.product.price) + Number(v.additionalPrice))?.variantName || "Standard",
    })),
  };
}

/** Add a product to the cart. Creates cart if it doesn't exist. */
export async function addToCart(productId: string, quantity: number = 1, variantId?: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { error: "You must be logged in to add items to your cart." };
  }

  const product = await prisma.product.findUnique({
    where: { id: productId, status: "ACTIVE", isAvailable: true },
    select: { id: true, price: true },
  });

  if (!product) {
    return { error: "Product not found or unavailable." };
  }

  let finalPrice = Number(product.price);
  if (variantId) {
    const variant = await prisma.productVariant.findFirst({
      where: { id: variantId, productId, isAvailable: true }
    });
    if (variant) {
      finalPrice = Number(product.price) + Number(variant.additionalPrice);
    }
  }

  const cartId = await getOrCreateCart(session.user.id);

  // Check if the product is already in the cart with the SAME PRICE (same variant)
  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId, productId, price: finalPrice },
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: Math.min(10, existingItem.quantity + quantity) },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId,
        productId,
        quantity: Math.min(10, quantity),
        price: finalPrice,
      },
    });
  }

  revalidatePath("/cart");
  return { error: null };
}

/** Update the quantity of a cart item. */
export async function updateCartItem(itemId: string, quantity: number) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { error: "Not authenticated." };
  }

  if (quantity < 1 || quantity > 10) {
    return { error: "Quantity must be between 1 and 10." };
  }

  // Ensure the item belongs to this user
  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId: session.user.id },
    },
  });

  if (!item) {
    return { error: "Cart item not found." };
  }

  await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity },
  });

  revalidatePath("/cart");
  return { error: null };
}

/** Remove a single item from the cart. */
export async function removeCartItem(itemId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { error: "Not authenticated." };
  }

  const item = await prisma.cartItem.findFirst({
    where: {
      id: itemId,
      cart: { userId: session.user.id },
    },
  });

  if (!item) {
    return { error: "Cart item not found." };
  }

  await prisma.cartItem.delete({ where: { id: itemId } });

  revalidatePath("/cart");
  return { error: null };
}

/** Remove all items from the user's cart. */
export async function clearCart() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { error: "Not authenticated." };
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!cart) return { error: null };

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  revalidatePath("/cart");
  return { error: null };
}

/** Fetch product details to populate a local guest cart item. */
export async function getProductForCart(productId: string) {
  const product = await prisma.product.findUnique({
    where: { id: productId, status: "ACTIVE", isAvailable: true },
    include: {
      images: {
        where: { isPrimary: true },
        take: 1,
      },
      variants: true,
      category: {
        select: { name: true, slug: true },
      },
    },
  });

  if (!product) {
    return { error: "Product not found or unavailable." };
  }

  return {
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      price: Number(product.price),
      isAvailable: product.isAvailable,
      images: product.images.map((img) => ({
        imageUrl: img.imageUrl,
        isPrimary: img.isPrimary,
      })),
      variants: product.variants.map((v) => ({
        id: v.id,
        variantName: v.variantName,
        additionalPrice: Number(v.additionalPrice),
        isAvailable: v.isAvailable,
      })),
      category: product.category,
    },
    error: null,
  };
}

/** Sync local guest cart to the user's database cart upon login. */
export async function syncLocalCart(localItems: { productId: string; quantity: number; variantId?: string }[]) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { error: "Not authenticated." };
  }

  if (!localItems || localItems.length === 0) return { error: null };

  const cartId = await getOrCreateCart(session.user.id);

  for (const item of localItems) {
    const product = await prisma.product.findUnique({
      where: { id: item.productId, status: "ACTIVE", isAvailable: true },
      select: { price: true },
    });
    if (!product) continue;

    let finalPrice = Number(product.price);
    if (item.variantId) {
      const variant = await prisma.productVariant.findFirst({
        where: { id: item.variantId, productId: item.productId, isAvailable: true }
      });
      if (variant) {
        finalPrice = Number(product.price) + Number(variant.additionalPrice);
      }
    }

    const existingItem = await prisma.cartItem.findFirst({
      where: { cartId, productId: item.productId, price: finalPrice },
    });

    if (existingItem) {
      await prisma.cartItem.update({
        where: { id: existingItem.id },
        data: { quantity: Math.min(10, existingItem.quantity + item.quantity) },
      });
    } else {
      await prisma.cartItem.create({
        data: {
          cartId,
          productId: item.productId,
          quantity: Math.min(10, item.quantity),
          price: finalPrice,
        },
      });
    }
  }

  revalidatePath("/cart");
  return { error: null };
}
