"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { createMidtransTransaction } from "@/lib/midtrans";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateOrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  postalCode: string;
}

export interface OrderItemData {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: OrderItemData[];
  address?: {
    recipientName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
  } | null;
  payment?: {
    status: string;
    paymentMethod: string;
    transactionId: string | null;
  } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FIO-${timestamp}${random}`;
}

const SHIPPING_THRESHOLD = 500_000;
const SHIPPING_FEE = 50_000;

function calcShipping(subtotal: number): number {
  return subtotal >= SHIPPING_THRESHOLD ? 0 : subtotal > 0 ? SHIPPING_FEE : 0;
}

// ─── createOrder ──────────────────────────────────────────────────────────────

export async function createOrder(formData: CreateOrderFormData): Promise<{
  orderNumber: string | null;
  snapToken: string | null;
  error: string | null;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      orderNumber: null,
      snapToken: null,
      error: "You must be logged in to place an order.",
    };
  }

  const userId = session.user.id;

  // 1. Fetch user's cart
  const cart = await prisma.cart.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
              price: true,
              isAvailable: true,
              status: true,
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return { orderNumber: null, snapToken: null, error: "Your cart is empty." };
  }

  // 2. Validate all items are still available
  for (const item of cart.items) {
    if (!item.product.isAvailable || item.product.status !== "ACTIVE") {
      return {
        orderNumber: null,
        snapToken: null,
        error: `"${item.product.name}" is no longer available.`,
      };
    }
  }

  // 3. Calculate totals
  const subtotal = cart.items.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  const shippingCost = calcShipping(subtotal);
  const totalAmount = subtotal + shippingCost;
  const orderNumber = generateOrderNumber();

  // 4. Run Prisma transaction: create address + order + items + clear cart
  try {
    const result = await prisma.$transaction(async (tx) => {
      const address = await tx.checkoutAddress.create({
        data: {
          userId,
          recipientName: `${formData.firstName} ${formData.lastName}`.trim(),
          phone: formData.phone,
          address: formData.apartment
            ? `${formData.address}, ${formData.apartment}`
            : formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
        },
      });

      const order = await tx.order.create({
        data: {
          userId,
          addressId: address.id,
          orderNumber,
          subtotal,
          shippingCost,
          totalAmount,
          status: "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              quantity: item.quantity,
              unitPrice: Number(item.price),
            })),
          },
        },
      });

      // Clear the cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return { order, address };
    });

    // 5. Create Midtrans Snap transaction
    let snapToken: string | null = null;
    try {
      snapToken = await createMidtransTransaction({
        orderId: orderNumber,
        amount: totalAmount,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        items: cart.items.map((item) => ({
          id: item.productId,
          name: item.product.name,
          price: Number(item.price),
          quantity: item.quantity,
        })),
      });

      // Store the Snap token / create Payment record
      await prisma.payment.create({
        data: {
          orderId: result.order.id,
          paymentMethod: "midtrans",
          amount: totalAmount,
          status: "PENDING",
          transactionId: snapToken,
        },
      });
    } catch (midtransError) {
      console.error("Midtrans error (order still created):", midtransError);
    }

    revalidatePath("/orders");
    revalidatePath("/cart");

    return { orderNumber, snapToken, error: null };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      orderNumber: null,
      snapToken: null,
      error: "Failed to place order. Please try again.",
    };
  }
}

// ─── getUserOrders ────────────────────────────────────────────────────────────

export async function getUserOrders(): Promise<{
  orders: OrderData[];
  error: string | null;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { orders: [], error: "Not authenticated." };
  }

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        address: true,
        payment: true,
      },
    });

    return {
      orders: orders.map((o) => ({
        id: o.id,
        orderNumber: o.orderNumber,
        subtotal: Number(o.subtotal),
        shippingCost: Number(o.shippingCost),
        totalAmount: Number(o.totalAmount),
        status: o.status,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          image: item.product.images[0]?.imageUrl,
        })),
        address: o.address
          ? {
              recipientName: o.address.recipientName,
              phone: o.address.phone,
              address: o.address.address,
              city: o.address.city,
              postalCode: o.address.postalCode,
            }
          : null,
        payment: o.payment
          ? {
              status: o.payment.status,
              paymentMethod: o.payment.paymentMethod,
              transactionId: o.payment.transactionId,
            }
          : null,
      })),
      error: null,
    };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return { orders: [], error: "Failed to fetch orders." };
  }
}

// ─── getOrderByNumber ─────────────────────────────────────────────────────────

export async function getOrderByNumber(orderNumber: string): Promise<{
  order: OrderData | null;
  error: string | null;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { order: null, error: "Not authenticated." };
  }

  try {
    const order = await prisma.order.findFirst({
      where: {
        orderNumber,
        userId: session.user.id, // security: ensure it belongs to this user
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: { where: { isPrimary: true }, take: 1 },
              },
            },
          },
        },
        address: true,
        payment: true,
        statusHistories: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!order) {
      return { order: null, error: "Order not found." };
    }

    return {
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        subtotal: Number(order.subtotal),
        shippingCost: Number(order.shippingCost),
        totalAmount: Number(order.totalAmount),
        status: order.status,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          image: item.product.images[0]?.imageUrl,
        })),
        address: order.address
          ? {
              recipientName: order.address.recipientName,
              phone: order.address.phone,
              address: order.address.address,
              city: order.address.city,
              postalCode: order.address.postalCode,
            }
          : null,
        payment: order.payment
          ? {
              status: order.payment.status,
              paymentMethod: order.payment.paymentMethod,
              transactionId: order.payment.transactionId,
            }
          : null,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching order:", error);
    return { order: null, error: "Failed to fetch order." };
  }
}

// ─── getSnapToken — retry payment for PENDING orders ─────────────────────────

export async function getSnapToken(orderNumber: string): Promise<{
  snapToken: string | null;
  error: string | null;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { snapToken: null, error: "Not authenticated." };
  }

  try {
    const order = await prisma.order.findFirst({
      where: { orderNumber, userId: session.user.id },
      include: {
        payment: true,
        items: true,
        address: true,
        user: { select: { email: true, name: true } },
      },
    });

    if (!order) return { snapToken: null, error: "Order not found." };
    if (order.status !== "PENDING") {
      return { snapToken: null, error: "Payment can only be retried for PENDING orders." };
    }

    // If we still have the original Snap token (transactionId) and it hasn't expired, reuse it.
    // Midtrans Snap tokens are valid for 24 hours.
    if (order.payment?.transactionId) {
      return { snapToken: order.payment.transactionId, error: null };
    }

    // Otherwise create a new Snap transaction. Midtrans allows this with the same order_id
    // as long as it hasn't been settled.
    const { createMidtransTransaction } = await import("@/lib/midtrans");
    const nameParts = (order.user?.name ?? "Customer").split(" ");

    const snapToken = await createMidtransTransaction({
      orderId: order.orderNumber,
      amount: Number(order.totalAmount),
      firstName: nameParts[0],
      lastName: nameParts.slice(1).join(" "),
      email: order.user?.email ?? "",
      phone: order.address?.phone ?? "",
      items: order.items.map((item) => ({
        id: item.productId,
        name: item.productName,
        price: Number(item.unitPrice),
        quantity: item.quantity,
      })),
    });

    // Update payment record with new token
    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: { transactionId: snapToken },
      });
    } else {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          paymentMethod: "midtrans",
          amount: Number(order.totalAmount),
          status: "PENDING",
          transactionId: snapToken,
        },
      });
    }

    return { snapToken, error: null };
  } catch (error) {
    console.error("Error getting snap token:", error);
    return { snapToken: null, error: "Failed to initiate payment. Please try again." };
  }
}
