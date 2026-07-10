import { notFound } from "next/navigation";
import { NewsFormView } from "@/modules/AdminModule";
import { adminGetNews } from "@/app/actions/admin-news";

export const metadata = {
  title: "Edit News",
};

export default async function EditNewsPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { news, error } = await adminGetNews(params.id);

  if (error || !news) {
    notFound();
  }

  return <NewsFormView initialData={news} />;
}
