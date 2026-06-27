import { AdminCategoryForm } from "@/modules/AdminModule/components/admin-category-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "New Category | Admin",
};

export default function NewCategoryPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories" className="text-neutral-500 hover:text-neutral-900">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            Add New Category
          </h1>
        </div>
      </div>
      <AdminCategoryForm mode="create" />
    </div>
  );
}
