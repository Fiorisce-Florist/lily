import { DokuPaymentProvider } from "./doku";

export function getPaymentProvider() {
  return new DokuPaymentProvider();
}

export { normalizeDokuPaymentMethod, verifyDokuSignature } from "./doku";
