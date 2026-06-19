import type { Metadata } from "next";
import { AdminSidebar } from "@/modules/AdminModule/components/admin-sidebar";
import { AdminBreadcrumb } from "@/modules/AdminModule/components/admin-breadcrumb";

export const metadata: Metadata = {
  title: { default: "Admin — Fiorisce", template: "%s | Admin — Fiorisce" },
  description: "Fiorisce admin dashboard",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-950 flex">
      <AdminSidebar />
      <main className="flex-1 min-w-0 overflow-hidden">
        <div className="container mx-auto px-6 py-8 max-w-7xl">
          <AdminBreadcrumb />
          {children}
        </div>
      </main>
    </div>
  );
}
