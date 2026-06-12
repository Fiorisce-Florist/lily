import { OrderDetailModule } from "@/modules/OrderDetailModule";

export const metadata = {
  title: "Order Details — Fiorisce",
  description: "View the details and tracking status of your order.",
};

interface OrderDetailsPageProps {
  params: {
    orderNumber: string;
  };
}

export default async function OrderDetailsPage({ params }: OrderDetailsPageProps) {
  return <OrderDetailModule orderNumber={params.orderNumber} />;
}
