"use client";

import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/* ---------------------------------- Types --------------------------------- */

export type AccordionProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Root>;

export type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

export type AccordionTriggerProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Trigger
>;

export type AccordionContentProps = React.ComponentPropsWithoutRef<
  typeof AccordionPrimitive.Content
>;

/* ------------------------------- Accordion -------------------------------- */

const Accordion = AccordionPrimitive.Root;

/* ----------------------------- AccordionItem ------------------------------ */

const AccordionItem = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Item>,
  AccordionItemProps
>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    // Ditambahkan border dark mode menggunakan warna warm stone gray (neutral-800)
    className={cn("border-cornsilk-300 border-b dark:border-neutral-800", className)}
    {...props}
  />
));
AccordionItem.displayName = "AccordionItem";

/* ---------------------------- AccordionTrigger ---------------------------- */

const AccordionTrigger = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Trigger>,
  AccordionTriggerProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        // 1. Warna teks default disesuaikan (neutral-900 / neutral-100)
        // 2. Transisi hover halus ke warna camel-600 / camel-400
        // 3. Focus state (aksesibilitas) yang rapi menggunakan warna camel
        // 4. Ketika open, ikon chevron berputar sekaligus berubah warna menjadi camel
        "text-b4 font-inter hover:text-camel-600 dark:hover:text-camel-400 focus-visible:ring-camel-500 dark:focus-visible:ring-offset-neutral-1000 [&[data-state=open]>svg]:text-camel-600 dark:data-[state=open]:text-camel-400 data-[state=open]:text-camel-600 dark:[&[data-state=open]>svg]:text-camel-400 flex flex-1 items-center justify-between rounded-md py-4 font-medium text-neutral-900 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden dark:text-neutral-100 [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        // Mengurangi kepekatan warna ikon default (neutral-400) agar fokus utama tetap pada teks
        className="h-4 w-4 shrink-0 text-neutral-400 transition-transform duration-200 ease-in-out"
        aria-hidden="true"
      />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;

/* ---------------------------- AccordionContent ---------------------------- */

const AccordionContent = React.forwardRef<
  React.ComponentRef<typeof AccordionPrimitive.Content>,
  AccordionContentProps
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="text-b5 font-inter data-[state=closed]:motion-safe:animate-accordion-up data-[state=open]:motion-safe:animate-accordion-down overflow-hidden"
    {...props}
  >
    {/* Mengubah warna teks konten menjadi sedikit lebih lembut (neutral-600 / neutral-400) demi kenyamanan membaca */}
    <div
      className={cn("pt-0 pb-4 leading-relaxed text-neutral-600 dark:text-neutral-400", className)}
    >
      {children}
    </div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

/* -------------------------------- Exports --------------------------------- */

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
