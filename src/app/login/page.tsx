import Link from "next/link";
import type { Metadata } from "next";
import { seedBaseData } from "@/lib/data";
import { LoginForm } from "./LoginForm";

export const metadata: Metadata = {
  title: "Inicia sesión",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  await seedBaseData();
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col justify-center gap-10 px-6 py-16 md:flex-row">
      <Link href="/" className="text-sm text-neutral-500 hover:underline">
        ← Volver
      </Link>
      <section className="flex-1 rounded-2xl border border-neutral-200 p-6">
        <h1 className="font-serif text-xl font-semibold">Inicia sesión</h1>
        <p className="mt-1 mb-5 text-sm text-neutral-600">
          Continúa con tus bodas guardadas.
        </p>
        <LoginForm mode="signin" />
      </section>

      <section className="flex-1 rounded-2xl border border-neutral-200 p-6">
        <h1 className="font-serif text-xl font-semibold">Crea tu cuenta gratis</h1>
        <p className="mt-1 mb-5 text-sm text-neutral-600">
          Empieza tu página de boda sin pagar nada.
        </p>
        <LoginForm mode="signup" />
      </section>
    </main>
  );
}