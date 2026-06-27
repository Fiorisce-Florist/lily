import { NextRequest, NextResponse } from "next/server";
import { verifyMidtransNotification } from "@/lib/midtrans";
import { prisma } from "@/lib/prisma";

// Map Midtrans transaction_status → our PaymentStatus
function mapMidtransStatus(
  transactionStatus: string,
  fraudStatus?: string
): "PENDING" | "PAID" | "FAILED" | "EXPIRED" {
  if (transactionStatus === "capture") {
    return fraudStatus === "challenge" ? "PENDING" : "PAID";
  }
  if (transactionStatus === "settlement") return "PAID";
  if (transactionStatus === "pending") return "PENDING";
  if (transactionStatus === "deny" || transactionStatus === "cancel") return "FAILED";
  if (transactionStatus === "expire") return "EXPIRED";
  return "PENDING";
}

// Map to OrderStatus
function mapToOrderStatus(paymentStatus: string): string | null {
  if (paymentStatus === "PAID") return "PAID";
  if (paymentStatus === "FAILED" || paymentStatus === "EXPIRED") return "CANCELLED";
  return null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Verify the notification with Midtrans
    const notification = await verifyMidtransNotification(body);

    const orderId = notification.order_id as string;
    const transactionStatus = notification.transaction_status as string;
    const fraudStatus = notification.fraud_status as string | undefined;

    const paymentStatus = mapMidtransStatus(transactionStatus, fraudStatus);

    // Find the payment by transactionId (which is the Snap token) or by order_id
    // The order_id from Midtrans is our orderNumber
    const order = await prisma.order.findFirst({
      where: { orderNumber: orderId },
      include: { payment: true },
    });

    if (!order) {
      console.warn(`[Midtrans webhook] Order not found: ${orderId}`);
      return NextResponse.json({ received: true });
    }

    if (order.payment) {
      await prisma.payment.update({
        where: { id: order.payment.id },
        data: {
          status: paymentStatus,
          paidAt: paymentStatus === "PAID" ? new Date() : undefined,
        },
      });

      // Log the raw payload
      await prisma.paymentLog.create({
        data: {
          paymentId: order.payment.id,
          payload: body,
        },
      });
    }

    // Update order status
    const newOrderStatus = mapToOrderStatus(paymentStatus);
    if (newOrderStatus && order.status !== newOrderStatus) {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data: { status: newOrderStatus as any },
        }),
        prisma.orderStatusHistory.create({
          data: {
            orderId: order.id,
            oldStatus: order.status,
            newStatus: newOrderStatus,
            changedBy: order.userId, // System change attributed to order owner
          }
        })
      ]);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("[Midtrans webhook] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
