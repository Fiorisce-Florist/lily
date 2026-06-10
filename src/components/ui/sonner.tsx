"use client"

import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-cornsilk-100 group-[.toaster]:text-neutral-900 group-[.toaster]:border-cornsilk-300 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:font-inter",
          description: "group-[.toast]:text-neutral-500 group-[.toast]:text-b5",
          actionButton:
            "group-[.toast]:bg-blush-500 group-[.toast]:text-cornsilk-100",
          cancelButton:
            "group-[.toast]:bg-cornsilk-200 group-[.toast]:text-neutral-800",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
