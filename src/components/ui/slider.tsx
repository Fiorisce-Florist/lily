"use client"

import * as React from "react"
import * as SliderPrimitive from "@radix-ui/react-slider"

import { cn } from "@/lib/utils"

/* ---------------------------------- Types --------------------------------- */

export type SliderProps = React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
>

/* --------------------------------- Slider --------------------------------- */

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full touch-none items-center select-none",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="bg-cornsilk-200 relative h-2 w-full grow overflow-hidden rounded-full">
      <SliderPrimitive.Range className="bg-blush-500 absolute h-full" />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="border-blush-500 bg-cornsilk-100 ring-offset-background focus-visible:ring-blush-500 block h-5 w-5 rounded-full border-2 transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
))
Slider.displayName = SliderPrimitive.Root.displayName

/* -------------------------------- Exports --------------------------------- */

export { Slider }
