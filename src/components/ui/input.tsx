import * as React from "react"

import { cn } from "@/lib/utils"

export type InputProps = React.ComponentPropsWithoutRef<"input">

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-lg border border-cornsilk-400 bg-cornsilk-100 px-3 py-2 text-b4 font-inter text-neutral-900 ring-offset-background file:border-0 file:bg-transparent file:text-b5 file:font-medium file:text-neutral-800 placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
