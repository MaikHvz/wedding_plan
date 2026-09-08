"use client";

import { useState } from "react";
import type { Product } from "@/types";

export type ProductFormAction = (formData: FormData) => Promise<void>;

export function ProductForm({
  product,
  action,
  submitLabel,
}: {
  product?: Product;
  action: ProductFormAction;
  submitLabel: string;
}) {
  const [features, setFeatures] = useState(() => {
    if (!product) {
      return "Plantilla profesional\nWeb Builder";
    }
    try {
      const parsed = JSON.parse(product.featuresJson) as unknown;
      return Array.isArray(parsed) ? parsed.join("\n") : "";
    } catch {
      return "";
    }
  });

  return (
    <form
      action={action}
      className="max-w-2xl rounded-xl border border-neutral-200 bg-white p-6"
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          Nombre *
          <input
            name="name"
            required
            defaultValue={product?.name ?? ""}
            placeholder="Plan Esencial"
            className="rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Precio (CLP) *
          <input
            name="price"
            type="number"
            required
            min={0}
            defaultValue={product?.price ?? ""}
            className="rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Moneda
          <input
            name="currency"
            defaultValue={product?.currency ?? "CLP"}
            className="rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Duración (días, opcional)
          <input
            name="durationDays"
            type="number"
            min={0}
            defaultValue={product?.durationDays ?? ""}
            className="rounded-lg border border-neutral-300 px-3 py-2"
          />
        </label>
      </div>

      <label className="mt-4 flex flex-col gap-1 text-sm">
        Descripción
        <textarea
          name="description"
          rows={2}
          defaultValue={product?.description ?? ""}
          className="rounded-lg border border-neutral-300 px-3 py-2"
        />
      </label>

      <label className="mt-4 flex flex-col gap-1 text-sm">
        Features (una por línea)
        <textarea
          name="featuresJson"
          rows={6}
          value={features}
          onChange={(event) => setFeatures(event.target.value)}
          className="rounded-lg border border-neutral-300 px-3 py-2 font-mono text-xs"
        />
      </label>

      <label className="mt-4 flex items-center gap-2 text-sm">
        <input
          name="active"
          type="checkbox"
          defaultChecked={product?.active ?? true}
          className="h-4 w-4"
        />
        Producto activo (visible en el checkout)
      </label>

      <button
        type="submit"
        className="mt-6 rounded-full bg-neutral-900 px-6 py-2 text-sm text-white hover:bg-neutral-700"
      >
        {submitLabel}
      </button>
    </form>
  );
}