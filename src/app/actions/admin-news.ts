"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./admin";

export interface AdminNewsFormData {
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  imageUrl?: string;
  isPublished?: boolean;
}

export async function adminGetAllNews(page: number = 1, limit: number = 20, search: string = "") {
  await requireAdmin();

  const skip = (page - 1) * limit;

  const where = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" as const } },
          { slug: { contains: search, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [news, totalCount] = await Promise.all([
    prisma.news.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true, email: true } },
      },
    }),
    prisma.news.count({ where }),
  ]);

  return {
    news: news.map((n) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      isPublished: n.isPublished,
      authorName: n.author?.name || n.author?.email || "Unknown",
      createdAt: n.createdAt.toISOString(),
      updatedAt: n.updatedAt.toISOString(),
    })),
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}

export async function adminGetNews(id: string) {
  await requireAdmin();

  const news = await prisma.news.findUnique({
    where: { id },
  });

  if (!news) return { news: null, error: "News not found." };

  return {
    news: {
      ...news,
      excerpt: news.excerpt ?? undefined,
      imageUrl: news.imageUrl ?? undefined,
      createdAt: news.createdAt.toISOString(),
      updatedAt: news.updatedAt.toISOString(),
    },
    error: null,
  };
}

export async function adminCreateNews(data: AdminNewsFormData) {
  const session = await requireAdmin();

  try {
    const news = await prisma.news.create({
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        imageUrl: data.imageUrl,
        isPublished: data.isPublished ?? false,
        authorId: session.user.id,
      },
    });

    revalidatePath("/admin/news");
    revalidatePath("/news");
    return { news, error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { news: null, error: "A news with that slug already exists." };
    }
    console.error("Error creating news:", error);
    return { news: null, error: "Failed to create news." };
  }
}

export async function adminUpdateNews(id: string, data: Partial<AdminNewsFormData>) {
  await requireAdmin();

  try {
    const news = await prisma.news.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        content: data.content,
        excerpt: data.excerpt,
        imageUrl: data.imageUrl,
        isPublished: data.isPublished,
      },
    });

    revalidatePath("/admin/news");
    revalidatePath("/news");
    revalidatePath(`/news/${news.slug}`);
    return { error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error?.code === "P2002") {
      return { error: "A news with that slug already exists." };
    }
    console.error("Error updating news:", error);
    return { error: "Failed to update news." };
  }
}

export async function adminToggleNewsStatus(id: string) {
  await requireAdmin();

  const news = await prisma.news.findUnique({
    where: { id },
    select: { isPublished: true, slug: true },
  });

  if (!news) return { error: "News not found." };

  const newStatus = !news.isPublished;

  await prisma.news.update({
    where: { id },
    data: { isPublished: newStatus },
  });

  revalidatePath("/admin/news");
  revalidatePath("/news");
  revalidatePath(`/news/${news.slug}`);
  return { error: null, newStatus };
}

export async function adminDeleteNews(id: string) {
  await requireAdmin();

  try {
    await prisma.news.delete({
      where: { id },
    });

    revalidatePath("/admin/news");
    revalidatePath("/news");
    return { error: null };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deleting news:", error);
    return { error: "Failed to delete news." };
  }
}
