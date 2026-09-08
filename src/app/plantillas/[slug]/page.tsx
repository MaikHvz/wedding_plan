import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WeddingRenderer } from "@/components/wedding/WeddingRenderer";
import { DEFAULT_THEME } from "@/config/app";
import { JsonLd, breadcrumbSchema } from "@/config/seo";
import { getAllTemplateConfigs, getTemplateConfig, resolveTheme } from "@/lib/templates";
import { getTemplateDemo } from "@/lib/templates/demos";
import type { EffectiveSection } from "@/lib/wedding/render-data";
import type { Wedding } from "@/types";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllTemplateConfigs().map((config) => ({ slug: config.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const config = getTemplateConfig(slug);
  return {
    title: config ? `Plantilla ${config.name} — demo de página de boda` : "Plantilla",
    description: config
      ? `Explora la demo de la plantilla ${config.name} de Web de Boda. ${config.description}`
      : "Plantilla de página de boda.",
    alternates: config ? { canonical: `/plantillas/${config.slug}` } : undefined,
  };
}

export default async function TemplateDemoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const config = getTemplateConfig(slug);
  if (!config) {
    notFound();
  }
  const demo = getTemplateDemo(slug);
  if (!demo) {
    notFound();
  }
  const theme = resolveTheme(config.themeId) ?? DEFAULT_THEME;

  const wedding: Wedding = {
    id: `demo-${config.slug}`,
    userId: "seed",
    title: demo.title,
    partner1: demo.partner1,
    partner2: demo.partner2,
    eventDate: demo.eventDate,
    eventTime: demo.eventTime,
    locationName: demo.locationName,
    locationAddress: demo.locationAddress,
    mapsUrl: demo.mapsUrl,
    driveUrl: demo.driveUrl,
    slug: `demo-${config.slug}`,
    status: "DRAFT",
    templateId: config.slug,
    templateVersion: config.version,
    themeJson: JSON.stringify({ id: config.themeId }),
    maxGuests: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    publishedAt: null,
    expiresAt: null,
  };

  const sections: EffectiveSection[] = config.sections.map((section, index) => ({
    id: `${section.type}-demo`,
    type: section.type,
    variant: section.variant,
    position: index + 1,
    enabled: true,
    data: demo.data[section.type] ?? {},
  }));

  return (
    <main className="relative">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Inicio", item: "/" },
          { name: "Plantillas", item: "/plantillas" },
          { name: config.name },
        ])}
      />
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-6 py-3 backdrop-blur">
        <Link
          href="/plantillas"
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          ← Volver al catálogo
        </Link>
        <span className="text-sm uppercase tracking-[0.25em] text-neutral-500">
          Demo · {config.name}
        </span>
      </div>
      <WeddingRenderer
        wedding={wedding}
        template={config}
        theme={theme}
        sections={sections}
      />
    </main>
  );
}