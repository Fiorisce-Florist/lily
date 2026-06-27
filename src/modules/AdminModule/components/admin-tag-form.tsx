"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { adminCreateTag, adminUpdateTag, adminDeleteTag } from "@/app/actions/admin";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminTagFormProps {
  mode: "create" | "edit";
  tagId?: string;
  defaultValues?: {
    name: string;
    slug: string;
    description: string;
    type: string;
  };
}

const TAG_TYPES = ["GENERAL", "FLOWER", "COLOR", "OCCASION"] as const;

export function AdminTagForm({ mode, tagId, defaultValues }: AdminTagFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);
  
  const [form, setForm] = React.useState({
    name: defaultValues?.name || "",
    slug: defaultValues?.slug || "",
    description: defaultValues?.description || "",
    type: defaultValues?.type || "GENERAL",
  });

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setForm((prev) => ({
      ...prev,
      name: newName,
      slug: mode === "create" && !prev.slug.includes("-manual-") ? generateSlug(newName) : prev.slug,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    let res;
    if (mode === "create") {
      res = await adminCreateTag({
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        type: form.type as any,
      });
    } else {
      res = await adminUpdateTag(tagId!, {
        name: form.name,
        slug: form.slug,
        description: form.description || undefined,
        type: form.type as any,
      });
    }

    setIsSubmitting(false);

    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success(`Tag ${mode === "create" ? "created" : "updated"} successfully!`);
      router.push("/admin/tags");
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this tag?")) return;
    setIsDeleting(true);
    const res = await adminDeleteTag(tagId!);
    setIsDeleting(false);
    
    if (res.error) {
      toast.error(res.error);
    } else {
      toast.success("Tag deleted");
      router.push("/admin/tags");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
        <h2 className="text-h5 font-fraunces font-semibold">Basic Details</h2>
        
        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="type">Tag Type</Label>
            <Select 
              value={form.type} 
              onValueChange={(val) => setForm((prev) => ({ ...prev, type: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {TAG_TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              required
              value={form.name}
              onChange={handleNameChange}
              placeholder="e.g. Graduation"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="slug">Slug</Label>
            <Input
              id="slug"
              required
              value={form.slug}
              onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
              placeholder="e.g. graduation"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief description..."
              className="h-24"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {mode === "create" ? "Create Tag" : "Save Changes"}
        </Button>
        {mode === "edit" && (
          <Button type="button" variant="outline" className="text-red-500 hover:text-red-600 border-red-200 hover:bg-red-50" onClick={handleDelete} disabled={isDeleting}>
            {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Delete Tag
          </Button>
        )}
      </div>
    </form>
  );
}
