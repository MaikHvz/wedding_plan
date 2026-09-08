import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { seedBaseData, weddingsRepo } from "@/lib/data";
import { getWeddingPageData } from "@/lib/wedding/render-data";
import { WeddingRenderer } from "@/components/wedding/WeddingRenderer";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function WeddingPreviewPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const user = await requireUser();
  const { id } = await params;
  await seedBaseData();

  const wedding = weddingsRepo.findById(id);
  if (!wedding || wedding.userId !== user.id) {
    notFound();
  }

  const pageData = getWeddingPageData(wedding);

  return (
    <main className="relative">
      <div className="sticky top-0 z-50 flex items-center justify-between border-b border-neutral-200 bg-white/90 px-6 py-3 backdrop-blur">
        <Link
          href={`/dashboard/bodas/${wedding.id}`}
          className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
        >
          ← Volver al editor
        </Link>
        <span className="text-sm uppercase tracking-[0.25em] text-neutral-500">
          Preview · {wedding.title}
        </span>
      </div>
      <WeddingRenderer
        wedding={wedding}
        template={pageData.template}
        theme={pageData.theme}
        sections={pageData.sections}
        mediaUrls={pageData.mediaUrls}
      />
    </main>
  );
}