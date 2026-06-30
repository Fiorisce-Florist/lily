import { OrderModule } from "@/modules/OrderModule";
import { getUserOrders } from "@/app/actions/orders";

export const metadata = {
  title: "My Orders",
  description: "View your past orders, track current shipments, and manage your purchase history.",
};

export default async function OrdersPage() {
  const { orders, error } = await getUserOrders();
  return <OrderModule orders={orders} error={error} />;
}
