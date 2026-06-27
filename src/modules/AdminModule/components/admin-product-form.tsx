"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Trash2 } from "lucide-react";
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
  type AdminProductVariantData,
} from "@/app/actions/admin";

interface Category {
  id: string;
}

interface AdminProductFormProps {
  mode: "create" | "edit";
  productId?: string;
  categories: { id: string; name: string }[];
  tags?: { id: string; name: string; type: string }[];
  defaultValues?: Partial<AdminProductFormData>;
}

export function AdminProductForm({
  mode,
  productId,
  categories,
  tags = [],
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
    variants: defaultValues?.variants ?? [],
    tagIds: defaultValues?.tagIds ?? [],
  });

  const set = (key: keyof AdminProductFormData) => (v: string | number | boolean | string[]) =>
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

  // ─── Variant helpers ──────────────────────────────────────────────────────
  const addVariant = () => {
    setForm((prev) => ({
      ...prev,
      variants: [
        ...(prev.variants ?? []),
        { variantName: "", additionalPrice: 0, isAvailable: true, imageUrl: "" },
      ],
    }));
  };

  const removeVariant = (index: number) => {
    setForm((prev) => ({
      ...prev,
      variants: (prev.variants ?? []).filter((_, i) => i !== index),
    }));
  };

  const updateVariant = (
    index: number,
    field: keyof AdminProductVariantData,
    value: string | number | boolean
  ) => {
    setForm((prev) => ({
      ...prev,
      variants: (prev.variants ?? []).map((v, i) =>
        i === index ? { ...v, [field]: value } : v
      ),
    }));
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

      {/* Pricing, Category & Tags */}
      <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
        <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Pricing, Category &amp; Tags
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
            <Select value={form.categoryId} onValueChange={(value) => set("categoryId")(value)}>
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

          <div className="space-y-1.5 sm:col-span-2">
            <Label className="text-b6">Tags</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {tags.map((tag) => (
                <label key={tag.id} className="flex items-center gap-2 border rounded-md px-3 py-2 cursor-pointer hover:bg-neutral-50 dark:hover:bg-neutral-800">
                  <input
                    type="checkbox"
                    className="rounded border-neutral-300 dark:border-neutral-700"
                    checked={form.tagIds?.includes(tag.id) || false}
                    onChange={(e) => {
                      const newIds = e.target.checked
                        ? [...(form.tagIds || []), tag.id]
                        : (form.tagIds || []).filter((id) => id !== tag.id);
                      set("tagIds")(newIds);
                    }}
                  />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">{tag.name}</span>
                    <span className="text-xs text-neutral-500">{tag.type}</span>
                  </div>
                </label>
              ))}
            </div>
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

      {/* Size Variants */}
      <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
              Bouquet Sizes
            </h2>
            <p className="text-b6 font-inter text-neutral-400 mt-1">
              Add size options with pricing. The additional price is added to the base price above.
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={addVariant}
            className="gap-1.5"
          >
            <Plus className="h-4 w-4" />
            Add Size
          </Button>
        </div>

        {(form.variants ?? []).length === 0 ? (
          <div className="rounded-xl border-2 border-dashed border-neutral-200 dark:border-neutral-700 py-8 text-center">
            <p className="text-b5 font-inter text-neutral-400">
              No size variants yet. Click &ldquo;Add Size&rdquo; to create options like Small, Medium, Large.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {(form.variants ?? []).map((variant, index) => (
              <div
                key={variant.id ?? `new-${index}`}
                className="flex items-start gap-3 p-4 rounded-xl bg-cornsilk-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50"
              >
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor={`variant-name-${index}`} className="text-b6">
                      Size Name <span className="text-blush-500">*</span>
                    </Label>
                    <Input
                      id={`variant-name-${index}`}
                      required
                      placeholder="e.g., Small, Medium, Large"
                      value={variant.variantName}
                      onChange={(e) =>
                        updateVariant(index, "variantName", e.target.value)
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label
                      htmlFor={`variant-price-${index}`}
                      className="text-b6"
                    >
                      Additional Price (IDR)
                    </Label>
                    <Input
                      id={`variant-price-${index}`}
                      type="number"
                      min={0}
                      step={1000}
                      placeholder="e.g., 50000"
                      value={variant.additionalPrice || ""}
                      onChange={(e) =>
                        updateVariant(
                          index,
                          "additionalPrice",
                          Number(e.target.value)
                        )
                      }
                    />
                    <p className="text-[11px] font-inter text-neutral-400">
                      Total: IDR{" "}
                      {((form.price || 0) + (variant.additionalPrice || 0)).toLocaleString("id-ID")}
                    </p>
                  </div>
                  
                  {/* Variant Image */}
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label htmlFor={`variant-image-${index}`} className="text-b6">
                      Image URL (Optional)
                    </Label>
                    <div className="flex gap-3 items-center">
                      <Input
                        id={`variant-image-${index}`}
                        type="url"
                        placeholder="https://example.com/variant-image.jpg"
                        value={variant.imageUrl ?? ""}
                        onChange={(e) =>
                          updateVariant(index, "imageUrl", e.target.value)
                        }
                        className="flex-1"
                      />
                      {variant.imageUrl && (
                        <div className="relative h-10 w-10 overflow-hidden rounded-md bg-cornsilk-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={variant.imageUrl}
                            alt="Preview"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <div className="flex items-center gap-1.5">
                    <Checkbox
                      id={`variant-available-${index}`}
                      checked={variant.isAvailable ?? true}
                      onCheckedChange={(checked) =>
                        updateVariant(index, "isAvailable", !!checked)
                      }
                    />
                    <Label
                      htmlFor={`variant-available-${index}`}
                      className="text-b6 font-inter text-neutral-500 dark:text-neutral-400 cursor-pointer whitespace-nowrap"
                    >
                      In Stock
                    </Label>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(index)}
                    className="text-neutral-400 hover:text-red-500 dark:hover:text-red-400 p-1.5 h-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
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
        <Button type="submit" variant="primary" disabled={isSubmitting} className="min-w-35">
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
