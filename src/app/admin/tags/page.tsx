import Link from "next/link";
import { Plus, Edit } from "lucide-react";
import { adminGetTags } from "@/app/actions/admin";

export const metadata = {
  title: "Tags | Admin Dashboard",
};

export default async function AdminTagsPage() {
  const tags = await adminGetTags();

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            Tags
          </h1>
          <p className="text-b5 font-inter text-neutral-500">
            Manage tags (Colors, Flowers, Occasions)
          </p>
        </div>
        <Link
          href="/admin/tags/new"
          className="inline-flex items-center justify-center rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 dark:bg-cornsilk-100 dark:text-neutral-900 dark:hover:bg-white transition-colors gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Tag
        </Link>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-950 border-b border-neutral-200 dark:border-neutral-800">
              <tr>
                <th className="px-6 py-4 font-fraunces font-medium text-neutral-600 dark:text-neutral-300">Type</th>
                <th className="px-6 py-4 font-fraunces font-medium text-neutral-600 dark:text-neutral-300">Name</th>
                <th className="px-6 py-4 font-fraunces font-medium text-neutral-600 dark:text-neutral-300">Slug</th>
                <th className="px-6 py-4 font-fraunces font-medium text-neutral-600 dark:text-neutral-300">Products</th>
                <th className="px-6 py-4 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {tags.map((tag) => (
                <tr key={tag.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-inter font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-300">
                      {tag.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">{tag.name}</td>
                  <td className="px-6 py-4 text-neutral-500">{tag.slug}</td>
                  <td className="px-6 py-4 text-neutral-500">{tag._count?.products || 0}</td>
                  <td className="px-6 py-4 text-right">
                    <Link href={`/admin/tags/${tag.id}/edit`} className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Link>
                  </td>
                </tr>
              ))}
              {tags.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-neutral-500">
                    No tags found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
