"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Users, Loader2, ShieldCheck, User } from "lucide-react";
import { toast } from "sonner";
import { adminToggleUserRole } from "@/app/actions/admin";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatShortDate } from "@/lib/formatters";

interface UserRow {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  image: string | null;
  phone: string | null;
  createdAt: string;
  orderCount: number;
}

function RoleToggleButton({ userId, currentRole }: { userId: string; currentRole: string }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleToggle = async () => {
    const verb = currentRole === "ADMIN" ? "demote to Customer" : "promote to Admin";
    if (!confirm(`Are you sure you want to ${verb} this user?`)) return;

    setIsLoading(true);
    const result = await adminToggleUserRole(userId);
    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(`User is now ${result.newRole}.`);
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-inter font-medium border transition-colors disabled:opacity-50 ${
        currentRole === "ADMIN"
          ? "border-blush-300 text-blush-700 bg-blush-50 hover:bg-blush-100 dark:border-blush-700 dark:text-blush-300 dark:bg-blush-900/20 dark:hover:bg-blush-900/40"
          : "border-neutral-300 text-neutral-600 bg-neutral-50 hover:bg-neutral-100 dark:border-neutral-700 dark:text-neutral-400 dark:bg-neutral-800 dark:hover:bg-neutral-700"
      }`}
    >
      {isLoading ? (
        <Loader2 className="h-3 w-3 animate-spin" />
      ) : currentRole === "ADMIN" ? (
        <ShieldCheck className="h-3 w-3" />
      ) : (
        <User className="h-3 w-3" />
      )}
      {currentRole === "ADMIN" ? "Admin" : "Customer"}
    </button>
  );
}

export function AdminUsersTable({ users }: { users: UserRow[] }) {
  const [search, setSearch] = React.useState("");
  const [roleFilter, setRoleFilter] = React.useState("ALL");

  const filtered = React.useMemo(() => {
    return users.filter((u) => {
      const matchSearch =
        !search ||
        (u.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (u.email ?? "").toLowerCase().includes(search.toLowerCase());
      const matchRole = roleFilter === "ALL" || u.role === roleFilter;
      return matchSearch && matchRole;
    });
  }, [users, search, roleFilter]);

  const newLocal =
    "px-6 py-4 font-inter text-neutral-600 dark:text-neutral-400 max-w-[200px] truncate";
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 px-6 py-4 border-b border-neutral-200 dark:border-neutral-800">
        <Input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1"
        />
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Roles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All Roles</SelectItem>
            <SelectItem value="CUSTOMER">Customer</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Users className="h-12 w-12 text-neutral-300 mb-4" />
          <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            No users found
          </h2>
          <p className="text-b5 font-inter text-neutral-500 mt-2">
            {search || roleFilter !== "ALL"
              ? "Try adjusting your search or filter."
              : "No users have registered yet."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-neutral-50 dark:bg-neutral-800/50">
              <tr>
                {["User", "Email", "Phone", "Orders", "Joined", "Role"].map((h) => (
                  <th
                    key={h}
                    className="px-6 py-3 text-left text-b6 font-inter font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-neutral-50 dark:hover:bg-neutral-800/30 transition-colors"
                >
                  {/* User avatar + name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 shrink-0 border border-blush-200 dark:border-blush-800">
                        <AvatarImage
                          src={user.image || ""}
                          alt={user.name ?? "Avatar"}
                          className="object-cover"
                        />
                        <AvatarFallback className="bg-blush-100 dark:bg-blush-900/30 text-sm font-fraunces font-bold text-blush-600 dark:text-blush-400">
                          {(user.name || user.email || "?")[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <p className="font-inter font-medium text-neutral-900 dark:text-cornsilk-100 max-w-35 truncate">
                        {user.name ?? <span className="text-neutral-400 italic">No name</span>}
                      </p>
                    </div>
                  </td>
                  <td className={newLocal}>{user.email ?? "—"}</td>
                  <td className="px-6 py-4 font-inter text-neutral-500 dark:text-neutral-500">
                    {user.phone ?? (
                      <span className="text-neutral-300 dark:text-neutral-600">—</span>
                    )}
                  </td>
                  <td className="px-6 py-4 font-jetbrains font-medium text-neutral-700 dark:text-neutral-300">
                    {user.orderCount}
                  </td>
                  <td className="px-6 py-4 font-inter text-neutral-500 dark:text-neutral-400 whitespace-nowrap">
                    {formatShortDate(user.createdAt)}
                  </td>
                  <td className="px-6 py-4">
                    <RoleToggleButton userId={user.id} currentRole={user.role} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
