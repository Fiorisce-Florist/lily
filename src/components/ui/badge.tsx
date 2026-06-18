import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-b6 font-mono font-normal transition-colors focus:outline-none focus:ring-2 focus:ring-blush-500 focus:ring-offset-2 w-fit",
  {
    variants: {
      variant: {
        default: "bg-blush-500 text-cornsilk-100 hover:bg-blush-600",
        secondary: "bg-cornsilk-200 text-neutral-800 hover:bg-cornsilk-300",
        outline: "border border-cornsilk-400 dark:text-neutral-400 text-neutral-600",
        success: "bg-olive-200 text-olive-900 hover:bg-olive-300",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export type BadgeProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => {
    return <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />;
  }
);
Badge.displayName = "Badge";

export { Badge, badgeVariants };
