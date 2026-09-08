"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { templatesRepo } from "@/lib/data";
import type { TemplateConfig } from "@/types";

function parseConfig(configJson: string): Partial<TemplateConfig> | null {
  try {
    const parsed = JSON.parse(configJson) as unknown;
    if (parsed && typeof parsed === "object") {
      return parsed as Partial<TemplateConfig>;
    }
    return null;
  } catch {
    return null;
  }
}

function buildConfig(formData: FormData): {
  name: string;
  slug: string;
  description: string;
  category: string;
  version: number;
  isActive: boolean;
  configJson: string;
} {
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-");
  const description = String(formData.get("description") ?? "").trim();
  const category = String(formData.get("category") ?? "").trim();
  const version = Number(formData.get("version") ?? 1) || 1;
  const isActive = formData.get("active") === "on";
  const configRaw = String(formData.get("configJson") ?? "").trim();
  const config = configRaw ? parseConfig(configRaw) : null;

  const configJson = JSON.stringify({
    id: slug,
    slug,
    name,
    description,
    category,
    version,
    themeId: config?.themeId ?? "ivory",
    suggestedThemeIds: config?.suggestedThemeIds ?? [],
    sections: config?.sections ?? [],
    previewUrl: config?.previewUrl ?? null,
    musicUrl: config?.musicUrl ?? null,
  });

  return {
    name,
    slug,
    description,
    category,
    version,
    isActive,
    configJson,
  };
}

export async function createTemplateAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const config = buildConfig(formData);
  if (!config.name || !config.slug) {
    throw new Error("Nombre y slug son obligatorios");
  }
  templatesRepo.create({
    slug: config.slug,
    name: config.name,
    description: config.description,
    category: config.category,
    previewUrl: null,
    configJson: config.configJson,
    version: config.version,
    isActive: config.isActive,
  });
  redirect("/admin/plantillas");
}

export async function updateTemplateAction(
  templateId: string,
  formData: FormData,
): Promise<void> {
  await requireAdmin();
  const config = buildConfig(formData);
  templatesRepo.update(templateId, {
    slug: config.slug,
    name: config.name,
    description: config.description,
    category: config.category,
    configJson: config.configJson,
    version: config.version,
    isActive: config.isActive,
  });
  revalidatePath("/admin/plantillas");
  revalidatePath(`/admin/plantillas/${templateId}`);
  redirect(`/admin/plantillas/${templateId}`);
}

export async function toggleTemplateAction(
  templateId: string,
  isActive: boolean,
): Promise<void> {
  await requireAdmin();
  templatesRepo.update(templateId, { isActive: !isActive });
  revalidatePath("/admin/plantillas");
}

export async function deleteTemplateAction(templateId: string): Promise<void> {
  await requireAdmin();
  templatesRepo.delete(templateId);
  redirect("/admin/plantillas");
}