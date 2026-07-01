export function formatPrice(v: number | string): string {
  if (typeof v === "string") return v;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(v);
}

export function formatShortDate(iso: string | Date | null | undefined): string {
  if (!iso) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(iso));
}

export function formatLongDate(iso: string | Date | null | undefined): string {
  if (!iso) return "N/A";
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
  }).format(new Date(iso));
}

export function getStatusColor(status: string): string {
  switch (status.toUpperCase()) {
    case "PENDING":
      return "text-camel-700 bg-camel-100 border-camel-200 dark:text-camel-300 dark:bg-camel-900/30 dark:border-camel-800/50";
    case "PAID":
      return "text-blue-700 bg-blue-100 border-blue-200 dark:text-blue-300 dark:bg-blue-900/30 dark:border-blue-800/50";
    case "PROCESSING":
      return "text-violet-700 bg-violet-100 border-violet-200 dark:text-violet-300 dark:bg-violet-900/30 dark:border-violet-800/50";
    case "SHIPPED":
      return "text-indigo-700 bg-indigo-100 border-indigo-200 dark:text-indigo-300 dark:bg-indigo-900/30 dark:border-indigo-800/50";
    case "COMPLETED":
      return "text-green-700 bg-green-100 border-green-200 dark:text-green-300 dark:bg-green-900/30 dark:border-green-800/50";
    case "CANCELLED":
      return "text-red-700 bg-red-100 border-red-200 dark:text-red-300 dark:bg-red-900/30 dark:border-red-800/50";
    default:
      return "text-neutral-700 bg-neutral-100 border-neutral-200 dark:text-neutral-300 dark:bg-neutral-800 dark:border-neutral-700";
  }
}
