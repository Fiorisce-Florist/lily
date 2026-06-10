"use client"

import * as React from "react"
import * as TabsPrimitive from "@radix-ui/react-tabs"

import { cn } from "@/lib/utils"

const Tabs = TabsPrimitive.Root

// ---------- TabsList ----------

export type TabsListProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.List
>

const TabsList = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.List>,
  TabsListProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "bg-cornsilk-200 inline-flex h-10 items-center justify-center rounded-lg p-1 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
      className
    )}
    {...props}
  />
))
TabsList.displayName = TabsPrimitive.List.displayName

// ---------- TabsTrigger ----------

export type TabsTriggerProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Trigger
>

const TabsTrigger = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Trigger>,
  TabsTriggerProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      "text-b5 font-inter ring-offset-background focus-visible:ring-blush-500 data-[state=active]:bg-cornsilk-100 dark:data-[state=active]:text-cornsilk-100 inline-flex items-center justify-center rounded-md px-3 py-1.5 font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-neutral-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-neutral-900",
      className
    )}
    {...props}
  />
))
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName

// ---------- TabsContent ----------

export type TabsContentProps = React.ComponentPropsWithoutRef<
  typeof TabsPrimitive.Content
>

const TabsContent = React.forwardRef<
  React.ComponentRef<typeof TabsPrimitive.Content>,
  TabsContentProps
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "ring-offset-background focus-visible:ring-blush-500 mt-2 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
      className
    )}
    {...props}
  />
))
TabsContent.displayName = TabsPrimitive.Content.displayName

export { Tabs, TabsList, TabsTrigger, TabsContent }
