"use client"

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const Dialog = DialogPrimitive.Root

const DialogTrigger = DialogPrimitive.Trigger

const DialogPortal = DialogPrimitive.Portal

const DialogClose = DialogPrimitive.Close

/* -------------------------------- Overlay -------------------------------- */

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
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
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName

/* -------------------------------- Content -------------------------------- */

const DialogContent = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg gap-4",
        "border border-cornsilk-300 bg-cornsilk-100 p-6 shadow-lg rounded-xl",
        "motion-safe:data-[state=open]:animate-dialog-in",
        "motion-safe:data-[state=closed]:animate-dialog-out",
        className,
      )}
      {...props}
    >
      {children}
      <DialogPrimitive.Close
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
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
))
DialogContent.displayName = DialogPrimitive.Content.displayName

/* -------------------------------- Header -------------------------------- */

const DialogHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className,
    )}
    {...props}
  />
))
DialogHeader.displayName = "DialogHeader"

/* -------------------------------- Footer -------------------------------- */

const DialogFooter = React.forwardRef<
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
DialogFooter.displayName = "DialogFooter"

/* -------------------------------- Title --------------------------------- */

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-h4 font-fraunces font-semibold leading-none tracking-tight",
      className,
    )}
    {...props}
  />
))
DialogTitle.displayName = DialogPrimitive.Title.displayName

/* ------------------------------ Description ----------------------------- */

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-b5 font-inter text-neutral-600", className)}
    {...props}
  />
))
DialogDescription.displayName = DialogPrimitive.Description.displayName

/* -------------------------------- Types --------------------------------- */

type DialogProps = React.ComponentPropsWithoutRef<typeof Dialog>
type DialogTriggerProps = React.ComponentPropsWithoutRef<typeof DialogTrigger>
type DialogPortalProps = React.ComponentPropsWithoutRef<typeof DialogPortal>
type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogClose>
type DialogOverlayProps = React.ComponentPropsWithoutRef<typeof DialogOverlay>
type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogContent>
type DialogHeaderProps = React.ComponentPropsWithoutRef<typeof DialogHeader>
type DialogFooterProps = React.ComponentPropsWithoutRef<typeof DialogFooter>
type DialogTitleProps = React.ComponentPropsWithoutRef<typeof DialogTitle>
type DialogDescriptionProps = React.ComponentPropsWithoutRef<
  typeof DialogDescription
>

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
}

export type {
  DialogProps,
  DialogTriggerProps,
  DialogPortalProps,
  DialogCloseProps,
  DialogOverlayProps,
  DialogContentProps,
  DialogHeaderProps,
  DialogFooterProps,
  DialogTitleProps,
  DialogDescriptionProps,
}
