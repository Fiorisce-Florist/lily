import { OrderDetailModule } from "@/modules/OrderDetailModule";
import { getOrderByNumber } from "@/app/actions/orders";

export const metadata = {
  title: "Order Details — Fiorisce",
  description: "View the details and tracking status of your order.",
};

interface OrderDetailsPageProps {
  params: Promise<{ orderNumber: string }>;
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  const { orderNumber } = await params;
  const { order, error } = await getOrderByNumber(orderNumber);
  return <OrderDetailModule order={order} orderNumber={orderNumber} error={error} />;
}
