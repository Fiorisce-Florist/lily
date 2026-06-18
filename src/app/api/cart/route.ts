import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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

async function getOrCreateCart(userId: string): Promise<string> {
  const existing = await prisma.cart.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: { id: true },
  });
  if (existing) return existing.id;
  const newCart = await prisma.cart.create({ data: { userId }, select: { id: true } });
  return newCart.id;
}

/** GET /api/cart — return the current user's cart */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ cart: null }, { status: 200 });
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: cartInclude(),
  });

  if (!cart) {
    return NextResponse.json({ cart: null });
  }

  // Ensure Decimals are mapped to standard JS Numbers to match frontend types perfectly
  const mappedCart = {
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
        images: item.product.images,
        variants: item.product.variants.map((v) => ({
          ...v,
          additionalPrice: Number(v.additionalPrice),
        })),
        category: item.product.category,
      },
    })),
  };

  return NextResponse.json({ cart: mappedCart });
}

/** POST /api/cart — add an item to the cart */
export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { productId, quantity = 1 } = body as { productId: string; quantity?: number };

  if (!productId) {
    return NextResponse.json({ error: "productId is required" }, { status: 400 });
  }

  const product = await prisma.product.findUnique({
    where: { id: productId, status: "ACTIVE", isAvailable: true },
    select: { id: true, price: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found or unavailable" }, { status: 404 });
  }

  const cartId = await getOrCreateCart(session.user.id);

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId, productId },
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
        price: product.price,
      },
    });
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
