import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/admin";
import { seedBaseData, weddingsRepo } from "@/lib/data";
import { getWeddingPageData } from "@/lib/wedding/render-data";
import { getAllThemes } from "@/lib/templates";
import { Builder } from "@/components/builder/Builder";
import { saveWeddingPageAdminAction } from "@/app/dashboard/bodas/[id]/actions";
import type { BuilderPageState, BuilderSection } from "@/lib/builder/model";

export const dynamic = "force-dynamic";

export default async function AdminEditWeddingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  await seedBaseData();

  const wedding = weddingsRepo.findById(id);
  if (!wedding) {
    notFound();
  }

  const pageData = getWeddingPageData(wedding);

  const sections: BuilderSection[] = pageData.sections.map((section) => ({
    id: section.id,
    type: section.type,
    variant: section.variant,
    position: section.position,
    enabled: section.enabled,
    data: section.data,
  }));

  const initial: BuilderPageState = {
    title: wedding.title,
    partner1: wedding.partner1 ?? "",
    partner2: wedding.partner2 ?? "",
    eventDate: wedding.eventDate ?? "",
    eventTime: wedding.eventTime ?? "",
    locationName: wedding.locationName ?? "",
    locationAddress: wedding.locationAddress ?? "",
    mapsUrl: wedding.mapsUrl ?? "",
    driveUrl: wedding.driveUrl ?? "",
    themeId: pageData.theme.id,
    sections,
  };

  return (
    <Builder
      weddingId={wedding.id}
      wedding={wedding}
      initial={initial}
      template={pageData.template}
      themes={getAllThemes()}
      saveAction={saveWeddingPageAdminAction}
      homeHref={`/admin/bodas/${wedding.id}`}
      previewHref={`/admin/bodas/${wedding.id}/preview`}
      publishHref="#"
      guestsHref="#"
    />
  );
}