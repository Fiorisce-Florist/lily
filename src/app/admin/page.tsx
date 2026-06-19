import type { Metadata } from "next";
import { adminGetDashboardStats } from "@/app/actions/admin";
import { DashboardView } from "@/modules/AdminModule";

export const metadata: Metadata = { title: "Dashboard" };

export default async function AdminDashboardPage() {
  const stats = await adminGetDashboardStats();
  return <DashboardView stats={stats} />;
}
