import type { Metadata } from "next";
import { Catalog } from "@/components/templates/Catalog";
import { JsonLd, breadcrumbSchema } from "@/config/seo";
import { getAllTemplateConfigs, getAllThemes } from "@/lib/templates";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Plantillas para tu boda",
  description:
    "Elige entre nuestras plantillas para página web de matrimonio e invitaciones digitales. Estructuras únicas, personalización de colores y demos completas.",
  alternates: {
    canonical: "/plantillas",
  },
};

export default async function PlantillasPage() {
  const templates = getAllTemplateConfigs();
  const themes = getAllThemes();

  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12">
      <JsonLd data={breadcrumbSchema([{ name: "Inicio", item: "/" }, { name: "Plantillas" }])} />
      <header className="mb-10">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Catálogo
        </p>
        <h1 className="mt-2 font-serif text-3xl font-semibold">
          Plantillas para tu boda
        </h1>
        <p className="mt-3 max-w-2xl text-neutral-600">
          Cada plantilla tiene una estructura propia. Elige la tuya y repíntala
          con el color que combine con tu ceremonia: todas son 100%
          personalizables.
        </p>
      </header>

      <Catalog templates={templates} themes={themes} />
    </main>
  );
}