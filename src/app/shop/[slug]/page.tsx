import { notFound } from "next/navigation";
import { ProductDetailModule } from "@/modules/ProductDetailModule";
import { getProductBySlug, getProducts } from "@/app/actions/products";
import { mapProductToBouquet } from "@/lib/product-mapper";

export async function generateStaticParams() {
  const { products } = await getProducts();
  return (products || []).map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} — Fiorisce`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);
  if (!product) notFound();

  const { products: allProducts } = await getProducts();
  const relatedBouquets = (allProducts || []).map(mapProductToBouquet);
  const bouquet = mapProductToBouquet(product);

  return <ProductDetailModule bouquet={bouquet} relatedBouquets={relatedBouquets} />;
}
