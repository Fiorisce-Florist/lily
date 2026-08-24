import { adminGetSiteSettings } from "@/app/actions/admin";
import { SettingsView } from "@/modules/AdminModule/views/SettingsView";

export const metadata = {
  title: "Settings",
};

export default async function AdminSettingsPage() {
  const settings = await adminGetSiteSettings();

  return <SettingsView settings={settings} />;
}
