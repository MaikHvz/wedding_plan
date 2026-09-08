"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { WeddingStatus } from "@/types";
import { weddingStatusMeta } from "@/lib/ui/format";

interface ShellWedding {
  id: string;
  title: string;
  slug: string;
  status: WeddingStatus;
}

interface ShellUser {
  name: string;
  email: string;
}

export function AppShell({
  user,
  weddings,
  logoutAction,
  createWeddingAction,
  children,
}: {
  user: ShellUser;
  weddings: ShellWedding[];
  logoutAction: () => Promise<void>;
  createWeddingAction: () => Promise<void>;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const route = useMemo(() => {
    const match = pathname.match(/^\/dashboard\/bodas\/([^/]+)(?:\/|$)/);
    const isEditor = /^\/dashboard\/bodas\/[^/]+$/.test(pathname);
    const isPreview = /^\/dashboard\/bodas\/[^/]+\/preview$/.test(pathname);
    return {
      weddingId: match?.[1] ?? null,
      plain: isEditor || isPreview,
      home: pathname === "/dashboard",
      guests: pathname.endsWith("/invitados"),
      checkout: pathname.endsWith("/checkout"),
    };
  }, [pathname]);

  const activeWedding = route.weddingId
    ? (weddings.find(
        (wedding) => wedding.id === route.weddingId,
      ) ?? null)
    : null;

  function sectionLabel(): string {
    if (route.guests) return "Invitados y confirmaciones";
    if (route.checkout) return "Publicar tu página";
    return "Editor de tu página";
  }

  const title = route.home
    ? "Mis bodas"
    : activeWedding
      ? route.guests || route.checkout
        ? sectionLabel()
        : "Editor"
      : "Dashboard";

  if (route.plain) {
    return children;
  }

  const statusMeta = activeWedding
    ? weddingStatusMeta(activeWedding.status)
    : null;

  const sidebar = (
    <div className="flex h-full flex-col">
      <Link
        href="/dashboard"
        onClick={() => setMenuOpen(false)}
        className="flex items-center gap-2.5 border-b border-neutral-100 px-5 py-4"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-900 text-lg text-white">
          💍
        </span>
        <span className="leading-tight">
          <span className="block text-sm font-semibold text-neutral-900">
            Weddings Studio
          </span>
          <span className="block text-[11px] text-neutral-500">
            Panel de bodas
          </span>
        </span>
      </Link>

      <nav className="flex flex-col gap-1 px-3 py-4">
        <Link
          href="/dashboard"
          onClick={() => setMenuOpen(false)}
          className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
            route.home
              ? "bg-neutral-100 text-neutral-900"
              : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
          }`}
        >
          <HomeIcon />
          Mis bodas
        </Link>

        {activeWedding && !route.home && (
          <>
            <p className="mt-4 px-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              {activeWedding.title}
            </p>
            <div className="flex flex-col gap-0.5">
              <SidebarLink
                href={`/dashboard/bodas/${activeWedding.id}`}
                active={!route.guests && !route.checkout}
                onNavigate={() => setMenuOpen(false)}
              >
                <PencilIcon />
                Editor
              </SidebarLink>
              <SidebarLink
                href={`/dashboard/bodas/${activeWedding.id}/invitados`}
                active={route.guests}
                onNavigate={() => setMenuOpen(false)}
              >
                <UsersIcon />
                Invitados
              </SidebarLink>
              <SidebarLink
                href={`/dashboard/bodas/${activeWedding.id}/checkout`}
                active={route.checkout}
                onNavigate={() => setMenuOpen(false)}
              >
                <RocketIcon />
                Publicar
              </SidebarLink>
              {activeWedding.status === "PUBLISHED" && (
                <SidebarLink
                  href={`/w/${activeWedding.slug}`}
                  onNavigate={() => setMenuOpen(false)}
                >
                  <EyeIcon />
                  Ver página pública
                </SidebarLink>
              )}
            </div>
          </>
        )}
      </nav>

      <div className="flex-1 overflow-y-auto px-3 pb-2 pt-1">
        <p className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
          Tus bodas · {weddings.length}
        </p>
        <div className="flex flex-col gap-0.5">
          {weddings.map((wedding) => (
            <Link
              key={wedding.id}
              href={`/dashboard/bodas/${wedding.id}`}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors ${
                activeWedding?.id === wedding.id
                  ? "bg-neutral-100 text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  weddingStatusMeta(wedding.status).dot
                }`}
              />
              <span className="truncate">{wedding.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="border-t border-neutral-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
            {initials(user.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-neutral-900">
              {user.name}
            </p>
            <p className="truncate text-xs text-neutral-500">{user.email}</p>
          </div>
        </div>
        <form action={logoutAction} className="mt-2">
          <button
            type="submit"
            className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-neutral-600 transition-colors hover:bg-neutral-50 hover:text-neutral-900"
          >
            <LogoutIcon />
            Cerrar sesión
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="flex h-dvh bg-neutral-50 text-neutral-900">
      <aside className="hidden w-72 shrink-0 border-r border-neutral-200 bg-white lg:block">
        {sidebar}
      </aside>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar menú"
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-xl">
            {sidebar}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-neutral-200/80 bg-white/90 px-4 py-3 backdrop-blur sm:px-6">
          <button
            type="button"
            aria-label="Abrir menú"
            onClick={() => setMenuOpen(true)}
            className="-ml-1 rounded-lg p-1.5 text-neutral-600 transition-colors hover:bg-neutral-100 lg:hidden"
          >
            <MenuIcon />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-2.5">
              <h1 className="truncate font-serif text-lg font-semibold text-neutral-900 sm:text-xl">
                {title}
              </h1>
              {statusMeta && (
                <span
                  className={`hidden items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide sm:inline-flex ${statusMeta.badge}`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${statusMeta.dot}`}
                  />
                  {statusMeta.label}
                </span>
              )}
            </div>
            <p className="truncate text-xs text-neutral-500">
              {route.home
                ? "Crea, edita y publica tus páginas de boda."
                : activeWedding
                  ? activeWedding.title
                  : "\u00a0"}
            </p>
          </div>

          {route.home && (
            <form action={createWeddingAction}>
              <button
                type="submit"
                className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-700"
              >
                + Nueva boda
              </button>
            </form>
          )}
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  active = false,
  onNavigate,
  children,
}: {
  href: string;
  active?: boolean;
  onNavigate: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={`flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "bg-neutral-900 text-white"
          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
      }`}
    >
      {children}
    </Link>
  );
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  return `${(parts[0]?.[0] ?? "")}${(parts[1]?.[0] ?? "")}`.toUpperCase();
}

function HomeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5 shrink-0" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function PencilIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5 shrink-0" aria-hidden="true">
      <path d="m5.433 13.917 1.262-3.155A4 4 0 0 1 7.58 9.42l6.92-6.918a2.121 2.121 0 0 1 3 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 0 1-.65-.65Z" />
      <path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0 0 10 3H4.75A2.75 2.75 0 0 0 2 5.75v9.5A2.75 2.75 0 0 0 4.75 18h9.5A2.75 2.75 0 0 0 17 15.25V10a.75.75 0 0 0-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5Z" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5 shrink-0" aria-hidden="true">
      <path d="M7 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM14.5 9a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5ZM1.615 16.428a1.224 1.224 0 0 1-.569-1.175 6.002 6.002 0 0 1 11.908 0c.058.467-.172.92-.57 1.174A9.953 9.953 0 0 1 7 18a9.953 9.953 0 0 1-5.385-1.572ZM14.5 16h-.106c.07-.297.088-.611.048-.933a7.47 7.47 0 0 0-1.588-3.755 4.502 4.502 0 0 1 5.874 2.636.818.818 0 0 1-.36.98A7.465 7.465 0 0 1 14.5 16Z" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5 shrink-0" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M4.606 12.97a.75.75 0 0 1-.134 1.051l-2.55 1.937a.75.75 0 0 0-.241 1.096l.922 1.466a.75.75 0 0 0 1.104.245l1.938-1.55a.75.75 0 0 1 1.05.134l4.302 4.302a.75.75 0 0 0 1.226-.352l1.6-4.8A6.75 6.75 0 0 0 20 8.197V6.75A6.75 6.75 0 0 0 13.25 0H11.803a6.75 6.75 0 0 0-5.158 2.399l-4.039 4.8a.75.75 0 0 0-.333 1.083l1.695 2.475.639.212Zm9.818-2.22a2.25 2.25 0 1 0 0-4.5 2.25 2.25 0 0 0 0 4.5Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5 shrink-0" aria-hidden="true">
      <path d="M10 12.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
      <path
        fillRule="evenodd"
        d="M.664 10.59a1.651 1.651 0 0 1 0-1.186A10.004 10.004 0 0 1 10 3c4.257 0 7.893 2.66 9.336 6.41.147.381.146.804 0 1.186A10.004 10.004 0 0 1 10 17c-4.257 0-7.893-2.66-9.336-6.41ZM14 10a4 4 0 1 1-8 0 4 4 0 0 1 8 0Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className="h-4.5 w-4.5 shrink-0" aria-hidden="true">
      <path
        fillRule="evenodd"
        d="M3 4.25A2.25 2.25 0 0 1 5.25 2h5.5A2.25 2.25 0 0 1 13 4.25v2a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 0-.75-.75h-5.5a.75.75 0 0 0-.75.75v11.5c0 .414.336.75.75.75h5.5a.75.75 0 0 0 .75-.75v-2a.75.75 0 0 1 1.5 0v2A2.25 2.25 0 0 1 10.75 18h-5.5A2.25 2.25 0 0 1 3 15.75V4.25Z"
        clipRule="evenodd"
      />
      <path
        fillRule="evenodd"
        d="M19 10a.75.75 0 0 0-.75-.75H8.704l1.048-.943a.75.75 0 1 0-1.004-1.114l-2.5 2.25a.75.75 0 0 0 0 1.114l2.5 2.25a.75.75 0 1 0 1.004-1.114l-1.048-.943h9.546A.75.75 0 0 0 19 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}