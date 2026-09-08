"use server";

import { requireUser } from "@/lib/auth";
import { seedBaseData, weddingSectionsRepo, weddingsRepo } from "@/lib/data";
import { saveFile, StorageError } from "@/lib/storage";
import { isValidVariant, resolveTheme } from "@/lib/templates";
import type { BuilderPageState, BuilderSection } from "@/lib/builder/model";
import type { Profile, SectionType } from "@/types";

export interface SaveResult {
  ok: boolean;
  savedAt?: string;
  error?: string;
}

function findOwnedWedding(userId: string, weddingId: string) {
  const wedding = weddingsRepo.findById(weddingId);
  if (!wedding || wedding.userId !== userId) {
    return null;
  }
  return wedding;
}

/**
 * Núcleo del guardado del builder. Recibe el principal autenticado (o uno
 * impedido) y valida permisos: el dueño SIEMPRE, o cualquier admin.
 */
function saveWeddingPageCore(
  principal: Pick<Profile, "id" | "role">,
  weddingId: string,
  state: BuilderPageState,
): SaveResult {
  const wedding = weddingsRepo.findById(weddingId);
  const isOwner = wedding?.userId === principal.id;
  const isAdmin = principal.role === "admin";
  if (!wedding || (!isOwner && !isAdmin)) {
    return { ok: false, error: "Boda no encontrada" };
  }

  weddingsRepo.update(weddingId, {
    title: state.title || "Mi boda",
    partner1: state.partner1,
    partner2: state.partner2,
    eventDate: state.eventDate || null,
    eventTime: state.eventTime || null,
    locationName: state.locationName || null,
    locationAddress: state.locationAddress || null,
    mapsUrl: state.mapsUrl || null,
    driveUrl: state.driveUrl || null,
    themeJson: resolveTheme(state.themeId)
      ? JSON.stringify({ id: state.themeId })
      : null,
  });

  replaceSections(weddingId, state.sections);

  return { ok: true, savedAt: new Date().toISOString() };
}

/** Persiste la página del builder como datos (regla §23, nunca HTML). */
export async function saveWeddingPageAction(
  weddingId: string,
  state: BuilderPageState,
): Promise<SaveResult> {
  try {
    const user = await requireUser();
    await seedBaseData();
    const wedding = findOwnedWedding(user.id, weddingId);
    if (!wedding) {
      return { ok: false, error: "Boda no encontrada" };
    }
    return saveWeddingPageCore(user, weddingId, state);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al guardar",
    };
  }
}

/** Persiste la página del builder desde el panel admin (cualquier boda). */
export async function saveWeddingPageAdminAction(
  weddingId: string,
  state: BuilderPageState,
): Promise<SaveResult> {
  try {
    const user = await requireUser();
    await seedBaseData();
    if (user.role !== "admin") {
      return { ok: false, error: "Acción permitida solo a administradores" };
    }
    return saveWeddingPageCore(user, weddingId, state);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Error al guardar",
    };
  }
}

function replaceSections(weddingId: string, sections: BuilderSection[]): void {
  const existing = weddingSectionsRepo.findManyByWedding(weddingId);
  const existingIds = new Set(existing.map((section) => section.id));
  const incomingIds = new Set(sections.map((section) => section.id));

  for (const old of existing) {
    if (!incomingIds.has(old.id)) {
      weddingSectionsRepo.delete(old.id);
    }
  }

  sections
    .sort((a, b) => a.position - b.position)
    .forEach((section, index) => {
      const variant = isValidVariant(section.type, section.variant)
        ? section.variant
        : "classic";
      const dataJson = JSON.stringify(section.data ?? {});
      if (existingIds.has(section.id)) {
        weddingSectionsRepo.update(section.id, {
          variant,
          position: index + 1,
          enabled: section.enabled,
          dataJson,
        });
      } else {
        weddingSectionsRepo.create({
          weddingId,
          type: section.type as SectionType,
          variant,
          position: index + 1,
          enabled: section.enabled,
          dataJson,
        });
      }
    });
}

export interface UploadResult {
  ok: boolean;
  url?: string;
  error?: string;
}

/** Sube una imagen y la guarda bajo `weddings/<id>/<sección>` (plan §60/§116). */
export async function uploadWeddingImageAction(
  formData: FormData,
): Promise<UploadResult> {
  try {
    const user = await requireUser();
    const weddingId = String(formData.get("weddingId") ?? "");
    const section = String(formData.get("section") ?? "gallery");
    const file = formData.get("file");

    if (!weddingId || !file || !(file instanceof File)) {
      return { ok: false, error: "Archivo no válido" };
    }
    const wedding = findOwnedWedding(user.id, weddingId);
    if (!wedding) {
      return { ok: false, error: "Boda no encontrada" };
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const stored = await saveFile({
      dir: `weddings/${weddingId}/${section}`,
      buffer,
      mimeType: file.type,
    });

    return { ok: true, url: stored.url };
  } catch (error) {
    const message =
      error instanceof StorageError
        ? error.message
        : error instanceof Error && error.name !== "NEXT_REDIRECT"
          ? error.message
          : "Error al subir la imagen";
    return { ok: false, error: message };
  }
}