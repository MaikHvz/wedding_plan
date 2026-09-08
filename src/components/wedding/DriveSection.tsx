import type { SectionComponentProps } from "./WeddingRenderer";
import type { SectionDataMap } from "@/types";
import { validateMapsOrDriveUrl } from "@/lib/maps";

export function DriveSection({ wedding, data, variant }: SectionComponentProps) {
  const drive = data as SectionDataMap["drive"];
  const driveUrl = drive.driveUrl || wedding.driveUrl;
  const text = drive.text || "Comparte las fotografías de la boda. Accede al álbum y sube tus fotos.";
  const v = variant ?? "classic";

  if (validateMapsOrDriveUrl(driveUrl) !== null) return null;
  const driveHref = driveUrl || undefined;

  if (v === "button") {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto flex w-full max-w-xl flex-col items-center gap-4 text-center sm:flex-row sm:justify-center sm:text-left">
          <p className="text-sm text-[var(--t-muted)]">{text}</p>
          <a
            href={driveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 rounded-full bg-[var(--t-accent)] px-6 py-2.5 text-sm text-white transition-opacity hover:opacity-90"
          >
            Acceder al álbum
          </a>
        </div>
      </section>
    );
  }

  if (v === "card") {
    return (
      <section className="px-6 py-20">
        <div className="mx-auto max-w-md rounded-[var(--t-radius)] bg-[var(--t-surface)] px-8 py-12 text-center shadow-sm">
          <p className="mb-2 text-xs uppercase tracking-[0.4em] text-[var(--t-accent)]">Compartamos fotos</p>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-[var(--t-muted)]">{text}</p>
          <a
            href={driveHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block rounded-full bg-[var(--t-accent)] px-8 py-3 text-sm text-white transition-opacity hover:opacity-90"
          >
            Acceder al álbum
          </a>
        </div>
      </section>
    );
  }

  // classic (default)
  return (
    <section className="bg-[var(--t-surface)] px-6 py-20">
      <div className="mx-auto w-full max-w-xl text-center">
        <p className="mb-2 text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">Compartamos fotos</p>
        <p className="mt-4 text-pretty leading-relaxed text-[var(--t-muted)]">{text}</p>
        <a
          href={driveHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-8 inline-block rounded-full bg-[var(--t-accent)] px-8 py-3 text-sm text-white transition-opacity hover:opacity-90"
        >
          Acceder al álbum
        </a>
      </div>
    </section>
  );
}
