"use client"

import * as React from "react"
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

const AlertDialog = AlertDialogPrimitive.Root

const AlertDialogTrigger = AlertDialogPrimitive.Trigger

const AlertDialogPortal = AlertDialogPrimitive.Portal

/* -------------------------------- Overlay -------------------------------- */

const AlertDialogOverlay = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-neutral-1000/60 dark:bg-neutral-1000/80",
      "motion-safe:data-[state=open]:animate-fade-in",
      "motion-safe:data-[state=closed]:animate-fade-out",
      className,
    )}
    {...props}
  />
))
AlertDialogOverlay.displayName = AlertDialogPrimitive.Overlay.displayName

/* -------------------------------- Content -------------------------------- */

const AlertDialogContent = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Content>
>(({ className, ...props }, ref) => (
  <AlertDialogPortal>
    <AlertDialogOverlay />
    <AlertDialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg gap-4",
        "-translate-x-1/2 -translate-y-1/2",
        "border border-cornsilk-300 bg-cornsilk-100 p-6 shadow-lg rounded-xl",
        "text-neutral-900 dark:border-neutral-700 dark:bg-neutral-900 dark:text-cornsilk-100",
        "motion-safe:data-[state=open]:animate-dialog-in",
        "motion-safe:data-[state=closed]:animate-dialog-out",
        className,
      )}
      {...props}
    />
  </AlertDialogPortal>
))
AlertDialogContent.displayName = AlertDialogPrimitive.Content.displayName

/* -------------------------------- Header -------------------------------- */

const AlertDialogHeader = React.forwardRef<
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
AlertDialogHeader.displayName = "AlertDialogHeader"

/* -------------------------------- Footer -------------------------------- */

const AlertDialogFooter = React.forwardRef<
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
AlertDialogFooter.displayName = "AlertDialogFooter"

/* -------------------------------- Title --------------------------------- */

const AlertDialogTitle = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Title
    ref={ref}
    className={cn("text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100", className)}
    {...props}
  />
))
AlertDialogTitle.displayName = AlertDialogPrimitive.Title.displayName

/* ------------------------------ Description ----------------------------- */

const AlertDialogDescription = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Description
    ref={ref}
    className={cn("text-b5 font-inter text-neutral-600 dark:text-cornsilk-400", className)}
    {...props}
  />
))
AlertDialogDescription.displayName =
  AlertDialogPrimitive.Description.displayName

/* -------------------------------- Action -------------------------------- */

const AlertDialogAction = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Action>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Action>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Action
    ref={ref}
    className={cn(buttonVariants(), className)}
    {...props}
  />
))
AlertDialogAction.displayName = AlertDialogPrimitive.Action.displayName

/* -------------------------------- Cancel -------------------------------- */

const AlertDialogCancel = React.forwardRef<
  React.ComponentRef<typeof AlertDialogPrimitive.Cancel>,
  React.ComponentPropsWithoutRef<typeof AlertDialogPrimitive.Cancel>
>(({ className, ...props }, ref) => (
  <AlertDialogPrimitive.Cancel
    ref={ref}
    className={cn(
      buttonVariants({ variant: "outline" }),
      "mt-2 sm:mt-0",
      className,
    )}
    {...props}
  />
))
AlertDialogCancel.displayName = AlertDialogPrimitive.Cancel.displayName

/* -------------------------------- Types --------------------------------- */

type AlertDialogProps = React.ComponentPropsWithoutRef<typeof AlertDialog>
type AlertDialogTriggerProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogTrigger
>
type AlertDialogPortalProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogPortal
>
type AlertDialogOverlayProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogOverlay
>
type AlertDialogContentProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogContent
>
type AlertDialogHeaderProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogHeader
>
type AlertDialogFooterProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogFooter
>
type AlertDialogTitleProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogTitle
>
type AlertDialogDescriptionProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogDescription
>
type AlertDialogActionProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogAction
>
type AlertDialogCancelProps = React.ComponentPropsWithoutRef<
  typeof AlertDialogCancel
>

export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
}

export type {
  AlertDialogProps,
  AlertDialogTriggerProps,
  AlertDialogPortalProps,
  AlertDialogOverlayProps,
  AlertDialogContentProps,
  AlertDialogHeaderProps,
  AlertDialogFooterProps,
  AlertDialogTitleProps,
  AlertDialogDescriptionProps,
  AlertDialogActionProps,
  AlertDialogCancelProps,
}
