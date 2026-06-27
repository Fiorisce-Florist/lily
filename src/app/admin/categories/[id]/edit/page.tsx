import { AdminCategoryForm } from "@/modules/AdminModule/components/admin-category-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminGetCategory } from "@/app/actions/admin";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Category | Admin",
};

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = await adminGetCategory(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="text-neutral-500 hover:text-neutral-900">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            Edit Category
          </h1>
        </div>
      </div>
      <AdminCategoryForm 
        mode="edit" 
        categoryId={category.id} 
        defaultValues={{
          name: category.name,
          slug: category.slug,
          description: category.description || "",
        }} 
      />
    </div>
  );
}
