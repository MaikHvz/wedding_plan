import "server-only";

import type { Order, Product } from "@/types";
import { ordersRepo, productsRepo } from "@/lib/data";

/**
 * Capa de pagos (ADR-007).
 *
 * Mientras no haya despliegue NO existe pasarela de pago por API. Todo el
 * procesamiento es local, simulando pagos exitosos vía este módulo. La pasarela
 * real (API + webhooks) se integrará solo tras el despliegue, manteniendo la
 * regla de seguridad de que el backend controla la publicación.
 */

export const PAYMENT_PROVIDER_SIMULATED = "simulated";
export const PAYMENT_PROVIDER_REAL = "real";

export interface PaymentProvider {
  /** Crea la referencia de pago externa y devuelve su identificador. */
  createPaymentReference(order: Order): Promise<string>;
  /** Verifica que un pago fue confirmado por el proveedor. */
  isPaymentConfirmed(
    providerReference: string,
    amount: number,
    currency: string,
  ): Promise<boolean>;
}

export class PaymentsError extends Error {
  constructor(
    message: string,
    readonly code:
      | "PRODUCT_NOT_FOUND"
      | "ORDER_NOT_FOUND"
      | "PAYMENT_MISMATCH"
      | "ALREADY_PAID",
  ) {
    super(message);
    this.name = "PaymentsError";
  }
}

export async function createOrder(input: {
  userId: string;
  weddingId: string;
  productId: string;
  provider?: string;
}): Promise<Order> {
  const product = productsRepo.findById(input.productId);
  if (!product) {
    throw new PaymentsError("Producto no encontrado", "PRODUCT_NOT_FOUND");
  }
  return ordersRepo.create({
    userId: input.userId,
    weddingId: input.weddingId,
    productId: product.id,
    provider: input.provider ?? PAYMENT_PROVIDER_SIMULATED,
    amount: product.price,
    currency: product.currency,
  });
}

/**
 * Simulación local de pago exitoso (MVP sin pasarela).
 * Sustituir por la pasarela real + webhook verificado al desplegar.
 */
export async function simulateSuccessfulPayment(orderId: string): Promise<Order> {
  const order = ordersRepo.findById(orderId);
  if (!order) {
    throw new PaymentsError("Orden no encontrada", "ORDER_NOT_FOUND");
  }
  if (order.status === "PAID") {
    throw new PaymentsError("La orden ya está pagada", "ALREADY_PAID");
  }
  return ordersRepo.setStatus(order.id, "PAID");
}

export async function getActiveProducts(): Promise<Product[]> {
  return productsRepo.findActive();
}