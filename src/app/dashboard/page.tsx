import { requireUser } from "@/lib/auth";
import { seedBaseData, weddingsRepo } from "@/lib/data";
import { WeddingCard } from "@/components/weddings/WeddingCard";

export default async function DashboardPage() {
  const user = await requireUser();
  await seedBaseData();
  const weddings = weddingsRepo.findManyByUser(user.id);

  return (
    <div className="flex flex-col gap-8">
      <header className="rounded-2xl bg-neutral-900 px-6 py-6 text-white sm:px-8 sm:py-8">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-400">
          Tu espacio de bodas
        </p>
        <h1 className="mt-2 font-serif text-2xl font-semibold sm:text-3xl">
          Hola, {user.name}
        </h1>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-neutral-300">
          Crea, edita y publica tus páginas de boda, e invita a tus seres
          queridos desde un solo lugar.
        </p>
        <div className="mt-5 flex flex-wrap gap-4 text-center">
          <div className="rounded-xl bg-white/10 px-4 py-2.5">
            <p className="text-xl font-semibold">{weddings.length}</p>
            <p className="text-[11px] uppercase tracking-wide text-neutral-300">
              Bodas
            </p>
          </div>
          <div className="rounded-xl bg-white/10 px-4 py-2.5">
            <p className="text-xl font-semibold">
              {weddings.filter((wedding) => wedding.status === "PUBLISHED").length}
            </p>
            <p className="text-[11px] uppercase tracking-wide text-neutral-300">
              Publicadas
            </p>
          </div>
        </div>
      </header>

      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-serif text-xl font-semibold text-neutral-900">
              Tus bodas
            </h2>
            <p className="text-sm text-neutral-600">
              Crea una página nueva o continúa una existente.
            </p>
          </div>
        </div>

        {weddings.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-neutral-300 px-8 py-12 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-2xl">
              💍
            </div>
            <p className="font-medium text-neutral-700">
              Todavía no tienes bodas
            </p>
            <p className="mx-auto mt-1 max-w-sm text-sm text-neutral-500">
              Crea tu primera página de boda con el botón “Nueva boda”. Después
              invita a tus invitados y sigue sus confirmaciones.
            </p>
          </section>
        ) : (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {weddings.map((wedding) => (
              <WeddingCard key={wedding.id} wedding={wedding} />
            ))}
          </section>
        )}
      </section>
    </div>
  );
}