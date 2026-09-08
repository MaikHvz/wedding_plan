import Link from "next/link";
import { requireAdmin } from "@/lib/auth/admin";
import { usersRepo } from "@/lib/data";
import { deleteUserAction, setUserRoleAction } from "./actions";

export default async function AdminUsuariosPage() {
  await requireAdmin();
  const users = usersRepo.findAllWithCount();

  return (
    <div>
      <header className="mb-8">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-500">
          Panel de administración
        </p>
        <h1 className="mt-1 font-serif text-3xl font-semibold">Usuarios</h1>
        <p className="mt-2 text-sm text-neutral-600">
          {users.length} usuarios registrados.
        </p>
      </header>

      <div className="overflow-hidden rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-xs uppercase tracking-wide text-neutral-500">
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3 text-right">Bodas</th>
              <th className="px-4 py-3">Registrado</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-3 font-medium">
                  <Link
                    href={`/admin/usuarios/${user.id}`}
                    className="hover:underline"
                  >
                    {user.name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-neutral-600">{user.email}</td>
                <td className="px-4 py-3">
                  <form action={setUserRoleAction.bind(null, user.id, user.role === "admin" ? "user" : "admin")}>
                    <button
                      type="submit"
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium uppercase tracking-wide ${
                        user.role === "admin"
                          ? "bg-neutral-900 text-white"
                          : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                      }`}
                    >
                      {user.role}
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3 text-right text-neutral-600">
                  {user.weddingCount}
                </td>
                <td className="px-4 py-3 text-xs text-neutral-500">
                  {new Date(user.createdAt).toLocaleDateString("es-CL")}
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/usuarios/${user.id}`}
                      className="rounded-full border border-neutral-300 px-3 py-1 text-xs hover:border-neutral-900"
                    >
                      Ver
                    </Link>
                    <form action={deleteUserAction.bind(null, user.id)}>
                      <button
                        type="submit"
                        className="rounded-full border border-red-200 px-3 py-1 text-xs text-red-600 hover:border-red-400"
                      >
                        Eliminar
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="p-8 text-center text-sm text-neutral-500">
            No hay usuarios.
          </p>
        )}
      </div>
    </div>
  );
}