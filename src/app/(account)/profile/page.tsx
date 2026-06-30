import { ProfileModule } from "@/modules/ProfileModule";
import { getProfile, getUserAddresses } from "@/app/actions/profile";

export const metadata = {
  title: "My Profile",
  description: "Manage your personal information, address, and account settings.",
};

export default async function ProfilePage() {
  const [{ profile, error }, { addresses }] = await Promise.all([getProfile(), getUserAddresses()]);

  return <ProfileModule profile={profile} addresses={addresses} error={error} />;
}
