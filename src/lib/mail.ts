import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Types ────────────────────────────────────────────────────────────────────

interface OrderLineItem {
  productName: string;
  variantName?: string | null;
  quantity: number;
  unitPrice: number;
}

interface OrderMailData {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  totalAmount: number;
  subtotal: number;
  shippingCost: number;
  deliveryMethod: string;
  deliveryDate: string;
  deliveryTime?: string | null;
  messageCard?: string | null;
  includePaperBag: boolean;
  items: OrderLineItem[];
  address?: {
    address: string;
    city: string;
    postalCode: string;
  } | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatIDR(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function formatDeliveryMethod(method: string): string {
  switch (method) {
    case "PICKUP":
      return "Store Pickup";
    case "GOSEND":
      return "GoSend";
    case "FIORISCE_DELIVERY":
      return "Fiorisce Delivery";
    default:
      return method;
  }
}

// ─── Email Template ───────────────────────────────────────────────────────────

function buildAdminOrderEmailHtml(data: OrderMailData): string {
  const itemRows = data.items
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f0ece8; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528;">
            ${item.productName}${item.variantName ? ` <span style="color: #8c7e6a; text-transform: uppercase;">(${item.variantName})</span>` : ""}
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f0ece8; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f0ece8; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528; text-align: right;">
            ${formatIDR(item.unitPrice * item.quantity)}
          </td>
        </tr>`
    )
    .join("");

  const addressBlock = data.address
    ? `
      <tr>
        <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #8c7e6a; width: 140px;">Address</td>
        <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528;">
          ${data.address.address}, ${data.address.city} ${data.address.postalCode}
        </td>
      </tr>`
    : "";

  const messageCardBlock = data.messageCard
    ? `
      <tr>
        <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #8c7e6a; width: 140px;">Message Card</td>
        <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528; font-style: italic;">"${data.messageCard}"</td>
      </tr>`
    : "";

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /></head>
<body style="margin: 0; padding: 0; background-color: #faf8f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #faf8f5; padding: 32px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(61, 53, 40, 0.06);">
          
          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #5c4f3c 0%, #8c7e6a 100%); padding: 32px 40px; text-align: center;">
              <h1 style="margin: 0; font-family: 'Georgia', serif; font-size: 22px; color: #ffffff; font-weight: 600; letter-spacing: 1px;">
                🌸 New Order Received
              </h1>
              <p style="margin: 8px 0 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #d4cfc7;">
                Order <strong>${data.orderNumber}</strong>
              </p>
            </td>
          </tr>

          <!-- Customer Info -->
          <tr>
            <td style="padding: 28px 40px 0;">
              <h2 style="margin: 0 0 16px; font-family: 'Georgia', serif; font-size: 16px; color: #5c4f3c; border-bottom: 2px solid #f0ece8; padding-bottom: 8px;">
                Customer Details
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #8c7e6a; width: 140px;">Name</td>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528; font-weight: 600;">${data.customerName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #8c7e6a;">Email</td>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528;">${data.customerEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #8c7e6a;">Phone</td>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528;">${data.customerPhone}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Order Items -->
          <tr>
            <td style="padding: 28px 40px 0;">
              <h2 style="margin: 0 0 16px; font-family: 'Georgia', serif; font-size: 16px; color: #5c4f3c; border-bottom: 2px solid #f0ece8; padding-bottom: 8px;">
                Order Items
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f0ece8; border-radius: 8px; overflow: hidden;">
                <thead>
                  <tr style="background-color: #faf8f5;">
                    <th style="padding: 10px 16px; font-family: 'Segoe UI', sans-serif; font-size: 12px; color: #8c7e6a; text-align: left; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                    <th style="padding: 10px 16px; font-family: 'Segoe UI', sans-serif; font-size: 12px; color: #8c7e6a; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                    <th style="padding: 10px 16px; font-family: 'Segoe UI', sans-serif; font-size: 12px; color: #8c7e6a; text-align: right; text-transform: uppercase; letter-spacing: 0.5px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>
            </td>
          </tr>

          <!-- Totals -->
          <tr>
            <td style="padding: 20px 40px 0;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 6px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #8c7e6a;">Subtotal</td>
                  <td style="padding: 6px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528; text-align: right;">${formatIDR(data.subtotal)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #8c7e6a;">Shipping</td>
                  <td style="padding: 6px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528; text-align: right;">${data.shippingCost > 0 ? formatIDR(data.shippingCost) : "Free"}</td>
                </tr>
                <tr>
                  <td style="padding: 12px 0 0; font-family: 'Segoe UI', sans-serif; font-size: 18px; color: #5c4f3c; font-weight: 700; border-top: 2px solid #f0ece8;">Total</td>
                  <td style="padding: 12px 0 0; font-family: 'Segoe UI', sans-serif; font-size: 18px; color: #5c4f3c; font-weight: 700; text-align: right; border-top: 2px solid #f0ece8;">${formatIDR(data.totalAmount)}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Delivery Info -->
          <tr>
            <td style="padding: 28px 40px 0;">
              <h2 style="margin: 0 0 16px; font-family: 'Georgia', serif; font-size: 16px; color: #5c4f3c; border-bottom: 2px solid #f0ece8; padding-bottom: 8px;">
                Delivery Details
              </h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #8c7e6a; width: 140px;">Method</td>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528; font-weight: 600;">${formatDeliveryMethod(data.deliveryMethod)}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #8c7e6a;">Date</td>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528;">${data.deliveryDate}</td>
                </tr>
                ${
                  data.deliveryTime
                    ? `
                <tr>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #8c7e6a;">Time</td>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528;">${data.deliveryTime}</td>
                </tr>`
                    : ""
                }
                <tr>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #8c7e6a;">Paper Bag</td>
                  <td style="padding: 8px 0; font-family: 'Segoe UI', sans-serif; font-size: 14px; color: #3d3528;">${data.includePaperBag ? "Yes" : "No"}</td>
                </tr>
                ${addressBlock}
                ${messageCardBlock}
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 32px 40px; text-align: center;">
              <p style="margin: 0; font-family: 'Segoe UI', sans-serif; font-size: 12px; color: #b5ab9a;">
                This is an automated notification from Fiorisce.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Send Admin Notification ──────────────────────────────────────────────────

export async function sendOrderNotificationToAdmin(data: OrderMailData) {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!process.env.RESEND_API_KEY) {
    console.warn("[mail] RESEND_API_KEY is not set — skipping order notification email.");
    return;
  }

  if (!adminEmail) {
    console.warn("[mail] ADMIN_EMAIL is not set — skipping order notification email.");
    return;
  }

  try {
    const { error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL ?? "Fiorisce <onboarding@resend.dev>",
      to: adminEmail,
      subject: `🌸 New Order ${data.orderNumber} — ${formatIDR(data.totalAmount)}`,
      html: buildAdminOrderEmailHtml(data),
    });

    if (error) {
      console.error("[mail] Failed to send order notification:", error);
    }
  } catch (err) {
    // Non-blocking — don't fail the order if email fails
    console.error("[mail] Error sending order notification:", err);
  }
}
