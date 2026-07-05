import { NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { normalizeDokuPaymentMethod, verifyDokuSignature } from "@/lib/payments";

const REQUEST_TARGET = "/api/payments/doku/notification";

function toPrismaJson(value: unknown): Prisma.InputJsonValue {
  return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
}

interface DokuNotification {
  order?: {
    invoice_number?: string;
    amount?: number | string;
    status?: string;
  };
  transaction?: {
    status?: string;
    date?: string;
    original_request_id?: string;
  };
  service?: {
    id?: string;
  };
  acquirer?: {
    id?: string;
  };
  channel?: {
    id?: string;
  };
}

function toPaymentStatus(status?: string, orderStatus?: string) {
  const normalized = (status ?? orderStatus ?? "").toUpperCase();
  if (normalized === "SUCCESS") return "PAID";
  if (normalized === "FAILED") return "FAILED";
  if (normalized === "EXPIRED" || normalized === "ORDER_EXPIRED") return "EXPIRED";
  return "PENDING";
}

function toOrderStatus(paymentStatus: string) {
  if (paymentStatus === "PAID") return "PAID";
  if (paymentStatus === "FAILED" || paymentStatus === "EXPIRED") return "CANCELLED";
  return "PENDING";
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const clientId = request.headers.get("Client-Id") ?? "";
  const requestId = request.headers.get("Request-Id") ?? "";
  const requestTimestamp = request.headers.get("Request-Timestamp") ?? "";
  const signature = request.headers.get("Signature") ?? "";

  if (
    !verifyDokuSignature({
      body: rawBody,
      clientId,
      requestId,
      requestTimestamp,
      requestTarget: REQUEST_TARGET,
      signature,
    })
  ) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  const payload = JSON.parse(rawBody) as DokuNotification;
  const orderNumber = payload.order?.invoice_number;

  if (!orderNumber) {
    return NextResponse.json({ error: "Missing invoice number" }, { status: 400 });
  }

  const paymentStatus = toPaymentStatus(payload.transaction?.status, payload.order?.status);
  const orderStatus = toOrderStatus(paymentStatus);
  const paymentMethod = normalizeDokuPaymentMethod(payload.channel?.id);

  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { payment: true },
  });

  if (!order?.payment) {
    return NextResponse.json({ error: "Order payment not found" }, { status: 404 });
  }

  await prisma.$transaction([
    prisma.payment.update({
      where: { id: order.payment.id },
      data: {
        status: paymentStatus,
        paymentMethod,
        paidAt:
          paymentStatus === "PAID" && payload.transaction?.date
            ? new Date(payload.transaction.date)
            : undefined,
      },
    }),
    prisma.paymentLog.create({
      data: {
        paymentId: order.payment.id,
        payload: toPrismaJson({
          provider: "DOKU",
          paymentMethod,
          requestId,
          service: payload.service?.id,
          acquirer: payload.acquirer?.id,
          channel: payload.channel?.id,
          transactionStatus: payload.transaction?.status,
          raw: payload,
        }),
      },
    }),
    prisma.order.update({
      where: { id: order.id },
      data: { status: orderStatus },
    }),
  ]);

  return NextResponse.json({ status: "OK" });
}
