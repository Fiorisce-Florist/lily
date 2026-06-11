import * as React from "react";

import { cn } from "@/lib/utils";

/* ---------------------------------- Types --------------------------------- */

export type CardProps = React.HTMLAttributes<HTMLDivElement>;
export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;
export type CardTitleProps = React.HTMLAttributes<HTMLDivElement>;
export type CardDescriptionProps = React.HTMLAttributes<HTMLDivElement>;
export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

/* ---------------------------------- Card ---------------------------------- */

const Card = React.forwardRef<HTMLDivElement, CardProps>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "border-cornsilk-300 bg-cornsilk-100 dark:text-cornsilk-100 rounded-xl border text-neutral-900 shadow-sm dark:border-neutral-700 dark:bg-neutral-900",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

/* ------------------------------- CardHeader ------------------------------- */

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
);
CardHeader.displayName = "CardHeader";

/* ------------------------------- CardTitle -------------------------------- */

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-h4 font-fraunces leading-none font-semibold tracking-tight", className)}
      {...props}
    />
  )
);
CardTitle.displayName = "CardTitle";

/* ----------------------------- CardDescription ---------------------------- */

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-b5 font-inter text-neutral-600 dark:text-neutral-400", className)}
      {...props}
    />
  )
);
CardDescription.displayName = "CardDescription";

/* ------------------------------ CardContent ------------------------------- */

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
);
CardContent.displayName = "CardContent";

/* ------------------------------- CardFooter ------------------------------- */

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
);
CardFooter.displayName = "CardFooter";

/* -------------------------------- Exports --------------------------------- */

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
