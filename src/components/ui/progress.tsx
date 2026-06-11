"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

import { cn } from "@/lib/utils";

/* ---------------------------------- Types --------------------------------- */

export type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>;

/* -------------------------------- Progress -------------------------------- */

const Progress = React.forwardRef<React.ComponentRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn("bg-cornsilk-200 relative h-2 w-full overflow-hidden rounded-full", className)}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className="bg-blush-500 h-full w-full flex-1 rounded-full transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

/* -------------------------------- Exports --------------------------------- */

export { Progress };
