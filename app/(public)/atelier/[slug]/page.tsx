import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Link from "next/link";
import { MapPin, MessageCircle, ShoppingBag } from "lucide-react";
import { LinkButton } from "@/components/ui/link-button";
import { ModelPhoto } from "@/components/ui/model-photo";
import { EmptyState } from "@/components/ui/empty-state";
import { getWorkshopBySlug } from "@/lib/mock-data/workshop";
import { getCatalogItems } from "@/lib/mock-data/catalog";
import { formatAmount } from "@/lib/money/format";
import { formatPhoneDisplay } from "@/lib/utils/phone";
import { CATALOG_CATEGORY_LABELS } from "@/features/catalog/types";
import { computeAnnouncedDeposit } from "@/features/public-orders/types";
import { PublicHeader } from "./_components/public-header";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const workshop = await getWorkshopBySlug(slug);
  if (!workshop) return { title: "Atelier introuvable" };

  return {
    title: `${workshop.name} — Commander une tenue sur mesure`,
    description: workshop.onlineOrdering.welcomeMessage,
  };
}

/**
 * Vitrine publique d'un atelier, ouverte sans compte.
 *
 * Ce que le visiteur voit : le nom de l'atelier, sa ville, son WhatsApp, et les
 * modèles que l'atelier a choisi de proposer. Rien d'autre — aucun client,
 * aucune commande, aucun montant encaissé (PROJECT_RULES.md §7).
 */
export default async function PublicWorkshopPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const workshop = await getWorkshopBySlug(slug);
  if (!workshop) notFound();

  const settings = workshop.onlineOrdering;

  if (!settings.enabled) {
    return (
      <>
        <PublicHeader workshop={workshop} />
        <main className="mx-auto w-full max-w-2xl px-4 py-12 text-center sm:px-6">
          <h1 className="text-xl font-bold text-text">Commandes en ligne fermées</h1>
          <p className="mt-3 text-sm text-text-muted">{settings.closedMessage}</p>
          <LinkButton
            href={`https://wa.me/${workshop.whatsappPhone.replace(/\D/g, "")}`}
            variant="whatsapp"
            className="mt-6"
            fullWidth="mobile"
            icon={<MessageCircle className="size-4" />}
          >
            Écrire à l&apos;atelier sur WhatsApp
          </LinkButton>
        </main>
      </>
    );
  }

  const allItems = await getCatalogItems();
  const offeredItems = allItems.filter(
    (item) =>
      item.workshopId === workshop.id &&
      !item.isArchived &&
      (settings.allowedCategories.length === 0 ||
        settings.allowedCategories.includes(item.category))
  );

  return (
    <>
      <PublicHeader workshop={workshop} />

      <main className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
        <section className="py-8 sm:py-10">
          <h1 className="text-2xl font-bold text-text sm:text-3xl">
            Commandez votre tenue sur mesure
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            {settings.welcomeMessage}
          </p>

          <ul className="mt-5 flex flex-col gap-1.5 text-sm text-text-muted">
            <li>
              <strong className="text-text">Délai :</strong> comptez au moins{" "}
              {settings.minDelayDays} jours entre votre demande et la livraison.
            </li>
            {settings.requireDeposit ? (
              <li>
                <strong className="text-text">Acompte :</strong> {settings.depositPercent} % à la
                confirmation, pour lancer la coupe.
              </li>
            ) : null}
            <li>
              <strong className="text-text">Mesures :</strong>{" "}
              {settings.acceptMeasurementsOnline
                ? "vous pouvez les indiquer dans votre message."
                : "l'atelier vous contacte pour les prendre."}
            </li>
          </ul>
        </section>

        {offeredItems.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="size-6" />}
            title="Aucun modèle en ligne pour le moment."
            description="Écrivez directement à l'atelier sur WhatsApp : il vous proposera ses créations du moment."
          />
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offeredItems.map((item) => {
              const deposit = computeAnnouncedDeposit(item.indicativePrice, settings);
              return (
                <article
                  key={item.id}
                  className="flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-xs"
                >
                  <ModelPhoto
                    src={item.imageUrl}
                    alt={item.name}
                    category={CATALOG_CATEGORY_LABELS[item.category] || item.category}
                    className="aspect-4/3 w-full"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />

                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h2 className="text-base font-bold leading-tight text-text">{item.name}</h2>
                    {item.description ? (
                      <p className="line-clamp-3 text-xs leading-relaxed text-text-muted">
                        {item.description}
                      </p>
                    ) : null}

                    {settings.showPrices ? (
                      <p className="mt-auto pt-2 text-sm font-bold text-primary-950">
                        {item.indicativePrice ? formatAmount(item.indicativePrice) : "Sur devis"}
                        {deposit ? (
                          <span className="ml-1 text-xs font-medium text-text-muted">
                            · acompte {formatAmount(deposit)}
                          </span>
                        ) : null}
                      </p>
                    ) : (
                      <p className="mt-auto pt-2 text-sm font-semibold text-text-muted">
                        Prix communiqué après votre demande
                      </p>
                    )}

                    <LinkButton
                      href={`/atelier/${workshop.slug}/commander?modele=${item.id}`}
                      fullWidth
                      className="mt-2"
                      icon={<ShoppingBag className="size-4" />}
                    >
                      Demander ce modèle
                    </LinkButton>
                  </div>
                </article>
              );
            })}
          </section>
        )}

        <section className="mt-10 rounded-[var(--radius-lg)] border border-border bg-surface p-5 text-center">
          <p className="text-sm text-text">
            Vous ne trouvez pas ce que vous cherchez ?
          </p>
          <p className="mt-1 text-xs text-text-muted">
            <MapPin className="mr-1 inline size-3.5" aria-hidden="true" />
            {workshop.city}, {workshop.country} · {formatPhoneDisplay(workshop.whatsappPhone)}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-center">
            <LinkButton
              href={`/atelier/${workshop.slug}/commander`}
              fullWidth="mobile"
              icon={<ShoppingBag className="size-4" />}
            >
              Décrire ma tenue
            </LinkButton>
            <LinkButton
              href={`https://wa.me/${workshop.whatsappPhone.replace(/\D/g, "")}`}
              variant="whatsapp"
              fullWidth="mobile"
              icon={<MessageCircle className="size-4" />}
            >
              Écrire sur WhatsApp
            </LinkButton>
          </div>
        </section>

        <p className="mt-10 text-center text-xs text-text-subtle">
          <Link href="/" className="hover:text-text">
            Boutique en ligne propulsée par Fildor
          </Link>
        </p>
      </main>
    </>
  );
}
