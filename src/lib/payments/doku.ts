import crypto from "node:crypto";

import type { CreateCheckoutInput, CreateCheckoutResult, PaymentProvider } from "./types";

const CHECKOUT_TARGET = "/checkout/v1/payment";

interface DokuCheckoutResponse {
  response?: {
    payment?: {
      url?: string;
      token_id?: string;
      payment_method_types?: string[];
    };
  };
  error_messages?: string[];
  error?: {
    code?: string;
    message?: string;
    type?: string;
  };
  message?: string | string[];
}

function getDokuBaseUrl() {
  return process.env.DOKU_IS_PRODUCTION === "true"
    ? "https://api.doku.com"
    : "https://api-sandbox.doku.com";
}

function getClientId() {
  return process.env.DOKU_CLIENT_ID ?? process.env.PAYMENT_PROVIDER_CLIENT_ID ?? "";
}

function getSecretKey() {
  return process.env.DOKU_SECRET_KEY ?? process.env.PAYMENT_PROVIDER_SECRET_KEY ?? "";
}

function getPaymentMethodTypes() {
  const configured =
    process.env.DOKU_PAYMENT_METHOD_TYPES ?? process.env.PAYMENT_PROVIDER_METHOD_TYPES ?? "";

  return configured
    .split(",")
    .map((method) => method.trim())
    .filter(Boolean);
}

function formatProviderMessage(message?: string | string[]) {
  if (Array.isArray(message)) return message.join(", ");
  return message;
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
  return normalized ? `DOKU.${normalized.toLowerCase()}` : "PAYMENT_PROVIDER";
}

export class DokuPaymentProvider implements PaymentProvider {
  readonly method = "PAYMENT_PROVIDER";

  async createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult> {
    const clientId = getClientId();
    const secretKey = getSecretKey();

    if (!clientId || !secretKey) {
      throw new Error("Payment provider credentials are not configured.");
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
        ...(getPaymentMethodTypes().length > 0
          ? { payment_method_types: getPaymentMethodTypes() }
          : {}),
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
      const providerMessage =
        data.error_messages?.join(", ") ||
        data.error?.message ||
        formatProviderMessage(data.message) ||
        "Failed to create payment session.";
      const providerCode = data.error?.code ? ` (${data.error.code})` : "";
      throw new Error(
        `Payment provider error${providerCode}: ${providerMessage} [HTTP ${response.status}]`
      );
    }

    return {
      provider: "DOKU",
      checkoutUrl,
      transactionId: tokenId,
      raw: data,
    };
  }
}
