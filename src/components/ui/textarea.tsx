import * as React from "react"

import { cn } from "@/lib/utils"

export type TextareaProps = React.ComponentPropsWithoutRef<"textarea">

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-20 w-full rounded-lg border border-cornsilk-400 bg-cornsilk-100 px-3 py-2 text-b4 font-inter text-neutral-900 ring-offset-background placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blush-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Textarea.displayName = "Textarea"

export { Textarea }
