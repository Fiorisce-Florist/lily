export interface CheckoutCustomer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

export interface CheckoutLineItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
}

export interface CreateCheckoutInput {
  orderNumber: string;
  amount: number;
  customer: CheckoutCustomer;
  lineItems: CheckoutLineItem[];
  successUrl: string;
  notificationUrl: string;
}

export interface CreateCheckoutResult {
  provider: string;
  checkoutUrl: string;
  transactionId: string;
  raw: unknown;
}

export interface PaymentProvider {
  readonly method: string;
  createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutResult>;
}
