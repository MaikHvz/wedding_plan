import Link from "next/link";
import type { Wedding } from "@/types";
import { formatDateEs, weddingStatusMeta } from "@/lib/ui/format";

export function WeddingCard({ wedding }: { wedding: Wedding }) {
  const meta = weddingStatusMeta(wedding.status);
  const couples = [wedding.partner1, wedding.partner2]
    .filter(Boolean)
    .join(" & ");

  return (
    <article className="flex flex-col gap-4 rounded-2xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate font-serif text-xl font-semibold text-neutral-900">
            {wedding.title}
          </h3>
          {couples && <p className="mt-0.5 text-sm text-neutral-500">{couples}</p>}
        </div>
        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide ${meta.badge}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
          {meta.label}
        </span>
      </div>

      {wedding.eventDate && (
        <div className="flex items-center gap-2 text-sm text-neutral-600">
          <svg
            viewBox="0 0 20 20"
            fill="currentColor"
            className="h-4 w-4 text-neutral-400"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.75 2a.75.75 0 0 1 .75.75V4h7V2.75a.75.75 0 0 1 1.5 0V4h.5A2.75 2.75 0 0 1 18 6.75v8.5A2.75 2.75 0 0 1 15.25 18H4.75A2.75 2.75 0 0 1 2 15.25v-8.5A2.75 2.75 0 0 1 4.75 4h.5V2.75a.75.75 0 0 1 .75-.75Zm-2.25 5.5v7.75c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25V7.5H3.5Zm3 2.75a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4Zm3.25 0a.75.75 0 0 0-1.5 0v4a.75.75 0 0 0 1.5 0v-4Z"
              clipRule="evenodd"
            />
          </svg>
          <span className="capitalize">{formatDateEs(wedding.eventDate)}</span>
        </div>
      )}

      <p className="text-xs leading-relaxed text-neutral-500">{meta.description}</p>

      <div className="mt-auto flex flex-wrap items-center gap-2 border-t border-neutral-100 pt-4">
        <Link
          href={`/dashboard/bodas/${wedding.id}`}
          className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-medium text-white transition-colors hover:bg-neutral-700"
        >
          {wedding.status === "PUBLISHED" ? "Editar página" : "Continuar"}
        </Link>
        <Link
          href={`/dashboard/bodas/${wedding.id}/invitados`}
          className="rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium transition-colors hover:border-neutral-900"
        >
          Invitados
        </Link>
        {wedding.status === "PUBLISHED" ? (
          <Link
            href={`/w/${wedding.slug}`}
            className="ml-auto rounded-full border border-emerald-200 px-4 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:border-emerald-400"
          >
            Ver pública
          </Link>
        ) : (
          <Link
            href={`/dashboard/bodas/${wedding.id}/checkout`}
            className="ml-auto rounded-full border border-neutral-300 px-4 py-1.5 text-xs font-medium transition-colors hover:border-neutral-900"
          >
            {wedding.status === "PAYMENT_PENDING" ? "Completar pago" : "Publicar"}
          </Link>
        )}
      </div>
    </article>
  );
}