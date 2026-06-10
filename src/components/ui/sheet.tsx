"use client"

import * as React from "react"
import * as SheetPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const Sheet = SheetPrimitive.Root

const SheetTrigger = SheetPrimitive.Trigger

const SheetClose = SheetPrimitive.Close

const SheetPortal = SheetPrimitive.Portal

/* -------------------------------- Overlay -------------------------------- */

const SheetOverlay = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-neutral-1000/60",
      "motion-safe:data-[state=open]:animate-fade-in",
      "motion-safe:data-[state=closed]:animate-fade-out",
      className,
    )}
    {...props}
  />
))
SheetOverlay.displayName = SheetPrimitive.Overlay.displayName

/* ------------------------------ Variants -------------------------------- */

const sheetVariants = cva(
  "fixed z-50 gap-4 bg-cornsilk-100 p-6 shadow-lg transition ease-in-out motion-safe:data-[state=closed]:duration-300 motion-safe:data-[state=open]:duration-300",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b border-cornsilk-300 motion-safe:data-[state=open]:animate-slide-in-from-top motion-safe:data-[state=closed]:animate-slide-out-to-top",
        bottom:
          "inset-x-0 bottom-0 border-t border-cornsilk-300 motion-safe:data-[state=open]:animate-slide-in-from-bottom motion-safe:data-[state=closed]:animate-slide-out-to-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r border-cornsilk-300 sm:max-w-sm motion-safe:data-[state=open]:animate-slide-in-from-left motion-safe:data-[state=closed]:animate-slide-out-to-left",
        right:
          "inset-y-0 right-0 h-full w-3/4 border-l border-cornsilk-300 sm:max-w-sm motion-safe:data-[state=open]:animate-slide-in-from-right motion-safe:data-[state=closed]:animate-slide-out-to-right",
      },
    },
    defaultVariants: {
      side: "right",
    },
  },
)

/* -------------------------------- Content -------------------------------- */

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitive.Content>,
    VariantProps<typeof sheetVariants> {}

const SheetContent = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Content>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <SheetPortal>
    <SheetOverlay />
    <SheetPrimitive.Content
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetPrimitive.Close
        className={cn(
          "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background",
          "transition-opacity hover:opacity-100",
          "focus:outline-none focus:ring-2 focus:ring-blush-500 focus:ring-offset-2",
          "disabled:pointer-events-none",
          "data-[state=open]:bg-cornsilk-200",
        )}
      >
        <X className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Close</span>
      </SheetPrimitive.Close>
    </SheetPrimitive.Content>
  </SheetPortal>
))
SheetContent.displayName = SheetPrimitive.Content.displayName

/* -------------------------------- Header -------------------------------- */

const SheetHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-2 text-center sm:text-left",
      className,
    )}
    {...props}
  />
))
SheetHeader.displayName = "SheetHeader"

/* -------------------------------- Footer -------------------------------- */

const SheetFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className,
    )}
    {...props}
  />
))
SheetFooter.displayName = "SheetFooter"

/* -------------------------------- Title --------------------------------- */

const SheetTitle = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Title>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Title
    ref={ref}
    className={cn("text-h4 font-fraunces font-semibold", className)}
    {...props}
  />
))
SheetTitle.displayName = SheetPrimitive.Title.displayName

/* ------------------------------ Description ----------------------------- */

const SheetDescription = React.forwardRef<
  React.ComponentRef<typeof SheetPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof SheetPrimitive.Description>
>(({ className, ...props }, ref) => (
  <SheetPrimitive.Description
    ref={ref}
    className={cn("text-b5 font-inter text-neutral-600", className)}
    {...props}
  />
))
SheetDescription.displayName = SheetPrimitive.Description.displayName

/* -------------------------------- Types --------------------------------- */

type SheetProps = React.ComponentPropsWithoutRef<typeof Sheet>
type SheetTriggerProps = React.ComponentPropsWithoutRef<typeof SheetTrigger>
type SheetCloseProps = React.ComponentPropsWithoutRef<typeof SheetClose>
type SheetPortalProps = React.ComponentPropsWithoutRef<typeof SheetPortal>
type SheetOverlayProps = React.ComponentPropsWithoutRef<typeof SheetOverlay>
type SheetHeaderProps = React.ComponentPropsWithoutRef<typeof SheetHeader>
type SheetFooterProps = React.ComponentPropsWithoutRef<typeof SheetFooter>
type SheetTitleProps = React.ComponentPropsWithoutRef<typeof SheetTitle>
type SheetDescriptionProps = React.ComponentPropsWithoutRef<
  typeof SheetDescription
>

export {
  Sheet,
  SheetTrigger,
  SheetClose,
  SheetPortal,
  SheetOverlay,
  sheetVariants,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetTitle,
  SheetDescription,
}

export type {
  SheetProps,
  SheetTriggerProps,
  SheetCloseProps,
  SheetPortalProps,
  SheetOverlayProps,
  SheetContentProps,
  SheetHeaderProps,
  SheetFooterProps,
  SheetTitleProps,
  SheetDescriptionProps,
}
