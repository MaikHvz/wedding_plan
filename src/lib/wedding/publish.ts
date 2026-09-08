import "server-only";

import type { WeddingStatus } from "@/types";
import { ordersRepo, productsRepo, publicationsRepo, weddingsRepo } from "@/lib/data";

/**
 * Máquina de estados de la boda y publicación controlada por backend (m07).
 *
 * Regla ADR-004: la publicación se activa SOLO desde el backend cuando existe
 * un pago confirmado (orden PAID). El frontend jamás "publica" ni envía paid=true.
 */

const ALLOWED_TRANSITIONS: Record<WeddingStatus, readonly WeddingStatus[]> = {
  DRAFT: ["READY", "PAYMENT_PENDING", "PAID", "ARCHIVED"],
  READY: ["PAYMENT_PENDING", "PAID", "DRAFT", "ARCHIVED"],
  PAYMENT_PENDING: ["PAID", "DRAFT", "ARCHIVED"],
  PAID: ["PUBLISHED", "ARCHIVED"],
  PUBLISHED: ["PUBLISHED", "EXPIRED", "ARCHIVED"],
  EXPIRED: ["PAYMENT_PENDING", "PAID", "ARCHIVED"],
  ARCHIVED: [],
};

export class PublishError extends Error {
  constructor(
    message: string,
    readonly code:
      | "ORDER_NOT_FOUND"
      | "NOT_PAID"
      | "INVALID_TRANSITION"
      | "WEDDING_NOT_FOUND",
  ) {
    super(message);
    this.name = "PublishError";
  }
}

export function canTransition(from: WeddingStatus, to: WeddingStatus): boolean {
  return from === to || ALLOWED_TRANSITIONS[from].includes(to);
}

/** Aplica una transición de estado (lanza si no está permitida). */
export function transitionWeddingStatus(
  weddingId: string,
  to: WeddingStatus,
): void {
  const wedding = weddingsRepo.findById(weddingId);
  if (!wedding) {
    throw new PublishError("Boda no encontrada", "WEDDING_NOT_FOUND");
  }
  if (!canTransition(wedding.status, to)) {
    throw new PublishError(
      `Transición inválida: ${wedding.status} → ${to}`,
      "INVALID_TRANSITION",
    );
  }
  weddingsRepo.setStatus(weddingId, to);
}

/** Publica una boda en `/w/<slug>` después de que el backend confirmó un pago.
 * Idempotente: si ya está PUBLISHED devuelve el estado actual.
 * Fuente de verdad: debe existir una orden PAID asociada a la boda.
 */
export function publishWeddingAfterPaid(weddingId: string): { slug: string } {
  const wedding = weddingsRepo.findById(weddingId);
  if (!wedding) {
    throw new PublishError("Boda no encontrada", "WEDDING_NOT_FOUND");
  }
  if (wedding.status === "PUBLISHED") {
    return { slug: wedding.slug };
  }

  const paid = ordersRepo
    .findManyByWedding(weddingId)
    .find((order) => order.status === "PAID");
  if (!paid) {
    throw new PublishError(
      "No existe un pago confirmado para publicar esta boda",
      "NOT_PAID",
    );
  }

  // Backend confirma el pago → estado PAID → publicación
  if (wedding.status !== "PAID") {
    transitionWeddingStatus(weddingId, "PAID");
  }
  transitionWeddingStatus(weddingId, "PUBLISHED");

  const nowIso = new Date().toISOString();
  const product = productsRepo.findById(paid.productId);
  const durationDays = product?.durationDays ?? 365;
  const expiresAt = new Date(Date.now() + durationDays * 86_400_000).toISOString();

  const existing = publicationsRepo.findManyByWedding(weddingId)[0];
  if (existing) {
    publicationsRepo.update(existing.id, {
      status: "PUBLISHED",
      publishedAt: nowIso,
      expiresAt,
    });
  } else {
    publicationsRepo.create({
      weddingId,
      slug: wedding.slug,
      status: "PUBLISHED",
      publishedAt: nowIso,
      expiresAt,
    });
  }

  return { slug: wedding.slug };
}

/** Expira una boda PUBLISHED cuya publicación venció (`expiresAt`).
 * Devuelve `true` si aplicó la expiración. El paso del tiempo es backend:
 * esta función se llama desde las rutas de lectura para no confiar en el cliente.
 */
export function applyExpiryIfDue(weddingId: string): boolean {
  const wedding = weddingsRepo.findById(weddingId);
  if (!wedding || wedding.status !== "PUBLISHED") return false;

  const publication = publicationsRepo.findManyByWedding(weddingId)[0];
  if (!publication) return false;
  const expiresAt =
    publication.expiresAt ?? wedding.expiresAt ?? publication.publishedAt;
  if (!expiresAt) return false;

  if (Date.parse(expiresAt) > Date.now()) return false;

  transitionWeddingStatus(weddingId, "EXPIRED");
  if (publication.status !== "EXPIRED") {
    publicationsRepo.update(publication.id, { status: "EXPIRED" });
  }
  return true;
}