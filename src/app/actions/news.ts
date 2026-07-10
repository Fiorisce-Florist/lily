"use server";

import { prisma } from "@/lib/prisma";

export async function getAllNews(page: number = 1, limit: number = 9) {
  const skip = (page - 1) * limit;

  const [news, totalCount] = await Promise.all([
    prisma.news.findMany({
      where: { isPublished: true },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
      },
    }),
    prisma.news.count({ where: { isPublished: true } }),
  ]);

  return {
    news: news.map((n) => ({
      id: n.id,
      title: n.title,
      slug: n.slug,
      excerpt: n.excerpt,
      imageUrl: n.imageUrl,
      authorName: n.author?.name || "Fiorisce Team",
      createdAt: n.createdAt.toISOString(),
    })),
    totalPages: Math.ceil(totalCount / limit),
    totalCount,
  };
}

export async function getNewsBySlug(slug: string) {
  const news = await prisma.news.findUnique({
    where: { slug, isPublished: true },
    include: {
      author: { select: { name: true } },
    },
  });

  if (!news) return null;

  return {
    ...news,
    authorName: news.author?.name || "Fiorisce Team",
    createdAt: news.createdAt.toISOString(),
  };
}
