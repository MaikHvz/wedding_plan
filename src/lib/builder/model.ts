import type { SectionType } from "@/types";
import { SECTION_ORDER } from "@/config/app";

/**
 * Modelo del builder: la página como datos (plan.md §22–23).
 * Este módulo es compartido (cliente + servidor) y no importa `server-only`.
 */

export interface BuilderSection {
  id: string;
  type: SectionType;
  variant: string;
  position: number;
  enabled: boolean;
  data: Record<string, unknown>;
}

/** Todo lo que se edita y se persiste al guardar. */
export interface BuilderPageState {
  title: string;
  partner1: string;
  partner2: string;
  eventDate: string;
  eventTime: string;
  locationName: string;
  locationAddress: string;
  mapsUrl: string;
  driveUrl: string;
  themeId: string;
  sections: BuilderSection[];
}

export const BUILDER_SECTION_ORDER: readonly SectionType[] = SECTION_ORDER;

export const SECTION_LABELS: Record<SectionType, string> = {
  hero: "Portada",
  couple: "La pareja",
  story: "Nuestra historia",
  gallery: "Galería",
  countdown: "Cuenta regresiva",
  event: "Evento",
  dresscode: "Código de vestimenta",
  location: "Ubicación",
  drive: "Google Drive",
  footer: "Pie de página",
};

export type BuilderFieldType =
  | "text"
  | "textarea"
  | "date"
  | "url"
  | "image";

export interface BuilderField {
  key: string;
  label: string;
  type: BuilderFieldType;
  placeholder?: string;
  hint?: string;
}

export const SECTION_FIELDS: Record<SectionType, BuilderField[]> = {
  hero: [
    { key: "subtitle", label: "Subtítulo", type: "text" },
    { key: "partner1", label: "Nombre 1", type: "text" },
    { key: "partner2", label: "Nombre 2", type: "text" },
    { key: "date", label: "Fecha (texto)", type: "text" },
    { key: "image", label: "Imagen de fondo", type: "image" },
  ],
  couple: [
    { key: "name1", label: "Nombre 1", type: "text" },
    { key: "name2", label: "Nombre 2", type: "text" },
    { key: "image1", label: "Foto 1", type: "image" },
    { key: "image2", label: "Foto 2", type: "image" },
    { key: "description", label: "Historia corta", type: "textarea" },
  ],
  story: [
    { key: "title", label: "Título", type: "text" },
    { key: "image", label: "Imagen", type: "image" },
    { key: "content", label: "Historia", type: "textarea" },
  ],
  gallery: [],
  countdown: [],
  event: [
    { key: "title", label: "Título del evento", type: "text" },
    { key: "date", label: "Fecha (texto)", type: "text" },
    { key: "time", label: "Hora (texto)", type: "text" },
    { key: "place", label: "Lugar", type: "text" },
    { key: "address", label: "Dirección", type: "text" },
  ],
  location: [
    { key: "place", label: "Nombre del lugar", type: "text" },
    { key: "address", label: "Dirección", type: "text" },
    {
      key: "mapsUrl",
      label: "URL de Google Maps",
      type: "url",
      hint: "Debe ser una URL HTTPS de Google Maps (no guardamos credenciales).",
    },
  ],
  dresscode: [
    { key: "title", label: "Título", type: "text" },
    {
      key: "code",
      label: "Código de vestimenta",
      type: "text",
      placeholder: "Ej. Formal / Elegante sport",
    },
    { key: "description", label: "Descripción", type: "textarea" },
    {
      key: "colors",
      label: "Colores sugeridos (hex separados por coma)",
      type: "text",
      placeholder: "#b98a5e, #f5f0e8, #3d3a36",
      hint: "Escribe códigos hexadecimales separados por coma.",
    },
  ],
  drive: [
    {
      key: "driveUrl",
      label: "URL de Google Drive",
      type: "url",
      hint: "Crea una carpeta en Drive, compártela y pega aquí su enlace.",
    },
    {
      key: "text",
      label: "Mensaje",
      type: "textarea",
      placeholder: "Comparte tus fotos de la boda en nuestro álbum.",
    },
  ],
  footer: [{ key: "text", label: "Texto final", type: "textarea" }],
};

export function emptyBuilderSection(
  type: SectionType,
  position: number,
): BuilderSection {
  return {
    id: `${type}-${position}-${Math.random().toString(36).slice(2, 8)}`,
    type,
    variant: "classic",
    position,
    enabled: true,
    data: type === "gallery" ? { images: [] as string[] } : {},
  };
}

export function buildWeddingFields(state: BuilderPageState) {
  return [
    { key: "title", label: "Título", value: state.title },
    { key: "partner1", label: "Nombre 1", value: state.partner1 },
    { key: "partner2", label: "Nombre 2", value: state.partner2 },
    { key: "eventDate", label: "Fecha de la boda", value: state.eventDate },
    { key: "eventTime", label: "Hora del evento", value: state.eventTime },
    { key: "locationName", label: "Lugar", value: state.locationName },
    { key: "locationAddress", label: "Dirección", value: state.locationAddress },
    { key: "mapsUrl", label: "URL de Google Maps", value: state.mapsUrl },
    { key: "driveUrl", label: "URL de Google Drive", value: state.driveUrl },
  ] as const;
}