import type { Metadata } from "next";
import { adminGetAllUsers } from "@/app/actions/admin";
import { UsersView } from "@/modules/AdminModule";

export const metadata: Metadata = { title: "Users" };

export default async function AdminUsersPage() {
  const users = await adminGetAllUsers();
  return <UsersView users={users} />;
}
