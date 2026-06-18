"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ProfileData {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  image: string | null;
  role: string;
  createdAt: string;
}

export interface AddressData {
  id: string;
  recipientName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
}

export interface UpdateProfileData {
  name: string;
  phone?: string;
}

// ─── getProfile ───────────────────────────────────────────────────────────────

export async function getProfile(): Promise<{
  profile: ProfileData | null;
  error: string | null;
}> {
  const session = await auth();
  if (!session?.user?.id) {
    return { profile: null, error: "Not authenticated." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        image: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) return { profile: null, error: "User not found." };

    return {
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        image: user.image,
        role: user.role,
        createdAt: user.createdAt.toISOString(),
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    return { profile: null, error: "Failed to load profile." };
  }
}

// ─── updateProfile ────────────────────────────────────────────────────────────

export async function updateProfile(data: UpdateProfileData): Promise<{
  error: string | null;
}> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  if (!data.name?.trim()) return { error: "Name is required." };

  try {
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: data.name.trim(),
        phone: data.phone?.trim() || null,
      },
    });

    revalidatePath("/profile");
    return { error: null };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { error: "Failed to update profile." };
  }
}

// ─── updatePassword ───────────────────────────────────────────────────────────

export async function updatePassword(
  currentPassword: string,
  newPassword: string
): Promise<{ error: string | null }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  if (newPassword.length < 8) {
    return { error: "New password must be at least 8 characters." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { passwordHash: true },
    });

    if (!user) return { error: "User not found." };

    // Users who signed up via OAuth may not have a password
    if (!user.passwordHash) {
      // Allow setting a password for the first time
      const hashed = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: session.user.id },
        data: { passwordHash: hashed },
      });
      return { error: null };
    }

    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) return { error: "Current password is incorrect." };

    const hashed = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { passwordHash: hashed },
    });

    return { error: null };
  } catch (error) {
    console.error("Error updating password:", error);
    return { error: "Failed to update password." };
  }
}

// ─── getUserAddresses ─────────────────────────────────────────────────────────

export async function getUserAddresses(): Promise<{
  addresses: AddressData[];
  error: string | null;
}> {
  const session = await auth();
  if (!session?.user?.id) return { addresses: [], error: "Not authenticated." };

  try {
    // Get unique addresses from CheckoutAddress (deduped by address+city+postalCode)
    const addresses = await prisma.checkoutAddress.findMany({
      where: { userId: session.user.id },
      orderBy: { id: "desc" },
      distinct: ["address", "city", "postalCode"],
    });

    return {
      addresses: addresses.map((a) => ({
        id: a.id,
        recipientName: a.recipientName,
        phone: a.phone,
        address: a.address,
        city: a.city,
        postalCode: a.postalCode,
      })),
      error: null,
    };
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return { addresses: [], error: "Failed to load addresses." };
  }
}

// ─── deleteAddress ────────────────────────────────────────────────────────────

export async function deleteAddress(id: string): Promise<{ error: string | null }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated." };

  // Ensure it belongs to this user
  const address = await prisma.checkoutAddress.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!address) return { error: "Address not found." };

  try {
    await prisma.checkoutAddress.delete({ where: { id } });
    revalidatePath("/profile");
    return { error: null };
  } catch {
    return { error: "Failed to delete address." };
  }
}
