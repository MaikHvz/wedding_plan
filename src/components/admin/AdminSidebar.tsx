import Link from "next/link";
import { logoutAction } from "@/app/dashboard/actions";
import { APP_NAME } from "@/config/app";

const NAV = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/usuarios", label: "Usuarios" },
  { href: "/admin/bodas", label: "Bodas" },
  { href: "/admin/plantillas", label: "Plantillas" },
  { href: "/admin/productos", label: "Productos" },
  { href: "/admin/ordenes", label: "Órdenes" },
  { href: "/admin/publicaciones", label: "Publicaciones" },
];

export function AdminSidebar() {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-neutral-200 bg-white">
      <div className="border-b border-neutral-200 px-5 py-4">
        <p className="text-xs uppercase tracking-[0.3em] text-neutral-500">
          Admin
        </p>
        <p className="mt-1 font-serif text-lg font-semibold">
          {APP_NAME}
        </p>
      </div>
      <nav className="flex flex-1 flex-col gap-1 p-3">
        {NAV.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="rounded-lg px-3 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="border-t border-neutral-200 p-3">
        <form action={logoutAction}>
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-left text-sm text-neutral-600 hover:bg-neutral-100"
          >
            Cerrar sesión
          </button>
        </form>
      </div>
    </aside>
  );
}
