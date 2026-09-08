"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { requireUser, signOut } from "@/lib/auth";
import { seedBaseData, weddingsRepo } from "@/lib/data";
import { DEFAULT_TEMPLATE } from "@/lib/templates";

export async function createWeddingAction(): Promise<void> {
  const user = await requireUser();
  await seedBaseData();
  weddingsRepo.create({
    userId: user.id,
    title: `Mi boda · ${DEFAULT_TEMPLATE.name}`,
    slug: `boda-${randomUUID().slice(0, 8)}`,
    templateId: DEFAULT_TEMPLATE.slug,
    templateVersion: DEFAULT_TEMPLATE.version,
    themeJson: JSON.stringify({ id: DEFAULT_TEMPLATE.themeId }),
  });
  redirect("/dashboard");
}

export async function logoutAction(): Promise<void> {
  await signOut();
  redirect("/login");
}