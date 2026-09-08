import type { SectionComponentProps } from "./WeddingRenderer";
import type { SectionDataMap } from "@/types";
import { getTemplateDemo } from "@/lib/templates/demos";
import { ambientOf, BohoArch, Wave, LaurelWreath, UrbanaShape, EleganceLine } from "./Motifs";
import { AmbientShader } from "./AmbientShader";
import { BackgroundImage } from "./BackgroundImage";
import { Sparkles, HeroGlint } from "./Sparkles";

function AmbientHeroDecoration({ templateId }: { templateId?: string }) {
  const ambient = ambientOf(templateId);
  switch (ambient) {
    case "garden":
    case "boho":
      return (
        <div className="pointer-events-none mb-6 flex justify-center">
          <BohoArch className="opacity-90 drop-shadow-sm" />
        </div>
      );
    case "costa":
      return (
        <div className="pointer-events-none mb-6 flex justify-center">
          <Wave className="opacity-90 drop-shadow-sm" />
        </div>
      );
    case "clasica":
      return (
        <div className="pointer-events-none mb-6 flex justify-center">
          <LaurelWreath className="opacity-90 drop-shadow-sm" />
        </div>
      );
    case "urbana":
      return (
        <div className="pointer-events-none mb-6 flex justify-center">
          <UrbanaShape className="opacity-80" />
        </div>
      );
    case "elegance":
    default:
      return (
        <div className="pointer-events-none mb-6 flex justify-center">
          <EleganceLine className="opacity-80 drop-shadow-sm" />
        </div>
      );
  }
}

const heroDate = (date?: string) => date?.replace(/-/g, ".");

/** Entrada escalonada: devuelve la clase + retardo para un elemento del hero. */
function heroIn(delay: number) {
  return { className: "hero-in", style: { animationDelay: `${delay}ms` } };
}

