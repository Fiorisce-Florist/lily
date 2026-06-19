import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminGetCategories } from "@/app/actions/admin";
import { AdminProductForm } from "@/modules/AdminModule/components/admin-product-form";

export const metadata: Metadata = { title: "New Product" };

export default async function NewProductPage() {
  const categories = await adminGetCategories();

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
          Add New Product
        </h1>
        <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400 mt-1">
          Create a new bouquet listing for your shop.
        </p>
      </div>

      <AdminProductForm
        mode="create"
        categories={categories.map((c) => ({ id: c.id, name: c.name }))}
      />
    </div>
  );
}
