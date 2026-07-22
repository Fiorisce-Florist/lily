"use server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { Prisma, ProductStatus, TagType } from "@prisma/client";

// ─── Auth guard ───────────────────────────────────────────────────────────────

import { expireStaleOrders } from "./orders";

function getCheckoutPhoneFromLogs(logs: Array<{ requestBody: unknown }>) {
  for (const log of logs) {
    const requestBody = log.requestBody as {
      customer?: { phone?: unknown };
    } | null;
    const phone = requestBody?.customer?.phone;
    if (typeof phone === "string" && phone.trim()) {
      return phone;
    }
  }

  return null;
}

export async function requireAdmin() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized: Admin access required.");
  }
  return session;
}

// ─── Dashboard Stats ──────────────────────────────────────────────────────────

export async function adminGetDashboardStats() {
  await requireAdmin();
  await expireStaleOrders(); // Lazy expiration

  const [totalProducts, activeProducts, totalOrders, totalUsers, revenueResult, recentOrders] =
    await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "ACTIVE" } }),
      prisma.order.count(),
      prisma.user.count(),
      prisma.order.aggregate({
        _sum: { totalAmount: true },
        where: { status: { in: ["COMPLETED"] } },
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

export async function adminGetAllProducts(
  page: number = 1,
  limit: number = 20,
  search: string = ""
) {
  await requireAdmin();

  const skip = (page - 1) * limit;

  const where: Prisma.ProductWhereInput = search
    ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { slug: { contains: search, mode: "insensitive" } },
        ],
      }
    : {};

  const [products, totalCount] = await Promise.all([
    prisma.product.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        category: { select: { id: true, name: true } },
        images: { where: { isPrimary: true }, take: 1 },
        variants: { select: { additionalPrice: true } },
        _count: { select: { orderItems: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    products: products.map((p) => {
      let minPrice = Number(p.price);
      if (p.variants.length > 0) {
        minPrice += Math.min(...p.variants.map((v) => Number(v.additionalPrice)));
      }
      return {
        id: p.id,
        name: p.name,
        slug: p.slug,
        price: Number(p.price),
        minPrice,
        hasVariants: p.variants.length > 0,
        status: p.status,
        isAvailable: p.isAvailable,
        categoryName: p.category.name,
        categoryId: p.category.id,
        image: p.images[0]?.imageUrl ?? null,
        soldCount: p._count.orderItems,
        createdAt: p.createdAt.toISOString(),
      };
    }),
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}

export interface AdminProductVariantData {
  id?: string;
  variantName: string;
  additionalPrice: number;
  isAvailable?: boolean;
  imageUrl?: string;
  stemsQuantity?: number | null;
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
  tagIds?: string[];
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
                  imageUrl: v.imageUrl,
                  stemsQuantity: v.stemsQuantity,
                })),
              }
            : undefined,
        tags:
          data.tagIds && data.tagIds.length > 0
            ? {
                create: data.tagIds.map((tagId) => ({ tagId })),
              }
            : undefined,
      },
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidateTag("products", "max");
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
        imageUrl: v.imageUrl ?? undefined,
        stemsQuantity: v.stemsQuantity,
      })),
      tagIds: product.tags.map((t) => t.tagId),
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
                imageUrl: v.imageUrl,
                stemsQuantity: v.stemsQuantity,
              },
            });
          } else {
            await tx.productVariant.create({
              data: {
                productId: id,
                variantName: v.variantName,
                additionalPrice: v.additionalPrice,
                isAvailable: v.isAvailable ?? true,
                imageUrl: v.imageUrl,
                stemsQuantity: v.stemsQuantity,
              },
            });
          }
        }
      }

      // Sync tags if provided
      if (data.tagIds !== undefined) {
        // Simple approach: delete all and recreate
        await tx.productTag.deleteMany({
          where: { productId: id },
        });

        if (data.tagIds.length > 0) {
          await tx.productTag.createMany({
            data: data.tagIds.map((tagId) => ({
              productId: id,
              tagId,
            })),
          });
        }
      }
    });

    revalidatePath("/admin/products");
    revalidatePath("/shop");
    revalidateTag("products", "max");

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
  revalidateTag("products", "max");
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
  revalidateTag("products", "max");

  return { error: null };
}

// ─── Order Management ─────────────────────────────────────────────────────────

