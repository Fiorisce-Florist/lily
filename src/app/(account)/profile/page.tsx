import { ProfileModule } from "@/modules/ProfileModule";

export const metadata = {
  title: "My Profile — Fiorisce",
  description: "Manage your personal information, address, and account settings.",
};

export default function ProfilePage() {
  return <ProfileModule />;
}
