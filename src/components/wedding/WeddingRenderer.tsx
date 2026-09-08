import { createElement, Fragment } from "react";
import type { ComponentType, CSSProperties } from "react";
import type { SectionType, TemplateConfig, Theme, Wedding } from "@/types";
import type { EffectiveSection } from "@/lib/wedding/render-data";
import { ambientBackgroundClass, ambientOf, SectionDivider } from "./Motifs";
import { Reveal } from "./Reveal";
import { MusicPlayer } from "./MusicPlayer";
import { CustomCursor } from "./CustomCursor";
import { TrailSparkles } from "./TrailSparkles";
import { HeroSection } from "./HeroSection";
import { CoupleSection } from "./CoupleSection";
import { StorySection } from "./StorySection";
import { GallerySection } from "./GallerySection";
import { CountdownSection } from "./CountdownSection";
import { EventSection } from "./EventSection";
import { LocationSection } from "./LocationSection";
import { DriveSection } from "./DriveSection";
import { DresscodeSection } from "./DresscodeSection";
import { FooterSection } from "./FooterSection";

export interface WeddingRendererProps {
  wedding: Wedding;
  template: TemplateConfig;
  theme: Theme;
  sections: EffectiveSection[];
  mediaUrls?: string[];
}

/** Props que recibe cada sección. */
export interface SectionComponentProps {
  wedding: Wedding;
  mediaUrls?: string[];
  templateName?: string;
  /** Slug de la plantilla (drive de la identidad visual/ambientación). */
  templateId?: string;
  /** Variante de la sección (definida por la plantilla). */
  variant?: string;
  data: Record<string, unknown>;
}

const SECTION_COMPONENTS: Record<
  SectionType,
  ComponentType<SectionComponentProps>
> = {
  hero: HeroSection,
  couple: CoupleSection,
  story: StorySection,
  gallery: GallerySection,
  countdown: CountdownSection,
  event: EventSection,
  location: LocationSection,
  drive: DriveSection,
  dresscode: DresscodeSection,
  footer: FooterSection,
};

function themeStyles(theme: Theme): CSSProperties {
  const styles: Record<string, string> = {};
  for (const [key, value] of Object.entries(theme.tokens)) {
    styles[`--${key}`] = value;
  }
  return styles as CSSProperties;
}

/**
 * WeddingRenderer: motor único de renderizado (ADR-002).
 * Se usa en Demo, Builder, Preview y página pública.
 */
export function WeddingRenderer({
  wedding,
  template,
  theme,
  sections,
  mediaUrls = [],
}: WeddingRendererProps) {
  const templateId = template.slug ?? template.id;
  const ambient = ambientOf(templateId);
  return (
    <div
      style={themeStyles(theme)}
      className={`min-h-screen bg-[var(--t-bg)] font-sans text-[var(--t-text)] ${ambientBackgroundClass(ambient)}`}
    >
      {sections.map((section, index) => {
        const Component = SECTION_COMPONENTS[section.type];
        if (!Component) {
          return null;
        }
        return (
          <Reveal
            key={section.id}
            from="up"
            delay={index === 0 ? 0 : Math.min(index * 60, 240)}
          >
            <Fragment>
              {index > 0 && <SectionDivider templateId={templateId} />}
              {createElement(Component, {
                data: section.data,
                wedding,
                mediaUrls,
                templateName: template.name,
                templateId,
                variant: section.variant,
              })}
            </Fragment>
          </Reveal>
        );
      })}

      {/* Música de ambiente (botón flotante). */}
      <MusicPlayer src={template.musicUrl} />
    {/* Ambientación "firma" de plantilla: cursor custom (urbana) y rastro de
          chispas (elegance) según el tipo de ambientación. */}
      {ambient === "urbana" && <CustomCursor />}
      {ambient === "elegance" && <TrailSparkles />}
    </div>
  );
}