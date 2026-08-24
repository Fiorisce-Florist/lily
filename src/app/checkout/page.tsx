import { CheckoutModule } from "@/modules/CheckoutModule";
import { getProfile, getUserAddresses } from "@/app/actions/profile";
import { getOpenPickupDates } from "@/app/actions/orders";

export const metadata = {
  title: "Checkout",
  description: "Complete your purchase securely.",
};

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  const { dates: openPickupDates } = await getOpenPickupDates();

  if (!session?.user?.id) {
    return <CheckoutModule profile={null} addresses={[]} openPickupDates={openPickupDates} />;
  }

  const [{ profile }, { addresses }] = await Promise.all([getProfile(), getUserAddresses()]);

  return <CheckoutModule profile={profile} addresses={addresses} openPickupDates={openPickupDates} />;
}
