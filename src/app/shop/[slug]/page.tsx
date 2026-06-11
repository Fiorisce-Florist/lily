import { notFound } from "next/navigation";
import { ALL_BOUQUETS } from "@/modules/ShopModule/data/bouquets";
import { ProductDetailModule } from "@/modules/ProductDetailModule";

export function generateStaticParams() {
  return ALL_BOUQUETS.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bouquet = ALL_BOUQUETS.find((b) => b.slug === slug);
  if (!bouquet) return {};
  return {
    title: `${bouquet.name} — Fiorisce`,
    description: bouquet.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const bouquet = ALL_BOUQUETS.find((b) => b.slug === slug);
  if (!bouquet) notFound();
  return <ProductDetailModule bouquet={bouquet} />;
}
