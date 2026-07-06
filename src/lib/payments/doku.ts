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

function maskValue(value: string, visible = 6) {
  if (!value) return "<empty>";
  if (value.length <= visible) return "*".repeat(value.length);
  return `${value.slice(0, visible)}...${value.slice(-4)}`;
}

function log(label: string, data: unknown) {
  // Server actions & route handlers surface console logs to Vercel runtime logs.
  console.log(`[doku-checkout] ${label}`, typeof data === "string" ? data : JSON.stringify(data));
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

function sanitizeDokuText(value: string | undefined, fallback: string) {
  const sanitized = (value ?? "")
    .replace(/[^a-zA-Z0-9 .\-/+,=_'@%:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  return sanitized || fallback;
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
  if (normalized.startsWith("EMONEY_"))
    return `DOKU.${normalized.replace("EMONEY_", "").toLowerCase()}`;
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
      log("config_error", {
        message: "Payment provider credentials are not configured.",
        clientIdPresent: Boolean(clientId),
        secretKeyPresent: Boolean(secretKey),
        isProduction: process.env.DOKU_IS_PRODUCTION === "true",
      });
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
          id: sanitizeDokuText(item.id, "item"),
          name: sanitizeDokuText(item.name, "Product"),
          quantity: item.quantity,
          price: Math.round(item.price),
          sku: sanitizeDokuText(item.id, "item"),
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
        id: sanitizeDokuText(input.customer.id, "customer"),
        name: sanitizeDokuText(input.customer.firstName, "Customer"),
        last_name: sanitizeDokuText(input.customer.lastName, "-"),
        phone: normalizePhone(input.customer.phone),
        email: input.customer.email,
        address: sanitizeDokuText(input.customer.address, "-"),
        city: sanitizeDokuText(input.customer.city, "-"),
        postcode: sanitizeDokuText(input.customer.postalCode, "00000"),
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

    const baseUrl = getDokuBaseUrl();
    log("request", {
      url: `${baseUrl}${CHECKOUT_TARGET}`,
      isProduction: process.env.DOKU_IS_PRODUCTION === "true",
      clientId: maskValue(clientId),
      secretKey: maskValue(secretKey),
      requestId,
      requestTimestamp,
      requestTarget: CHECKOUT_TARGET,
      orderNumber: input.orderNumber,
      amount: input.amount,
      lineItemCount: input.lineItems.length,
      customer: {
        id: input.customer.id,
        email: input.customer.email,
        phone: input.customer.phone,
        name: input.customer.firstName,
      },
    });
    log("request_body", body);

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

    const responseText = await response.text();
    let data: DokuCheckoutResponse = {};
    try {
      data = responseText ? (JSON.parse(responseText) as DokuCheckoutResponse) : {};
    } catch {
      log("response_parse_error", {
        status: response.status,
        statusText: response.statusText,
        rawBody: responseText,
      });
    }

    const checkoutUrl = data.response?.payment?.url;
    const tokenId = data.response?.payment?.token_id;

    log("response", {
      status: response.status,
      statusText: response.statusText,
      hasCheckoutUrl: Boolean(checkoutUrl),
      hasTokenId: Boolean(tokenId),
      message: data.message,
      error: data.error,
      errorMessages: data.error_messages,
    });
    log("response_body", responseText);

    if (!response.ok || !checkoutUrl || !tokenId) {
      log("checkout_failed", {
        orderNumber: input.orderNumber,
        httpStatus: response.status,
        rawResponse: responseText,
        requestBody: body,
        signatureComponents: {
          clientId: maskValue(clientId),
          requestId,
          requestTimestamp,
          requestTarget: CHECKOUT_TARGET,
          digest,
        },
      });
      const providerMessage =
        data.error_messages?.join(", ") ||
        data.error?.message ||
        formatProviderMessage(data.message) ||
        "Failed to create payment session.";
      const providerCode = data.error?.code ? ` (${data.error.code})` : "";
      const message = `Payment provider error${providerCode}: ${providerMessage} [HTTP ${response.status}]`;
      const error = new Error(message);
      // Attach raw payload for upstream logging in the server action catch block.
      (
        error as Error & { rawResponse?: string; requestBody?: string; httpStatus?: number }
      ).rawResponse = responseText;
      (
        error as Error & { rawResponse?: string; requestBody?: string; httpStatus?: number }
      ).requestBody = body;
      (
        error as Error & { rawResponse?: string; requestBody?: string; httpStatus?: number }
      ).httpStatus = response.status;
      throw error;
    }

    log("checkout_success", { orderNumber: input.orderNumber, tokenId, checkoutUrl });

    return {
      provider: "DOKU",
      checkoutUrl,
      transactionId: tokenId,
      raw: data,
    };
  }
}
