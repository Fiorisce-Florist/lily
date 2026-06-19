"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Flower2,
  ShieldCheck,
  Menu,
} from "lucide-react";
import { signOut } from "@/lib/auth-client";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/users", label: "Users", icon: Users },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  // Close mobile sidebar on route change
  React.useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  }

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blush-600 text-white shadow-lg shadow-blush-900/30"
        aria-label="Open sidebar"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 z-50 h-screen flex flex-col bg-white dark:bg-neutral-950 border-r border-neutral-200 dark:border-neutral-800 transition-transform duration-300 md:transition-all ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } ${collapsed ? "w-17.5" : "w-60"}`}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blush-600 shadow-lg shadow-blush-900/30">
            <ShieldCheck className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-fraunces text-lg font-bold text-neutral-900 dark:text-cornsilk-100 tracking-tight">
              Admin Panel
            </span>
          )}
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-inter font-medium transition-colors ${
                  active
                    ? "bg-blush-600 text-white shadow-sm"
                    : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100"
                } ${collapsed ? "justify-center" : ""}`}
                title={collapsed ? label : undefined}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {!collapsed && <span>{label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-neutral-200 dark:border-neutral-800 p-2 space-y-1">
          <Link
            href="/"
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-inter text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "View Store" : undefined}
          >
            <Flower2 className="h-4 w-4 shrink-0" />
            {!collapsed && <span>View Store</span>}
          </Link>
          <button
            onClick={async () => {
              await signOut();
              window.location.href = "/login";
            }}
            className={`w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-inter text-neutral-600 dark:text-neutral-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors ${
              collapsed ? "justify-center" : ""
            }`}
            title={collapsed ? "Sign Out" : undefined}
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sign Out</span>}
          </button>

          {/* Collapse toggle */}
          <button
            onClick={() => setCollapsed((v) => !v)}
            className="hidden md:flex w-full items-center justify-center rounded-xl px-3 py-2 text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>
      </aside>
    </>
  );
}
