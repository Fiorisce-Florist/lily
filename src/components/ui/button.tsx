import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-inter font-medium whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blush-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary:
          "bg-blush-500 text-cornsilk-100 hover:bg-blush-600 active:bg-blush-700",
        secondary:
          "bg-cornsilk-500 text-neutral-900 hover:bg-cornsilk-600 active:bg-cornsilk-700",
        outline:
          "border border-cornsilk-400 text-neutral-800 bg-transparent  hover:bg-cornsilk-300 active:bg-cornsilk-500  hover:text-neutral-800",
        ghost:
          "text-neutral-700 hover:bg-cornsilk-200 hover:text-neutral-800 active:bg-cornsilk-500",
        link:
          "text-blush-500 underline-offset-4 hover:underline active:text-blush-700",
      },
      size: {
        sm: "h-8 px-3 text-b5",
        md: "h-10 px-4 text-b4",
        lg: "h-12 px-6 text-b3",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

export type ButtonProps = React.ComponentPropsWithoutRef<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
