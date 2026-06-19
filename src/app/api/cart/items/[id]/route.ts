import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** PATCH /api/cart/items/[id] — update quantity of a cart item */
export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await request.json();
  const { quantity } = body as { quantity: number };

  if (typeof quantity !== "number" || quantity < 1 || quantity > 10) {
    return NextResponse.json({ error: "Invalid quantity" }, { status: 400 });
  }

  const item = await prisma.cartItem.findFirst({
    where: { id, cart: { userId: session.user.id } },
  });

  if (!item) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  await prisma.cartItem.update({ where: { id }, data: { quantity } });

  return NextResponse.json({ success: true });
}

/** DELETE /api/cart/items/[id] — remove a cart item */
export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const item = await prisma.cartItem.findFirst({
    where: { id, cart: { userId: session.user.id } },
  });

  if (!item) {
    return NextResponse.json({ error: "Cart item not found" }, { status: 404 });
  }

  await prisma.cartItem.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
