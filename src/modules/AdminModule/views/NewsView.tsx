import Link from "next/link";
import { Plus, Newspaper } from "lucide-react";
import type { adminGetAllNews } from "@/app/actions/admin-news";
import { Button } from "@/components/ui/button";
import { AdminNewsActions } from "@/modules/AdminModule/components/admin-news-actions";
import { AdminPagination } from "@/modules/AdminModule/components/admin-pagination";
import { AdminSearch } from "@/modules/AdminModule/components/admin-search";

type NewsList = Awaited<ReturnType<typeof adminGetAllNews>>;

export function NewsView({ data, search, page }: { data: NewsList; search: string; page: number }) {
  const { news, totalCount, totalPages } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
            News
          </h1>
          <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400 mt-1">
            {totalCount} news article{totalCount !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex items-center gap-4">
          <AdminSearch placeholder="Search news..." initialValue={search} />
          <Button variant="primary" asChild>
            <Link href="/admin/news/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Create News
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        {news.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Newspaper className="h-12 w-12 text-neutral-300 mb-4" />
            <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
              No news yet
            </h2>
            <p className="text-b5 font-inter text-neutral-500 mt-2 mb-6">
              Start by creating your first news article.
            </p>
            <Button variant="primary" asChild>
              <Link href="/admin/news/new">
                <Plus className="h-4 w-4 mr-2" />
                Create News
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  {["Title", "Author", "Status", "Created At", "Actions"].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-3 text-left text-b6 font-inter font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                {news.map((n) => (
                  <tr
                    key={n.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    {/* News info */}
                    <td className="px-6 py-4">
                      <div className="min-w-0">
                        <Link
                          href={`/news/${n.slug}`}
                          target="_blank"
                          className="font-inter font-medium text-neutral-900 dark:text-cornsilk-100 truncate max-w-50 hover:text-rose-300 dark:hover:text-rose-300"
                        >
                          {n.title}
                        </Link>
                        <p className="text-b6 font-inter text-neutral-400 truncate max-w-50">
                          /{n.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-inter text-neutral-600 dark:text-neutral-400">
                      {n.authorName}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-inter font-medium ${
                          n.isPublished
                            ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-400"
                        }`}
                      >
                        {n.isPublished ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-inter text-neutral-600 dark:text-neutral-400">
                      {new Date(n.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <AdminNewsActions newsId={n.id} isPublished={n.isPublished} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {totalPages > 1 && <AdminPagination currentPage={page} totalPages={totalPages} />}
    </div>
  );
}
