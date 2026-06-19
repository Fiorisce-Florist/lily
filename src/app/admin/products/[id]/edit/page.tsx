import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { notFound } from "next/navigation";
import { adminGetProduct, adminGetCategories } from "@/app/actions/admin";
import { AdminProductForm } from "@/modules/AdminModule/components/admin-product-form";

export const metadata: Metadata = { title: "Edit Product" };

interface EditProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params;
  const [{ product, error }, categories] = await Promise.all([
    adminGetProduct(id),
    adminGetCategories(),
  ]);

  if (error || !product) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-2 text-b4 font-inter text-neutral-500 hover:text-neutral-900 dark:hover:text-cornsilk-100 mb-4 transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to Products
        </Link>
        <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
          Edit Product
        </h1>
        <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400 mt-1">
          {product.name}
        </p>
      </div>

      <AdminProductForm
        mode="edit"
        productId={id}
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
        defaultValues={{
          name: product.name,
          slug: product.slug,
          categoryId: product.categoryId,
          price: product.price,
          description: product.description,
          isAvailable: product.isAvailable,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          status: product.status as any,
          imageUrl: product.imageUrl,
        }}
      />
    </div>
  );
}
