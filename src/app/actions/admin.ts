"use server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { ProductStatus } from "@prisma/client";

// ─── Auth guard ───────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function adminGetDashboardStats() {
  await requireAdmin();

  const [totalProducts, activeProducts, totalOrders, totalUsers, revenueResult, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ["PAID", "PROCESSING", "SHIPPED", "COMPLETED"] } },
      }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true, email: true } },
          _count: { select: { items: true } },
        },
      }),
    ]);

  return {
    totalProducts,
    activeProducts,
    totalOrders,
    totalUsers,
    revenue: Number(revenueResult._sum.totalAmount ?? 0),
    recentOrders: recentOrders.map((o) => ({
      id: o.id,
      orderNumber: o.orderNumber,
      status: o.status,
      totalAmount: Number(o.totalAmount),
      createdAt: o.createdAt.toISOString(),
      customerName: o.user?.name ?? o.user?.email ?? "Unknown",
      itemCount: o._count.items,
    })),
  };
}

// ─── Product Management ───────────────────────────────────────────────────────

export async function adminGetAllProducts() {
  await requireAdmin();

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { id: true, name: true } },
      images: { where: { isPrimary: true }, take: 1 },
      _count: { select: { orderItems: true } },
    },
  });

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: Number(p.price),
    status: p.status,
    isAvailable: p.isAvailable,
    categoryName: p.category.name,
    categoryId: p.category.id,
    image: p.images[0]?.imageUrl ?? null,
    soldCount: p._count.orderItems,
    createdAt: p.createdAt.toISOString(),
  }));
}

export interface AdminProductVariantData {
  id?: string;
  variantName: string;
  additionalPrice: number;
  isAvailable?: boolean;
}

export interface AdminProductFormData {
  name: string;
  slug: string;
  categoryId: string;
  price: number;
  description?: string;
  isAvailable?: boolean;
  status?: ProductStatus;
  imageUrl?: string;
  variants?: AdminProductVariantData[];
}

export async function adminCreateProduct(data: AdminProductFormData) {
  await requireAdmin();

  try {
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        categoryId: data.categoryId,
        price: data.price,
        description: data.description,
        isAvailable: data.isAvailable ?? true,
        status: data.status ?? "ACTIVE",
        images: data.imageUrl
          ? {
              create: {
                imageUrl: data.imageUrl,
                isPrimary: true,
              },
            }
          : undefined,
        variants:
          data.variants && data.variants.length > 0
            ? {
                create: data.variants.map((v) => ({
                  variantName: v.variantName,
                  additionalPrice: v.additionalPrice,
                  isAvailable: v.isAvailable ?? true,
                })),
              }
            : undefined,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    return { product, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { product: null, error: "A product with that slug already exists." };
    }
    console.error("Error creating product:", error);
    return { product: null, error: "Failed to create product." };
  }
}

export async function adminGetProduct(id: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      images: true,
      variants: true,
      tags: { include: { tag: true } },
    },
  });

  if (!product) return { product: null, error: "Product not found." };

  return {
    product: {
      id: product.id,
      name: product.name,
      slug: product.slug,
      description: product.description ?? "",
      price: Number(product.price),
      status: product.status,
      isAvailable: product.isAvailable,
      categoryId: product.categoryId,
      imageUrl:
        product.images.find((i) => i.isPrimary)?.imageUrl ?? product.images[0]?.imageUrl ?? "",
      variants: product.variants.map((v) => ({
        id: v.id,
        variantName: v.variantName,
        additionalPrice: Number(v.additionalPrice),
        isAvailable: v.isAvailable,
      })),
    },
    error: null,
  };
}

