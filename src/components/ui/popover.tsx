"use client"

import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

/* -------------------------------- Content -------------------------------- */

const PopoverContent = React.forwardRef<
  React.ComponentRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-xl border border-cornsilk-300 bg-cornsilk-100 p-4 text-neutral-900 shadow-md outline-none dark:border-neutral-700 dark:bg-neutral-900 dark:text-cornsilk-100",
        "motion-safe:data-[state=open]:animate-fade-in",
        "motion-safe:data-[state=closed]:animate-fade-out",
        className,
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

/* -------------------------------- Types --------------------------------- */

type PopoverProps = React.ComponentPropsWithoutRef<typeof Popover>
type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>
type PopoverAnchorProps = React.ComponentPropsWithoutRef<typeof PopoverAnchor>
type PopoverContentProps = React.ComponentPropsWithoutRef<typeof PopoverContent>

export { Popover, PopoverTrigger, PopoverAnchor, PopoverContent }

export type {
  PopoverProps,
  PopoverTriggerProps,
  PopoverAnchorProps,
  PopoverContentProps,
}