export function HeroSection({ wedding, data, templateId, variant }: SectionComponentProps) {
  const hero = data as SectionDataMap["hero"];
  const defaultDemo = templateId ? getTemplateDemo(templateId) : null;
  const partner1 = hero.partner1 || wedding.partner1;
  const partner2 = hero.partner2 || wedding.partner2;
  const couple = partner1 || partner2 ? `${partner1} & ${partner2}` : wedding.title;
  const date = hero.date || wedding.eventDate;
  const image = hero.image || (defaultDemo?.data?.hero?.image as string | undefined);
  const v = variant ?? "fullscreen";

  const monogram = partner1 && partner2 ? `${partner1[0]} & ${partner2[0]}` : null;
  const ambient = ambientOf(templateId);

  // Fondo con capas explícitas (z-0) para que la imagen SIEMPRE aparezca
  // por encima del fondo de la página, con fade-in, zoomy lento (Ken Burns)
  // y fallback temático.
  const background = (
    <BackgroundImage
      src={image}
      alt={couple}
      kenBurns
      overlay={
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--t-bg)]/75 via-[var(--t-bg)]/40 to-[var(--t-bg)]" />
      }
      fallback={
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--t-accent-soft)]/70 via-[var(--t-bg)]/85 to-[var(--t-bg)]" />
      }
    />
  );

  // Efectos de carga: brillo de lente al entrar + chispitas titilantes.
  const loadFx = (
    <>
      <HeroGlint />
      <Sparkles />
    </>
  );

  if (v === "split") {
    return (
      <section className="relative flex min-h-[90svh] flex-col overflow-hidden sm:grid sm:grid-cols-2">
        <div className="relative min-h-[50vh] sm:min-h-full overflow-hidden">
          <BackgroundImage
            src={image}
            alt={couple}
            kenBurns
            overlay={
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 sm:from-black/40 sm:via-transparent sm:to-transparent" />
            }
            fallback={<div className="absolute inset-0 bg-[var(--t-accent-soft)]" />}
          />
          <AmbientShader templateId={templateId} onImage={Boolean(image)} />
          {loadFx}
          <div className="absolute bottom-6 left-6 z-10 rounded-[var(--t-radius)] border border-white/20 bg-black/40 px-4 py-2 backdrop-blur-md text-xs uppercase tracking-[0.3em] text-white hero-in" style={{ animationDelay: "0.8s" }}>
            {ambient === "urbana" ? "Metropolitan Wedding" : "Celebración"}
          </div>
        </div>
        <div className="relative z-10 flex flex-col justify-center px-8 py-20 text-center sm:px-14 sm:py-24 sm:text-left bg-[var(--t-bg)]">
          <div className="mx-auto max-w-xl sm:mx-0">
            {monogram && (
              <div {...heroIn(0.15)} className="mb-6 inline-flex items-center gap-3 font-serif text-3xl font-semibold tracking-wider text-[var(--t-accent)]">
                <span>{partner1?.[0]}</span>
                <span className="text-xl font-light opacity-70">/</span>
                <span>{partner2?.[0]}</span>
              </div>
            )}
            <p {...heroIn(0.3)} className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-[var(--t-muted)]">
              {hero.subtitle || "Juntos decimos sí"}
            </p>
            <h1 {...heroIn(0.45)} className="font-serif text-4xl font-semibold leading-[1.1] tracking-tight sm:text-6xl text-balance text-[var(--t-text)]">
              {couple}
            </h1>
            <div {...heroIn(0.6)} className="mt-8 flex items-center justify-center gap-4 sm:justify-start">
              <div className="h-px w-12 bg-[var(--t-accent)]" />
              {date && (
                <p className="text-sm font-medium uppercase tracking-[0.25em] text-[var(--t-muted)]">
                  {heroDate(date)}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (v === "minimal") {
    return (
      <section className="relative flex min-h-[90svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        {background}
        <AmbientShader templateId={templateId} onImage={Boolean(image)} />
        {loadFx}
        <div className="relative z-10 mx-auto max-w-3xl rounded-[calc(var(--t-radius)*1.5)] border border-[var(--t-border)] bg-[var(--t-surface)]/85 px-8 py-14 shadow-lg backdrop-blur-md sm:px-16 sm:py-20">
          <div {...heroIn(0.15)}>
            <AmbientHeroDecoration templateId={templateId} />
          </div>
          <p {...heroIn(0.3)} className="mb-4 text-xs font-medium uppercase tracking-[0.4em] text-[var(--t-muted)]">
            {hero.subtitle || "Nuestra boda"}
          </p>
          <h1 {...heroIn(0.45)} className="font-serif text-5xl font-semibold leading-tight text-balance sm:text-7xl text-[var(--t-text)]">
            {couple}
          </h1>
          {date && (
            <div {...heroIn(0.6)} className="mt-8 inline-flex items-center gap-3 rounded-full border border-[var(--t-accent)]/30 bg-[var(--t-accent-soft)]/50 px-6 py-2 text-xs uppercase tracking-[0.3em] text-[var(--t-text)]">
              {heroDate(date)}
            </div>
          )}
        </div>
      </section>
    );
  }

  if (v === "classic") {
    return (
      <section className="relative flex min-h-[90svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
        {background}
        <AmbientShader templateId={templateId} onImage={Boolean(image)} />
        {loadFx}
        <div className="relative z-10 mx-auto max-w-3xl px-6 py-12">
          <div {...heroIn(0.15)}>
            <AmbientHeroDecoration templateId={templateId} />
          </div>
          <p {...heroIn(0.3)} className="mb-6 text-xs uppercase tracking-[0.45em] text-[var(--t-muted)]">
            {hero.subtitle || "Solemnidad & Unión"}
          </p>
          <h1 {...heroIn(0.45)} className="font-serif text-5xl font-normal leading-tight text-balance sm:text-7xl text-[var(--t-text)]">
            {couple}
          </h1>
          {date && (
            <div {...heroIn(0.6)} className="mx-auto mt-8 flex items-center justify-center gap-4">
              <div className="h-px w-16 bg-[var(--t-accent)]" />
              <span className="font-serif text-sm tracking-[0.3em] text-[var(--t-accent)]">❦</span>
              <div className="h-px w-16 bg-[var(--t-accent)]" />
            </div>
          )}
          {date && (
            <p {...heroIn(0.72)} className="mt-6 text-base tracking-[0.3em] text-[var(--t-muted)] uppercase">
              {heroDate(date)}
            </p>
          )}
        </div>
      </section>
    );
  }

  // fullscreen (default, high-end editorial)
  return (
    <section className="relative flex min-h-[92svh] flex-col items-center justify-center overflow-hidden px-6 py-24 text-center">
      {background}
      <AmbientShader templateId={templateId} onImage={Boolean(image)} />
      {loadFx}
      <div className="relative z-10 mx-auto max-w-4xl px-4 py-8">
        <div {...heroIn(0.05)}>
          <AmbientHeroDecoration templateId={templateId} />
        </div>
        {monogram && (
          <div {...heroIn(0.2)} className="mb-6 inline-flex items-center justify-center rounded-full border border-[var(--t-border)] bg-[var(--t-surface)]/70 px-6 py-2 backdrop-blur-md">
            <span className="font-serif text-lg tracking-[0.3em] text-[var(--t-accent)]">
              {monogram}
            </span>
          </div>
        )}
        <p {...heroIn(0.35)} className="mb-4 text-xs font-semibold uppercase tracking-[0.4em] text-[var(--t-muted)]">
          {hero.subtitle || "Juntos decimos sí"}
        </p>
        <h1 {...heroIn(0.5)} className="font-serif text-5xl font-semibold leading-[1.15] text-balance sm:text-7xl lg:text-8xl text-[var(--t-text)] drop-shadow-sm">
          {couple}
        </h1>
        {date && (
          <div {...heroIn(0.66)} className="mx-auto mt-8 flex items-center justify-center gap-4">
            <div className="h-px w-20 bg-[var(--t-accent)]" />
            <p className="text-sm font-medium tracking-[0.3em] text-[var(--t-muted)] uppercase">
              {heroDate(date)}
            </p>
            <div className="h-px w-20 bg-[var(--t-accent)]" />
          </div>
        )}
      </div>
    </section>
  );
}

