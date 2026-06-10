import * as React from "react"

import { cn } from "@/lib/utils"

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("bg-cornsilk-200 animate-pulse rounded-md", className)}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton }
