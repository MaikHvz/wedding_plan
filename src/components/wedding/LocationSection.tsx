import type { SectionComponentProps } from "./WeddingRenderer";
import type { SectionDataMap } from "@/types";
import { validateMapsOrDriveUrl } from "@/lib/maps";

export function LocationSection({ wedding, data, variant }: SectionComponentProps) {
  const location = data as SectionDataMap["location"];
  const place = location.place || wedding.locationName;
  const address = location.address || wedding.locationAddress;
  const mapsUrl = location.mapsUrl || wedding.mapsUrl;
  const mapsValid = validateMapsOrDriveUrl(mapsUrl) === null;
  const mapsHref = mapsUrl || undefined;
  const v = variant ?? "centered";

  if (!place && !address && !mapsValid) return null;

  const mapEmbed = mapsValid && mapsUrl ? (
    <iframe
      src={mapsUrl.replace(/\/edit.*$/, "/preview") + "&embedded=true"}
      className="mt-6 aspect-video w-full rounded-[var(--t-radius)] border-0"
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title="Ubicación en el mapa"
    />
  ) : null;

  if (v === "split") {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto grid w-full max-w-4xl grid-cols-1 items-start gap-10 sm:grid-cols-2">
          <div className="sm:py-8">
            <p className="mb-2 text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Ubicación</p>
            <h2 className="font-serif text-3xl font-semibold">{place || "El lugar"}</h2>
            {address && <p className="mt-4 text-[var(--t-muted)]">{address}</p>}
            {mapsValid && (
              <a
                href={mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-8 inline-block rounded-full border border-[var(--t-accent)] px-6 py-2.5 text-sm text-[var(--t-accent)] transition-colors hover:bg-[var(--t-accent)] hover:text-white"
              >
                Ver en Google Maps
              </a>
            )}
          </div>
          <div>
            {mapEmbed ?? (
              <div className="flex aspect-video items-center justify-center rounded-[var(--t-radius)] bg-[var(--t-accent-soft)] text-sm text-[var(--t-muted)]">
                Sin mapa configurado
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  if (v === "minimal") {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="font-serif text-4xl font-semibold italic">{place || "El lugar"}</h2>
          {address && <p className="mt-4 text-lg text-[var(--t-muted)]">{address}</p>}
          {mapsValid && (
            <a
              href={mapsHref}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-block text-sm underline underline-offset-4 text-[var(--t-accent)] hover:text-[var(--t-text)] transition-colors"
            >
              Ver en mapa →
            </a>
          )}
        </div>
      </section>
    );
  }

  // centered (default)
  return (
    <section className="px-6 py-20">
      <div className="mx-auto w-full max-w-xl text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Ubicación</p>
        <h2 className="font-serif text-3xl font-semibold">{place || "El lugar"}</h2>
        {address && <p className="mt-4 text-[var(--t-muted)]">{address}</p>}
        {mapEmbed}
        {mapsValid && (
          <a
            href={mapsHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full border border-[var(--t-accent)] px-6 py-2.5 text-sm text-[var(--t-accent)] transition-colors hover:bg-[var(--t-accent)] hover:text-white"
          >
            Ver en Google Maps
          </a>
        )}
      </div>
    </section>
  );
}