export async function adminUpdateProduct(id: string, data: Partial<AdminProductFormData>) {
  await requireAdmin();

  try {
    await prisma.$transaction(async (tx) => {
      await tx.product.update({
        where: { id },
        data: {
          name: data.name,
          slug: data.slug,
          categoryId: data.categoryId,
          price: data.price,
          description: data.description,
          isAvailable: data.isAvailable,
          status: data.status,
        },
      });

      // Update primary image if provided
      if (data.imageUrl !== undefined) {
        // Set all existing images to non-primary
        await tx.productImage.updateMany({
          where: { productId: id },
          data: { isPrimary: false },
        });

        // Check if a primary image exists, update or create
        const existingPrimary = await tx.productImage.findFirst({
          where: { productId: id, isPrimary: true },
        });

        if (existingPrimary) {
          await tx.productImage.update({
            where: { id: existingPrimary.id },
            data: { imageUrl: data.imageUrl, isPrimary: true },
          });
        } else if (data.imageUrl) {
          await tx.productImage.create({
            data: { productId: id, imageUrl: data.imageUrl, isPrimary: true },
          });
        }
      }

      // Sync size variants if provided
      if (data.variants !== undefined) {
        const incoming = data.variants ?? [];
        const incomingIds = incoming.filter((v) => v.id).map((v) => v.id!);

        // Delete variants that were removed
        await tx.productVariant.deleteMany({
          where: {
            productId: id,
            ...(incomingIds.length > 0 ? { id: { notIn: incomingIds } } : {}),
          },
        });

        // Upsert each variant
        for (const v of incoming) {
          if (v.id) {
            await tx.productVariant.update({
              where: { id: v.id },
              data: {
                variantName: v.variantName,
                additionalPrice: v.additionalPrice,
                isAvailable: v.isAvailable ?? true,
              },
            });
          } else {
            await tx.productVariant.create({
              data: {
                productId: id,
                variantName: v.variantName,
                additionalPrice: v.additionalPrice,
                isAvailable: v.isAvailable ?? true,
              },
            });
          }
        }
      }
    });

    revalidatePath("/admin/products");
    revalidatePath(`/shop`);
    return { error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "A product with that slug already exists." };
    }
    console.error("Error updating product:", error);
    return { error: "Failed to update product." };
  }
}

export async function adminToggleProductStatus(id: string) {
  await requireAdmin();

  const product = await prisma.product.findUnique({
    where: { id },
    select: { status: true },
  });

  if (!product) return { error: "Product not found." };

  const newStatus: ProductStatus = product.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  await prisma.product.update({
    where: { id },
    data: { status: newStatus },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { error: null, newStatus };
}

export async function adminDeleteProduct(id: string) {
  await requireAdmin();

  // Soft delete: set to INACTIVE and unavailable
  await prisma.product.update({
    where: { id },
    data: { status: "INACTIVE", isAvailable: false },
  });

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  return { error: null };
}

// ─── Order Management ─────────────────────────────────────────────────────────

export async function adminGetAllOrders() {
  await requireAdmin();

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { name: true, email: true } },
      payment: { select: { status: true, paymentMethod: true } },
      _count: { select: { items: true } },
    },
  });

  return orders.map((o) => ({
    id: o.id,
    orderNumber: o.orderNumber,
    status: o.status,
    totalAmount: Number(o.totalAmount),
    createdAt: o.createdAt.toISOString(),
    customerName: o.user?.name ?? o.user?.email ?? "Unknown",
    customerEmail: o.user?.email ?? "",
    paymentStatus: o.payment?.status ?? null,
    paymentMethod: o.payment?.paymentMethod ?? null,
    itemCount: o._count.items,
  }));
}

export async function adminUpdateOrderStatus(orderId: string, newStatus: string) {
  const session = await requireAdmin();

  const order = await prisma.order.findUnique({ where: { id: orderId }, select: { status: true } });
  if (!order) return { error: "Order not found." };

  await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { status: newStatus as any },
    }),
    prisma.orderStatusHistory.create({
      data: {
        orderId,
        oldStatus: order.status,
        newStatus,
        changedBy: session.user.id,
      },
    }),
  ]);

  revalidatePath("/admin/orders");
  return { error: null };
}

// ─── Category helpers ─────────────────────────────────────────────────────────

export async function adminGetCategories() {
  await requireAdmin();

  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
}

// ─── User Management ──────────────────────────────────────────────────────────

export async function adminGetAllUsers() {
  await requireAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: { select: { orders: true } },
    },
  });

  return users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    image: u.image,
    phone: u.phone,
    createdAt: u.createdAt.toISOString(),
    orderCount: u._count.orders,
  }));
}

export async function adminToggleUserRole(userId: string) {
  const session = await requireAdmin();

  // Prevent admins from demoting themselves
  if (userId === session.user.id) {
    return { error: "You cannot change your own role." };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });

  if (!user) return { error: "User not found." };

  const newRole = user.role === "ADMIN" ? "CUSTOMER" : "ADMIN";

  await prisma.user.update({
    where: { id: userId },
    data: { role: newRole },
  });

  revalidatePath("/admin/users");
  return { error: null, newRole };
}
