export type OrderStatus = "PENDING" | "PAID" | "PROCESSING" | "SHIPPED" | "COMPLETED" | "CANCELLED";

export interface OrderItemType {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  image?: string; // Adding image for UI purposes, standard Prisma schema might join this
}

export interface OrderType {
  id: string;
  orderNumber: string;
  subtotal: number;
  shippingCost: number;
  totalAmount: number;
  status: OrderStatus;
  createdAt: string; // ISO string
  items: OrderItemType[];
}

export const MOCK_ORDERS: OrderType[] = [
  {
    id: "ord_1",
    orderNumber: "FIO-8932",
    subtotal: 1250000,
    shippingCost: 0,
    totalAmount: 1250000,
    status: "PROCESSING",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1).toISOString(), // 1 day ago
    items: [
      {
        id: "item_1",
        productId: "p_1",
        productName: "The Classic Romance",
        quantity: 1,
        unitPrice: 750000,
        image: "https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=600&q=80",
      },
      {
        id: "item_2",
        productId: "p_2",
        productName: "Midnight Velvet",
        quantity: 1,
        unitPrice: 500000,
        image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?w=600&q=80",
      },
    ],
  },
  {
    id: "ord_2",
    orderNumber: "FIO-8421",
    subtotal: 450000,
    shippingCost: 25000,
    totalAmount: 475000,
    status: "COMPLETED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(), // 14 days ago
    items: [
      {
        id: "item_3",
        productId: "p_3",
        productName: "Sunshine Bliss",
        quantity: 1,
        unitPrice: 450000,
        image: "https://images.unsplash.com/photo-1508610048659-a06b669e3321?w=600&q=80",
      },
    ],
  },
  {
    id: "ord_3",
    orderNumber: "FIO-7102",
    subtotal: 1800000,
    shippingCost: 0,
    totalAmount: 1800000,
    status: "CANCELLED",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 45).toISOString(), // 45 days ago
    items: [
      {
        id: "item_4",
        productId: "p_4",
        productName: "Royal Peony Cascade",
        quantity: 2,
        unitPrice: 900000,
        image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?w=600&q=80",
      },
    ],
  },
];
