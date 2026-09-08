"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { RsvpAttendance } from "@/types";
import {
  addGuestAction,
  deleteGuestAction,
  sendAllInvitationsAction,
  sendOneInvitationAction,
  setMaxGuestsAction,
  updateGuestAction,
} from "@/app/dashboard/bodas/[id]/invitados/actions";
import type { GuestActionResult } from "@/app/dashboard/bodas/[id]/invitados/actions";
import { formatDateShortEs } from "@/lib/ui/format";

/* ─── Types ─────────────────────────────────────────────── */

export interface GuestManagerGuest {
  id: string;
  name: string;
  email: string;
  groupName: string | null;
  status: string;
  createdBy: string;
  inviteUrl: string | null;
  sentAt: string | null;
  attended: boolean;
  attendance: RsvpAttendance | null;
  companions: string[];
  partySize: number;
}

export interface GuestManagerProps {
  weddingId: string;
  weddingTitle: string;
  inviters: Record<string, { id: string; name: string; email: string }>;
  guests: GuestManagerGuest[];
  maxGuests: number;
  capacity: {
    confirmed: number;
    declined: number;
    pending: number;
    totalGuests: number;
    remaining: number | null;
  };
}

/* ─── Helpers ───────────────────────────────────────────── */

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase();
}

const STATUS_META: Record<
  string,
  { label: string; dot: string; badge: string; bg: string }
> = {
  ACCEPTED: {
    label: "Asiste",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-600/10",
    bg: "bg-emerald-50",
  },
  DECLINED: {
    label: "No asiste",
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 ring-rose-600/10",
    bg: "bg-rose-50",
  },
  SENT: {
    label: "Invitado",
    dot: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700 ring-sky-600/10",
    bg: "bg-sky-50",
  },
  INVITED: {
    label: "Pendiente",
    dot: "bg-neutral-400",
    badge: "bg-neutral-100 text-neutral-600 ring-neutral-500/10",
    bg: "bg-neutral-50",
  },
};

function initialsColor(name: string): string {
  const palette = [
    "bg-rose-100 text-rose-700",
    "bg-sky-100 text-sky-700",
    "bg-emerald-100 text-emerald-700",
    "bg-amber-100 text-amber-800",
    "bg-violet-100 text-violet-700",
    "bg-teal-100 text-teal-700",
    "bg-pink-100 text-pink-700",
    "bg-indigo-100 text-indigo-700",
  ];
  let sum = 0;
  for (const char of name) sum += char.charCodeAt(0);
  return palette[sum % palette.length];
}

/* ─── Tiny UI atoms ─────────────────────────────────────── */

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? STATUS_META.INVITED;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ring-1 ring-inset ${meta.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}

function Avatar({ name, size = "md" }: { name: string; size?: "sm" | "md" }) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-xs" : "h-10 w-10 text-sm";
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-semibold ${sizeClass} ${initialsColor(name)}`}
      aria-hidden="true"
    >
      {initialsOf(name)}
    </span>
  );
}

/* ─── Slide-over panel ──────────────────────────────────── */

function SlideOver({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div
        ref={panelRef}
        className="relative flex h-full w-full max-w-lg flex-col bg-white shadow-2xl animate-slide-in-right"
      >
        <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
          <h2 className="font-serif text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
          >
            <XIcon />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-6 py-5">{children}</div>
      </div>
    </div>
  );
}

/* ─── Confirm dialog ────────────────────────────────────── */

function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  variant = "danger",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  variant?: "danger" | "primary";
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl animate-scale-in">
        <h3 className="font-serif text-lg font-semibold text-neutral-900">
          {title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-xl border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`rounded-xl px-4 py-2 text-sm font-medium text-white transition-colors ${
              variant === "danger"
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-neutral-900 hover:bg-neutral-800"
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Guest form (shared add/edit) ──────────────────────── */

function GuestForm({
  defaultName,
  defaultEmail,
  defaultGroup,
  submitLabel,
  busy,
  busyLabel,
  onSubmit,
}: {
  defaultName?: string;
  defaultEmail?: string;
  defaultGroup?: string;
  submitLabel: string;
  busy: boolean;
  busyLabel: string;
  onSubmit: (data: { name: string; email: string; groupName: string }) => void;
}) {
  const [name, setName] = useState(defaultName ?? "");
  const [email, setEmail] = useState(defaultEmail ?? "");
  const [group, setGroup] = useState(defaultGroup ?? "");

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({ name: name.trim(), email: email.trim(), groupName: group.trim() });
      }}
    >
      <div>
        <label
          htmlFor="gf-name"
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          Nombre completo <span className="text-rose-500">*</span>
        </label>
        <input
          id="gf-name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="María José"
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5"
        />
      </div>
      <div>
        <label
          htmlFor="gf-email"
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          Correo electrónico <span className="text-rose-500">*</span>
        </label>
        <input
          id="gf-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="correo@ejemplo.cl"
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5"
        />
      </div>
      <div>
        <label
          htmlFor="gf-group"
          className="mb-1.5 block text-sm font-medium text-neutral-700"
        >
          Grupo
          <span className="ml-1 text-neutral-400 font-normal">(opcional)</span>
        </label>
        <input
          id="gf-group"
          value={group}
          onChange={(e) => setGroup(e.target.value)}
          placeholder="Ej. Familia de la novia"
          className="w-full rounded-xl border border-neutral-300 bg-white px-4 py-2.5 text-sm outline-none transition-all focus:border-neutral-900 focus:ring-2 focus:ring-neutral-900/5"
        />
      </div>
      <button
        type="submit"
        disabled={busy}
        className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
      >
        {busy ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            {busyLabel}
          </>
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}

