"use client";

import * as React from "react";
import { DayPicker } from "react-day-picker";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({ className, classNames, showOutsideDays = true, ...props }: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        month_caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-b5 font-inter font-medium",
        nav: "space-x-1 flex items-center",
        button_previous: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute left-1"
        ),
        button_next: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 absolute right-1"
        ),
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday:
          "text-neutral-500 rounded-md w-9 font-inter font-normal text-b6 dark:text-neutral-400",
        week: "flex w-full mt-2",
        day: "h-9 w-9 text-center text-b5 p-0 relative [&:has([aria-selected].range_end)]:rounded-r-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day_button: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-inter font-normal aria-selected:opacity-100"
        ),
        range_end: "range_end",
        selected:
          "bg-blush-500 text-cornsilk-100 hover:bg-blush-500 hover:text-cornsilk-100 focus:bg-blush-500 focus:text-cornsilk-100 dark:bg-blush-600 dark:hover:bg-blush-600 dark:focus:bg-blush-600 rounded-md",
        today: "bg-cornsilk-200 text-neutral-900 dark:bg-neutral-800 dark:text-cornsilk-100",
        outside:
          "outside text-neutral-500 aria-selected:bg-cornsilk-200/50 aria-selected:text-neutral-500 dark:text-neutral-400 dark:aria-selected:bg-neutral-800/50 dark:aria-selected:text-neutral-400",
        disabled: "text-neutral-400 opacity-50 dark:text-neutral-600",
        range_middle:
          "aria-selected:bg-cornsilk-200 aria-selected:text-neutral-900 dark:aria-selected:bg-neutral-800 dark:aria-selected:text-cornsilk-100",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
