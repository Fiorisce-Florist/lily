import { DokuCheckoutProvider } from "./doku";

export function getPaymentProvider() {
  return new DokuCheckoutProvider();
}

export { normalizeDokuPaymentMethod, verifyDokuSignature } from "./doku";
