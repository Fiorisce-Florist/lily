import { AccountSidebar } from "@/components/elements/AccountSidebar";

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white dark:bg-neutral-950 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl pt-8 sm:pt-12">
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <AccountSidebar />
          </aside>

          {/* Main Content */}
          <main className="flex-1 w-full max-w-full overflow-hidden">{children}</main>
        </div>
      </div>
    </div>
  );
}
