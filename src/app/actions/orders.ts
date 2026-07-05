"use server";
import { headers } from "next/headers";
import type { Prisma } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPaymentProvider } from "@/lib/payments";
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

function toPrismaJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

function parseLocalPickupDateTime(date: string, time?: string) {
  if (!date || !time) return null;
  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  if (!year || !month || !day || hour === undefined || minute === undefined) return null;

  return new Date(year, month - 1, day, hour, minute, 0, 0);
}

function validatePickupTime(date: string, time?: string) {
  if (!date) return "Please select a pickup/delivery date.";
  if (!time) return "Please select a pickup/delivery time.";

  const pickupAt = parseLocalPickupDateTime(date, time);
  if (!pickupAt || Number.isNaN(pickupAt.getTime())) {
    return "Please select a valid pickup/delivery time.";
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selectedDay = new Date(pickupAt.getFullYear(), pickupAt.getMonth(), pickupAt.getDate());

  if (selectedDay < today) {
    return "Pickup/delivery date cannot be before today.";
  }

  const openingAt = new Date(pickupAt);
  openingAt.setHours(10, 0, 0, 0);
  const closingAt = new Date(pickupAt);
  closingAt.setHours(20, 0, 0, 0);

  if (pickupAt < openingAt || pickupAt > closingAt) {
    return "Pickup/delivery time must be during store hours, 10:00-20:00.";
  }

  const minimumPickupAt = new Date(now.getTime() + 3 * 60 * 60 * 1000);
  if (pickupAt < minimumPickupAt) {
    return "Pickup/delivery time must be at least 3 hours from now.";
  }

  return null;
}

// ─── createOrder ──────────────────────────────────────────────────────────────

export async function createOrder(formData: CreateOrderFormData): Promise<{
  orderNumber: string | null;
  paymentUrl?: string | null;
  error: string | null;
}> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return {
      orderNumber: null,
      paymentUrl: null,
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
              images: {
                where: { isPrimary: true },
                take: 1,
                select: { imageUrl: true },
              },
            },
          },
          variant: {
            select: {
              id: true,
              variantName: true,
              additionalPrice: true,
              stemsQuantity: true,
              isAvailable: true,
            },
          },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    return { orderNumber: null, paymentUrl: null, error: "Your cart is empty." };
  }

  // Filter items if selectedItemIds is provided
  const itemsToCheckout =
    formData.selectedItemIds && formData.selectedItemIds.length > 0
      ? cart.items.filter((item) => formData.selectedItemIds!.includes(item.id))
      : cart.items;

  if (itemsToCheckout.length === 0) {
    return { orderNumber: null, paymentUrl: null, error: "No items selected for checkout." };
  }

  const pickupValidationError = validatePickupTime(formData.deliveryDate, formData.deliveryTime);
  if (pickupValidationError) {
    return { orderNumber: null, paymentUrl: null, error: pickupValidationError };
  }

  // 2. Validate all items are still available and price matches
  for (const item of itemsToCheckout) {
    const isVariantUnavailable = item.variant ? !item.variant.isAvailable : false;

    if (!item.product.isAvailable || item.product.status !== "ACTIVE" || isVariantUnavailable) {
      return {
        orderNumber: null,
        paymentUrl: null,
        error: `"${item.product.name}${item.variant ? ` (${item.variant.variantName})` : ""}" is no longer available.`,
      };
    }

    // Check for stale pricing
    const livePrice =
      Number(item.product.price) + (item.variant ? Number(item.variant.additionalPrice) : 0);
    if (Number(item.price) !== livePrice) {
      return {
        orderNumber: null,
        paymentUrl: null,
        error: `The price of "${item.product.name}" has changed. Please refresh your cart.`,
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
      return {
        orderNumber: null,
        paymentUrl: null,
        error: "Address, city, and postal code are required for Fiorisce delivery.",
      };
    }
  }

  // 4. Run Prisma transaction: use existing address or create new + order + items + clear cart
  try {
    const created = await prisma.$transaction(async (tx) => {
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

      const payment = await tx.payment.create({
        data: {
          orderId: order.id,
          paymentMethod: getPaymentProvider().method,
          amount: totalAmount,
          status: "PENDING",
        },
      });

      return { order, payment };
    });

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ?? process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
    const provider = getPaymentProvider();
    const checkout = await provider.createCheckout({
      orderNumber,
      amount: totalAmount,
      successUrl: `${appUrl}/orders/${orderNumber}`,
      notificationUrl: `${appUrl}/api/payments/doku/notification`,
      customer: {
        id: userId,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        postalCode: formData.postalCode,
      },
      lineItems: [
        ...itemsToCheckout.map((item) => ({
          id: item.productId,
          name: item.variant
            ? `${item.product.name} (${item.variant.variantName})`
            : item.product.name,
          quantity: item.quantity,
          price: Number(item.price),
          imageUrl: item.product.images[0]?.imageUrl,
        })),
        ...(paperBagCost > 0
          ? [
              {
                id: "paper-bag",
                name: "Paper Bag",
                quantity: 1,
                price: paperBagCost,
              },
            ]
          : []),
      ],
    });

    await prisma.$transaction([
      prisma.payment.update({
        where: { id: created.payment.id },
        data: {
          transactionId: checkout.transactionId,
          receiptUrl: checkout.checkoutUrl,
        },
      }),
      prisma.paymentLog.create({
        data: {
          paymentId: created.payment.id,
          payload: toPrismaJson({
            provider: checkout.provider,
            event: "CHECKOUT_CREATED",
            paymentMethod: provider.method,
            checkoutUrl: checkout.checkoutUrl,
            raw: checkout.raw,
          }),
        },
      }),
      prisma.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          id: { in: itemsToCheckout.map((i) => i.id) },
        },
      }),
    ]);

    revalidatePath("/orders");
    revalidatePath("/cart");

    return { orderNumber, paymentUrl: checkout.checkoutUrl, error: null };
  } catch (error) {
    console.error("Error creating order:", error);
    await prisma.order.delete({ where: { orderNumber } }).catch(() => null);
    return {
      orderNumber: null,
      paymentUrl: null,
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
