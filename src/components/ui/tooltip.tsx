"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

/* -------------------------------- Content -------------------------------- */

const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-lg border border-neutral-800 bg-neutral-900 px-3 py-1.5",
        "text-b6 font-inter text-cornsilk-100 shadow-md",
        "motion-safe:animate-fade-in",
        className,
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

/* -------------------------------- Types --------------------------------- */

type TooltipProviderProps = React.ComponentPropsWithoutRef<
  typeof TooltipProvider
>
type TooltipProps = React.ComponentPropsWithoutRef<typeof Tooltip>
type TooltipTriggerProps = React.ComponentPropsWithoutRef<typeof TooltipTrigger>
type TooltipContentProps = React.ComponentPropsWithoutRef<typeof TooltipContent>

export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent }

export type {
  TooltipProviderProps,
  TooltipProps,
  TooltipTriggerProps,
  TooltipContentProps,
}
