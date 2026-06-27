import { AdminTagForm } from "@/modules/AdminModule/components/admin-tag-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { adminGetTag } from "@/app/actions/admin";
import { notFound } from "next/navigation";

export const metadata = {
  title: "Edit Tag | Admin",
};

export default async function EditTagPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tag = await adminGetTag(id);

  if (!tag) {
    notFound();
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/tags" className="text-neutral-500 hover:text-neutral-900">
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            Edit Tag
          </h1>
        </div>
      </div>
      <AdminTagForm 
        mode="edit" 
        tagId={tag.id} 
        defaultValues={{
          name: tag.name,
          slug: tag.slug,
          description: tag.description || "",
          type: tag.type,
        }} 
      />
    </div>
  );
}
