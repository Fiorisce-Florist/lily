"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { User, Package, LogOut } from "lucide-react";
import { signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    name: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    name: "Orders",
    href: "/orders",
    icon: Package,
  },
];

export function AccountSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogOut = async () => {
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <div className="flex flex-col space-y-1 md:sticky md:top-24">
      <h2 className="text-h4 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100 mb-6 px-4 md:px-0">
        My Account
      </h2>

      <nav className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-4 md:pb-0 px-4 md:px-0 scrollbar-hide">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl font-inter text-b3 font-medium transition-colors whitespace-nowrap",
                isActive
                  ? "bg-camel-100/50 text-camel-900 dark:bg-camel-900/20 dark:text-camel-100"
                  : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900 hover:text-neutral-900 dark:hover:text-neutral-100"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}

        <div className="hidden md:block w-full h-px bg-neutral-200 dark:bg-neutral-800 my-4" />

        <button
          onClick={handleLogOut}
          className="flex items-center gap-3 px-4 py-3 rounded-xl font-inter text-b4 font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
        >
          <LogOut className="h-5 w-5" />
          Log Out
        </button>
      </nav>
    </div>
  );
}
