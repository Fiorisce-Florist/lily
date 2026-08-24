import { adminGetPickupAvailability } from "@/app/actions/admin";
import { PickupAvailabilityView } from "@/modules/AdminModule/views/PickupAvailabilityView";

export const metadata = {
  title: "Pickup Availability",
};

export default async function AdminPickupAvailabilityPage() {
  const data = await adminGetPickupAvailability();

  return <PickupAvailabilityView initialDates={data.dates} />;
}
