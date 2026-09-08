import type { ReactNode } from "react";

/**
 * BrowserFrame — envoltorio "mockup de navegador" para las miniaturas de
 * plantillas (m05). Da contexto inmediato de "esto es un sitio web real"
 * en vez de una imagen suelta, y sirve de superficie para el hover
 * (elevación + zoom) que hace sentir las tarjetas del catálogo vivas.
 */
export function BrowserFrame({
  children,
  url = "tuboda.cl/w/tu-nombre",
}: {
  children: ReactNode;
  url?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl bg-white ring-1 ring-black/10 transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl group-hover:ring-black/15">
      <div className="flex items-center gap-3 border-b border-black/5 bg-neutral-50 px-3 py-2">
        <span className="flex gap-1.5">
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
          <span className="h-2 w-2 rounded-full bg-neutral-300" />
        </span>
        <span className="flex-1 truncate rounded-full bg-white px-2.5 py-0.5 text-center text-[10px] text-neutral-400 ring-1 ring-black/5">
          {url}
        </span>
      </div>
      <div className="overflow-hidden transition-transform duration-500 group-hover:scale-[1.03]">
        {children}
      </div>
    </div>
  );
}
