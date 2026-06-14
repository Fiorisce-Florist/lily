// TODO: set NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY to re-enable
import Medusa from "@medusajs/js-sdk";

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";
const publishableKey = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "";

export const medusa = new Medusa({
  baseUrl,
  publishableKey,
  debug: process.env.NODE_ENV === "development",
});
