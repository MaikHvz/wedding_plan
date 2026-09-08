import type { SectionComponentProps } from "./WeddingRenderer";
import type { SectionDataMap } from "@/types";
import { ambientOf, Wave, LaurelWreath, EleganceLine, BohoArch, GardenGarland, UrbanaShape, Watermark } from "./Motifs";
import { APP_NAME } from "@/config/app";

function AmbientMotif({ ambient }: { ambient: string }) {
  switch (ambient) {
    case "garden": return <GardenGarland className="mx-auto mb-6 h-8 opacity-60" />;
    case "boho": return <BohoArch className="mx-auto mb-6 h-8 opacity-60" />;
    case "costa": return <Wave className="mx-auto mb-6 h-6 opacity-60" />;
    case "clasica": return <LaurelWreath className="mx-auto mb-6 h-8 opacity-60" />;
    case "urbana": return <UrbanaShape className="mx-auto mb-6 h-8 opacity-40" />;
    case "elegance": return <EleganceLine className="mx-auto mb-6 h-6 opacity-60" />;
    default: return null;
  }
}

export function FooterSection({ data, templateName, variant, templateId }: SectionComponentProps) {
  const footer = data as SectionDataMap["footer"];
  const v = variant ?? "classic";
  const ambient = ambientOf(templateId);

  if (v === "minimal") {
    return (
      <footer className="relative overflow-hidden px-6 py-12 text-center">
        <Watermark templateId={templateId} />
        <p className="relative text-sm text-[var(--t-muted)]">
          {footer.text || "Gracias por acompañarnos en este día tan especial"}
        </p>
        <p className="relative mt-3 text-xs text-[var(--t-muted)] opacity-70">
          {templateName ? `Plantilla ${templateName}` : APP_NAME}
        </p>
      </footer>
    );
  }

  if (v === "centered") {
    return (
      <footer className="relative overflow-hidden px-6 py-16 text-center">
        <Watermark templateId={templateId} />
        <AmbientMotif ambient={ambient} />
        <p className="relative font-serif text-lg italic text-[var(--t-muted)]">
          {footer.text || "Gracias por acompañarnos en este día tan especial"}
        </p>
        <div className="relative mx-auto mt-6 h-px w-16 bg-[var(--t-accent)]" />
        <p className="relative mt-4 text-xs text-[var(--t-muted)] opacity-70">
          {templateName ? `Plantilla ${templateName}` : APP_NAME}
        </p>
      </footer>
    );
  }

  // classic (default)
  return (
    <footer className="relative overflow-hidden border-t border-[var(--t-border)] px-6 py-12 text-center">
      <Watermark templateId={templateId} />
      <AmbientMotif ambient={ambient} />
      <p className="relative text-sm text-[var(--t-muted)]">
        {footer.text || "Gracias por acompañarnos en este día tan especial"}
      </p>
      <p className="relative mt-3 text-xs text-[var(--t-muted)] opacity-70">
        {templateName ? `Plantilla ${templateName}` : APP_NAME}
      </p>
    </footer>
  );
}
