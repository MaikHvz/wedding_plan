"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { publicationsRepo, weddingsRepo } from "@/lib/data";
import type { WeddingStatus } from "@/types";

export async function setWeddingStatusAction(
  weddingId: string,
  formData: FormData,
) {
  await requireAdmin();
  const rawStatus = String(formData.get("status") ?? "");
  const status = rawStatus as WeddingStatus;
  const wedding = weddingsRepo.findById(weddingId);
  if (!wedding) {
    throw new Error("Boda no encontrada");
  }
  weddingsRepo.setStatus(weddingId, status);

  if (status === "PUBLISHED" && !publicationsRepo.findBySlug(wedding.slug)) {
    publicationsRepo.create({
      weddingId: wedding.id,
      slug: wedding.slug,
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
    });
  }

  revalidatePath("/admin/bodas");
  revalidatePath(`/admin/bodas/${weddingId}`);
  revalidatePath("/admin");
}

export async function deleteWeddingAction(weddingId: string) {
  await requireAdmin();
  weddingsRepo.delete(weddingId);
  redirect("/admin/bodas");
}