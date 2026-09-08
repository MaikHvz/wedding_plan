"use server";

import { requireUser } from "@/lib/auth";
import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { guestsRepo, invitationsRepo, weddingsRepo } from "@/lib/data";
import {
  sendInvitationToGuest,
  sendPendingInvitations,
} from "@/lib/guests/service";

export interface GuestActionResult {
  ok: boolean;
  error?: string;
  /** Mensaje informativo (ej. resultado del envío masivo). */
  info?: string;
}

async function requireWeddingOwner(weddingId: string): Promise<{
  userId: string;
  weddingId: string;
}> {
  const user = await requireUser();
  const wedding = weddingsRepo.findById(weddingId);
  if (!wedding || wedding.userId !== user.id) {
    notFound();
  }
  return { userId: user.id, weddingId: wedding.id };
}

export async function addGuestAction(
  previousState: GuestActionResult | null,
  formData: FormData,
): Promise<GuestActionResult> {
  const weddingId = String(formData.get("weddingId") ?? "");
  const { userId } = await requireWeddingOwner(weddingId);

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const groupName =
    String(formData.get("groupName") ?? "").trim() || null;

  if (!name) {
    return { ok: false, error: "El nombre del invitado es obligatorio." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Ingresa un correo electrónico válido." };
  }

  const guest = guestsRepo.create({
    weddingId,
    name,
    email,
    createdBy: userId,
    groupName,
    status: "INVITED",
  });
  invitationsRepo.createWithToken(weddingId, guest.id);

  revalidatePath(`/dashboard/bodas/${weddingId}/invitados`);
  return { ok: true };
}

export async function setMaxGuestsAction(
  previousState: GuestActionResult | null,
  formData: FormData,
): Promise<GuestActionResult> {
  const weddingId = String(formData.get("weddingId") ?? "");
  await requireWeddingOwner(weddingId);

  const raw = Number(String(formData.get("maxGuests") ?? "0"));
  const maxGuests = Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : 0;

  weddingsRepo.update(weddingId, { maxGuests });
  revalidatePath(`/dashboard/bodas/${weddingId}/invitados`);
  return {
    ok: true,
    info: maxGuests > 0 ? `Cupo máximo: ${maxGuests} invitados.` : "Sin límite de invitados.",
  };
}

export async function updateGuestAction(
  previousState: GuestActionResult | null,
  formData: FormData,
): Promise<GuestActionResult> {
  const weddingId = String(formData.get("weddingId") ?? "");
  await requireWeddingOwner(weddingId);

  const guestId = String(formData.get("guestId") ?? "");
  const guest = guestsRepo.findById(guestId);
  if (!guest || guest.weddingId !== weddingId) {
    return { ok: false, error: "Invitado no encontrado." };
  }

  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const groupName = String(formData.get("groupName") ?? "").trim() || null;

  if (!name) {
    return { ok: false, error: "El nombre es obligatorio." };
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Ingresa un correo electrónico válido." };
  }

  guestsRepo.update(guestId, { name, email, groupName });
  revalidatePath(`/dashboard/bodas/${weddingId}/invitados`);
  return { ok: true };
}

export async function deleteGuestAction(
  previousState: GuestActionResult | null,
  formData: FormData,
): Promise<GuestActionResult> {
  const weddingId = String(formData.get("weddingId") ?? "");
  await requireWeddingOwner(weddingId);

  const guestId = String(formData.get("guestId") ?? "");
  const guest = guestsRepo.findById(guestId);
  if (!guest || guest.weddingId !== weddingId) {
    return { ok: false, error: "Invitado no encontrado." };
  }

  guestsRepo.delete(guestId);
  revalidatePath(`/dashboard/bodas/${weddingId}/invitados`);
  return { ok: true };
}

export async function sendOneInvitationAction(
  previousState: GuestActionResult | null,
  formData: FormData,
): Promise<GuestActionResult> {
  const weddingId = String(formData.get("weddingId") ?? "");
  await requireWeddingOwner(weddingId);

  const guestId = String(formData.get("guestId") ?? "");
  try {
    await sendInvitationToGuest(guestId);
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "No se pudo enviar el correo.",
    };
  }
  revalidatePath(`/dashboard/bodas/${weddingId}/invitados`);
  return { ok: true, info: "Correo enviado." };
}

export async function sendAllInvitationsAction(
  previousState: GuestActionResult | null,
  formData: FormData,
): Promise<GuestActionResult> {
  const weddingId = String(formData.get("weddingId") ?? "");
  await requireWeddingOwner(weddingId);

  const result = await sendPendingInvitations(weddingId);
  revalidatePath(`/dashboard/bodas/${weddingId}/invitados`);

  if (result.total === 0) {
    return { ok: true, info: "No hay invitaciones pendientes por enviar." };
  }
  if (result.failed.length > 0) {
    return {
      ok: false,
      error: `Enviadas ${result.sent} de ${result.total}. Fallaron ${result.failed.length} (revisa la consola).`,
    };
  }
  return { ok: true, info: `Se enviaron ${result.sent} invitaciones.` };
}