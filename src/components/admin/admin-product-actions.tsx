"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Edit, Power, Trash2, MoreHorizontal, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { adminToggleProductStatus, adminDeleteProduct } from "@/app/actions/admin";

interface AdminProductActionsProps {
  productId: string;
  status: string;
}

export function AdminProductActions({ productId, status }: AdminProductActionsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleToggle = async () => {
    setIsLoading(true);
    const result = await adminToggleProductStatus(productId);
    setIsLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`Product ${result.newStatus === "ACTIVE" ? "activated" : "deactivated"}.`);
      router.refresh();
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product? This will mark it as inactive.")) return;
    setIsLoading(true);
    const result = await adminDeleteProduct(productId);
    setIsLoading(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Product deleted.");
      router.refresh();
    }
  };

  if (isLoading) {
    return <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          id={`product-actions-${productId}`}
          aria-label="Product actions"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem asChild>
          <Link href={`/admin/products/${productId}/edit`} className="flex items-center gap-2 cursor-pointer">
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggle} className="flex items-center gap-2 cursor-pointer">
          <Power className="h-3.5 w-3.5" />
          {status === "ACTIVE" ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="flex items-center gap-2 cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20"
        >
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
