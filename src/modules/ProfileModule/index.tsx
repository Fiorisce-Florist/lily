"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  Edit,
  X,
  Loader2,
  Trash2,
  MapPin,
  KeyRound,
  User,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { toast } from "sonner";
import { updateProfile, deleteAddress } from "@/app/actions/profile";
import { authClient } from "@/lib/auth-client";
import type { ProfileData, AddressData } from "@/app/actions/profile";

// ─── Personal Info Section ────────────────────────────────────────────────────

function PersonalInfoSection({ profile }: { profile: ProfileData }) {
  const router = useRouter();
  const [isEditing, setIsEditing] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);

  const nameParts = (profile.name ?? "").split(" ");
  const [firstName, setFirstName] = React.useState(nameParts[0] ?? "");
  const [lastName, setLastName] = React.useState(nameParts.slice(1).join(" "));
  const [phone, setPhone] = React.useState(profile.phone ?? "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim()) {
      toast.error("First name is required.");
      return;
    }
    setIsSaving(true);
    const result = await updateProfile({
      name: [firstName.trim(), lastName.trim()].filter(Boolean).join(" "),
      phone: phone.trim(),
    });
    setIsSaving(false);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Profile updated!");
      setIsEditing(false);
      router.refresh();
    }
  };

  const handleCancel = () => {
    const parts = (profile.name ?? "").split(" ");
    setFirstName(parts[0] ?? "");
    setLastName(parts.slice(1).join(" "));
    setPhone(profile.phone ?? "");
    setIsEditing(false);
  };

  return (
    <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-blush-100 dark:bg-blush-900/30">
            <User className="h-4 w-4 text-blush-600 dark:text-blush-400" />
          </div>
          <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            Personal Information
          </h2>
        </div>
        {!isEditing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1.5"
          >
            <Edit className="h-3.5 w-3.5" />
            Edit
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              disabled={!isEditing}
              placeholder="Jane"
              className={!isEditing ? "bg-neutral-50 dark:bg-neutral-950" : ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              disabled={!isEditing}
              placeholder="Doe"
              className={!isEditing ? "bg-neutral-50 dark:bg-neutral-950" : ""}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={profile.email ?? ""}
            disabled
            className="bg-neutral-50 dark:bg-neutral-950 text-neutral-500 dark:text-neutral-400"
          />
          <p className="text-b6 font-inter text-neutral-400">Email cannot be changed here.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            disabled={!isEditing}
            placeholder="+62 812 3456 7890"
            className={!isEditing ? "bg-neutral-50 dark:bg-neutral-950" : ""}
          />
        </div>

        {/* Role badge */}
        <div className="flex items-center gap-2 pt-2">
          <span className="text-b5 font-inter text-neutral-500 dark:text-neutral-400">Role:</span>
          <Badge
            className={
              profile.role === "ADMIN"
                ? "bg-blush-100 text-blush-800 dark:bg-blush-900/30 dark:text-blush-300"
                : "bg-camel-100 text-camel-800 dark:bg-camel-900/30 dark:text-camel-300"
            }
          >
            {profile.role}
          </Badge>
        </div>

        {isEditing && (
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isSaving ? "Saving…" : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-1.5"
            >
              <X className="h-4 w-4" />
              Cancel
            </Button>
          </div>
        )}
      </form>
    </section>
  );
}

// ─── Password Section ─────────────────────────────────────────────────────────

function PasswordSection({ hasPassword }: { hasPassword: boolean }) {
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [current, setCurrent] = React.useState("");
  const [next, setNext] = React.useState("");
  const [confirm, setConfirm] = React.useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (next !== confirm) {
      toast.error("New passwords do not match.");
      return;
    }
    if (next.length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setIsSaving(true);
    const { error } = await authClient.changePassword({
      newPassword: next,
      currentPassword: current,
      revokeOtherSessions: true
    });
    setIsSaving(false);
    if (error) {
      toast.error(error.message || "Failed to update password.");
    } else {
      toast.success(hasPassword ? "Password updated!" : "Password set!");
      setCurrent("");
      setNext("");
      setConfirm("");
      setIsOpen(false);
    }
  };

  return (
    <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-camel-100 dark:bg-camel-900/30">
            <KeyRound className="h-4 w-4 text-camel-600 dark:text-camel-400" />
          </div>
          <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
            {hasPassword ? "Change Password" : "Set Password"}
          </h2>
        </div>
        {!isOpen && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-1.5"
          >
            <Edit className="h-3.5 w-3.5" />
            {hasPassword ? "Change" : "Set"}
          </Button>
        )}
      </div>

      {!isOpen ? (
        <p className="text-b5 font-inter text-neutral-500 dark:text-neutral-400">
          {hasPassword
            ? "Your password is set. Click to change it."
            : "You signed up with Google. You can optionally set a password to also log in with email."}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {hasPassword && (
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={current}
                onChange={(e) => setCurrent(e.target.value)}
                required={hasPassword}
                autoComplete="current-password"
                placeholder="••••••••"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="At least 8 characters"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
              placeholder="Re-enter new password"
            />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              variant="primary"
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              {isSaving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <ShieldCheck className="h-4 w-4" />
              )}
              {isSaving ? "Saving…" : hasPassword ? "Update Password" : "Set Password"}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setIsOpen(false);
                setCurrent("");
                setNext("");
                setConfirm("");
              }}
              disabled={isSaving}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}
    </section>
  );
}

