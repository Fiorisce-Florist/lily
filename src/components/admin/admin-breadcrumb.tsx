"use client";

import { usePathname } from "next/navigation";
import { Breadcrumb } from "@/components/ui/breadcrumb";

export function AdminBreadcrumb() {
  const pathname = usePathname();
  if (!pathname || pathname === "/admin") return null;

  const segments = pathname.split("/").filter(Boolean);

  const items = segments.map((segment, index) => {
    const isLast = index === segments.length - 1;
    const href = isLast ? undefined : `/${segments.slice(0, index + 1).join("/")}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, " ");
    return { label, href };
  });

  return <Breadcrumb items={items} className="mb-6" />;
}
