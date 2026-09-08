import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { rsvpsRepo } from "@/lib/data";
import { buildTheme } from "@/lib/wedding/render-data";
import {
  computeCapacity,
  findByInvitationToken,
  remainingForGuest,
} from "@/lib/guests/service";
import { RsvpForm } from "@/components/guests/RsvpForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confirmación de invitación — Web de Boda",
  robots: { index: false, follow: false },
};

function formatDate(value: string | null): string {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("es-CL", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function InvitationPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const link = findByInvitationToken(token);
  if (!link) {
    notFound();
  }

  const { guest, wedding } = link;
  const theme = buildTheme(wedding);
  const t = theme.tokens ?? {};
  const capacity = computeCapacity(wedding.id);
  const remaining = remainingForGuest(wedding.id, guest.id, capacity);
  const existingRsvp = rsvpsRepo.findOneByGuestId(guest.id);

  const colors = {
    accent: t["t-accent"] ?? "#b98a5e",
    surface: t["t-surface"] ?? "#ffffff",
    text: t["t-text"] ?? "#3d3a36",
    muted: t["t-muted"] ?? "#8a8377",
    ctaBg: t["t-cta-bg"] ?? "#3d3a36",
    ctaText: t["t-cta-text"] ?? "#ffffff",
    accentSoft: t["t-accent-soft"] ?? "#e9d9c8",
  };
  const bg = t["t-bg"] ?? "#faf7f2";

  const details: Array<{ label: string; value: string }> = [];
  if (formatDate(wedding.eventDate)) {
    details.push({ label: "Fecha", value: formatDate(wedding.eventDate) });
  }
  if (wedding.eventTime) {
    details.push({ label: "Hora", value: wedding.eventTime });
  }
  if (wedding.locationName) {
    details.push({ label: "Lugar", value: wedding.locationName });
  }
  if (wedding.locationAddress) {
    details.push({ label: "Dirección", value: wedding.locationAddress });
  }

  return (
    <main
      style={{ background: bg, color: colors.text }}
      className="flex min-h-dvh flex-col items-center px-5 py-12"
    >
      <div className="w-full max-w-xl">
        <header className="mb-8 text-center">
          <p
            style={{ color: colors.muted }}
            className="text-xs uppercase tracking-[0.35em]"
          >
            Invitación especial
          </p>
          <h1
            style={{ color: colors.text }}
            className="mt-3 font-serif text-4xl font-medium"
          >
            {wedding.partner1} & {wedding.partner2}
          </h1>
          <div
            style={{ background: colors.accent, height: 2, width: 56 }}
            className="mx-auto mt-4"
          />
          <p style={{ color: colors.muted }} className="mt-4 text-sm">
            {wedding.title}
          </p>
        </header>

        {details.length > 0 && (
          <section
            className="mb-8 grid grid-cols-1 gap-3 text-center sm:grid-cols-2"
          >
            {details.map((detail) => (
              <div
                key={detail.label}
                style={{
                  background: colors.surface,
                  color: colors.text,
                }}
                className="rounded-xl border border-black/10 px-4 py-3"
              >
                <p
                  style={{ color: colors.muted }}
                  className="text-[11px] uppercase tracking-[0.25em]"
                >
                  {detail.label}
                </p>
                <p className="mt-1 text-sm font-medium capitalize">{detail.value}</p>
              </div>
            ))}
          </section>
        )}

        <RsvpForm
          token={token}
          guestName={guest.name}
          remaining={remaining}
          existing={
            existingRsvp
              ? {
                  attendance: existingRsvp.attendance,
                  companions: existingRsvp.companions,
                  message: existingRsvp.message,
                }
              : null
          }
          colors={colors}
        />

        <p
          style={{ color: colors.muted }}
          className="mt-8 text-center text-xs"
        >
          Enviado con Web de Boda · si tienes dudas contacta a los novios.
        </p>
      </div>
    </main>
  );
}