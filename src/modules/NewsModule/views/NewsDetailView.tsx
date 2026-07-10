"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Newspaper } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface NewsDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  imageUrl: string | null;
  authorName: string;
  createdAt: string;
}

export function NewsDetailView({ article }: { article: NewsDetail }) {
  return (
    <div className="container mx-auto px-6 py-12 max-w-4xl">
      <div className="mb-8">
        <Button
          variant="ghost"
          size="sm"
          asChild
          className="mb-6 -ml-3 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100"
        >
          <Link href="/news">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </Button>
        <div className="flex items-center text-b5 text-neutral-500 dark:text-neutral-400 mb-4 space-x-2 font-inter">
          <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          <span>•</span>
          <span>{article.authorName}</span>
        </div>
        <h1 className="text-h1 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100 mb-8 leading-tight">
          {article.title}
        </h1>
      </div>

      {article.imageUrl ? (
        <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 shadow-md">
          <Image
            src={article.imageUrl}
            alt={article.title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
          />
        </div>
      ) : (
        <div className="relative aspect-video rounded-3xl overflow-hidden mb-12 bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center shadow-inner">
          <Newspaper className="h-24 w-24 text-neutral-300 dark:text-neutral-600" />
        </div>
      )}

      <div className="prose prose-neutral dark:prose-invert max-w-none font-inter text-lg prose-p:leading-relaxed prose-headings:font-fraunces">
        {/* If content is raw markdown, we should render it using a markdown parser. 
            For now, we'll just split by newlines as a basic fallback if it's plain text.
            If it contains HTML, we could use dangerouslySetInnerHTML, but let's stick to safe rendering or assume it's plain text. */}
        {article.content.split("\n").map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))}
      </div>
    </div>
  );
}
