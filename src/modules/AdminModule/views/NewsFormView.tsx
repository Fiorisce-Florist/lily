"use client";

import { useState } from "react";
import type { CheckedState } from "@radix-ui/react-checkbox";
import { useRouter } from "next/navigation";
import { adminCreateNews, adminUpdateNews, type AdminNewsFormData } from "@/app/actions/admin-news";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Save, Loader2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

type InitialData = {
  id?: string;
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  isPublished?: boolean;
  // allow other fields from prisma like createdAt, updatedAt, authorId
  [key: string]: any;
};

export function NewsFormView({ initialData }: { initialData?: InitialData }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditing = !!initialData?.id;

  const [formData, setFormData] = useState<AdminNewsFormData>({
    title: initialData?.title || "",
    slug: initialData?.slug || "",
    content: initialData?.content || "",
    excerpt: initialData?.excerpt || "",
    imageUrl: initialData?.imageUrl || "",
    isPublished: initialData?.isPublished ?? false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "title" && !isEditing) {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      }));
    }
  };

  const handlePublishedChange = (checked: CheckedState) => {
    setFormData((prev) => ({ ...prev, isPublished: checked === true }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (isEditing) {
        const { error } = await adminUpdateNews(initialData.id!, formData);
        if (error) throw new Error(error);
        toast.success("News updated successfully");
      } else {
        const { error } = await adminCreateNews(formData);
        if (error) throw new Error(error);
        toast.success("News created successfully");
      }
      router.push("/admin/news");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col gap-3">
       <Link
          href="/admin/news"
          className="inline-flex items-center gap-2 text-b4 font-inter text-neutral-500 hover:text-neutral-900 dark:hover:text-cornsilk-100 mb-4 transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
          Back to News
        </Link>
          <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
            {isEditing ? "Edit News" : "Create News"}
          </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="News title"
              />
            </div>

            <div>
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                name="slug"
                type="text"
                required
                value={formData.slug}
                onChange={handleChange}
                placeholder="news-title-slug"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                value={formData.excerpt || ""}
                onChange={handleChange}
                placeholder="Short description of the news"
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                name="content"
                required
                rows={10}
                value={formData.content}
                onChange={handleChange}
                placeholder="Write the full content here... (Markdown/HTML supported if your renderer supports it)"
              />
            </div>

            <div>
              <Label htmlFor="imageUrl">Cover Image URL</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl || ""}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onCheckedChange={handlePublishedChange}
              />
              <Label htmlFor="isPublished">Publish immediately</Label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/news">Cancel</Link>
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            {isEditing ? "Save Changes" : "Create News"}
          </Button>
        </div>
      </form>
    </div>
  );
}
