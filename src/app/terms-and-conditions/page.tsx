import { Metadata } from "next";
import { TermsContent } from "./terms-content";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description: "Terms and conditions for Fiorisce.",
};

export default function TermsAndConditionsPage() {
  return <TermsContent />;
}
