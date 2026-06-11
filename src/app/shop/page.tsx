import ShopModule from "@/modules/ShopModule";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fiorisce",
  description:
    "Discover handcrafted bouquets for every occasion. Filter by occasion, color, and price. Fresh daily arrangements delivered.",
};

export default function ShopPage() {
  return <ShopModule />;
}
