"use client";

import * as React from "react";
import { format } from "date-fns";
import { CalendarDays, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { adminSetPickupAvailability } from "@/app/actions/admin";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";

interface PickupAvailabilityDay {
  date: string;
  isOpen: boolean;
}

interface PickupAvailabilityViewProps {
  initialDates: PickupAvailabilityDay[];
}

function toLocalDate(dateKey: string) {
  return new Date(`${dateKey}T00:00:00`);
}

export function PickupAvailabilityView({ initialDates }: PickupAvailabilityViewProps) {
  const [dates, setDates] = React.useState(initialDates);
  const [updatingDate, setUpdatingDate] = React.useState<string | null>(null);

  const dateKeys = React.useMemo(() => new Set(dates.map((day) => day.date)), [dates]);
  const openDateKeys = React.useMemo(
    () => new Set(dates.filter((day) => day.isOpen).map((day) => day.date)),
    [dates]
  );
  const selectedDates = React.useMemo(
    () => dates.filter((day) => day.isOpen).map((day) => toLocalDate(day.date)),
    [dates]
  );

  const openCount = selectedDates.length;

  const setDateOpen = async (date: string, isOpen: boolean) => {
    if (updatingDate) return;

    setUpdatingDate(date);
    const previousDates = dates;
    setDates((current) => current.map((day) => (day.date === date ? { ...day, isOpen } : day)));

    const result = await adminSetPickupAvailability(date, isOpen);
    setUpdatingDate(null);

    if (result.error) {
      setDates(previousDates);
      toast.error(result.error);
      return;
    }

    toast.success(`${format(toLocalDate(date), "PPP")} is now ${isOpen ? "open" : "closed"}.`);
  };

  const handleCalendarSelect = (nextSelectedDates: Date[] | undefined) => {
    const nextOpenDateKeys = new Set(
      (nextSelectedDates ?? []).map((date) => format(date, "yyyy-MM-dd"))
    );

    const changedDate = dates.find((day) => openDateKeys.has(day.date) !== nextOpenDateKeys.has(day.date));
    if (!changedDate) return;

    setDateOpen(changedDate.date, nextOpenDateKeys.has(changedDate.date));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="font-fraunces text-2xl font-semibold text-neutral-900 dark:text-cornsilk-100">
            Pickup & Delivery Availability
          </h1>
          <p className="mt-1 font-inter text-sm text-neutral-500">
            Open or close customer pickup, delivery, and in-store pickup dates for the next 30 days.
          </p>
        </div>
        <Badge variant={openCount > 0 ? "success" : "secondary"}>{openCount} open dates</Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,420px)_1fr]">
        <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-neutral-400" />
            <h2 className="font-fraunces text-lg font-medium">Availability Calendar</h2>
          </div>
          <Calendar
            mode="multiple"
            selected={selectedDates}
            onSelect={handleCalendarSelect}
            disabled={(date) => !dateKeys.has(format(date, "yyyy-MM-dd")) || Boolean(updatingDate)}
            classNames={{
              selected:
                "bg-olive-500 text-white hover:bg-olive-600 hover:text-white focus:bg-olive-600 focus:text-white rounded-full",
            }}
          />
          <p className="mt-4 font-inter text-sm text-neutral-500">
            Selected dates are open. Unselected dates are closed and cannot be chosen at checkout.
          </p>
        </section>

        <section className="rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
          <div className="border-b border-neutral-200 px-6 py-4 dark:border-neutral-800">
            <h2 className="font-fraunces text-lg font-medium">Next 30 Days</h2>
          </div>
          <div className="divide-y divide-neutral-200 dark:divide-neutral-800">
            {dates.map((day) => (
              <div key={day.date} className="flex items-center justify-between gap-4 px-6 py-4">
                <div>
                  <p className="font-inter text-sm font-medium text-neutral-900 dark:text-cornsilk-100">
                    {format(toLocalDate(day.date), "EEEE, MMMM d")}
                  </p>
                  <p className="font-jetbrains text-xs text-neutral-500">{day.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  {updatingDate === day.date && (
                    <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
                  )}
                  <span className="font-inter text-sm text-neutral-500">
                    {day.isOpen ? "Open" : "Closed"}
                  </span>
                  <Switch
                    checked={day.isOpen}
                    disabled={Boolean(updatingDate)}
                    onCheckedChange={(checked) => setDateOpen(day.date, checked)}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