/* ─── Capacity ring (SVG arc) ───────────────────────────── */

function CapacityRing({
  confirmed,
  max,
}: {
  confirmed: number;
  max: number;
}) {
  const pct = Math.min(100, Math.round((confirmed / max) * 100));
  const r = 38;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const color =
    pct >= 100
      ? "text-rose-500"
      : pct >= 80
        ? "text-amber-500"
        : "text-emerald-500";

  return (
    <div className="relative flex items-center justify-center">
      <svg width="100" height="100" className="-rotate-90">
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          className="stroke-neutral-100"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={r}
          fill="none"
          className={`${color} transition-all duration-700 ease-out`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-xl font-bold text-neutral-900">{pct}%</span>
        <span className="text-[10px] font-medium text-neutral-500">
          capacidad
        </span>
      </div>
    </div>
  );
}

/* ─── Toast ─────────────────────────────────────────────── */

function Toast({
  notice,
  onDismiss,
}: {
  notice: { ok: boolean; text: string };
  onDismiss: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 4500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-xl border px-4 py-3 shadow-lg animate-slide-up ${
        notice.ok
          ? "border-emerald-200 bg-white text-emerald-800"
          : "border-rose-200 bg-white text-rose-800"
      }`}
      role="status"
    >
      <span className="mt-0.5 shrink-0">
        {notice.ok ? <CheckCircleIcon /> : <ErrorCircleIcon />}
      </span>
      <p className="flex-1 text-sm leading-snug">{notice.text}</p>
      <button
        type="button"
        onClick={onDismiss}
        className="shrink-0 rounded p-0.5 text-neutral-400 transition-colors hover:text-neutral-600"
      >
        <XIcon />
      </button>
    </div>
  );
}

/* ─── Empty state ───────────────────────────────────────── */

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50/50 px-8 py-16 text-center">
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-neutral-100">
        <GuestsBigIcon />
      </div>
      <h3 className="font-serif text-xl font-semibold text-neutral-900">
        Sin invitados aún
      </h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-neutral-500">
        Comienza agregando a las personas que quieres invitar a tu boda.
        Podrás enviarles su invitación por correo o compartir el enlace
        directamente.
      </p>
      <button
        type="button"
        onClick={onAdd}
        className="mt-6 flex items-center gap-2 rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
      >
        <PlusIcon />
        Agregar primer invitado
      </button>
    </div>
  );
}

/* ─── Main component ────────────────────────────────────── */

export function GuestManager({
  weddingId,
  weddingTitle,
  inviters,
  guests,
  maxGuests,
  capacity,
}: GuestManagerProps) {
  const router = useRouter();
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<{
    ok: boolean;
    text: string;
  } | null>(null);

  /* Panel / dialog state */
  const [addOpen, setAddOpen] = useState(false);
  const [editingGuest, setEditingGuest] = useState<GuestManagerGuest | null>(
    null,
  );
  const [deletingGuest, setDeletingGuest] = useState<GuestManagerGuest | null>(
    null,
  );

  /* Filters & search */
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [groupFilter, setGroupFilter] = useState<string>("ALL");

  /* Bulk selection */
  const [selected, setSelected] = useState<Set<string>>(new Set());

  /* ── Derived data ── */

  const allGroups = useMemo(() => {
    const set = new Set<string>();
    for (const g of guests) {
      if (g.groupName) set.add(g.groupName);
    }
    return Array.from(set).sort();
  }, [guests]);

  const filtered = useMemo(() => {
    let list = guests;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.name.toLowerCase().includes(q) ||
          g.email.toLowerCase().includes(q) ||
          g.groupName?.toLowerCase().includes(q),
      );
    }

    if (statusFilter !== "ALL") {
      list = list.filter((g) => g.status === statusFilter);
    }

    if (groupFilter !== "ALL") {
      list = list.filter((g) => g.groupName === groupFilter);
    }

    return list;
  }, [guests, search, statusFilter, groupFilter]);

  const pendingCount = guests.filter((g) => !g.sentAt).length;
  const limited = maxGuests > 0;
  const confirmed = capacity.confirmed;

  const allSelected =
    filtered.length > 0 && filtered.every((g) => selected.has(g.id));

  /* ── Actions ── */

  async function run(
    key: string,
    action: (
      prev: GuestActionResult | null,
      formData: FormData,
    ) => Promise<GuestActionResult>,
    formData: FormData,
  ) {
    setBusy(key);
    setNotice(null);
    const result = await action(null, formData);
    setBusy(null);
    setNotice({
      ok: result.ok,
      text: result.error ?? result.info ?? (result.ok ? "Listo." : ""),
    });
    if (result.ok) {
      setAddOpen(false);
      setEditingGuest(null);
      router.refresh();
    }
  }

  const handleAdd = async (data: { name: string; email: string; groupName: string }) => {
    const fd = new FormData();
    fd.set("weddingId", weddingId);
    fd.set("name", data.name);
    fd.set("email", data.email);
    fd.set("groupName", data.groupName);
    await run("add", addGuestAction, fd);
  };

  const handleEdit = async (data: { name: string; email: string; groupName: string }) => {
    if (!editingGuest) return;
    const fd = new FormData();
    fd.set("weddingId", weddingId);
    fd.set("guestId", editingGuest.id);
    fd.set("name", data.name);
    fd.set("email", data.email);
    fd.set("groupName", data.groupName);
    await run(`edit-${editingGuest.id}`, updateGuestAction, fd);
  };

  const handleDelete = async () => {
    if (!deletingGuest) return;
    const fd = new FormData();
    fd.set("weddingId", weddingId);
    fd.set("guestId", deletingGuest.id);
    await run(`del-${deletingGuest.id}`, deleteGuestAction, fd);
    setDeletingGuest(null);
  };

  async function copyInvite(url: string, name: string) {
    try {
      await navigator.clipboard.writeText(url);
      setNotice({
        ok: true,
        text: `Enlace de ${name} copiado al portapapeles.`,
      });
    } catch {
      setNotice({ ok: false, text: "No se pudo copiar. Intenta de nuevo." });
    }
  }

  async function sendOne(guestId: string) {
    const fd = new FormData();
    fd.set("weddingId", weddingId);
    fd.set("guestId", guestId);
    await run(`send-${guestId}`, sendOneInvitationAction, fd);
  }

  async function sendAll() {
    const fd = new FormData();
    fd.set("weddingId", weddingId);
    await run("sendAll", sendAllInvitationsAction, fd);
  }

  function toggleSelectAll() {
    if (allSelected) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((g) => g.id)));
    }
  }

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function bulkSend() {
    setBusy("bulkSend");
    setNotice(null);
    let sent = 0;
    for (const id of selected) {
      const guest = guests.find((g) => g.id === id);
      if (guest && !guest.sentAt) {
        const fd = new FormData();
        fd.set("weddingId", weddingId);
        fd.set("guestId", id);
        const result = await sendOneInvitationAction(null, fd);
        if (result.ok) sent++;
      }
    }
    setBusy(null);
    setNotice({
      ok: true,
      text: sent > 0
        ? `Se enviaron ${sent} invitacion${sent === 1 ? "" : "es"}.`
        : "Los invitados seleccionados ya tenían correo enviado.",
    });
    setSelected(new Set());
    router.refresh();
  }

  /* ── Render ── */

  return (
    <div className="flex flex-col gap-6">
      {/* Toast */}
      {notice && (
        <Toast notice={notice} onDismiss={() => setNotice(null)} />
      )}

      {/* ── Capacity dashboard card ── */}
      <section className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-8">
          {/* Left: ring + text */}
          <div className="flex items-center gap-5">
            {limited && (
              <CapacityRing confirmed={confirmed} max={maxGuests} />
            )}
            <div>
              <h2 className="font-serif text-xl font-semibold text-neutral-900">
                Resumen de invitados
              </h2>
              <p className="mt-1 text-sm text-neutral-600">
                {limited
                  ? `${confirmed} de ${maxGuests} lugares confirmados.`
                  : "Sin cupo fijo: todos pueden confirmar."}
              </p>
              {limited && capacity.remaining !== null && (
                <p className="mt-1 text-xs text-neutral-500">
                  {capacity.remaining === 0
                    ? "Cupo completo"
                    : `Restan ${capacity.remaining} lugar${capacity.remaining === 1 ? "" : "es"}`}
                </p>
              )}
            </div>
          </div>

          {/* Center: metric cards */}
          <div className="flex flex-1 flex-wrap gap-3">
            <MetricCard
              value={guests.length}
              label="Total"
              icon={<UsersIcon />}
              color="neutral"
            />
            <MetricCard
              value={confirmed}
              label="Confirmados"
              icon={<CheckIcon />}
              color="emerald"
            />
            <MetricCard
              value={capacity.pending}
              label="Pendientes"
              icon={<ClockIcon />}
              color="amber"
            />
            <MetricCard
              value={capacity.declined}
              label="Declinan"
              icon={<XMarkIcon />}
              color="rose"
            />
          </div>

          {/* Right: max guests form */}
          <form
            className="shrink-0"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);
              formData.set("weddingId", weddingId);
              run("max", setMaxGuestsAction, formData);
            }}
          >
            <label className="mb-1 block text-xs font-medium text-neutral-500">
              Cupo máximo
            </label>
            <div className="flex items-center gap-2">
              <input
                name="maxGuests"
                type="number"
                min={0}
                defaultValue={maxGuests}
                className="w-20 rounded-lg border border-neutral-300 px-3 py-2 text-center text-sm outline-none transition-colors focus:border-neutral-900"
              />
              <button
                type="submit"
                disabled={busy === "max"}
                className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
              >
                {busy === "max" ? "..." : "Guardar"}
              </button>
            </div>
            <p className="mt-1 text-[11px] text-neutral-400">0 = sin límite</p>
          </form>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <section className="flex flex-col gap-3 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        {/* Left: search + filters */}
        <div className="flex flex-1 flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nombre, correo o grupo..."
              className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2 pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-neutral-400 focus:border-neutral-400 focus:bg-white"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none transition-colors focus:border-neutral-400"
          >
            <option value="ALL">Todos los estados</option>
            <option value="ACCEPTED">Asiste</option>
            <option value="DECLINED">No asiste</option>
            <option value="SENT">Invitado</option>
            <option value="INVITED">Pendiente</option>
          </select>
          {allGroups.length > 0 && (
            <select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 outline-none transition-colors focus:border-neutral-400"
            >
              <option value="ALL">Todos los grupos</option>
              {allGroups.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <span className="mr-1 text-xs font-medium text-neutral-500">
              {selected.size} seleccionado{selected.size === 1 ? "" : "s"}
            </span>
          )}
          {selected.size > 0 && (
            <button
              type="button"
              disabled={busy === "bulkSend"}
              onClick={bulkSend}
              className="flex items-center gap-1.5 rounded-lg bg-sky-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-sky-700 disabled:opacity-50"
            >
              <SendIcon />
              Enviar seleccionados
            </button>
          )}
          {pendingCount > 0 && (
            <button
              type="button"
              disabled={busy === "sendAll"}
              onClick={sendAll}
              className="flex items-center gap-1.5 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-50 disabled:opacity-50"
            >
              {busy === "sendAll" ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-neutral-300 border-t-neutral-700" />
              ) : (
                <SendIcon />
              )}
              Enviar todos ({pendingCount})
            </button>
          )}
          <button
            type="button"
            onClick={() => setAddOpen(true)}
            className="flex items-center gap-1.5 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800"
          >
            <PlusIcon />
            Agregar
          </button>
        </div>
      </section>

      {/* ── Guest list ── */}
      {guests.length === 0 ? (
        <EmptyState onAdd={() => setAddOpen(true)} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-neutral-200 bg-white px-8 py-12 text-center">
          <SearchIcon className="h-8 w-8 text-neutral-300" />
          <p className="mt-3 font-medium text-neutral-700">
            Sin resultados
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            No se encontraron invitados con esos filtros.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setStatusFilter("ALL");
              setGroupFilter("ALL");
            }}
            className="mt-3 text-sm font-medium text-neutral-900 underline underline-offset-2 hover:text-neutral-600"
          >
            Limpiar filtros
          </button>
        </div>
      ) : (
        <section className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
          {/* Table header (desktop) */}
          <div className="hidden border-b border-neutral-100 bg-neutral-50/80 px-5 py-3 lg:grid lg:grid-cols-[40px_1fr_120px_100px_140px] lg:gap-4 lg:items-center">
            <div>
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
              />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Invitado
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Estado
            </span>
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Grupo
            </span>
            <span className="text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Acciones
            </span>
          </div>

          <ul className="divide-y divide-neutral-100">
            {filtered.map((guest) => {
              const inviter = inviters[guest.createdBy];
              return (
                <li
                  key={guest.id}
                  className={`transition-colors ${
                    selected.has(guest.id) ? "bg-sky-50/40" : "hover:bg-neutral-50/50"
                  }`}
                >
                  {/* Desktop row */}
                  <div className="hidden items-center gap-4 px-5 py-3.5 lg:grid lg:grid-cols-[40px_1fr_120px_100px_140px]">
                    <input
                      type="checkbox"
                      checked={selected.has(guest.id)}
                      onChange={() => toggleSelect(guest.id)}
                      className="h-4 w-4 rounded border-neutral-300 accent-neutral-900"
                    />
                    <div className="flex min-w-0 items-center gap-3">
                      <Avatar name={guest.name} size="sm" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-neutral-900">
                          {guest.name}
                        </p>
                        <p className="truncate text-xs text-neutral-500">
                          {guest.email}
                        </p>
                        {inviter && (
                          <p className="truncate text-[11px] text-neutral-400">
                            por {inviter.name}
                          </p>
                        )}
                      </div>
                    </div>
                    <StatusBadge status={guest.status} />
                    <div>
                      {guest.groupName ? (
                        <span className="inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                          {guest.groupName}
                        </span>
                      ) : (
                        <span className="text-xs text-neutral-300">—</span>
                      )}
                    </div>
                    <GuestActions
                      guest={guest}
                      busy={busy}
                      onCopy={copyInvite}
                      onSend={sendOne}
                      onEdit={setEditingGuest}
                      onDelete={setDeletingGuest}
                      layout="row"
                    />
                  </div>

                  {/* Mobile card */}
                  <div className="flex flex-col gap-3 px-4 py-4 lg:hidden">
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selected.has(guest.id)}
                        onChange={() => toggleSelect(guest.id)}
                        className="mt-1 h-4 w-4 rounded border-neutral-300 accent-neutral-900"
                      />
                      <Avatar name={guest.name} />
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-medium text-neutral-900">
                            {guest.name}
                          </span>
                          <StatusBadge status={guest.status} />
                        </div>
                        <p className="mt-0.5 text-sm text-neutral-500">
                          {guest.email}
                        </p>
                        {guest.groupName && (
                          <span className="mt-1 inline-block rounded-md bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600">
                            {guest.groupName}
                          </span>
                        )}
                        {inviter && (
                          <p className="mt-1 text-[11px] text-neutral-400">
                            por {inviter.name}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Mobile detail chips */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 pl-12 text-xs">
                      <span
                        className={
                          guest.sentAt ? "text-emerald-600" : "text-neutral-400"
                        }
                      >
                        {guest.sentAt
                          ? `Enviado ${formatDateShortEs(guest.sentAt)}`
                          : "Sin enviar"}
                      </span>
                      <span
                        className={
                          guest.attendance ? "text-emerald-600" : "text-neutral-400"
                        }
                      >
                        {guest.attendance
                          ? guest.attendance === "yes"
                            ? `Confirmó${guest.companions.length > 0 ? ` · ${guest.companions.length} acomp.` : ""}`
                            : "No asistirá"
                          : "Sin respuesta"}
                      </span>
                    </div>

                    <GuestActions
                      guest={guest}
                      busy={busy}
                      onCopy={copyInvite}
                      onSend={sendOne}
                      onEdit={setEditingGuest}
                      onDelete={setDeletingGuest}
                      layout="wrap"
                    />
                  </div>
                </li>
              );
            })}
          </ul>

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-neutral-100 bg-neutral-50/50 px-5 py-3">
            <p className="text-xs text-neutral-500">
              {filtered.length} de {guests.length} invitado
              {guests.length === 1 ? "" : "s"}
              {search || statusFilter !== "ALL" || groupFilter !== "ALL"
                ? " (filtrados)"
                : ""}
            </p>
            <p className="text-xs text-neutral-400">
              {weddingTitle} — datos privados
            </p>
          </div>
        </section>
      )}

      {/* ── Add guest slide-over ── */}
      <SlideOver
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Agregar invitado"
      >
        <p className="mb-5 text-sm text-neutral-600">
          Al agregarlo se prepara su invitación para enviarla por correo o
          compartir el enlace.
        </p>
        <GuestForm
          submitLabel="Agregar invitado"
          busy={busy === "add"}
          busyLabel="Agregando..."
          onSubmit={handleAdd}
        />
      </SlideOver>

      {/* ── Edit guest slide-over ── */}
      <SlideOver
        open={!!editingGuest}
        onClose={() => setEditingGuest(null)}
        title="Editar invitado"
      >
        {editingGuest && (
          <GuestForm
            defaultName={editingGuest.name}
            defaultEmail={editingGuest.email}
            defaultGroup={editingGuest.groupName ?? ""}
            submitLabel="Guardar cambios"
            busy={busy === `edit-${editingGuest.id}`}
            busyLabel="Guardando..."
            onSubmit={handleEdit}
          />
        )}
      </SlideOver>

      {/* ── Delete confirm ── */}
      <ConfirmDialog
        open={!!deletingGuest}
        title="Eliminar invitado"
        message={
          deletingGuest
            ? `¿Quieres eliminar a ${deletingGuest.name} de la lista de invitados? Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setDeletingGuest(null)}
      />
    </div>
  );
}

