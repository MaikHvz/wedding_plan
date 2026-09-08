"use server";

import { redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { seedBaseData, weddingsRepo } from "@/lib/data";
import {
  createOrder,
  PAYMENT_PROVIDER_SIMULATED,
  simulateSuccessfulPayment,
} from "@/lib/payments";
import { publishWeddingAfterPaid } from "@/lib/wedding/publish";

/**
 * Checkout local (ADR-007): el "pago" se simula en el backend (sin pasarela).
 * La publicación NUNCA se activa desde el frontend: este server action
 * orquesta backend → validación → Order=PAID → Wedding=PUBLISHED (ADR-004).
 */
export async function completeCheckoutAction(formData: FormData): Promise<void> {
  const weddingId = String(formData.get("weddingId") ?? "");
  const productId = String(formData.get("productId") ?? "");
  const user = await requireUser();
  await seedBaseData();

  const wedding = weddingsRepo.findById(weddingId);
  if (!wedding || wedding.userId !== user.id) {
    redirect("/dashboard");
  }
  if (wedding.status === "PUBLISHED") {
    redirect(`/w/${wedding.slug}`);
  }

  const order = await createOrder({
    userId: user.id,
    weddingId: wedding.id,
    productId,
    provider: PAYMENT_PROVIDER_SIMULATED,
  });

  // Valida orden existente y no pagada; marca el pago como confirmado (simulado).
  await simulateSuccessfulPayment(order.id);

  // Backend controla la publicación tras el pago confirmado.
  const { slug } = publishWeddingAfterPaid(wedding.id);
  redirect(`/w/${slug}`);
}