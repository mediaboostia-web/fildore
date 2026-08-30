import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { getWorkshopBySlug } from "@/lib/mock-data/workshop";
import { getCatalogItemById } from "@/lib/mock-data/catalog";
import { computeAnnouncedDeposit } from "@/features/public-orders/types";
import { formatAmount } from "@/lib/money/format";
import { addDaysIso, todayIso } from "@/lib/utils/dates";
import { PublicHeader } from "../_components/public-header";
import { OrderRequestForm } from "./_components/order-request-form";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PublicOrderRequestPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ modele?: string }>;
}) {
  const [{ slug }, { modele }] = await Promise.all([params, searchParams]);
  const workshop = await getWorkshopBySlug(slug);
  if (!workshop) notFound();

  const settings = workshop.onlineOrdering;
  if (!settings.enabled) notFound();

  // Le modèle est revérifié ici comme dans l'action : un identifiant collé à la
  // main dans l'URL ne doit pas afficher un modèle retiré du catalogue.
  const item = modele ? await getCatalogItemById(modele) : undefined;
  const offeredItem =
    item &&
    item.workshopId === workshop.id &&
    !item.isArchived &&
    (settings.allowedCategories.length === 0 ||
      settings.allowedCategories.includes(item.category))
      ? item
      : undefined;

  const deposit = computeAnnouncedDeposit(offeredItem?.indicativePrice, settings);
  const earliestDate = addDaysIso(todayIso(), settings.minDelayDays);

  return (
    <>
      <PublicHeader workshop={workshop} />

      <main className="mx-auto w-full max-w-xl px-4 py-6 sm:px-6 sm:py-10">
        <LinkButton
          href={`/atelier/${workshop.slug}`}
          variant="secondary"
          size="sm"
          icon={<ArrowLeft className="size-4" />}
        >
          Revoir les modèles
        </LinkButton>

        <h1 className="mt-5 text-xl font-bold text-text sm:text-2xl">
          {offeredItem ? `Demander « ${offeredItem.name} »` : "Décrire la tenue souhaitée"}
        </h1>
        <p className="mt-2 text-sm text-text-muted">
          Laissez vos coordonnées : {workshop.name} vous rappelle pour confirmer les mesures, le
          tissu et le prix. Rien n&apos;est facturé à cette étape.
        </p>

        {offeredItem && settings.showPrices && offeredItem.indicativePrice ? (
          <div className="mt-4 rounded-[var(--radius-md)] border border-primary-100 bg-primary-50/60 p-3.5 text-sm text-text">
            Prix indicatif : <strong>{formatAmount(offeredItem.indicativePrice)}</strong>
            {deposit ? (
              <>
                {" "}
                · acompte annoncé : <strong>{formatAmount(deposit)}</strong>
              </>
            ) : null}
            <p className="mt-1 text-xs text-text-muted">
              Le prix définitif est confirmé par l&apos;atelier après vos mesures.
            </p>
          </div>
        ) : null}

        <div className="mt-6">
          <OrderRequestForm
            workshopSlug={workshop.slug}
            workshopName={workshop.name}
            catalogItemId={offeredItem?.id}
            catalogItemName={offeredItem?.name}
            earliestDate={earliestDate}
            minDelayDays={settings.minDelayDays}
            acceptMeasurementsOnline={settings.acceptMeasurementsOnline}
            defaultCity={workshop.city}
          />
        </div>
      </main>
    </>
  );
}
