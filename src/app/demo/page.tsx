import type { Metadata } from "next";
import { DEFAULT_TEMPLATE, DEFAULT_THEME } from "@/config/app";
import { WeddingRenderer } from "@/components/wedding/WeddingRenderer";
import type { EffectiveSection } from "@/lib/wedding/render-data";
import type { Wedding } from "@/types";

export const metadata: Metadata = {
  title: "Demo de página de boda",
  description:
    "Mira una demo completa de una página web de matrimonio creada con Web de Boda.",
  robots: { index: false, follow: false },
};

const demoWedding: Wedding = {
  id: "demo-1",
  userId: "seed",
  title: "Mutuo",
  partner1: "Andrea",
  partner2: "Sebastián",
  eventDate: "2027-03-20",
  eventTime: "18:30",
  locationName: "Hacienda Los Robles",
  locationAddress: "Camino a Lampa 4500, Santiago",
  mapsUrl: "https://www.google.com/maps/place",
  driveUrl: "https://drive.google.com",
  slug: "demo",
  status: "DRAFT",
  templateId: "elegance",
  templateVersion: 1,
  themeJson: null,
  maxGuests: 0,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  publishedAt: null,
  expiresAt: null,
};

const demoData: Record<string, Record<string, unknown>> = {
  hero: {
    subtitle: "Juntos decimos sí",
    partner1: "Andrea & Sebastián",
    image:
      "https://images.unsplash.com/photo-1768586471676-6af1d219e99e?auto=format&fit=crop&w=1920&q=85",
  },
  couple: {
    name1: "Andrea",
    name2: "Sebastián",
    description:
      "Nos conocimos en un viaje a la Patagonia y desde entonces supimos que queríamos compartir toda la vida.",
  },
  story: {
    title: "Nuestra historia",
    content:
      "Empezó con un café que duró ocho horas.\n\nLuego vinieron los viajes, las aventuras y ese primer aniversario que no queríamos que terminara.\n\nHoy estamos felices de invitarte a celebrar con nosotros.",
  },
  gallery: {
    images: [
      "https://picsum.photos/id/1079/600/600",
      "https://picsum.photos/id/113/600/600",
      "https://picsum.photos/id/428/600/600",
      "https://picsum.photos/id/180/600/600",
      "https://picsum.photos/id/227/600/600",
      "https://picsum.photos/id/42/600/600",
    ],
  },
  event: {
    title: "Ceremonia y celebración",
    date: "20 de marzo de 2027",
    time: "18:30 hrs",
    place: "Hacienda Los Robles",
    address: "Camino a Lampa 4500, Santiago",
  },
  dresscode: {
    title: "Código de vestimenta",
    code: "Alta costura · Formal",
    description:
      "Acompáñanos en gala. Vestidos largos, trajes oscuros y los detalles dorados que definen esta noche.",
    colors: ["#b98a5e", "#f5f0e8", "#3d3a36"],
  },
  location: {
    place: "Hacienda Los Robles",
    address: "Camino a Lampa 4500, Santiago",
    mapsUrl: "https://www.google.com/maps/place",
  },
  drive: {
    text: "Comparte tus fotos de la boda en nuestro álbum de Google Drive.",
  },
  footer: {
    text: "Con todo nuestro amor, Andrea & Sebastián",
  },
};

function buildSections(): EffectiveSection[] {
  return DEFAULT_TEMPLATE.sections.map((section, index) => ({
    id: `${section.type}-demo`,
    type: section.type,
    variant: section.variant,
    position: index + 1,
    enabled: true,
    data: demoData[section.type] ?? {},
  }));
}

export default function DemoPage() {
  return (
    <WeddingRenderer
      wedding={demoWedding}
      template={DEFAULT_TEMPLATE}
      theme={DEFAULT_THEME}
      sections={buildSections()}
    />
  );
}