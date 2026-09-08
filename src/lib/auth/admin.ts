import "server-only";

import { redirect } from "next/navigation";
import type { Profile } from "@/types";
import { requireUser } from "@/lib/auth";

/** Devuelve el usuario actual o redirige si no es admin (o no hay sesión). */
export async function requireAdmin(): Promise<Profile> {
  const user = await requireUser();
  if (user.role !== "admin") {
    redirect("/dashboard");
  }
  return user;
}
