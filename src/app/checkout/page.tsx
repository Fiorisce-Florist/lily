import { CheckoutModule } from "@/modules/CheckoutModule";
import { getProfile, getUserAddresses } from "@/app/actions/profile";

export const metadata = {
  title: "Checkout",
  description: "Complete your purchase securely.",
};

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function CheckoutPage() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) {
    return <CheckoutModule profile={null} addresses={[]} />;
  }

  const [{ profile }, { addresses }] = await Promise.all([getProfile(), getUserAddresses()]);

  return <CheckoutModule profile={profile} addresses={addresses} />;
}
