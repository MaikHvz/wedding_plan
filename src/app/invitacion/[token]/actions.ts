"use server";

import { revalidatePath } from "next/cache";
import { guestsRepo, rsvpsRepo } from "@/lib/data";
import {
  computeCapacity,
  findByInvitationToken,
  remainingForGuest,
} from "@/lib/guests/service";
import type { RsvpAttendance } from "@/types";

export interface RsvpActionResult {
  ok: boolean;
  message?: string;
  error?: string;
}

const MAX_COMPANIONS = 20;

export async function submitRsvpAction(
  previousState: RsvpActionResult | null,
  formData: FormData,
): Promise<RsvpActionResult> {
  const token = String(formData.get("token") ?? "");
  const attendanceRaw = String(formData.get("attendance") ?? "");
  const companionsRaw = String(formData.get("companions") ?? "[]");
  const messageRaw = String(formData.get("message") ?? "").trim();

  const link = findByInvitationToken(token);
  if (!link) {
    return { ok: false, error: "El enlace de invitación es inválido o expiró." };
  }
  const { guest, wedding } = link;

  let companions: string[] = [];
  try {
    const parsed = JSON.parse(companionsRaw) as unknown;
    if (Array.isArray(parsed)) {
      companions = parsed
        .map((value) => String(value).trim())
        .filter((value) => value.length > 0)
        .slice(0, MAX_COMPANIONS);
    }
  } catch {
    // Si viene malformado se trata como lista vacía.
  }

  const attendance: RsvpAttendance = attendanceRaw === "no" ? "no" : "yes";

  if (attendance === "yes") {
    const capacity = computeCapacity(wedding.id);
    const free = remainingForGuest(wedding.id, guest.id, capacity);
    const newParty = 1 + companions.length;
    if (free !== null && newParty > free) {
      return {
        ok: false,
        error:
          free <= 0
            ? "Ya no quedan cupos disponibles para esta boda."
            : `Solo quedan ${free} cupo(s). Reduce el número de acompañantes.`,
      };
    }
  }

  const message = messageRaw ? messageRaw.slice(0, 500) : null;
  rsvpsRepo.upsert({ guestId: guest.id, attendance, companions, message });
  guestsRepo.setStatus(guest.id, attendance === "yes" ? "ACCEPTED" : "DECLINED");

  revalidatePath(`/dashboard/bodas/${wedding.id}/invitados`);
  return {
    ok: true,
    message:
      attendance === "yes"
        ? `¡Listo ${guest.name}, te esperamos!`
        : `Gracias ${guest.name}, hemos registrado tu respuesta.`,
  };
}