import { AppShell } from "@/components/app/AppShell";
import { requireUser } from "@/lib/auth";
import { seedBaseData, weddingsRepo } from "@/lib/data";
import { createWeddingAction, logoutAction } from "./actions";
import type { Metadata } from "next";
import type { WeddingStatus } from "@/types";

export const metadata: Metadata = {
  title: "Panel",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  await seedBaseData();

  const weddings = weddingsRepo.findManyByUser(user.id).map((wedding) => ({
    id: wedding.id,
    title: wedding.title,
    slug: wedding.slug,
    status: wedding.status as WeddingStatus,
  }));

  return (
    <AppShell
      user={{ name: user.name, email: user.email }}
      weddings={weddings}
      logoutAction={logoutAction}
      createWeddingAction={createWeddingAction}
    >
      {children}
    </AppShell>
  );
}