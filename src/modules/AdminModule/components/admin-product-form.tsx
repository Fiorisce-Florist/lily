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
import { CldUploadWidget } from "next-cloudinary";
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
        {
          variantName: "",
          additionalPrice: 0,
          isAvailable: true,
          imageUrl: "",
          stemsQuantity: null,
        },
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
    value: string | number | boolean | null
  ) => {
    setForm((prev) => ({
      ...prev,
      variants: (prev.variants ?? []).map((v, i) => (i === index ? { ...v, [field]: value } : v)),
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

  const tagsByType = React.useMemo(() => {
    return tags.reduce(
      (acc, tag) => {
        const type = tag.type || "OTHER";
        if (!acc[type]) acc[type] = [];
        acc[type].push(tag);
        return acc;
      },
      {} as Record<string, typeof tags>
    );
  }, [tags]);

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
      {/* Basic Info */}
      <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
        <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Basic Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      {/* Organization */}
      <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-5 shadow-sm">
        <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Organization
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div className="space-y-3 md:col-span-2 mt-2">
            <Label className="text-b6">Tags</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border rounded-xl p-5 bg-neutral-50/50 dark:bg-neutral-800/20 border-neutral-200 dark:border-neutral-800">
              {Object.entries(tagsByType)
                .sort(([typeA], [typeB]) => {
                  const order = ["GENERAL", "OCCASION", "COLOR", "FLOWER"];
                  const indexA = order.indexOf(typeA.toUpperCase());
                  const indexB = order.indexOf(typeB.toUpperCase());
                  if (indexA !== -1 && indexB !== -1) return indexA - indexB;
                  if (indexA !== -1) return -1;
                  if (indexB !== -1) return 1;
                  return typeA.localeCompare(typeB);
                })
                .map(([type, typeTags]) => (
                  <div key={type} className="space-y-3">
                    <h4 className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-2">
                      {type}
                      <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-700"></span>
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {typeTags.map((tag) => (
                        <label
                          key={tag.id}
                          className={`flex items-center gap-2 border rounded-lg px-3 py-1.5 cursor-pointer transition-all ${
                            form.tagIds?.includes(tag.id)
                              ? "bg-blush-50 border-blush-300 text-blush-900 dark:bg-blush-900/30 dark:border-blush-700 dark:text-blush-100 shadow-sm"
                              : "bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300"
                          }`}
                        >
                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={form.tagIds?.includes(tag.id) || false}
                            onChange={(e) => {
                              const newIds = e.target.checked
                                ? [...(form.tagIds || []), tag.id]
                                : (form.tagIds || []).filter((id) => id !== tag.id);
                              set("tagIds")(newIds);
                            }}
                          />
                          <span className="text-xs font-medium leading-none">{tag.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing & Inventory */}
      <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-5 shadow-sm">
        <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Pricing &amp; Inventory
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="price">
              Base Price (IDR) <span className="text-blush-500">*</span>
            </Label>
            <Input
              id="price"
              type="number"
              required
              min={0}
              placeholder="e.g., 750000"
              value={form.price ?? ""}
              onChange={(e) => {
                let val = e.target.value;
                if (/^0+(?=\d)/.test(val)) {
                  val = val.replace(/^0+(?=\d)/, "");
                  e.target.value = val;
                }
                set("price")(val === "" ? 0 : Number(val));
              }}
              onWheel={(e) => (e.target as HTMLInputElement).blur()}
              className="text-lg font-medium"
            />
          </div>

          <div className="space-y-4">
            <Label>Availability Status</Label>
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
                    className="font-inter text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer font-medium"
                  >
                    {s}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            <div className="flex items-center gap-2 pt-2">
              <Checkbox
                id="isAvailable"
                checked={form.isAvailable ?? true}
                onCheckedChange={(checked) => set("isAvailable")(!!checked)}
              />
              <Label
                htmlFor="isAvailable"
                className="font-inter text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer"
              >
                In Stock (available to purchase)
              </Label>
            </div>
          </div>
        </div>
      </section>

      {/* Media (Hidden if variants exist per user request) */}
      {(form.variants ?? []).length === 0 && (
        <section className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 shadow-sm">
          <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            Media
          </h2>
          <div className="flex gap-4 items-start">
            <div className="flex-1 space-y-2">
              <Label>Primary Image URL</Label>
              <div className="flex items-center gap-4 mt-2">
                <CldUploadWidget
                  signatureEndpoint="/api/cloudinary/sign"
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  onSuccess={(result: any) => {
                    if (result?.info?.secure_url) {
                      set("imageUrl")(result.info.secure_url);
                    }
                  }}
                  options={{
                    multiple: false,
                    resourceType: "image",
                  }}
                >
                  {({ open }) => {
                    return (
                      <Button type="button" variant="outline" onClick={() => open()}>
                        Upload Image
                      </Button>
                    );
                  }}
                </CldUploadWidget>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="Or paste an image URL..."
                  value={form.imageUrl ?? ""}
                  onChange={(e) => set("imageUrl")(e.target.value)}
                  className="flex-1"
                />
              </div>
              <p className="text-b6 font-inter text-neutral-400">
                Upload a direct image or paste a URL for the main product photo.
              </p>
            </div>
            {form.imageUrl && (
              <div className="relative h-24 w-24 overflow-hidden rounded-xl bg-cornsilk-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 shrink-0">
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
          </div>
        </section>
      )}

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
              No size variants yet. Click &ldquo;Add Size&rdquo; to create options like Small,
              Medium, Large.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {(form.variants ?? []).map((variant, index) => (
              <div
                key={variant.id ?? `new-${index}`}
                className="flex flex-col gap-4 p-5 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60"
              >
                {/* Variant Top Row: Name, Price, Actions */}
                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr_auto] gap-4 items-start">
                  <div className="space-y-1.5">
                    <Label htmlFor={`variant-name-${index}`} className="text-b6">
                      Size / Variant Name <span className="text-blush-500">*</span>
                    </Label>
                    <Select
                      value={variant.variantName}
                      onValueChange={(value) => updateVariant(index, "variantName", value)}
                    >
                      <SelectTrigger id={`variant-name-${index}`} className="w-full">
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="s">S</SelectItem>
                        <SelectItem value="m">M</SelectItem>
                        <SelectItem value="l">L</SelectItem>
                        <SelectItem value="xl">XL</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor={`variant-price-${index}`} className="text-b6">
                      Additional Cost (IDR)
                    </Label>
                    <Input
                      id={`variant-price-${index}`}
                      type="number"
                      min={0}
                      placeholder="e.g., 50000"
                      value={variant.additionalPrice ?? ""}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (/^0+(?=\d)/.test(val)) {
                          val = val.replace(/^0+(?=\d)/, "");
                          e.target.value = val;
                        }
                        updateVariant(index, "additionalPrice", val === "" ? 0 : Number(val));
                      }}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    />
                    <p className="text-[11px] font-inter text-neutral-500">
                      Final Price: IDR{" "}
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                        {((form.price || 0) + (variant.additionalPrice || 0)).toLocaleString(
                          "id-ID"
                        )}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Variant Bottom Row: Image and Stems */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start mt-4">
                  <div className="space-y-1.5">
                    <Label htmlFor={`variant-image-${index}`} className="text-b6">
                      Variant-Specific Image URL
                    </Label>
                    <div className="flex gap-3 items-center">
                      <CldUploadWidget
                        signatureEndpoint="/api/cloudinary/sign"
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        onSuccess={(result: any) => {
                          if (result?.info?.secure_url) {
                            updateVariant(index, "imageUrl", result.info.secure_url);
                          }
                        }}
                        options={{
                          multiple: false,
                          resourceType: "image",
                        }}
                      >
                        {({ open }) => {
                          return (
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => open()}
                              size="sm"
                            >
                              Upload
                            </Button>
                          );
                        }}
                      </CldUploadWidget>
                      <Input
                        id={`variant-image-${index}`}
                        type="url"
                        placeholder="Or paste URL..."
                        value={variant.imageUrl ?? ""}
                        onChange={(e) => updateVariant(index, "imageUrl", e.target.value)}
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

                  <div className="space-y-1.5">
                    <Label htmlFor={`variant-stems-${index}`} className="text-b6">
                      Stems Quantity (Optional)
                    </Label>
                    <Input
                      id={`variant-stems-${index}`}
                      type="number"
                      min={1}
                      placeholder="e.g., 10"
                      value={variant.stemsQuantity ?? ""}
                      onChange={(e) => {
                        let val = e.target.value;
                        if (/^0+(?=\d)/.test(val)) {
                          val = val.replace(/^0+(?=\d)/, "");
                          e.target.value = val;
                        }
                        updateVariant(index, "stemsQuantity", val ? Number(val) : null);
                      }}
                      onWheel={(e) => (e.target as HTMLInputElement).blur()}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-6 md:pt-0">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeVariant(index)}
                  >
                    <Trash2 className="h-4 w-4 md:mr-1.5" />
                    <span className="hidden md:inline">Remove</span>
                  </Button>
                  <div className="flex items-center gap-1.5">
                    <Checkbox
                      id={`variant-available-${index}`}
                      checked={variant.isAvailable ?? true}
                      onCheckedChange={(checked) => updateVariant(index, "isAvailable", !!checked)}
                    />
                    <Label
                      htmlFor={`variant-available-${index}`}
                      className="text-xs font-inter text-neutral-500 dark:text-neutral-400 cursor-pointer"
                    >
                      In Stock
                    </Label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
