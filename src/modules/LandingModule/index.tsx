import { HeroSection } from "./sections/hero-section";
import { CategorySection } from "./sections/category-section";
import { FeaturedSection } from "./sections/featured-section";
import { CollectionSection } from "./sections/collection-section";
import { OccasionSection } from "./sections/occasion-section";
import { AboutSection } from "./sections/about-section";
import { LocationSection } from "./sections/location-section";
import { CtaSection } from "./sections/cta-section";
import type { LandingProduct } from "@/app/actions/landing";

interface LandingModuleProps {
  featured: LandingProduct[];
  freshFlowers: LandingProduct[];
  artificialFlowers: LandingProduct[];
  papanBunga: LandingProduct[];
}

export default function LandingModule({
  featured,
  freshFlowers,
  artificialFlowers,
  papanBunga,
}: LandingModuleProps) {
  return (
    <div className="flex w-full flex-col">
      <HeroSection />
      <CategorySection />
      <FeaturedSection products={featured} />

      {freshFlowers.length > 0 && (
        <CollectionSection
          title="Fresh Flower"
          href="/shop?category=fresh-flowers"
          products={freshFlowers}
          variant="light"
        />
      )}

      {artificialFlowers.length > 0 && (
        <CollectionSection
          title="Artificial Flower"
          href="/shop?category=artificial-flowers"
          products={artificialFlowers}
          variant="light"
        />
      )}

      {papanBunga.length > 0 && (
        <CollectionSection
          title="Papan Bunga"
          href="/shop?category=papan-bunga"
          products={papanBunga}
          variant="light"
          imageFit="cover"
        />
      )}

      <OccasionSection />
      <AboutSection />
      <LocationSection />
    </div>
  );
}
