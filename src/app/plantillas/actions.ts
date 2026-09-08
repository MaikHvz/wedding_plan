"use server";

import { randomUUID } from "node:crypto";
import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { seedBaseData, weddingsRepo, weddingSectionsRepo } from "@/lib/data";
import { getTheme, resolveTemplate } from "@/lib/templates";
import { getTemplateDemo } from "@/lib/templates/demos";
import type { SectionType } from "@/types";

/** Crea una boda nueva usando la plantilla y tema elegidos, precarga datos demo y va al Builder. */
export async function useTemplateAction(formData: FormData): Promise<void> {
  const slug = String(formData.get("slug") ?? "").trim();
  const requestedTheme = String(formData.get("themeId") ?? "").trim();
  const user = await requireUser();
  const template = resolveTemplate(slug);
  if (!template) {
    throw new Error(`Plantilla no encontrada: ${slug}`);
  }
  const themeId =
    (requestedTheme && getTheme(requestedTheme) && requestedTheme) ||
    template.themeId;
  await seedBaseData();

  const demo = getTemplateDemo(template.slug);

  const wedding = weddingsRepo.create({
    userId: user.id,
    title: demo?.title || `Mi boda · ${template.name}`,
    partner1: demo?.partner1 || "",
    partner2: demo?.partner2 || "",
    eventDate: demo?.eventDate || null,
    eventTime: demo?.eventTime || null,
    locationName: demo?.locationName || null,
    locationAddress: demo?.locationAddress || null,
    mapsUrl: demo?.mapsUrl || null,
    driveUrl: demo?.driveUrl || null,
    slug: `boda-${randomUUID().slice(0, 8)}`,
    templateId: template.slug,
    templateVersion: template.version,
    themeJson: JSON.stringify({ id: themeId }),
  });

  // Seed default sections with full template demo contents
  template.sections.forEach((section, index) => {
    const data = demo?.data?.[section.type] ?? {};
    weddingSectionsRepo.create({
      weddingId: wedding.id,
      type: section.type as SectionType,
      variant: section.variant,
      position: index + 1,
      enabled: true,
      dataJson: JSON.stringify(data),
    });
  });

  redirect(`/dashboard/bodas/${wedding.id}`);
}