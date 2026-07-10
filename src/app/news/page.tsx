import { Metadata } from "next";
import { NewsListView } from "@/modules/NewsModule";
import { getAllNews } from "@/app/actions/news";

export const metadata: Metadata = {
  title: "News & Updates",
  description: "Stay up to date with the latest stories and updates from Fiorisce.",
};

export default async function NewsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;

  const data = await getAllNews(page, 9);

  return <NewsListView news={data.news} />;
}