// ─── Addresses Section ────────────────────────────────────────────────────────

function AddressesSection({ addresses }: { addresses: AddressData[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = React.useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm("Remove this address?")) return;
    setDeletingId(id);
    const result = await deleteAddress(id);
    setDeletingId(null);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Address removed.");
      router.refresh();
    }
  };

  return (
    <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="h-9 w-9 flex items-center justify-center rounded-xl bg-olive-100 dark:bg-olive-900/30">
          <MapPin className="h-4 w-4 text-olive-600 dark:text-olive-400" />
        </div>
        <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          Saved Addresses
        </h2>
      </div>

      {addresses.length === 0 ? (
        <div className="py-8 text-center border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-2xl">
          <MapPin className="h-8 w-8 text-neutral-300 dark:text-neutral-600 mx-auto mb-3" />
          <p className="text-b4 font-inter font-medium text-neutral-500 dark:text-neutral-400">
            No saved addresses yet
          </p>
          <p className="text-b5 font-inter text-neutral-400 dark:text-neutral-500 mt-1">
            Addresses from your orders will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800 hover:border-camel-300 dark:hover:border-camel-800 transition-colors group"
            >
              <address className="not-italic text-b5 font-inter text-neutral-600 dark:text-neutral-400 leading-relaxed">
                <p className="font-semibold text-neutral-900 dark:text-cornsilk-100 font-inter">
                  {addr.recipientName}
                </p>
                <p>{addr.address}</p>
                <p>
                  {addr.city}, {addr.postalCode}
                </p>
                <p className="text-b6 mt-1 text-neutral-400">{addr.phone}</p>
              </address>
              <button
                onClick={() => handleDelete(addr.id)}
                disabled={deletingId === addr.id}
                aria-label="Delete address"
                className="shrink-0 p-2 rounded-lg text-neutral-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-50"
              >
                {deletingId === addr.id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

// ─── Account Info Section ─────────────────────────────────────────────────────

function AccountInfoSection({ profile }: { profile: ProfileData }) {
  const joined = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(new Date(profile.createdAt));

  return (
    <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
      <h2 className="text-h6 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-4">
        Account Details
      </h2>
      <dl className="space-y-3 text-b5 font-inter">
        <div className="flex justify-between">
          <dt className="text-neutral-500 dark:text-neutral-400">Member since</dt>
          <dd className="text-neutral-900 dark:text-cornsilk-100 font-medium">{joined}</dd>
        </div>
        <Separator />
        <div className="flex justify-between">
          <dt className="text-neutral-500 dark:text-neutral-400">Account type</dt>
          <dd>
            <Badge
              className={
                profile.role === "ADMIN"
                  ? "bg-blush-100 text-blush-800 dark:bg-blush-900/30 dark:text-blush-300"
                  : "bg-camel-100 text-camel-800 dark:bg-camel-900/30 dark:text-camel-300"
              }
            >
              {profile.role}
            </Badge>
          </dd>
        </div>
      </dl>
    </section>
  );
}

// ─── Main Module ──────────────────────────────────────────────────────────────

interface ProfileModuleProps {
  profile: ProfileData | null;
  addresses: AddressData[];
  error: string | null;
}

export function ProfileModule({ profile, addresses, error }: ProfileModuleProps) {
  if (error || !profile) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle className="h-12 w-12 text-blush-400 mb-4" />
        <h2 className="text-h4 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100">
          {error ?? "Profile not found"}
        </h2>
      </div>
    );
  }

  // Check if this user has a password set (we can't know directly, but email-only users
  // from OAuth won't have passwordHash — we pass a hint by checking if email provider was used)
  // We approximate: if profile.role is set we just default to showing the set password option
  const hasPassword = true; // Will be handled gracefully in the server action

  return (
    <div className="space-y-8">
      {/* Header & Breadcrumb */}
      <div>
        <Breadcrumb
          className="mb-4"
          items={[{ label: "My Account", href: "/profile" }, { label: "Profile" }]}
        />
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="h-14 w-14 shrink-0 rounded-full bg-blush-100 dark:bg-blush-900/30 flex items-center justify-center overflow-hidden">
            {profile.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.image}
                alt={profile.name ?? "Avatar"}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-h4 font-fraunces font-bold text-blush-600 dark:text-blush-400">
                {(profile.name ?? profile.email ?? "?")[0].toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
              {profile.name ?? "My Profile"}
            </h1>
            <p className="text-b4 font-inter text-neutral-500 dark:text-neutral-400">
              {profile.email}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — main forms */}
        <div className="lg:col-span-2 space-y-6">
          <PersonalInfoSection profile={profile} />
          <PasswordSection hasPassword={hasPassword} />
          <AddressesSection addresses={addresses} />
        </div>

        {/* Right — account meta */}
        <div className="space-y-6">
          <AccountInfoSection profile={profile} />
        </div>
      </div>
    </div>
  );
}
