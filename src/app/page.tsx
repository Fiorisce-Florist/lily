import LandingModule from "@/modules/LandingModule";
import { getFeaturedProducts, getProductsByCategory } from "@/app/actions/landing";

export const metadata = {
  title: "Fiorisce — Handcrafted Floral Arrangements",
  description:
    "Discover beautifully handcrafted bouquets for every occasion. Fresh daily arrangements, artificial flowers, and papan bunga — delivered with care.",
};

export default async function HomePage() {
  const [featured, freshFlowers, artificialFlowers, papanBunga] = await Promise.all([
    getFeaturedProducts(8),
    getProductsByCategory("fresh-flowers", 4),
    getProductsByCategory("artificial-flowers", 4),
    getProductsByCategory("papan-bunga", 4),
  ]);

  return (
    <LandingModule
      featured={featured}
      freshFlowers={freshFlowers}
      artificialFlowers={artificialFlowers}
      papanBunga={papanBunga}
    />
  );
}
