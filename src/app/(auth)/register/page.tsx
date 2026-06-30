import { RegisterModule } from "@/modules/AuthModule/sections/register";

export const metadata = {
  title: "Create Account",
  description: "Join Fiorisce to discover curated, fresh, and beautifully arranged blooms.",
};

export default function RegisterPage() {
  return <RegisterModule />;
}
