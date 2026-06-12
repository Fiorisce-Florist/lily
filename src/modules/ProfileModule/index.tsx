"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Breadcrumb } from "@/components/ui/breadcrumb";
import { Save } from "lucide-react";
import { toast } from "sonner";

export function ProfileModule() {
  const [isEditing, setIsEditing] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Profile updated successfully!");
    setIsEditing(false);
  };

  return (
    <div className="space-y-8">
      {/* Header & Breadcrumb */}
      <div>
        <Breadcrumb
          className="mb-4"
          items={[{ label: "My Account", href: "/profile" }, { label: "Profile" }]}
        />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-h2 font-fraunces font-bold text-neutral-900 dark:text-cornsilk-100">
              My Profile
            </h1>
            <p className="text-b4 font-inter text-neutral-600 dark:text-neutral-400 mt-2">
              Manage your personal information, contact details, and account preferences.
            </p>
          </div>
          <Button
            variant={isEditing ? "outline" : "primary"}
            onClick={() => setIsEditing(!isEditing)}
            className="w-full sm:w-auto"
          >
            {isEditing ? "Cancel" : "Edit Profile"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Personal Information */}
          <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
              Personal Information
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    defaultValue="Jane"
                    disabled={!isEditing}
                    className="bg-neutral-50 dark:bg-neutral-950"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    defaultValue="Doe"
                    disabled={!isEditing}
                    className="bg-neutral-50 dark:bg-neutral-950"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue="jane.doe@example.com"
                  disabled={!isEditing}
                  className="bg-neutral-50 dark:bg-neutral-950"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  defaultValue="+1 (555) 123-4567"
                  disabled={!isEditing}
                  className="bg-neutral-50 dark:bg-neutral-950"
                />
              </div>

              {isEditing && (
                <div className="pt-4 flex justify-end">
                  <Button type="submit" variant="primary" className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              )}
            </form>
          </section>

          {/* Shipping Address */}
          <section className="bg-white dark:bg-neutral-900 rounded-3xl p-6 sm:p-8 border border-neutral-200 dark:border-neutral-800">
            <h2 className="text-h5 font-fraunces font-semibold text-neutral-900 dark:text-cornsilk-100 mb-6">
              Default Shipping Address
            </h2>
            <div className="space-y-4">
              <div className="p-4 border border-camel-200 dark:border-camel-900 rounded-2xl bg-camel-50/30 dark:bg-camel-900/10">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-medium text-neutral-900 dark:text-cornsilk-100 font-inter">
                    Home
                  </span>
                  <span className="text-xs font-medium bg-camel-100 text-camel-800 dark:bg-camel-900 dark:text-camel-200 px-2 py-1 rounded-full">
                    Default
                  </span>
                </div>
                <p className="text-b4 text-neutral-600 dark:text-neutral-400">
                  Jane Doe
                  <br />
                  123 Floral Street, Apt 4B
                  <br />
                  San Francisco, CA 94102
                  <br />
                  United States
                </p>
                <div className="mt-4 flex gap-3">
                  <Button variant="outline" size="sm" className="h-8">
                    Edit
                  </Button>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full border-dashed border-2 py-8 text-neutral-500"
              >
                + Add New Address
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
