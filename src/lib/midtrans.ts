// Midtrans Snap helper — wraps the midtrans-client Node SDK
// Docs: https://docs.midtrans.com/en/snap/integration-guide

import MidtransClient from "midtrans-client";

const snap = new MidtransClient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === "true",
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.MIDTRANS_CLIENT_KEY!,
});

export interface MidtransItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface MidtransTransactionParams {
  orderId: string;
  amount: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  items: MidtransItem[];
}

/**
 * Creates a Snap transaction and returns the `token` to be used by Snap.js on the client.
 */
export async function createMidtransTransaction(
  params: MidtransTransactionParams
): Promise<string> {
  const parameter = {
    transaction_details: {
      order_id: params.orderId,
      gross_amount: params.amount,
    },
    customer_details: {
      first_name: params.firstName,
      last_name: params.lastName,
      email: params.email,
      phone: params.phone,
    },
    item_details: params.items.map((item) => ({
      id: item.id,
      name: item.name.slice(0, 50), // Midtrans max 50 chars
      price: Math.round(item.price),
      quantity: item.quantity,
    })),
    callbacks: {
      finish: `${process.env.NEXTAUTH_URL}/orders`,
    },
  };

  const response = await snap.createTransaction(parameter);
  return response.token as string;
}

/**
 * Verifies a Midtrans notification payload and returns the transaction status.
 */
export async function verifyMidtransNotification(notification: Record<string, unknown>) {
  const statusResponse = await snap.transaction.notification(notification);
  return statusResponse;
}

export { snap };
