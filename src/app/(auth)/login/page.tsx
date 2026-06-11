import { LoginModule } from "@/modules/AuthModule/sections/login";

export const metadata = {
  title: "Login — Fiorisce",
  description: "Sign in to your Fiorisce account to track orders and manage your wishlist.",
};

export default function LoginPage() {
  return <LoginModule />;
}
