import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import crypto from "crypto";

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? "";
  const body = req.body as Record<string, string>;

  const signatureKey = crypto
    .createHash("sha512")
    .update(
      `${body.order_id}${body.status_code}${body.gross_amount}${serverKey}`
    )
    .digest("hex");

  if (signatureKey !== body.signature_key) {
    res.status(400).json({ message: "Invalid signature" });
    return;
  }

  // Forward to Medusa's internal webhook processing
  // which calls getWebhookActionAndData on the payment provider
  const paymentWebhookUrl = `${req.protocol}://${req.get("host")}/hooks/payment/midtrans_midtrans`;
  try {
    await fetch(paymentWebhookUrl, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
    res.status(200).json({ message: "OK" });
  } catch {
    res.status(500).json({ message: "Internal server error" });
  }
}
