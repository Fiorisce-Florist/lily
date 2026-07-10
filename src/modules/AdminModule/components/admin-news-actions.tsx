"use client";

import { useState } from "react";
import { MoreHorizontal, Edit, Trash, Globe, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { adminToggleNewsStatus, adminDeleteNews } from "@/app/actions/admin-news";
import Link from "next/link";

export function AdminNewsActions({
  newsId,
  isPublished,
}: {
  newsId: string;
  isPublished: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleToggleStatus() {
    setIsLoading(true);
    await adminToggleNewsStatus(newsId);
    setIsLoading(false);
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this news?")) return;
    setIsLoading(true);
    await adminDeleteNews(newsId);
    setIsLoading(false);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" disabled={isLoading}>
          <MoreHorizontal className="h-4 w-4 text-neutral-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 font-inter">
        <DropdownMenuItem asChild>
          <Link href={`/admin/news/${newsId}`} className="cursor-pointer">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleToggleStatus} className="cursor-pointer">
          {isPublished ? (
            <>
              <EyeOff className="h-4 w-4 mr-2" />
              Unpublish
            </>
          ) : (
            <>
              <Globe className="h-4 w-4 mr-2" />
              Publish
            </>
          )}
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleDelete}
          className="cursor-pointer text-red-600 focus:text-red-600"
        >
          <Trash className="h-4 w-4 mr-2" />
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
