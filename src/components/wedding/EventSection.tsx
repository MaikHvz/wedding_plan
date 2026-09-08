import type { SectionComponentProps } from "./WeddingRenderer";
import type { SectionDataMap } from "@/types";

function EventRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-4 sm:flex-row sm:items-baseline sm:gap-6">
      <span className="w-32 shrink-0 text-xs uppercase tracking-[0.2em] text-[var(--t-muted)]">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

export function EventSection({ wedding, data, variant }: SectionComponentProps) {
  const event = data as SectionDataMap["event"];
  const title = event.title || "El evento";
  const v = variant ?? "classic";

  const rows = [
    { label: "Fecha", value: event.date || wedding.eventDate || null },
    { label: "Hora", value: event.time || wedding.eventTime || null },
    { label: "Lugar", value: event.place || wedding.locationName || null },
    { label: "Dirección", value: event.address || wedding.locationAddress || null },
  ].filter((row): row is { label: string; value: string } => Boolean(row.value));

  if (rows.length === 0) return null;

  if (v === "timeline") {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto w-full max-w-2xl">
          <p className="mb-12 text-center text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Cuándo y dónde</p>
          <h2 className="mb-10 text-center font-serif text-3xl font-semibold">{title}</h2>
          <div className="relative border-l border-[var(--t-accent-soft)] pl-8">
            {rows.map((row) => (
              <div key={row.label} className="relative mb-8 last:mb-0">
                <span className="absolute -left-8 top-1 flex h-3 w-3 items-center justify-center rounded-full bg-[var(--t-accent)]" />
                <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[var(--t-accent)]">{row.label}</p>
                <p className="font-medium">{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (v === "compact") {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto w-full max-w-3xl">
          <p className="mb-3 text-center text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Cuándo y dónde</p>
          <h2 className="mb-10 text-center font-serif text-3xl font-semibold">{title}</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {rows.map((row) => (
              <div key={row.label} className="rounded-[var(--t-radius)] bg-[var(--t-surface)] px-4 py-5 text-center">
                <p className="mb-2 text-xs uppercase tracking-[0.2em] text-[var(--t-accent)]">{row.label}</p>
                <p className="font-medium leading-snug">{row.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // classic (default)
  return (
    <section className="px-6 py-20">
      <div className="mx-auto w-full max-w-xl">
        <p className="mb-2 text-center text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Cuándo y dónde</p>
        <h2 className="mb-6 text-center font-serif text-3xl font-semibold">{title}</h2>
        <div className="divide-y divide-[var(--t-border)] border-y border-[var(--t-border)]">
          {rows.map((row) => (
            <EventRow key={row.label} label={row.label} value={row.value} />
          ))}
        </div>
      </div>
    </section>
  );
}
