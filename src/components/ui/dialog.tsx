"use client";

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

/* -------------------------------- Overlay -------------------------------- */

const DialogOverlay = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50",
      "bg-neutral-1000/60 dark:bg-neutral-1000/80",
      "motion-safe:data-[state=open]:animate-fade-in",
      "motion-safe:data-[state=closed]:animate-fade-out",
      className
    )}
    {...props}
  />
));

DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

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
        "fixed top-1/2 left-1/2 z-50",
        "grid w-[95vw] max-w-lg gap-4",
        "-translate-x-1/2 -translate-y-1/2",
        "rounded-xl border p-6 shadow-lg",

        // Light mode
        "border-cornsilk-300 bg-cornsilk-100 text-neutral-900",

        // Dark mode
        "dark:text-cornsilk-100 dark:border-neutral-700 dark:bg-neutral-900",

        "motion-safe:data-[state=open]:animate-dialog-in",
        "motion-safe:data-[state=closed]:animate-dialog-out",

        className
      )}
      {...props}
    >
      {children}

      <DialogPrimitive.Close
        className={cn(
          "absolute top-4 right-4 rounded-md p-1",
          "opacity-70 transition-opacity",
          "hover:opacity-100",
          "focus:outline-none",
          "focus:ring-blush-500 focus:ring-1",
          "focus:ring-offset-2",
          "disabled:pointer-events-none",

          "dark:text-cornsilk-300 text-neutral-700",

          "data-[state=open]:bg-cornsilk-200",
          "dark:data-[state=open]:bg-neutral-800"
        )}
      >
        <X className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));

DialogContent.displayName = DialogPrimitive.Content.displayName;

/* -------------------------------- Header -------------------------------- */

const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
      {...props}
    />
  )
);

DialogHeader.displayName = "DialogHeader";

/* -------------------------------- Footer -------------------------------- */

const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  )
);

DialogFooter.displayName = "DialogFooter";

/* -------------------------------- Title --------------------------------- */

const DialogTitle = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn("text-h4 font-fraunces leading-none font-semibold tracking-tight", className)}
    {...props}
  />
));

DialogTitle.displayName = DialogPrimitive.Title.displayName;

/* ------------------------------ Description ----------------------------- */

const DialogDescription = React.forwardRef<
  React.ComponentRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-b5 font-inter dark:text-cornsilk-400 text-neutral-600", className)}
    {...props}
  />
));

DialogDescription.displayName = DialogPrimitive.Description.displayName;

/* -------------------------------- Types --------------------------------- */

type DialogProps = React.ComponentPropsWithoutRef<typeof Dialog>;
type DialogTriggerProps = React.ComponentPropsWithoutRef<typeof DialogTrigger>;
type DialogPortalProps = React.ComponentPropsWithoutRef<typeof DialogPortal>;
type DialogCloseProps = React.ComponentPropsWithoutRef<typeof DialogClose>;
type DialogOverlayProps = React.ComponentPropsWithoutRef<typeof DialogOverlay>;
type DialogContentProps = React.ComponentPropsWithoutRef<typeof DialogContent>;
type DialogHeaderProps = React.HTMLAttributes<HTMLDivElement>;
type DialogFooterProps = React.HTMLAttributes<HTMLDivElement>;
type DialogTitleProps = React.ComponentPropsWithoutRef<typeof DialogTitle>;
type DialogDescriptionProps = React.ComponentPropsWithoutRef<typeof DialogDescription>;

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
};

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
};
