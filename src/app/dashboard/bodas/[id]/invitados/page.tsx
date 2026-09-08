import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { APP_URL } from "@/config/app";
import { usersRepo, weddingsRepo } from "@/lib/data";
import {
  computeCapacity,
  listGuestsForWedding,
} from "@/lib/guests/service";
import { GuestManager } from "@/components/guests/GuestManager";
import type {
  GuestManagerGuest,
  GuestManagerProps,
} from "@/components/guests/GuestManager";

export const dynamic = "force-dynamic";

export default async function WeddingGuestsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;

  const wedding = weddingsRepo.findById(id);
  if (!wedding || wedding.userId !== user.id) {
    notFound();
  }

  const details = listGuestsForWedding(wedding.id);
  const capacity = computeCapacity(wedding.id);

  const invitedBy = new Map<string, { id: string; name: string; email: string }>();
  for (const entry of details) {
    const creatorId = entry.guest.createdBy;
    if (!invitedBy.has(creatorId)) {
      const profile = usersRepo.findById(creatorId);
      invitedBy.set(creatorId, {
        id: creatorId,
        name: profile?.name ?? "Usuario",
        email: profile?.email ?? "",
      });
    }
  }

  const guests: GuestManagerGuest[] = details.map((entry) => ({
    id: entry.guest.id,
    name: entry.guest.name,
    email: entry.guest.email,
    groupName: entry.guest.groupName,
    status: entry.guest.status,
    createdBy: entry.guest.createdBy,
    inviteUrl: entry.invitation?.token
      ? `${APP_URL.replace(/\/$/, "")}/invitacion/${entry.invitation.token}`
      : null,
    sentAt: entry.invitation?.sentAt ?? null,
    attended: entry.rsvp?.attendance === "yes",
    attendance: entry.rsvp?.attendance ?? null,
    companions: entry.rsvp?.companions ?? [],
    partySize: entry.partySize,
  }));

  const managerProps: GuestManagerProps = {
    weddingId: wedding.id,
    weddingTitle: wedding.title,
    inviters: Object.fromEntries(invitedBy),
    guests,
    maxGuests: wedding.maxGuests,
    capacity: {
      confirmed: capacity.confirmed,
      declined: capacity.declined,
      pending: capacity.pending,
      totalGuests: capacity.totalGuests,
      remaining: capacity.remaining,
    },
  };

  return (
    <div className="mx-auto w-full max-w-5xl">
      <header className="mb-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-neutral-400">
              Invitados y confirmaciones
            </p>
            <h1 className="mt-1 font-serif text-2xl font-semibold text-neutral-900 sm:text-3xl">
              Invitados de «{wedding.title}»
            </h1>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-3 py-1 text-xs font-semibold text-neutral-600">
            <span className={`h-1.5 w-1.5 rounded-full ${capacity.confirmed > 0 ? "bg-emerald-500" : "bg-neutral-400"}`} />
            {capacity.totalGuests} invitado{capacity.totalGuests === 1 ? "" : "s"} registrados
          </span>
        </div>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-neutral-600">
          Agrega a las personas que quieres invitar, envíales su invitación por
          correo y sigue quién ya confirmó con quién irá.
        </p>
      </header>

      <GuestManager {...managerProps} />
    </div>
  );
}