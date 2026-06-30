import { OrderDetailModule } from "@/modules/OrderDetailModule";
import { getOrderByNumber } from "@/app/actions/orders";
import { generateDynamicQris } from "@/lib/qr";

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
  
  let qrisString = "";
  if (order && order.status === "PENDING" && order.payment?.paymentMethod === "QRIS") {
    const baseQris = process.env.QR_STRING || "";
    if (baseQris) {
      qrisString = generateDynamicQris(baseQris, Number(order.totalAmount));
    }
  }

  return <OrderDetailModule order={order} orderNumber={orderNumber} error={error} qrisString={qrisString} />;
}
