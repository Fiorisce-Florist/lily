"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import { Combobox } from "@/components/ui/combobox";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { DataTable } from "@/components/ui/data-table";
import { ColumnDef } from "@tanstack/react-table";

// Data Table Mock Data
type Payment = {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
};

const data: Payment[] = [
  { id: "m5gr84i9", amount: 316, status: "success", email: "ken99@yahoo.com" },
  { id: "3u1reuv4", amount: 242, status: "success", email: "Abe45@gmail.com" },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@gmail.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@gmail.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@hotmail.com",
  },
];

const columns: ColumnDef<Payment>[] = [
  { accessorKey: "status", header: "Status" },
  { accessorKey: "email", header: "Email" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);
      return <div className="font-jetbrains text-right font-medium">{formatted}</div>;
    },
  },
];

export function ComplexShowcase() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <section className="space-y-8">
      <div>
        <h2 className="text-h3 font-fraunces border-cornsilk-300 mb-6 border-b pb-2 font-bold text-neutral-700 dark:border-neutral-800 dark:text-neutral-300">
          Complex Features
        </h2>
        <p className="text-b4 mb-8 max-w-2xl text-neutral-600 dark:text-neutral-400">
          Advanced components with complex interactions and state management.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-12 xl:grid-cols-2">
        {/* Calendar */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Calendar
          </h3>
          <div className="border-cornsilk-300 flex justify-center rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="border-cornsilk-300 rounded-md border shadow-sm dark:border-neutral-800"
            />
          </div>
        </div>

        {/* Combobox */}
        <div className="space-y-4">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Combobox
          </h3>
          <div className="border-cornsilk-300 flex min-h-62.5 items-center justify-center rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <Combobox
              options={[
                { label: "Rose", value: "rose" },
                { label: "Tulip", value: "tulip" },
                { label: "Sunflower", value: "sunflower" },
                { label: "Lily", value: "lily" },
                { label: "Orchid", value: "orchid" },
              ]}
              placeholder="Select a flower..."
            />
          </div>
        </div>

        {/* Carousel */}
        <div className="space-y-4 xl:col-span-2">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Carousel
          </h3>
          <div className="border-cornsilk-300 flex items-center justify-center rounded-xl border bg-white p-12 dark:border-neutral-800 dark:bg-neutral-900">
            <Carousel className="w-full max-w-xs sm:max-w-md">
              <CarouselContent>
                {Array.from({ length: 5 }).map((_, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                      <div className="bg-cornsilk-200 border-cornsilk-400 flex aspect-square items-center justify-center rounded-xl border">
                        <span className="text-h2 font-fraunces font-semibold text-neutral-800">
                          Slide {index + 1}
                        </span>
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>

        {/* Sonner Toasts */}
        <div className="space-y-4 xl:col-span-2">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Toast Notifications (Sonner)
          </h3>
          <div className="border-cornsilk-300 flex flex-wrap items-center justify-center gap-4 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <Button
              variant="outline"
              onClick={() =>
                toast("Event has been created", {
                  description: "Sunday, December 03, 2023 at 9:00 AM",
                  action: { label: "Undo", onClick: () => console.log("Undo") },
                })
              }
            >
              Default Toast
            </Button>
            <Button variant="outline" onClick={() => toast.success("Subscription updated!")}>
              Success Toast
            </Button>
            <Button
              variant="outline"
              onClick={() => toast.error("Payment failed. Please try again.")}
            >
              Error Toast
            </Button>
          </div>
        </div>

        {/* Data Table */}
        <div className="space-y-4 xl:col-span-2">
          <h3 className="text-h5 font-inter mb-4 font-semibold tracking-wider text-neutral-500 uppercase">
            Data Table
          </h3>
          <div className="border-cornsilk-300 rounded-xl border bg-white p-6 dark:border-neutral-800 dark:bg-neutral-900">
            <DataTable columns={columns} data={data} />
          </div>
        </div>
      </div>
    </section>
  );
}
