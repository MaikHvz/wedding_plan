import type { ReactNode } from "react";
import type { Metadata } from "next";
import { requireAdmin } from "@/lib/auth/admin";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen bg-neutral-50">
      <AdminSidebar />
      <main className="flex-1 overflow-x-auto px-8 py-10">{children}</main>
    </div>
  );
}
