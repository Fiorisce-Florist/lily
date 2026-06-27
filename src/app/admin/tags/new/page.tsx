import { AdminTagForm } from "@/modules/AdminModule/components/admin-tag-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = {
  title: "New Tag | Admin",
};

export default function NewTagPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/tags" className="text-neutral-500 hover:text-neutral-900">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            Add New Tag
          </h1>
        </div>
      </div>
      <AdminTagForm mode="create" />
    </div>
  );
}
