import type { WeddingStatus } from "@/types";

function parseDate(value: string): Date | null {
  if (!value) {
    return null;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/** "20 de marzo de 2027" */
export function formatDateEs(value: string | null | undefined): string {
  const date = parseDate(value ?? "");
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** "20 mar 2027" (compacto, para listas) */
export function formatDateShortEs(value: string | null | undefined): string {
  const date = parseDate(value ?? "");
  if (!date) {
    return "";
  }
  return date.toLocaleDateString("es-CL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

interface StatusMeta {
  label: string;
  description: string;
  /** clases Tailwind para el pill de estado */
  badge: string;
  /** color del punto decorativo */
  dot: string;
}

export const WEDDING_STATUS_META: Record<WeddingStatus, StatusMeta> = {
  DRAFT: {
    label: "En construcción",
    description: "Sigue editando tu página cuando quieras.",
    badge: "bg-neutral-100 text-neutral-700",
    dot: "bg-neutral-400",
  },
  READY: {
    label: "Lista para publicar",
    description: "Ya casi terminas: revisa el preview y publica.",
    badge: "bg-sky-100 text-sky-700",
    dot: "bg-sky-500",
  },
  PAYMENT_PENDING: {
    label: "Pago pendiente",
    description: "Completa el pago para publicar tu página.",
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
  },
  PAID: {
    label: "Pagada",
    description: "¡Pago confirmado! Ya puedes publicar.",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  PUBLISHED: {
    label: "Publicada",
    description: "Tu página está en línea para todo el mundo.",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
  },
  EXPIRED: {
    label: "Publicación vencida",
    description: "Renueva la publicación para volver a estar en línea.",
    badge: "bg-amber-100 text-amber-800",
    dot: "bg-amber-500",
  },
  ARCHIVED: {
    label: "Archivada",
    description: "Esta boda está guardada pero fuera de línea.",
    badge: "bg-neutral-200 text-neutral-600",
    dot: "bg-neutral-400",
  },
};

export function weddingStatusMeta(status: WeddingStatus): StatusMeta {
  return WEDDING_STATUS_META[status];
}