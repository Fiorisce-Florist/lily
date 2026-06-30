"use server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CreateOrderFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  apartment?: string;
  city?: string;
  postalCode?: string;
  addressId?: string | null;
  deliveryMethod: "PICKUP" | "GOSEND" | "FIORISCE_DELIVERY";
  deliveryDate: string;
  deliveryTime?: string;
  messageCard?: string;
  includePaperBag: boolean;
  selectedItemIds?: string[];
}

export interface OrderItemData {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  image?: string;
  variantName?: string | null;
}

export interface OrderData {
  id: string;
  orderNumber: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: string;
  deliveryMethod: string;
  deliveryDate: string | null;
  deliveryTime: string | null;
  messageCard: string | null;
  includePaperBag: boolean;
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
    receiptUrl: string | null;
  } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FIO-${timestamp}${random}`;
}

function calcShipping(): number {
  return 0; // GoSend ordered by user, Pickup is free
}

// ─── createOrder ──────────────────────────────────────────────────────────────

export async function createOrder(formData: CreateOrderFormData): Promise<{
  orderNumber: string | null;
  snapToken?: string | null;
  error: string | null;
}> {
  const session = await auth.api.getSession({ headers: await headers() });
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
          variant: {
            select: { id: true, variantName: true },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return { orderNumber: null, snapToken: null, error: "Your cart is empty." };
  }

  // Filter items if selectedItemIds is provided
  const itemsToCheckout = formData.selectedItemIds && formData.selectedItemIds.length > 0 
    ? cart.items.filter(item => formData.selectedItemIds!.includes(item.id))
    : cart.items;

  if (itemsToCheckout.length === 0) {
    return { orderNumber: null, snapToken: null, error: "No items selected for checkout." };
  }

  // 2. Validate all items are still available
  for (const item of itemsToCheckout) {
    if (!item.product.isAvailable || item.product.status !== "ACTIVE") {
      return {
        orderNumber: null,
        snapToken: null,
        error: `"${item.product.name}" is no longer available.`,
      };
    }
  }

  // 3. Calculate totals
  let subtotal = itemsToCheckout.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0);
  
  let paperBagCost = 0;
  if (formData.includePaperBag || formData.deliveryMethod === "GOSEND") {
    let hasLarge = false;
    let hasMedium = false;
    for (const item of itemsToCheckout) {
      const vName = item.variant?.variantName?.toLowerCase() || "";
      if (vName === "l" || vName === "large") hasLarge = true;
      else if (vName === "m" || vName === "medium") hasMedium = true;
    }
    if (hasLarge) paperBagCost = 8000;
    else if (hasMedium) paperBagCost = 7000;
    else paperBagCost = 5000;
  }
  
  subtotal += paperBagCost;
  const shippingCost = calcShipping();
  const totalAmount = subtotal + shippingCost;
  const orderNumber = generateOrderNumber();

  if (formData.deliveryMethod === "FIORISCE_DELIVERY") {
    if (!formData.address || !formData.city || !formData.postalCode) {
      return { orderNumber: null, snapToken: null, error: "Address, city, and postal code are required for Fiorisce delivery." };
    }
  }

  // 4. Run Prisma transaction: use existing address or create new + order + items + clear cart
  try {
    const result = await prisma.$transaction(async (tx) => {
      let addressIdToUse = formData.addressId;

      if (formData.deliveryMethod === "FIORISCE_DELIVERY" && formData.address) {
        if (!addressIdToUse) {
          const address = await tx.checkoutAddress.create({
            data: {
              userId,
              recipientName: `${formData.firstName} ${formData.lastName}`.trim(),
              phone: formData.phone,
              address: formData.apartment
                ? `${formData.address}, ${formData.apartment}`
                : formData.address || "",
              city: formData.city || "",
              postalCode: formData.postalCode || "",
            },
          });
          addressIdToUse = address.id;
        }
      } else if (addressIdToUse) {
        // Verify address belongs to user
        const existing = await tx.checkoutAddress.findFirst({
          where: { id: addressIdToUse, userId },
        });
        if (!existing) {
          addressIdToUse = null;
        }
      }

      const order = await tx.order.create({
        data: {
          userId,
          addressId: addressIdToUse,
          orderNumber,
          subtotal,
          shippingCost,
          totalAmount,
          status: "PENDING",
          deliveryMethod: formData.deliveryMethod,
          deliveryDate: new Date(formData.deliveryDate),
          deliveryTime: formData.deliveryTime || null,
          messageCard: formData.messageCard || null,
          includePaperBag: formData.includePaperBag || formData.deliveryMethod === "GOSEND",
          items: {
            create: itemsToCheckout.map((item) => ({
              productId: item.productId,
              productName: item.product.name,
              variantId: item.variant?.id,
              variantName: item.variant?.variantName,
              quantity: item.quantity,
              unitPrice: Number(item.price),
            })),
          },
        },
      });

      // Clear the selected items from the cart
      await tx.cartItem.deleteMany({ 
        where: { 
          cartId: cart.id,
          id: { in: itemsToCheckout.map(i => i.id) }
        } 
      });

      return { order, addressId: addressIdToUse };
    });

    // 5. Create Payment record for QRIS
    try {
      await prisma.payment.create({
        data: {
          orderId: result.order.id,
          paymentMethod: "QRIS",
          amount: totalAmount,
          status: "PENDING",
        },
      });
    } catch (paymentError) {
      console.error("Payment error (order still created):", paymentError);
    }

    revalidatePath("/orders");
    revalidatePath("/cart");

    return { orderNumber, error: null };
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
  const session = await auth.api.getSession({ headers: await headers() });
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
        deliveryMethod: o.deliveryMethod,
        deliveryDate: o.deliveryDate ? o.deliveryDate.toISOString() : null,
        deliveryTime: o.deliveryTime,
        messageCard: o.messageCard,
        includePaperBag: o.includePaperBag,
        createdAt: o.createdAt.toISOString(),
        items: o.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          image: item.product.images[0]?.imageUrl,
          variantName: item.variantName,
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
              receiptUrl: o.payment.receiptUrl,
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
  const session = await auth.api.getSession({ headers: await headers() });
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
        deliveryMethod: order.deliveryMethod,
        deliveryDate: order.deliveryDate ? order.deliveryDate.toISOString() : null,
        deliveryTime: order.deliveryTime,
        messageCard: order.messageCard,
        includePaperBag: order.includePaperBag,
        createdAt: order.createdAt.toISOString(),
        items: order.items.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.productName,
          quantity: item.quantity,
          unitPrice: Number(item.unitPrice),
          image: item.product.images[0]?.imageUrl,
          variantName: item.variantName,
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
              receiptUrl: order.payment.receiptUrl,
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
  const session = await auth.api.getSession({ headers: await headers() });
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

// ─── uploadOrderReceipt ───────────────────────────────────────────────────────

export async function uploadOrderReceipt(orderId: string, receiptUrl: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return { error: "Not authenticated." };
  }

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { payment: true },
    });

    if (!order || order.userId !== session.user.id) {
      return { error: "Order not found or unauthorized." };
    }

    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: { receiptUrl },
      });
    }

    revalidatePath(`/orders/${order.orderNumber}`);
    return { success: true };
  } catch (error) {
    console.error("Error uploading receipt:", error);
    return { error: "Failed to save receipt URL." };
  }
}
