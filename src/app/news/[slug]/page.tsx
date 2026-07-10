import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getNewsBySlug } from "@/app/actions/news";
import { NewsDetailView } from "@/modules/NewsModule";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const news = await getNewsBySlug(params.slug);

  if (!news) {
    return {
      title: "News Not Found",
    };
  }

  return {
    title: news.title,
    description: news.excerpt || news.title,
  };
}

export default async function NewsDetailPage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const news = await getNewsBySlug(params.slug);

  if (!news) {
    notFound();
  }

  return <NewsDetailView article={news} />;
}
