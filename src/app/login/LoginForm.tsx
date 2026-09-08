"use client";

import { useActionState } from "react";
import { authenticate, type LoginState } from "@/app/login/actions";

export function LoginForm({ mode }: { mode: "signin" | "signup" }) {
  const [state, formAction, pending] = useActionState<LoginState | undefined, FormData>(
    authenticate,
    undefined,
  );

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="mode" value={mode} />
      {mode === "signup" && (
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-neutral-700"
          >
            Nombre
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2"
          />
        </div>
      )}
      <div>
        <label
          htmlFor={`${mode}-email`}
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Email
        </label>
        <input
          id={`${mode}-email`}
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
      </div>
      <div>
        <label
          htmlFor={`${mode}-password`}
          className="mb-1 block text-sm font-medium text-neutral-700"
        >
          Contraseña
        </label>
        <input
          id={`${mode}-password`}
          name="password"
          type="password"
          required
          minLength={mode === "signup" ? 8 : undefined}
          className="w-full rounded-lg border border-neutral-300 px-3 py-2"
        />
      </div>

      {state?.message && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-full bg-neutral-900 px-6 py-2.5 text-sm text-white hover:bg-neutral-700 disabled:opacity-50"
      >
        {pending
          ? "Procesando..."
          : mode === "signin"
            ? "Entrar"
            : "Crear mi cuenta"}
      </button>
    </form>
  );
}