export async function adminGetAllOrders(
  page: number = 1,
  limit: number = 20,
  search: string = "",
  status: string = "all"
) {
  await requireAdmin();
  await expireStaleOrders(); // Lazy expiration

  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {};

  if (status !== "all") {
    where.status = status as Prisma.OrderWhereInput["status"];
  }

  if (search) {
    where.OR = [
      { orderNumber: { contains: search, mode: "insensitive" } },
      { user: { name: { contains: search, mode: "insensitive" } } },
      { user: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        payment: { select: { status: true, paymentMethod: true } },
        _count: { select: { items: true } },
      },
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map((o) => ({
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
    })),
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}

export async function adminGetOrder(id: string) {
  await requireAdmin();

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { name: true, email: true, phone: true } },
      address: true,
      items: true,
      payment: {
        include: {
          logs: {
            orderBy: { createdAt: "desc" },
          },
        },
      },
      statusHistories: {
        orderBy: { createdAt: "desc" },
        include: { changedByUser: { select: { name: true, email: true } } },
      },
    },
  });

  if (!order) return { order: null, error: "Order not found" };

  const checkoutLogs = await prisma.checkoutLog.findMany({
    where: { orderNumber: order.orderNumber },
    orderBy: { createdAt: "desc" },
  });

  const plainOrder = JSON.parse(JSON.stringify(order));
  const plainCheckoutLogs = JSON.parse(JSON.stringify(checkoutLogs));
  const customerPhone = getCheckoutPhoneFromLogs(plainCheckoutLogs);

  const serializedOrder = {
    ...plainOrder,
    customerPhone,
    subtotal: Number(plainOrder.subtotal),
    shippingCost: Number(plainOrder.shippingCost),
    totalAmount: Number(plainOrder.totalAmount),
    items: plainOrder.items.map((item: Record<string, unknown>) => ({
      ...item,
      unitPrice: Number(item.unitPrice),
      price: Number(item.unitPrice), // mapped for UI
    })),
    payment: plainOrder.payment
      ? {
          ...plainOrder.payment,
          amount: Number(plainOrder.payment.amount),
        }
      : null,
    checkoutLogs: plainCheckoutLogs.map((log: Record<string, unknown>) => ({
      ...log,
      amount: log.amount === null || log.amount === undefined ? null : Number(log.amount),
    })),
  };

  return { order: serializedOrder, error: null };
}

export async function adminGetCheckoutLogs(limit: number = 50) {
  await requireAdmin();

  const logs = await prisma.checkoutLog.findMany({
    take: limit,
    orderBy: { createdAt: "desc" },
  });
  const orderNumbers = [...new Set(logs.map((log) => log.orderNumber))];
  const orders = await prisma.order.findMany({
    where: { orderNumber: { in: orderNumbers } },
    select: { id: true, orderNumber: true },
  });
  const orderIdByNumber = new Map(orders.map((order) => [order.orderNumber, order.id]));

  return {
    logs: logs.map((log) => ({
      id: log.id,
      orderNumber: log.orderNumber,
      orderId: orderIdByNumber.get(log.orderNumber) ?? null,
      provider: log.provider,
      status: log.status,
      httpStatus: log.httpStatus,
      message: log.message,
      requestBody: log.requestBody,
      rawResponse: log.rawResponse,
      userId: log.userId,
      amount: log.amount === null ? null : Number(log.amount),
      createdAt: log.createdAt.toISOString(),
    })),
  };
}

export async function adminUpdateOrderStatus(orderId: string, newStatus: string) {
  const session = await requireAdmin();

  const order = await prisma.order.findUnique({ where: { id: orderId }, select: { status: true } });
  if (!order) return { error: "Order not found." };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const queries: any[] = [
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
  ];

  if (newStatus === "PAID" || newStatus === "PROCESSING") {
    queries.push(
      prisma.payment.updateMany({
        where: { orderId },
        data: { status: "PAID", paidAt: new Date() },
      })
    );
  }

  await prisma.$transaction(queries);

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

export async function adminGetCategory(id: string) {
  await requireAdmin();
  return prisma.category.findUnique({ where: { id } });
}

export async function adminCreateCategory(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  await requireAdmin();

  try {
    const category = await prisma.category.create({ data });
    revalidatePath("/admin/categories");
    revalidateTag("categories", "max");
    return { category, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { category: null, error: e.message || "Failed to create category" };
  }
}

export async function adminUpdateCategory(
  id: string,
  data: { name: string; slug: string; description?: string }
) {
  await requireAdmin();

  try {
    const updated = await prisma.category.update({ where: { id }, data });
    revalidatePath("/admin/categories");
    revalidateTag("categories", "max");
    return { category: updated, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { category: null, error: e.message || "Failed to update category" };
  }
}

export async function adminDeleteCategory(id: string) {
  await requireAdmin();

  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
    return { success: true, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to delete category" };
  }
}

// ─── Tags ─────────────────────────────────────────────────────────────────────

export async function adminGetTags() {
  await requireAdmin();

  return prisma.tag.findMany({
    orderBy: [{ type: "asc" }, { name: "asc" }],
    include: { _count: { select: { products: true } } },
  });
}

export async function adminGetTag(id: string) {
  await requireAdmin();
  return prisma.tag.findUnique({ where: { id } });
}

export async function adminCreateTag(data: {
  name: string;
  slug: string;
  description?: string;
  type: TagType;
}) {
  await requireAdmin();

  try {
    const tag = await prisma.tag.create({ data });
    revalidatePath("/admin/tags");
    revalidateTag("tags", "max");
    return { tag, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { tag: null, error: e.message || "Failed to create tag" };
  }
}

export async function adminUpdateTag(
  id: string,
  data: { name: string; slug: string; description?: string; type: TagType }
) {
  await requireAdmin();

  try {
    const updated = await prisma.tag.update({ where: { id }, data });
    revalidatePath("/admin/tags");
    revalidateTag("tags", "max");
    return { tag: updated, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { tag: null, error: e.message || "Failed to update tag" };
  }
}

export async function adminDeleteTag(id: string) {
  await requireAdmin();

  try {
    await prisma.tag.delete({ where: { id } });
    revalidatePath("/admin/tags");
    return { success: true, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    return { success: false, error: e.message || "Failed to delete tag" };
  }
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
