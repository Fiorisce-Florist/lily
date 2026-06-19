import { AdminUsersTable } from "@/modules/AdminModule/components/admin-users-table";
import type { adminGetAllUsers } from "@/app/actions/admin";

type UsersList = Awaited<ReturnType<typeof adminGetAllUsers>>;

export function UsersView({ users }: { users: UsersList }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
          Users
        </h1>
        <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400 mt-1">
          {users.length} registered user{users.length !== 1 ? "s" : ""}
        </p>
      </div>

      <AdminUsersTable users={users} />
    </div>
  );
}
