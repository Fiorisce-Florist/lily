import * as React from "react";

import { cn } from "@/lib/utils";

export type InputProps = React.ComponentPropsWithoutRef<"input">;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "border-cornsilk-400 bg-cornsilk-100  dark:bg-neutral-800 dark:border-neutral-700 text-b4 font-inter ring-offset-background file:text-b5 focus-visible:ring-blush-500 flex h-10 w-full rounded-lg border px-3 py-2 text-neutral-900 dark:text-neutral-300 file:border-0 file:bg-transparent file:font-medium file:text-neutral-800 placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
