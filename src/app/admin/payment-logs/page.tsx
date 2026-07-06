import { adminGetCheckoutLogs } from "@/app/actions/admin";
import { PaymentLogsView } from "@/modules/AdminModule/views/PaymentLogsView";

export const metadata = {
  title: "Payment Logs",
};

export default async function AdminPaymentLogsPage() {
  const data = await adminGetCheckoutLogs();

  return (
    <div className="p-6">
      <PaymentLogsView data={data} />
    </div>
  );
}
