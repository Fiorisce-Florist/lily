import { CheckoutModule } from "@/modules/CheckoutModule";
import { getProfile, getUserAddresses } from "@/app/actions/profile";

export const metadata = {
  title: "Checkout — Fiorisce",
  description: "Complete your purchase securely.",
};

export default async function CheckoutPage() {
  const [{ profile }, { addresses }] = await Promise.all([getProfile(), getUserAddresses()]);

  return <CheckoutModule profile={profile} addresses={addresses} />;
}
