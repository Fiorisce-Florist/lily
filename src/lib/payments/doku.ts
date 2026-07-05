import crypto from "node:crypto";

import type { CreateCheckoutInput, CreateCheckoutResult, PaymentProvider } from "./types";

const CHECKOUT_TARGET = "/checkout/v1/payment";

const DOKU_DIGITAL_PAYMENT_METHODS = [
  "CREDIT_CARD",
  "QRIS",
  "EMONEY_DOKU",
  "EMONEY_DANA",
  "EMONEY_OVO",
  "EMONEY_SHOPEE_PAY",
  "EMONEY_LINKAJA",
  "ONLINE_TO_OFFLINE_INDOMARET",
  "ONLINE_TO_OFFLINE_ALFA",
];

interface DokuCheckoutResponse {
  response?: {
    payment?: {
      url?: string;
      token_id?: string;
      payment_method_types?: string[];
    };
  };
  error_messages?: string[];
}

function getDokuBaseUrl() {
  return process.env.DOKU_IS_PRODUCTION === "true"
    ? "https://api.doku.com"
    : "https://api-sandbox.doku.com";
}

function getClientId() {
  return process.env.DOKU_CLIENT_ID ?? process.env.DOKU_API_KEY ?? "";
}

function getSecretKey() {
  return process.env.DOKU_SECRET_KEY ?? "";
}

function toDokuTimestamp(date = new Date()) {
  return date.toISOString().replace(/\.\d{3}Z$/, "Z");
}

export function createDokuDigest(body: string) {
  return crypto.createHash("sha256").update(body).digest("base64");
}

export function createDokuSignature({
  clientId,
  requestId,
  requestTimestamp,
  requestTarget,
  digest,
  secretKey,
}: {
  clientId: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  digest: string;
  secretKey: string;
}) {
  const component = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${requestTimestamp}`,
    `Request-Target:${requestTarget}`,
    `Digest:${digest}`,
  ].join("\n");

  const hmac = crypto.createHmac("sha256", secretKey).update(component).digest("base64");
  return `HMACSHA256=${hmac}`;
}

export function verifyDokuSignature({
  body,
  clientId,
  requestId,
  requestTimestamp,
  requestTarget,
  signature,
}: {
  body: string;
  clientId: string;
  requestId: string;
  requestTimestamp: string;
  requestTarget: string;
  signature: string;
}) {
  const expectedClientId = getClientId();
  const secretKey = getSecretKey();

  if (!expectedClientId || !secretKey || clientId !== expectedClientId) return false;

  const digest = createDokuDigest(body);
  const expected = createDokuSignature({
    clientId,
    requestId,
    requestTimestamp,
    requestTarget,
    digest,
    secretKey,
  });

  return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}

function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  return digits;
}

export function normalizeDokuPaymentMethod(channelId?: string) {
  const normalized = (channelId ?? "").toUpperCase();
  if (normalized === "CREDIT_CARD") return "DOKU.cc";
  if (normalized === "QRIS" || normalized === "QRIS_DOKU") return "DOKU.qris";
  if (normalized === "ONLINE_TO_OFFLINE_INDOMARET") return "DOKU.indomaret";
  if (normalized === "ONLINE_TO_OFFLINE_ALFA") return "DOKU.alfa";
  if (normalized.startsWith("EMONEY_")) return `DOKU.${normalized.replace("EMONEY_", "").toLowerCase()}`;
  if (normalized.startsWith("VIRTUAL_ACCOUNT_")) {
    return `DOKU.${normalized.replace("VIRTUAL_ACCOUNT_", "va_").toLowerCase()}`;
  }
  return normalized ? `DOKU.${normalized.toLowerCase()}` : "DOKU.checkout";
}

export class DokuCheckoutProvider implements PaymentProvider {
  readonly method = "DOKU.checkout";

  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    const clientId = getClientId();
    const secretKey = getSecretKey();

    if (!clientId || !secretKey) {
      throw new Error("Doku credentials are not configured.");
    }

    const body = JSON.stringify({
      order: {
        amount: Math.round(input.amount),
        invoice_number: input.orderNumber,
        currency: "IDR",
        callback_url: input.successUrl,
        callback_url_result: input.successUrl,
        language: "EN",
        auto_redirect: true,
        line_items: input.lineItems.map((item) => ({
          id: item.id,
          name: item.name,
          quantity: item.quantity,
          price: Math.round(item.price),
          sku: item.id,
          category: "gifts-and-flowers",
          image_url: item.imageUrl,
        })),
      },
      payment: {
        payment_due_date: 60,
        type: "SALE",
        payment_method_types: DOKU_DIGITAL_PAYMENT_METHODS,
      },
      customer: {
        id: input.customer.id,
        name: input.customer.firstName,
        last_name: input.customer.lastName || "-",
        phone: normalizePhone(input.customer.phone),
        email: input.customer.email,
        address: input.customer.address,
        city: input.customer.city,
        postcode: input.customer.postalCode,
        country: "ID",
      },
      additional_info: {
        override_notification_url: input.notificationUrl,
      },
    });

    const requestId = crypto.randomUUID();
    const requestTimestamp = toDokuTimestamp();
    const digest = createDokuDigest(body);
    const signature = createDokuSignature({
      clientId,
      requestId,
      requestTimestamp,
      requestTarget: CHECKOUT_TARGET,
      digest,
      secretKey,
    });

    const response = await fetch(`${getDokuBaseUrl()}${CHECKOUT_TARGET}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Client-Id": clientId,
        "Request-Id": requestId,
        "Request-Timestamp": requestTimestamp,
        Signature: signature,
      },
      body,
    });

    const data = (await response.json()) as DokuCheckoutResponse;
    const checkoutUrl = data.response?.payment?.url;
    const tokenId = data.response?.payment?.token_id;

    if (!response.ok || !checkoutUrl || !tokenId) {
      const message = data.error_messages?.join(", ") || "Failed to create Doku checkout.";
      throw new Error(message);
    }

    return {
      provider: "DOKU",
      checkoutUrl,
      transactionId: tokenId,
      raw: data,
    };
  }
}
