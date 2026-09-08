export type Id = string;

export type UserRole = "user" | "admin";

export interface Profile {
  id: Id;
  email: string;
  name: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export type WeddingStatus =
  | "DRAFT"
  | "READY"
  | "PAYMENT_PENDING"
  | "PAID"
  | "PUBLISHED"
  | "EXPIRED"
  | "ARCHIVED";

export interface Wedding {
  id: Id;
  userId: Id;
  title: string;
  partner1: string;
  partner2: string;
  eventDate: string | null;
  eventTime: string | null;
  locationName: string | null;
  locationAddress: string | null;
  mapsUrl: string | null;
  driveUrl: string | null;
  slug: string;
  status: WeddingStatus;
  templateId: string;
  templateVersion: number;
  themeJson: string | null;
  /** Cupo máximo de invitados confirmados (0 = sin límite). */
  maxGuests: number;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  expiresAt: string | null;
}

export type SectionType =
  | "hero"
  | "couple"
  | "story"
  | "gallery"
  | "countdown"
  | "event"
  | "dresscode"
  | "location"
  | "drive"
  | "footer";

export interface WeddingSection {
  id: Id;
  weddingId: Id;
  type: SectionType;
  variant: string;
  position: number;
  enabled: boolean;
  dataJson: string;
  createdAt: string;
  updatedAt: string;
}

export interface WeddingMedia {
  id: Id;
  weddingId: Id;
  storagePath: string;
  altText: string;
  position: number;
  createdAt: string;
}

export interface Template {
  id: Id;
  slug: string;
  name: string;
  description: string;
  category: string;
  previewUrl: string | null;
  configJson: string;
  version: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | "PENDING"
  | "PAID"
  | "FAILED"
  | "REFUNDED"
  | "CANCELLED";

export interface Product {
  id: Id;
  name: string;
  description: string;
  price: number;
  currency: string;
  durationDays: number | null;
  featuresJson: string;
  active: boolean;
}

export interface Order {
  id: Id;
  userId: Id;
  weddingId: Id;
  productId: Id;
  provider: string;
  providerReference: string | null;
  amount: number;
  currency: string;
  status: OrderStatus;
  createdAt: string;
  paidAt: string | null;
}

export interface Publication {
  id: Id;
  weddingId: Id;
  slug: string;
  status: WeddingStatus;
  publishedAt: string | null;
  expiresAt: string | null;
}

export interface Session {
  id: Id;
  userId: Id;
  token: string;
  expiresAt: string;
  createdAt: string;
}

export interface SessionUser {
  profile: Profile;
  session: Session;
}

/** Datos tipados por tipo de sección (sin `undefined` para no renderizar). */
export interface SectionDataMap {
  hero: {
    title?: string;
    subtitle?: string;
    partner1?: string;
    partner2?: string;
    date?: string;
    image?: string;
  };
  couple: {
    image1?: string;
    image2?: string;
    name1?: string;
    name2?: string;
    description?: string;
  };
  story: {
    title?: string;
    content?: string;
    image?: string;
  };
  gallery: {
    images?: string[];
  };
  countdown: Record<string, never>;
  event: {
    title?: string;
    date?: string;
    time?: string;
    place?: string;
    address?: string;
  };
  dresscode: {
    title?: string;
    description?: string;
    /** Colores sugeridos como muestras (hex). */
    colors?: string[];
    /** Código de vestimenta (ej. "Formal", "Elegante sport"). */
    code?: string;
  };
  location: {
    place?: string;
    address?: string;
    mapsUrl?: string;
  };
  drive: {
    driveUrl?: string;
    text?: string;
  };
  footer: {
    text?: string;
  };
}

/** Tokens de diseño del tema (colores, fuentes, radios, espaciado). */
export type ThemeTokens = Record<string, string>;

export interface Theme {
  id: string;
  name: string;
  tokens: ThemeTokens;
}

/** Configuración de una plantilla definida por el Template Engine (m03). */
export interface TemplateConfig {
  /** Identificador corto de la plantilla (ej. "elegance"). */
  id: string;
  /** Slug de la plantilla (ruta/fila en la tabla templates). */
  slug: string;
  name: string;
  description: string;
  category: string;
  version: number;
  /** ID del tema base que aplica la plantilla por defecto. */
  themeId: string;
  /** Temas sugeridos para la tarjeta del catálogo (swatches de color).
   * Si se omite, el catálogo ofrece todos los temas del sistema. */
  suggestedThemeIds?: string[];
  sections: Array<{ type: SectionType; variant: string }>;
  /** URL de preview (imagen) de la plantilla, si existe. */
  previewUrl?: string;
  /** URL de la música de ambiente (audio mp3/ogg) de la plantilla. */
  musicUrl?: string;
}

// ─────────────────────────────────────────────────────────────────────────
// Invitados, invitaciones y RSVP (m09)
// ─────────────────────────────────────────────────────────────────────────

/**
 * Estado de un invitado. `INVITED` = creado; `SENT` = correo enviado;
 * `ACCEPTED`/`DECLINED` = respondió el RSVP (Sí/No).
 */
export type GuestStatus =
  | "INVITED"
  | "SENT"
  | "ACCEPTED"
  | "DECLINED";

export type RsvpAttendance = "yes" | "no";

export interface Guest {
  id: Id;
  weddingId: Id;
  name: string;
  email: string;
  phone: string | null;
  groupName: string | null;
  status: GuestStatus;
  /** Quién agregó al invitado (permite agrupar por el usuario invitador). */
  createdBy: Id;
  createdAt: string;
  updatedAt: string;
}

export type InvitationStatus = "PENDING" | "SENT";

export interface Invitation {
  id: Id;
  weddingId: Id;
  guestId: Id;
  token: string;
  status: InvitationStatus;
  sentAt: string | null;
  openedAt: string | null;
  createdAt: string;
}

export interface RsvpResponse {
  id: Id;
  guestId: Id;
  /** "yes" = asistiré, "no" = no podré asistir. */
  attendance: RsvpAttendance;
  /** Nombres de los acompañantes que van con el invitado. */
  companions: string[];
  message: string | null;
  createdAt: string;
  updatedAt: string;
}