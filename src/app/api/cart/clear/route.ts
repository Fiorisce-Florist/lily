import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/** DELETE /api/cart/clear — remove all items from the user's cart */
export async function DELETE() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    select: { id: true },
  });

  if (!cart) {
    return NextResponse.json({ success: true });
  }

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  return NextResponse.json({ success: true });
}