/* ─── GuestActions ──────────────────────────────────────── */

function GuestActions({
  guest,
  busy,
  onCopy,
  onSend,
  onEdit,
  onDelete,
  layout,
}: {
  guest: GuestManagerGuest;
  busy: string | null;
  onCopy: (url: string, name: string) => void;
  onSend: (id: string) => void;
  onEdit: (g: GuestManagerGuest) => void;
  onDelete: (g: GuestManagerGuest) => void;
  layout: "row" | "wrap";
}) {
  const wrap = layout === "wrap";

  return (
    <div
      className={`flex items-center gap-1.5 ${
        wrap ? "pl-12" : "justify-end"
      } ${wrap ? "flex-wrap" : ""}`}
    >
      {guest.inviteUrl && (
        <button
          type="button"
          onClick={() => onCopy(guest.inviteUrl!, guest.name)}
          title="Copiar enlace"
          className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
        >
          <LinkIcon />
        </button>
      )}
      {!guest.sentAt && (
        <button
          type="button"
          disabled={busy === `send-${guest.id}`}
          onClick={() => onSend(guest.id)}
          title="Enviar invitación por correo"
          className="flex items-center gap-1 rounded-lg border border-sky-200 bg-sky-50 px-2.5 py-1.5 text-xs font-medium text-sky-700 transition-colors hover:bg-sky-100 disabled:opacity-50"
        >
          <SendIcon />
          Enviar
        </button>
      )}
      <button
        type="button"
        onClick={() => onEdit(guest)}
        title="Editar"
        className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-700"
      >
        <PencilIcon />
      </button>
      <button
        type="button"
        onClick={() => onDelete(guest)}
        title="Eliminar"
        className="rounded-lg p-1.5 text-neutral-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
      >
        <TrashIcon />
      </button>
    </div>
  );
}

