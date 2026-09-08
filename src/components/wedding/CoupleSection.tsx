/* eslint-disable @next/next/no-img-element */

import type { SectionComponentProps } from "./WeddingRenderer";
import type { SectionDataMap } from "@/types";
import { ambientOf, Wave, UrbanaShape } from "./Motifs";

function FancyFrame({ templateId, children }: { templateId?: string; children: React.ReactNode }) {
  const ambient = ambientOf(templateId);
  switch (ambient) {
    case "garden":
      return <div className="relative">{children}<span className="pointer-events-none absolute -bottom-2 -right-3 text-[var(--t-accent)]">✿</span></div>;
    case "boho":
      return <div className="relative">{children}<span className="pointer-events-none absolute -top-4 -left-4 text-3xl text-[var(--t-accent)] opacity-60">❁</span></div>;
    case "costa":
      return <div className="relative rounded-b-[48%_14%] overflow-hidden">{children}<span className="pointer-events-none absolute inset-x-0 -bottom-1 flex justify-center"><Wave className="opacity-70"/></span></div>;
    case "clasica":
      return <div className="relative">{children}<span className="pointer-events-none absolute -inset-2 -z-10 rounded-2xl border border-[var(--t-accent-soft)]"/></div>;
    case "urbana":
      return <div className="relative">{children}<span className="pointer-events-none absolute -right-2 -bottom-2"><UrbanaShape className="opacity-40"/></span></div>;
    case "elegance":
    default:
      return <div className="relative">{children}<span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 text-[var(--t-accent)] opacity-60">❖</span></div>;
  }
}

export function CoupleSection({ wedding, data, templateId, variant }: SectionComponentProps) {
  const coupleData = data as SectionDataMap["couple"];
  const name1 = coupleData.name1 || wedding.partner1 || "Nombre";
  const name2 = coupleData.name2 || wedding.partner2 || "Nombre";
  const v = variant ?? "classic";

  return (
    <section className="px-6 py-20">
      <div className="mx-auto w-full max-w-4xl">
        <p className="mb-12 text-center text-xs uppercase tracking-[0.4em] text-[var(--t-muted)]">
          Nuestro día especial
        </p>

        {v === "editorial" ? (
          <div className="grid grid-cols-1 items-center gap-10 sm:grid-cols-[1fr_auto_1fr] sm:gap-4">
            <FancyFrame templateId={templateId}>
              <PersonPortrait name={name1} label="Novia" image={coupleData.image1} />
            </FancyFrame>
            <div className="hidden font-serif text-4xl text-[var(--t-accent)] sm:block">&amp;</div>
            <FancyFrame templateId={templateId}>
              <PersonPortrait name={name2} label="Novio" image={coupleData.image2} />
            </FancyFrame>
          </div>
        ) : v === "portrait" ? (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <FancyFrame templateId={templateId}>
              <PersonPortrait tall name={name1} label="Novia" image={coupleData.image1} />
            </FancyFrame>
            <FancyFrame templateId={templateId}>
              <PersonPortrait tall name={name2} label="Novio" image={coupleData.image2} />
            </FancyFrame>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            <PersonPortrait name={name1} label="Novia" image={coupleData.image1} />
            <PersonPortrait name={name2} label="Novio" image={coupleData.image2} />
          </div>
        )}

        {coupleData.description && (
          <p className="mx-auto mt-12 max-w-xl text-pretty text-center leading-relaxed text-[var(--t-muted)]">
            {coupleData.description}
          </p>
        )}
      </div>
    </section>
  );
}

function PersonPortrait({
  name,
  label,
  image,
  tall,
}: {
  name: string;
  label?: string;
  image?: string;
  tall?: boolean;
}) {
  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {image ? (
        <img
          src={image}
          alt={name}
          className={`aspect-[3/4] w-full max-w-56 rounded-[var(--t-radius)] border border-[var(--t-border)] object-cover shadow-md transition-transform duration-500 hover:scale-[1.02] ${tall ? "max-w-64" : ""}`}
        />
      ) : (
        <div className={`flex aspect-[3/4] w-full max-w-56 items-center justify-center rounded-[var(--t-radius)] border border-[var(--t-border)] bg-[var(--t-accent-soft)] shadow-inner ${tall ? "max-w-64" : ""}`}>
          <span className="font-serif text-5xl text-[var(--t-accent)]">{name.slice(0, 1) || "•"}</span>
        </div>
      )}
      {label && <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--t-muted)]">{label}</span>}
      <h3 className="font-serif text-2xl font-semibold tracking-wide text-[var(--t-text)]">{name}</h3>
    </div>
  );
}
