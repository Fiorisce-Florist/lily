"use client";

import Link from "next/link";
import Image from "next/image";
import { Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  imageUrl: string | null;
  authorName: string;
  createdAt: string;
}

export function NewsListView({ news }: { news: NewsArticle[] }) {
  return (
    <div className="container mx-auto px-6 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100 mb-4">
          Latest News
        </h1>
        <p className="text-b3 font-inter text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
          Stay up to date with the latest stories, floral arrangements, and updates from Fiorisce.
        </p>
      </div>

      {news.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-neutral-50 dark:bg-neutral-900/50 rounded-2xl">
          <Newspaper className="h-16 w-16 text-neutral-300 mb-4" />
          <h2 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            No news yet
          </h2>
          <p className="text-b4 font-inter text-neutral-500 mt-2">Check back later for updates!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {news.map((article) => (
            <article
              key={article.id}
              className="flex flex-col bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow group"
            >
              <Link
                href={`/news/${article.slug}`}
                className="block relative aspect-video bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
              >
                {article.imageUrl ? (
                  <Image
                    src={article.imageUrl}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-cornsilk-100 dark:bg-neutral-800">
                    <Newspaper className="h-12 w-12 text-neutral-300 dark:text-neutral-600" />
                  </div>
                )}
              </Link>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-b6 text-neutral-500 dark:text-neutral-400 mb-3 space-x-2 font-inter">
                  <span>{article.authorName}</span>
                  <span>•</span>
                  <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                <Link
                  href={`/news/${article.slug}`}
                  className="group-hover:text-blush-600 dark:group-hover:text-blush-400 transition-colors"
                >
                  <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-3 line-clamp-2">
                    {article.title}
                  </h2>
                </Link>
                {article.excerpt && (
                  <p className="text-b5 font-inter text-neutral-600 dark:text-neutral-400 line-clamp-3 mb-6 flex-1">
                    {article.excerpt}
                  </p>
                )}
                <div className="mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
                  <Button
                    variant="link"
                    className="p-0 h-auto text-blush-600 hover:text-blush-700 dark:text-blush-400 dark:hover:text-blush-300 font-medium"
                    asChild
                  >
                    <Link href={`/news/${article.slug}`}>Read More &rarr;</Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
