import Link from "next/link";
import Image from "next/image";
import { Plus, Package } from "lucide-react";
import type { adminGetAllProducts } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { AdminProductActions } from "@/modules/AdminModule/components/admin-product-actions";
import { AdminPagination } from "@/modules/AdminModule/components/admin-pagination";
import { AdminSearch } from "@/modules/AdminModule/components/admin-search";
import { formatPrice } from "@/lib/formatters";


type ProductsList = Awaited<ReturnType<typeof adminGetAllProducts>>;




export function ProductsView({
  data,
  search,
  page,
}: {
  data: ProductsList;
  search: string;
  page: number;
}) {
  const { products, totalCount, totalPages } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
            Products
          </h1>
          <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400 mt-1">
            {totalCount} product{totalCount !== 1 ? "s" : ""} total
          </p>
        </div>
        <div className="flex items-center gap-4">
          <AdminSearch placeholder="Search products..." initialValue={search} />
          <Button variant="primary" asChild>
            <Link href="/admin/products/new" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-12 w-12 text-neutral-300 mb-4" />
            <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
              No products yet
            </h2>
            <p className="text-b5 font-inter text-neutral-500 mt-2 mb-6">
              Start by adding your first product.
            </p>
            <Button variant="primary" asChild>
              <Link href="/admin/products/new">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Link>
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 dark:bg-neutral-800/50 border-b border-neutral-200 dark:border-neutral-800">
                <tr>
                  {["Product", "Category", "Price", "Sold", "Status", "Actions"].map((h) => (
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
                {products.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                  >
                    {/* Product info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-cornsilk-100 dark:bg-neutral-800">
                          {product.image ? (
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <Package className="h-5 w-5 text-neutral-300" />
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/shop/${product.slug}`}
                            className="font-inter font-medium text-neutral-900 dark:text-cornsilk-100 truncate max-w-50 hover:text-rose-300 dark:hover:text-rose-300"
                          >
                            {product.name}
                          </Link>
                          <p className="text-b6 font-inter text-neutral-400 truncate max-w-50">
                            /{product.slug}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 font-inter text-neutral-600 dark:text-neutral-400">
                      {product.categoryName}
                    </td>
                    <td className="px-6 py-4 font-jetbrains font-medium text-neutral-900 dark:text-cornsilk-100">
                      {product.hasVariants ? (
                        <span className="text-neutral-500">From {formatPrice(product.minPrice)}</span>
                      ) : (
                        formatPrice(product.price)
                      )}
                    </td>
                    <td className="px-6 py-4 font-inter text-neutral-600 dark:text-neutral-400">
                      {product.soldCount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-inter font-medium ${
                          STATUS_COLORS[product.status] ?? ""
                        }`}
                      >
                        {product.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <AdminProductActions productId={product.id} status={product.status} />
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
