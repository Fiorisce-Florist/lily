import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BreadcrumbItem {
  /** Label shown in the breadcrumb */
  label: string;
  /** If provided, the item is rendered as a link */
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Prepend a Home icon link pointing to "/" — true by default */
  showHome?: boolean;
  className?: string;
}

// ─── Sub-components (composable API) ─────────────────────────────────────────

const BreadcrumbRoot = React.forwardRef<HTMLElement, React.ComponentPropsWithoutRef<"nav">>(
  ({ className, children, ...props }, ref) => (
    <nav
      ref={ref}
      aria-label="Breadcrumb"
      className={cn("flex items-center", className)}
      {...props}
    >
      <ol className="flex flex-wrap items-center gap-1.5 text-b6 font-inter text-neutral-400 dark:text-neutral-500">
        {children}
      </ol>
    </nav>
  )
);
BreadcrumbRoot.displayName = "BreadcrumbRoot";

const BreadcrumbListItem = React.forwardRef<HTMLLIElement, React.ComponentPropsWithoutRef<"li">>(
  ({ className, children, ...props }, ref) => (
    <li ref={ref} className={cn("inline-flex items-center gap-1.5", className)} {...props}>
      {children}
    </li>
  )
);
BreadcrumbListItem.displayName = "BreadcrumbListItem";

const BreadcrumbLink = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentPropsWithoutRef<typeof Link>
>(({ className, children, ...props }, ref) => (
  <Link
    ref={ref}
    className={cn("transition-colors hover:text-blush-500 dark:hover:text-blush-400", className)}
    {...props}
  >
    {children}
  </Link>
));
BreadcrumbLink.displayName = "BreadcrumbLink";

const BreadcrumbPage = React.forwardRef<HTMLSpanElement, React.ComponentPropsWithoutRef<"span">>(
  ({ className, children, ...props }, ref) => (
    <span
      ref={ref}
      role="link"
      aria-current="page"
      aria-disabled="true"
      className={cn("font-medium text-neutral-700 dark:text-neutral-200", className)}
      {...props}
    >
      {children}
    </span>
  )
);
BreadcrumbPage.displayName = "BreadcrumbPage";

const BreadcrumbSeparator = React.forwardRef<
  HTMLSpanElement,
  React.ComponentPropsWithoutRef<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    role="presentation"
    aria-hidden="true"
    className={cn("text-neutral-300 dark:text-neutral-600", className)}
    {...props}
  >
    <ChevronRight className="h-3 w-3" />
  </span>
));
BreadcrumbSeparator.displayName = "BreadcrumbSeparator";

// ─── Convenience wrapper ──────────────────────────────────────────────────────
// Renders from a simple `items` array. Use the composable sub-components above
// for custom layouts (e.g., with icons, truncation, or dropdowns).

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, showHome = true, className }, ref) => {
    const allItems: BreadcrumbItem[] = showHome ? [{ label: "Home", href: "/" }, ...items] : items;

    return (
      <BreadcrumbRoot ref={ref} className={className}>
        {allItems.map((item, idx) => {
          const isLast = idx === allItems.length - 1;
          const isFirst = idx === 0;

          return (
            <BreadcrumbListItem key={idx}>
              {!isFirst && <BreadcrumbSeparator />}

              {isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : item.href ? (
                <BreadcrumbLink href={item.href}>
                  {isFirst && showHome ? (
                    <span className="flex items-center gap-1">
                      <Home className="h-3 w-3" />
                      <span className="sr-only">Home</span>
                    </span>
                  ) : (
                    item.label
                  )}
                </BreadcrumbLink>
              ) : (
                <span>{item.label}</span>
              )}
            </BreadcrumbListItem>
          );
        })}
      </BreadcrumbRoot>
    );
  }
);
Breadcrumb.displayName = "Breadcrumb";

export {
  Breadcrumb,
  BreadcrumbRoot,
  BreadcrumbListItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
};
