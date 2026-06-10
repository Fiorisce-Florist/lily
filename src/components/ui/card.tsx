import * as React from "react"

import { cn } from "@/lib/utils"

/* ---------------------------------- Types --------------------------------- */

export type CardProps = React.HTMLAttributes<HTMLDivElement>
export type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>
export type CardTitleProps = React.HTMLAttributes<HTMLDivElement>
export type CardDescriptionProps = React.HTMLAttributes<HTMLDivElement>
export type CardContentProps = React.HTMLAttributes<HTMLDivElement>
export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>

/* ---------------------------------- Card ---------------------------------- */

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-xl border border-cornsilk-300 bg-cornsilk-100 text-neutral-900 shadow-sm",
        className,
      )}
      {...props}
    />
  ),
)
Card.displayName = "Card"

/* ------------------------------- CardHeader ------------------------------- */

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  ),
)
CardHeader.displayName = "CardHeader"

/* ------------------------------- CardTitle -------------------------------- */

const CardTitle = React.forwardRef<HTMLDivElement, CardTitleProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "text-h4 font-fraunces font-semibold leading-none tracking-tight",
        className,
      )}
      {...props}
    />
  ),
)
CardTitle.displayName = "CardTitle"

/* ----------------------------- CardDescription ---------------------------- */

const CardDescription = React.forwardRef<HTMLDivElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-b5 font-inter text-neutral-600", className)}
      {...props}
    />
  ),
)
CardDescription.displayName = "CardDescription"

/* ------------------------------ CardContent ------------------------------- */

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  ),
)
CardContent.displayName = "CardContent"

/* ------------------------------- CardFooter ------------------------------- */

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  ),
)
CardFooter.displayName = "CardFooter"

/* -------------------------------- Exports --------------------------------- */

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
