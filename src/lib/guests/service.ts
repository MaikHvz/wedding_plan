import "server-only";

import type {
  Guest,
  Invitation,
  RsvpResponse,
  Wedding,
} from "@/types";
import {
  guestsRepo,
  invitationsRepo,
  rsvpsRepo,
  weddingsRepo,
} from "@/lib/data";
import { buildTheme } from "@/lib/wedding/render-data";
import { buildInvitationEmail } from "@/lib/email/invitation";
import { sendEmail } from "@/lib/email";
import { APP_URL, EMAIL_FROM } from "@/config/app";

export class GuestsError extends Error {
  constructor(
    message: string,
    readonly code:
      | "GUEST_NOT_FOUND"
      | "WEDDING_NOT_FOUND"
      | "INVITATION_NOT_FOUND"
      | "EMAIL_FAILED",
  ) {
    super(message);
    this.name = "GuestsError";
  }
}

export interface GuestWithDetails {
  guest: Guest;
  invitation: Invitation | null;
  rsvp: RsvpResponse | null;
  /** Total de personas si el invitado asiste (él + acompañantes). */
  partySize: number;
}

export interface GuestCapacity {
  maxGuests: number;
  /** Personas confirmadas (invitado + acompañantes) con asistencia = sí. */
  confirmed: number;
  /** Invitados que confirmaron que no pueden asistir. */
  declined: number;
  /** Invitados que todavía no responden. */
  pending: number;
  /** Total de invitados registrados. */
  totalGuests: number;
  /** Cupos restantes; `null` cuando no hay límite (maxGuests = 0). */
  remaining: number | null;
}

/** Lista los invitados de una boda con su invitación y respuesta. */
export function listGuestsForWedding(weddingId: string): GuestWithDetails[] {
  const guests = guestsRepo.findManyByWedding(weddingId);
  const invitations = invitationsRepo.findManyByWedding(weddingId);
  const responses = rsvpsRepo.findManyByWedding(weddingId);

  const inviteByGuest = new Map(invitations.map((inv) => [inv.guestId, inv]));
  const rsvpByGuest = new Map(responses.map((rsvp) => [rsvp.guestId, rsvp]));

  return guests.map((guest) => {
    const rsvp = rsvpByGuest.get(guest.id) ?? null;
    return {
      guest,
      invitation: inviteByGuest.get(guest.id) ?? null,
      rsvp,
      partySize:
        rsvp?.attendance === "yes" ? 1 + rsvp.companions.length : 1,
    };
  });
}

/** Cálculo del cupo de una boda a partir de las respuestas actuales. */
export function computeCapacity(weddingId: string): GuestCapacity {
  const wedding = weddingsRepo.findById(weddingId);
  const maxGuests = wedding?.maxGuests ?? 0;

  const guests = guestsRepo.findManyByWedding(weddingId);
  const responses = rsvpsRepo.findManyByWedding(weddingId);
  const rsvpByGuest = new Map(responses.map((rsvp) => [rsvp.guestId, rsvp]));

  let confirmed = 0;
  let declined = 0;
  let pending = 0;

  for (const guest of guests) {
    const rsvp = rsvpByGuest.get(guest.id);
    if (!rsvp) {
      pending += 1;
    } else if (rsvp.attendance === "yes") {
      confirmed += 1 + rsvp.companions.length;
    } else {
      declined += 1;
    }
  }

  return {
    maxGuests,
    confirmed,
    declined,
    pending,
    totalGuests: guests.length,
    remaining: maxGuests > 0 ? Math.max(0, maxGuests - confirmed) : null,
  };
}

/** Cupos libres para un invitado concreto (le resta su propia respuesta actual). */
export function remainingForGuest(
  weddingId: string,
  guestId: string,
  capacity: GuestCapacity,
): number | null {
  if (capacity.maxGuests <= 0) {
    return null;
  }
  const current = rsvpsRepo.findOneByGuestId(guestId);
  const currentParty =
    current?.attendance === "yes" ? 1 + current.companions.length : 0;
  return Math.max(0, capacity.maxGuests - capacity.confirmed + currentParty);
}

/** Encuentra la boda e invitado correspondientes a un token de invitación. */
export function findByInvitationToken(
  token: string,
): {
  invitation: Invitation;
  guest: Guest;
  wedding: Wedding;
} | null {
  const invitation = invitationsRepo.findByToken(token);
  if (!invitation) {
    return null;
  }
  const guest = guestsRepo.findById(invitation.guestId);
  const wedding = weddingsRepo.findById(invitation.weddingId);
  if (!guest || !wedding) {
    return null;
  }
  // Marca "abierta" la primera vez que se usa el enlace (analítica).
  if (!invitation.openedAt) {
    invitationsRepo.markOpened(invitation.id);
  }
  return { invitation, guest, wedding };
}

/** Envía la invitación por email a un invitado y marca la invitación como enviada. */
export async function sendInvitationToGuest(
  guestId: string,
): Promise<{ guestId: string; ok: true }> {
  const guest = guestsRepo.findById(guestId);
  if (!guest) {
    throw new GuestsError("Invitado no encontrado", "GUEST_NOT_FOUND");
  }
  const wedding = weddingsRepo.findById(guest.weddingId);
  if (!wedding) {
    throw new GuestsError("Boda no encontrada", "WEDDING_NOT_FOUND");
  }

  const invitation =
    invitationsRepo.findByGuestId(guest.id) ??
    invitationsRepo.createWithToken(guest.weddingId, guest.id);

  try {
    const { subject, html } = buildInvitationEmail({
      to: guest.email,
      guestName: guest.name,
      wedding,
      theme: buildTheme(wedding),
      token: invitation.token,
      baseUrl: APP_URL,
      from: EMAIL_FROM,
    });

    await sendEmail({ to: guest.email, subject, html, from: EMAIL_FROM });

    invitationsRepo.markSent(invitation.id);
    if (guest.status === "INVITED") {
      guestsRepo.setStatus(guest.id, "SENT");
    }
    return { guestId: guest.id, ok: true as const };
  } catch (error) {
    throw new GuestsError(
      error instanceof Error ? error.message : "Error al enviar el correo",
      "EMAIL_FAILED",
    );
  }
}

export interface SendPendingResult {
  total: number;
  sent: number;
  failed: Array<{ guestId: string; name: string; error: string }>;
}

/** Envía las invitaciones pendientes de una boda (sin correo enviado aún). */
export async function sendPendingInvitations(
  weddingId: string,
): Promise<SendPendingResult> {
  const details = listGuestsForWedding(weddingId);
  const pending = details.filter((entry) => !entry.invitation?.sentAt);

  const result: SendPendingResult = {
    total: pending.length,
    sent: 0,
    failed: [],
  };

  for (const entry of pending) {
    try {
      await sendInvitationToGuest(entry.guest.id);
      result.sent += 1;
    } catch (error) {
      result.failed.push({
        guestId: entry.guest.id,
        name: entry.guest.name,
        error: error instanceof Error ? error.message : "Error de envío",
      });
    }
  }

  return result;
}