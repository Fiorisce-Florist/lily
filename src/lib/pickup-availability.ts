export const PICKUP_AVAILABILITY_DAYS = 30;
export const STORE_TIME_ZONE = "Asia/Jakarta";

export function getJakartaDateKey(date: Date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: STORE_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  return `${year}-${month}-${day}`;
}

export function isDateKey(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function addDaysToDateKey(dateKey: string, days: number) {
  const [year, month, day] = dateKey.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day + days, 0, 0, 0, 0));
  return date.toISOString().slice(0, 10);
}

export function dateKeyToDate(dateKey: string) {
  return new Date(`${dateKey}T00:00:00.000Z`);
}

export function dateToDateKey(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function getPickupAvailabilityWindow() {
  const start = getJakartaDateKey();
  const end = addDaysToDateKey(start, PICKUP_AVAILABILITY_DAYS);

  return { start, end };
}

export function isDateKeyInPickupWindow(dateKey: string) {
  if (!isDateKey(dateKey)) return false;

  const { start, end } = getPickupAvailabilityWindow();
  return dateKey >= start && dateKey <= end;
}

export function getPickupAvailabilityDateKeys() {
  const { start } = getPickupAvailabilityWindow();
  return Array.from({ length: PICKUP_AVAILABILITY_DAYS + 1 }, (_, index) =>
    addDaysToDateKey(start, index)
  );
}