/* ─── Metric card ───────────────────────────────────────── */

function MetricCard({
  value,
  label,
  icon,
  color,
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
  color: "neutral" | "emerald" | "amber" | "rose";
}) {
  const bg = {
    neutral: "bg-neutral-50 text-neutral-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  }[color];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-100 bg-white px-4 py-3">
      <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${bg}`}>
        {icon}
      </div>
      <div>
        <p className="text-lg font-bold leading-none text-neutral-900">
          {value}
        </p>
        <p className="mt-0.5 text-[11px] font-medium text-neutral-500">
          {label}
        </p>
      </div>
    </div>
  );
}

/* ─── SVG Icons ─────────────────────────────────────────── */

function PlusIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M10.75 4.75a.75.75 0 0 0-1.5 0v4.5h-4.5a.75.75 0 0 0 0 1.5h4.5v4.5a.75.75 0 0 0 1.5 0v-4.5h4.5a.75.75 0 0 0 0-1.5h-4.5v-4.5Z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
      <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M8.75 1A2.75 2.75 0 0 0 6 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 1 0 .23 1.482l.149-.022 1.005 9.82a1.75 1.75 0 0 0 1.742 1.63h7.147a1.75 1.75 0 0 0 1.742-1.63l1.004-9.82.148.022a.75.75 0 0 0 .231-1.482A41.03 41.03 0 0 0 14 4.193V3.75A2.75 2.75 0 0 0 11.25 1h-2.5ZM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4ZM8.58 7.72a.75.75 0 0 0-1.5.06l.3 7.5a.75.75 0 1 0 1.5-.06l-.3-7.5Zm4.34.06a.75.75 0 1 0-1.5-.06l-.3 7.5a.75.75 0 1 0 1.5.06l.3-7.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className ?? "h-4 w-4"} aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M12.586 4.586a2 2 0 1 1 2.828 2.828l-3 3a2 2 0 0 1-2.828 0 1 1 0 0 0-1.414 1.414 4 4 0 0 0 5.656 0l3-3a4 4 0 0 0-5.656-5.656l-1.5 1.5a1 1 0 1 0 1.414 1.414l1.5-1.5Zm-5 5a2 2 0 0 1 2.828 0 1 1 0 1 0 1.414-1.414 4 4 0 0 0-5.656 0l-3 3a4 4 0 1 0 5.656 5.656l1.5-1.5a1 1 0 1 0-1.414-1.414l-1.5 1.5a2 2 0 1 1-2.828-2.828l3-3Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
      <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.925A1.5 1.5 0 0 0 5.135 9.25h6.115a.75.75 0 0 1 0 1.5H5.135a1.5 1.5 0 0 0-1.442 1.086l-1.414 4.926a.75.75 0 0 0 .826.95 28.896 28.896 0 0 0 15.293-7.154.75.75 0 0 0 0-1.115A28.897 28.897 0 0 0 3.105 2.289Z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M16.704 4.153a.75.75 0 0 1 .143 1.052l-8 10.5a.75.75 0 0 1-1.127.075l-4.5-4.5a.75.75 0 0 1 1.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 0 1 1.05-.143Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function XMarkIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM6.75 9.25a.75.75 0 0 0 0 1.5h4.59l-2.101 2.101a.75.75 0 1 0 1.06 1.06l3.25-3.25a.75.75 0 0 0 0-1.06l-3.25-3.25a.75.75 0 1 0-1.06 1.06L11.34 9.25H6.75Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-emerald-500" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function ErrorCircleIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-rose-500" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-8-5a.75.75 0 0 1 .75.75v4.5a.75.75 0 0 1-1.5 0v-4.5A.75.75 0 0 1 10 5Zm0 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function GuestsBigIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-neutral-400" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  );
}
