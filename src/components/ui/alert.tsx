import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

/* -------------------------------- Variants -------------------------------- */

const alertVariants = cva(
  "relative w-full rounded-xl border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground",
  {
    variants: {
      variant: {
        default:
          "bg-cornsilk-100 border-cornsilk-300 text-neutral-900 dark:bg-neutral-900 dark:border-neutral-800 dark:text-neutral-100",
        destructive:
          "border-blush-400 bg-blush-100 text-blush-900 [&>svg]:text-blush-700 dark:bg-blush-1000 dark:border-blush-800 dark:text-blush-200 dark:[&>svg]:text-blush-400",
        success:
          "border-olive-400 bg-olive-100 text-olive-900 [&>svg]:text-olive-700 dark:bg-olive-1000 dark:border-olive-800 dark:text-olive-200 dark:[&>svg]:text-olive-400",
        warning:
          "border-camel-400 bg-camel-100 text-camel-900 [&>svg]:text-camel-700 dark:bg-camel-1000 dark:border-camel-800 dark:text-camel-200 dark:[&>svg]:text-camel-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

/* ---------------------------------- Types --------------------------------- */

export type AlertProps = React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>;

export type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

export type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

/* --------------------------------- Alert ---------------------------------- */

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
  )
);
Alert.displayName = "Alert";

/* ------------------------------- AlertTitle ------------------------------- */

const AlertTitle = React.forwardRef<HTMLHeadingElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn("text-b4 font-inter mb-1 leading-none font-medium tracking-tight", className)}
      {...props}
    />
  )
);
AlertTitle.displayName = "AlertTitle";

/* ----------------------------- AlertDescription --------------------------- */

const AlertDescription = React.forwardRef<HTMLParagraphElement, AlertDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-b5 font-inter [&_p]:leading-relaxed", className)}
      {...props}
    />
  )
);
AlertDescription.displayName = "AlertDescription";

/* -------------------------------- Exports --------------------------------- */

export { Alert, AlertTitle, AlertDescription, alertVariants };
