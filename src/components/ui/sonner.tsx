"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-cornsilk-100 group-[.toaster]:text-neutral-900 group-[.toaster]:border-cornsilk-300 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:font-inter dark:group-[.toaster]:bg-neutral-800 dark:group-[.toaster]:text-cornsilk-100 dark:group-[.toaster]:border-neutral-700",
          description:
            "group-[.toast]:text-neutral-500 group-[.toast]:text-b5 dark:group-[.toast]:text-neutral-400",
          actionButton:
            "group-[.toast]:bg-blush-500 group-[.toast]:text-cornsilk-100 dark:group-[.toast]:bg-blush-600",
          cancelButton:
            "group-[.toast]:bg-cornsilk-200 group-[.toast]:text-neutral-800 dark:group-[.toast]:bg-neutral-800 dark:group-[.toast]:text-neutral-200",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
