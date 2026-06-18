"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  adminCreateProduct,
  adminUpdateProduct,
  type AdminProductFormData,
} from "@/app/actions/admin";

interface Category {
  id: string;
  name: string;
}

interface AdminProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  categories: Category[];
  defaultValues?: Partial<AdminProductFormData>;
}

export function AdminProductForm({
  mode,
  productId,
  categories,
  defaultValues,
}: AdminProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [form, setForm] = React.useState<AdminProductFormData>({
    name: defaultValues?.name ?? "",
    slug: defaultValues?.slug ?? "",
    categoryId: defaultValues?.categoryId ?? categories[0]?.id ?? "",
    price: defaultValues?.price ?? 0,
    description: defaultValues?.description ?? "",
    isAvailable: defaultValues?.isAvailable ?? true,
    status: defaultValues?.status ?? "ACTIVE",
    imageUrl: defaultValues?.imageUrl ?? "",
  });

  const set = (key: keyof AdminProductFormData) => (v: string | number | boolean) =>
    setForm((prev) => ({ ...prev, [key]: v }));

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    set("name")(name);
    if (mode === "create") {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .trim();
      set("slug")(slug);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let result: { error: string | null };

      if (mode === "create") {
        const r = await adminCreateProduct(form);
        result = r;
      } else {
        result = await adminUpdateProduct(productId!, form);
      }

      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success(mode === "create" ? "Product created!" : "Product updated!");
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Basic Info */}
      <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
        <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Basic Information
        </h2>

        <div className="space-y-2">
          <Label htmlFor="name">
            Product Name <span className="text-blush-500">*</span>
          </Label>
          <Input
            id="name"
            required
            placeholder="e.g., Blush Reverie Bouquet"
            value={form.name}
            onChange={(e) => handleNameChange(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="slug">
            URL Slug <span className="text-blush-500">*</span>
          </Label>
          <Input
            id="slug"
            required
            placeholder="e.g., blush-reverie-bouquet"
            value={form.slug}
            onChange={(e) => set("slug")(e.target.value)}
          />
          <p className="text-b6 font-inter text-neutral-400">
            Used in URL: /shop/{form.slug || "your-slug"}
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            rows={4}
            placeholder="Describe this bouquet…"
            value={form.description ?? ""}
            onChange={(e) => set("description")(e.target.value)}
            className="resize-none"
          />
        </div>
      </section>

      {/* Pricing & Category */}
      <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
        <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Pricing &amp; Category
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">
              Price (IDR) <span className="text-blush-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              required
              min={0}
              step={1000}
              placeholder="e.g., 750000"
              value={form.price || ""}
              onChange={(e) => set("price")(Number(e.target.value))}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">
              Category <span className="text-blush-500">*</span>
            </Label>
            <Select
              value={form.categoryId}
              onValueChange={(value) => set("categoryId")(value)}
            >
              <SelectTrigger id="category" className="w-full">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {categories.length === 0 ? (
                  <SelectItem value="" disabled>
                    No categories found
                  </SelectItem>
                ) : (
                  categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Image */}
      <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
        <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Primary Image
        </h2>
        <div className="space-y-2">
          <Label htmlFor="imageUrl">Image URL</Label>
          <Input
            id="imageUrl"
            type="url"
            placeholder="https://example.com/image.jpg"
            value={form.imageUrl ?? ""}
            onChange={(e) => set("imageUrl")(e.target.value)}
          />
          <p className="text-b6 font-inter text-neutral-400">
            Paste a direct image URL. Image upload coming soon.
          </p>
        </div>
        {form.imageUrl && (
          <div className="relative h-32 w-32 overflow-hidden rounded-xl bg-cornsilk-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={form.imageUrl}
              alt="Preview"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        )}
      </section>

      {/* Status */}
      <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
        <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Availability
        </h2>
        <RadioGroup
          value={form.status}
          onValueChange={(val) => set("status")(val)}
          className="flex items-center gap-6"
        >
          {(["ACTIVE", "INACTIVE"] as const).map((s) => (
            <div key={s} className="flex items-center space-x-2">
              <RadioGroupItem value={s} id={`status-${s}`} />
              <Label
                htmlFor={`status-${s}`}
                className="font-inter text-b5 text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                {s}
              </Label>
            </div>
          ))}
        </RadioGroup>
        <div className="flex items-center gap-2 mt-4">
          <Checkbox
            id="isAvailable"
            checked={form.isAvailable ?? true}
            onCheckedChange={(checked) => set("isAvailable")(!!checked)}
          />
          <Label
            htmlFor="isAvailable"
            className="font-inter text-b5 text-neutral-700 dark:text-neutral-300 cursor-pointer"
          >
            In Stock (available to purchase)
          </Label>
        </div>
      </section>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
          className="min-w-[140px]"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving…
            </span>
          ) : mode === "create" ? (
            "Create Product"
          ) : (
            "Save Changes"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
