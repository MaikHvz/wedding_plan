"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { productsRepo } from "@/lib/data";

function parseFeatures(featuresJson: string): string[] {
  try {
    const parsed = JSON.parse(featuresJson) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]).map(String) : [];
  } catch {
    return [];
  }
}

export async function createProductAction(formData: FormData): Promise<void> {
  await requireAdmin();
  productsRepo.upsert({
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price") ?? 0) || 0,
    currency: String(formData.get("currency") ?? "CLP").trim().toUpperCase(),
    durationDays: Number(formData.get("durationDays") ?? "") || null,
    featuresJson: JSON.stringify(
      parseFeatures(String(formData.get("featuresJson") ?? "[]")),
    ),
    active: formData.get("active") === "on",
  });
  redirect("/admin/productos");
}

export async function updateProductAction(
  productId: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  productsRepo.update(productId, {
    name: String(formData.get("name") ?? "").trim(),
    description: String(formData.get("description") ?? "").trim(),
    price: Number(formData.get("price") ?? 0) || 0,
    currency: String(formData.get("currency") ?? "CLP").trim().toUpperCase(),
    durationDays: Number(formData.get("durationDays") ?? "") || null,
    featuresJson: JSON.stringify(
      parseFeatures(String(formData.get("featuresJson") ?? "[]")),
    ),
    active: formData.get("active") === "on",
  });
  revalidatePath("/admin/productos");
  revalidatePath(`/admin/productos/${productId}`);
  redirect(`/admin/productos/${productId}`);
}

export async function deleteProductAction(productId: string): Promise<void> {
  await requireAdmin();
  productsRepo.delete(productId);
  redirect("/admin/productos");
}