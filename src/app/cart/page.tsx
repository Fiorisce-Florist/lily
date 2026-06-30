import { Metadata } from "next";
import { CartModule } from "@/modules/CartModule";

export const metadata: Metadata = {
  title: "Cart",
};

export default function CartPage() {
  return <CartModule />;
}
