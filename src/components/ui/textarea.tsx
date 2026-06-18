import * as React from "react";

import { cn } from "@/lib/utils";

export type TextareaProps = React.ComponentPropsWithoutRef<"textarea">;

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "border-cornsilk-400 bg-cornsilk-100 dark:bg-neutral-800 dark:border-neutral-700 text-b4 font-inter ring-offset-background text-neutral-900 dark:text-neutral-300 focus-visible:ring-blush-500 flex min-h-20 w-full rounded-lg border px-3 py-2 placeholder:text-neutral-500 focus-visible:ring-1 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
