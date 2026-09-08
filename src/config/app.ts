import type { Product } from "@/types";
import { getTemplateConfig, getTheme } from "@/lib/templates";

export const CURRENCY = "CLP";

export const DEFAULT_PRODUCTS: Array<Omit<Product, "id">> = [
  {
    name: "Publicar tu página",
    description:
      "Página de boda con plantilla, personalización, fotografías, galería, countdown, ubicación, Google Maps, Google Drive, gestión de invitados con RSVP e invitaciones digitales.",
    price: 29990,
    currency: CURRENCY,
    durationDays: 365,
    featuresJson: JSON.stringify([
      "Plantilla profesional",
      "Web Builder",
      "Personalización de contenido",
      "Galería de fotografías",
      "Countdown",
      "Ubicación + Google Maps",
      "Google Drive",
      "Gestión de invitados + RSVP",
      "Invitaciones digitales",
      "Publicación 12 meses",
    ]),
    active: true,
  },
];

export const SECTION_ORDER = [
  "hero",
  "couple",
  "story",
  "gallery",
  "countdown",
  "event",
  "dresscode",
  "location",
  "drive",
  "footer",
] as const;

export const APP_NAME = "Web de Boda";
export const PUBLIC_WEDDING_PATH = "/w";

/** URL absoluta base del sitio (para enlaces dentro de los correos). */
export const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

/**
 * Remitente de los correos transaccionales. La capa `lib/email` no gestiona
 * ningún proveedor aún (plan §66): todo se registra por consola hasta que se
 * integre un proveedor real al desplegar.
 */
export const EMAIL_FROM = process.env.EMAIL_FROM ?? "no-reply@webdeboda.cl";
export const EMAIL_PROVIDER = process.env.EMAIL_PROVIDER ?? "console";

/** Email del administrador inicial sembrado automáticamente al iniciar. */
export const ADMIN_EMAIL = "admin@webdeboda.cl";
/** Password inicial del admin. Sobreescribir con env `ADMIN_PASSWORD`. */
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";
export const ADMIN_NAME = "Administrador";

/**
 * Música de ambiente por defecto para las páginas de boda (CC0/público
 * dominio, hospedada en archive.org). Cada plantilla puede sobreescribirla
 * con su propia `musicUrl`. Vacío ⇒ sin música.
 */
export const DEFAULT_WEDDING_MUSIC =
  "https://archive.org/download/ClairDeLune_2022/Clair-De-Lune.mp3";

/** Tema por defecto (Ivory Elegance), tomado del sistema de temas del engine. */
export const DEFAULT_THEME = getTheme("ivory") ?? {
  id: "ivory",
  name: "Ivory Elegance",
  tokens: {
    "t-bg": "#faf7f2",
    "t-surface": "#ffffff",
    "t-text": "#3d3a36",
    "t-muted": "#8a8377",
    "t-accent": "#b98a5e",
    "t-accent-soft": "#e9d9c8",
    "t-border": "rgba(61, 58, 54, 0.14)",
    "t-radius": "0.75rem",
    "t-spacing": "6rem",
    "t-cta-bg": "#3d3a36",
    "t-cta-text": "#ffffff",
  },
};

/** Plantilla por defecto (Elegance), tomada del registro del Template Engine. */
export const DEFAULT_TEMPLATE =
  getTemplateConfig("elegance") ?? {
    id: "elegance",
    slug: "elegance",
    name: "Elegance",
    description: "Plantilla elegante por defecto.",
    category: "Elegante",
    version: 1,
    themeId: "ivory",
    sections: SECTION_ORDER.map((type) => ({ type, variant: "classic" })),
  };