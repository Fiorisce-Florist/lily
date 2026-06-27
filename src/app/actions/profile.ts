"use server";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
  isDefault: boolean;
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
  const session = await auth.api.getSession({ headers: await headers() });
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
  const session = await auth.api.getSession({ headers: await headers() });
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

// ─── getUserAddresses ─────────────────────────────────────────────────────────

export async function getUserAddresses(): Promise<{
  addresses: AddressData[];
  error: string | null;
}> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { addresses: [], error: "Not authenticated." };

  try {
    const addresses = await prisma.checkoutAddress.findMany({
      where: { userId: session.user.id, isHidden: false },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return {
      addresses: addresses.map((a) => ({
        id: a.id,
        recipientName: a.recipientName,
        phone: a.phone,
        address: a.address,
        city: a.city,
        postalCode: a.postalCode,
        isDefault: a.isDefault,
      })),
      error: null,
    };
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return { addresses: [], error: "Failed to load addresses." };
  }
}

// ─── saveAddress ──────────────────────────────────────────────────────────────

export async function saveAddress(
  data: Omit<AddressData, "id" | "isDefault"> & { id?: string }
): Promise<{ error: string | null }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Not authenticated." };

  try {
    // If it's the first address, make it default
    const count = await prisma.checkoutAddress.count({
      where: { userId: session.user.id, isHidden: false },
    });
    const isFirst = count === 0;

    if (data.id) {
      // Update (actually create new and hide old to preserve order history)
      const old = await prisma.checkoutAddress.findFirst({
        where: { id: data.id, userId: session.user.id },
        include: { _count: { select: { orders: true } } },
      });

      if (!old) return { error: "Address not found." };

      if (old._count.orders > 0) {
        // Has orders, hide old and create new
        await prisma.$transaction([
          prisma.checkoutAddress.update({
            where: { id: data.id },
            data: { isHidden: true, isDefault: false },
          }),
          prisma.checkoutAddress.create({
            data: {
              userId: session.user.id,
              recipientName: data.recipientName,
              phone: data.phone,
              address: data.address,
              city: data.city,
              postalCode: data.postalCode,
              isDefault: old.isDefault, // Carry over default status
            },
          }),
        ]);
      } else {
        // No orders, just update in place
        await prisma.checkoutAddress.update({
          where: { id: data.id },
          data: {
            recipientName: data.recipientName,
            phone: data.phone,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
          },
        });
      }
    } else {
      // Create new
      await prisma.checkoutAddress.create({
        data: {
          userId: session.user.id,
          recipientName: data.recipientName,
          phone: data.phone,
          address: data.address,
          city: data.city,
          postalCode: data.postalCode,
          isDefault: isFirst,
        },
      });
    }

    revalidatePath("/profile");
    return { error: null };
  } catch (error) {
    console.error("Error saving address:", error);
    return { error: "Failed to save address." };
  }
}

// ─── setDefaultAddress ────────────────────────────────────────────────────────

export async function setDefaultAddress(id: string): Promise<{ error: string | null }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Not authenticated." };

  try {
    const address = await prisma.checkoutAddress.findFirst({
      where: { id, userId: session.user.id, isHidden: false },
    });

    if (!address) return { error: "Address not found." };

    await prisma.$transaction([
      prisma.checkoutAddress.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false },
      }),
      prisma.checkoutAddress.update({
        where: { id },
        data: { isDefault: true },
      }),
    ]);

    revalidatePath("/profile");
    return { error: null };
  } catch (error) {
    console.error("Error setting default address:", error);
    return { error: "Failed to set default address." };
  }
}

// ─── deleteAddress ────────────────────────────────────────────────────────────

export async function deleteAddress(id: string): Promise<{ error: string | null }> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user?.id) return { error: "Not authenticated." };

  try {
    const address = await prisma.checkoutAddress.findFirst({
      where: { id, userId: session.user.id },
      include: { _count: { select: { orders: true } } },
    });

    if (!address) return { error: "Address not found." };

    if (address._count.orders > 0) {
      // Used in order, just hide
      await prisma.checkoutAddress.update({
        where: { id },
        data: { isHidden: true, isDefault: false },
      });
    } else {
      // Safe to delete
      await prisma.checkoutAddress.delete({ where: { id } });
    }

    // If we just hid/deleted the default, try to set a new default
    if (address.isDefault) {
      const nextAddress = await prisma.checkoutAddress.findFirst({
        where: { userId: session.user.id, isHidden: false },
        orderBy: { createdAt: "desc" },
      });
      if (nextAddress) {
        await prisma.checkoutAddress.update({
          where: { id: nextAddress.id },
          data: { isDefault: true },
        });
      }
    }

    revalidatePath("/profile");
    return { error: null };
  } catch (error) {
    console.error("Error deleting address:", error);
    return { error: "Failed to delete address." };
  }
}
