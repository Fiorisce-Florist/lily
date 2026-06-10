import { AbstractPaymentProvider, BigNumber } from "@medusajs/framework/utils";
import {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types";
import MidtransClient from "midtrans-client";

type MidtransOptions = {
  serverKey: string;
  clientKey: string;
  isProduction?: boolean;
};

class MidtransPaymentProvider extends AbstractPaymentProvider<MidtransOptions> {
  static identifier = "midtrans";

  protected snap: MidtransClient.Snap;
  protected core: MidtransClient.CoreApi;

  constructor(container: Record<string, unknown>, options: MidtransOptions) {
    super(container, options);
    this.snap = new MidtransClient.Snap({
      isProduction: options.isProduction ?? false,
      serverKey: options.serverKey,
      clientKey: options.clientKey,
    });
    this.core = new MidtransClient.CoreApi({
      isProduction: options.isProduction ?? false,
      serverKey: options.serverKey,
      clientKey: options.clientKey,
    });
  }

  async initiatePayment(input: InitiatePaymentInput): Promise<InitiatePaymentOutput> {
    const { amount, currency_code, context } = input;
    const orderId = `FIORISCE-${Date.now()}`;

    const transaction = await this.snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: Number(amount),
      },
      customer_details: context?.customer ?? {},
    });

    return {
      id: orderId,
      data: {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
        order_id: orderId,
      },
    };
  }

  async authorizePayment(input: AuthorizePaymentInput): Promise<AuthorizePaymentOutput> {
    const orderId = input.data?.order_id as string;

    const status = await this.core.transaction.status(orderId);
    const sessionStatus = this.mapTransactionStatus(
      status.transaction_status,
      status.fraud_status
    );

    return {
      status: sessionStatus,
      data: { ...input.data, ...status },
    };
  }

  async capturePayment(input: CapturePaymentInput): Promise<CapturePaymentOutput> {
    return { data: input.data ?? {} };
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    const orderId = input.data?.order_id as string;
    const result = await this.core.transaction.cancel(orderId);
    return { data: result };
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: input.data ?? {} };
  }

  async getPaymentStatus(input: GetPaymentStatusInput): Promise<GetPaymentStatusOutput> {
    const orderId = input.data?.order_id as string;
    try {
      const status = await this.core.transaction.status(orderId);
      return {
        status: this.mapTransactionStatus(
          status.transaction_status,
          status.fraud_status
        ),
      };
    } catch {
      return { status: "pending" };
    }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    const orderId = input.data?.order_id as string;
    const result = await this.core.transaction.refund(orderId, {
      refund_key: `refund-${Date.now()}`,
      amount: Number(input.amount),
      reason: "Customer refund request",
    });
    return { data: { ...input.data, refund: result } };
  }

  async retrievePayment(input: RetrievePaymentInput): Promise<RetrievePaymentOutput> {
    const orderId = input.data?.order_id as string;
    const result = await this.core.transaction.status(orderId);
    return { data: result };
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return { data: input.data ?? {} };
  }

  async getWebhookActionAndData(
    payload: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    const { data } = payload;
    const transactionStatus = data.transaction_status as string;
    const fraudStatus = data.fraud_status as string;
    const sessionId = data.session_id as string;
    const grossAmount = Number(data.gross_amount ?? 0);

    if (
      (transactionStatus === "capture" && fraudStatus === "accept") ||
      transactionStatus === "settlement"
    ) {
      return {
        action: "captured",
        data: {
          session_id: sessionId,
          amount: new BigNumber(grossAmount),
        },
      };
    }

    if (
      transactionStatus === "cancel" ||
      transactionStatus === "deny" ||
      transactionStatus === "expire"
    ) {
      return {
        action: "failed",
        data: {
          session_id: sessionId,
          amount: new BigNumber(grossAmount),
        },
      };
    }

    return {
      action: "not_supported",
      data: {
        session_id: sessionId,
        amount: new BigNumber(0),
      },
    };
  }

  private mapTransactionStatus(
    transactionStatus: string,
    fraudStatus?: string
  ): "authorized" | "captured" | "pending" | "canceled" | "error" | "requires_more" {
    if (fraudStatus === "deny") return "error";

    switch (transactionStatus) {
      case "capture":
        return fraudStatus === "challenge" ? "requires_more" : "authorized";
      case "settlement":
        return "captured";
      case "pending":
        return "pending";
      case "deny":
      case "expire":
      case "failure":
        return "error";
      case "cancel":
        return "canceled";
      default:
        return "pending";
    }
  }
}

export default MidtransPaymentProvider;
