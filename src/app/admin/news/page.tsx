import type { Metadata } from "next";
import { adminGetAllNews } from "@/app/actions/admin-news";
import { NewsView } from "@/modules/AdminModule";

export const metadata: Metadata = { title: "News" };

export default async function AdminNewsPage(props: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page, 10) : 1;
  const search = typeof searchParams.search === "string" ? searchParams.search : "";

  const data = await adminGetAllNews(page, 20, search);
  return <NewsView data={data} search={search} page={page} />;
}
