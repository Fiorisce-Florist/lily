import { adminGetOrder } from "@/app/actions/admin";
import { OrderDetailView } from "@/modules/AdminModule/views/OrderDetailView";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Order Details | Admin Dashboard",
};

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { order, error } = await adminGetOrder(id);

  if (error || !order) {
    return notFound();
  }

  return (
    <div className="p-6">
      <OrderDetailView order={order} />
    </div>
  );
}
