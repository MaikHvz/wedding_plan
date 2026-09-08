"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { usersRepo } from "@/lib/data";
import type { UserRole } from "@/types";

export async function setUserRoleAction(userId: string, role: UserRole) {
  const admin = await requireAdmin();
  if (admin.id === userId) {
    throw new Error("No puedes cambiar tu propio rol de administrador.");
  }
  usersRepo.updateRole(userId, role);
  revalidatePath("/admin/usuarios");
  revalidatePath(`/admin/usuarios/${userId}`);
}

export async function deleteUserAction(userId: string) {
  const admin = await requireAdmin();
  if (admin.id === userId) {
    throw new Error("No puedes eliminar tu propia cuenta de administrador.");
  }
  usersRepo.delete(userId);
  redirect("/admin/usuarios");
}