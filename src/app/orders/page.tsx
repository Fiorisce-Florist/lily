import { OrderModule } from "@/modules/OrderModule";

export const metadata = {
  title: "My Orders — Fiorisce",
  description: "View your past orders, track current shipments, and manage your purchase history.",
};

export default function OrdersPage() {
  return <OrderModule />;
}
