import { HeroSection } from "./sections/hero-section";
import { CategorySection } from "./sections/category-section";
import { FeaturedSection } from "./sections/featured-section";
import { CollectionSection } from "./sections/collection-section";
import { OccasionSection } from "./sections/occasion-section";
import { AboutSection } from "./sections/about-section";
import { LocationSection } from "./sections/location-section";
import { CtaSection } from "./sections/cta-section";

const freshFlowers = [
  {
    id: "ff1",
    name: "Joyful Affection (L)",
    price: "RP 495.000",
    image: "/images/landing/ff_joyful_affection.png",
    slug: "joyful-affection-l",
  },
  {
    id: "ff2",
    name: "Sweet Promise (M)",
    price: "RP 265.000",
    image: "/images/landing/ff_sweet_promises.png",
    slug: "sweet-promise-m",
  },
  {
    id: "ff3",
    name: "Pure Love (L)",
    price: "RP 365.000",
    image: "/images/landing/ff_pure_love.png",
    slug: "pure-love-l",
  },
  {
    id: "ff4",
    name: "Soft Passion (M)",
    price: "RP 365.000",
    image: "/images/landing/ff_soft_passion.png",
    slug: "soft-passion-m",
  },
];

const artificialFlowers = [
  {
    id: "af1",
    name: "Cotton Pearl (XL)",
    price: "RP 515.000",
    image: "/images/landing/af_cotton_pearl.png",
    slug: "cotton-pearl-xl",
  },
  {
    id: "af2",
    name: "Enchanted (L)",
    price: "RP 405.000",
    image: "/images/landing/af_enchanted.png",
    slug: "enchanted-l",
  },
  {
    id: "af3",
    name: "Buttercup (XL)",
    price: "RP 620.000",
    image: "/images/landing/af_buttercup2.png",
    slug: "buttercup-xl",
  },
  {
    id: "af4",
    name: "The Arctic (M)",
    price: "RP 265.000",
    image: "/images/landing/af_the-arctic.png",
    slug: "the-arctic-m",
  },
];

const papanBunga = [
  {
    id: "pb1",
    name: "Bunga 2 Titik",
    price: "RP 1.500.000",
    image: "/images/landing/pb_bunga-2-titik.png",
    slug: "bunga-2-titik",
  },
  {
    id: "pb2",
    name: "Bunga 2 Titik, 2 Kuping Bunga",
    price: "RP 2.000.000",
    image: "/images/landing/pb_2-titik-2-kuping.png",
    slug: "bunga-2-titik-2-kuping",
  },
  {
    id: "pb3",
    name: "Bunga 2 Titik, 2 Kuping Panjang",
    price: "RP 2.500.000",
    image: "/images/landing/pb_2-titik-2-kuping-panjang.png",
    slug: "bunga-2-titik-2-kuping-panjang",
  },
  {
    id: "pb4",
    name: "Papan Bunga Full Frame",
    price: "RP 3.000.000",
    image: "/images/landing/pb_full-frame.png",
    slug: "papan-bunga-full-frame",
  },
];

export default function LandingModule() {
  return (
    <div className="flex w-full flex-col">
      <HeroSection />
      <CategorySection />
      <FeaturedSection />
      <CollectionSection
        title="Fresh Flower"
        href="/shop?category=fresh-flowers"
        products={freshFlowers}
        variant="light"
      />
      <CollectionSection
        title="Artificial Flower"
        href="/shop?category=artificial-flowers"
        products={artificialFlowers}
        variant="muted"
      />
      <CollectionSection
        title="Papan Bunga"
        href="/shop?category=papan-bunga"
        products={papanBunga}
        variant="light"
        imageFit="contain"
      />
      <OccasionSection />
      <AboutSection />
      <LocationSection />
      <CtaSection />
    </div>
  );
}
