declare module "midtrans-client" {
  interface SnapConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface CoreApiConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey: string;
  }

  interface TransactionDetails {
    order_id: string;
    gross_amount: number;
  }

  interface CreateTransactionInput {
    transaction_details: TransactionDetails;
    item_details?: unknown[];
    customer_details?: Record<string, unknown>;
  }

  interface TransactionResult {
    token: string;
    redirect_url: string;
  }

  class Snap {
    constructor(config: SnapConfig);
    createTransaction(input: CreateTransactionInput): Promise<TransactionResult>;
  }

  class CoreApi {
    constructor(config: CoreApiConfig);
    transaction: {
      status(orderId: string): Promise<Record<string, string>>;
      cancel(orderId: string): Promise<Record<string, unknown>>;
      refund(
        orderId: string,
        params: Record<string, unknown>
      ): Promise<Record<string, unknown>>;
    };
  }
}
