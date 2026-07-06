import DesignSystemModule from "@/modules/DesignSystemModule";
import { notFound } from "next/navigation";

export default function DesignSystemPage() {
  if (process.env.NODE_ENV !== "development") {
    notFound();
  }
  return <DesignSystemModule />;
}
