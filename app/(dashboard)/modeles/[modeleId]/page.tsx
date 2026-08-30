import { notFound } from "next/navigation";
import { ArrowLeft, Tag, Pencil, ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/ui/link-button";
import { ModelPhoto } from "@/components/ui/model-photo";
import { Badge } from "@/components/ui/badge";
import { RoleGate } from "@/components/shared/role-gate";
import { getCatalogItemById } from "@/lib/mock-data/catalog";
import { getCurrentUser } from "@/lib/auth/session";
import { formatAmount } from "@/lib/money/format";
import { CATALOG_CATEGORY_LABELS } from "@/features/catalog/types";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";
import { ArchiveModelButton } from "./_components/archive-model-button";

export default async function ModeleDetailPage({
  params,
}: {
  params: Promise<{ modeleId: string }>;
}) {
  const { modeleId } = await params;
  const [item, currentUser] = await Promise.all([getCatalogItemById(modeleId), getCurrentUser()]);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <LinkButton
          href="/modeles"
          variant="secondary"
          size="sm"
          icon={<ArrowLeft className="size-4" />}
        >
          Retour aux modèles
        </LinkButton>
      </div>

      <PageHeader
        title={item.name}
        description={`Catégorie : ${CATALOG_CATEGORY_LABELS[item.category] || item.category}`}
        action={
          <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap">
            <RoleGate require="catalogue:gerer" role={currentUser?.role}>
              <LinkButton
                href={`/modeles/${item.id}/modifier`}
                variant="secondary"
                size="sm"
                icon={<Pencil className="size-4" />}
              >
                Modifier
              </LinkButton>
            </RoleGate>
            <ArchiveModelButton
              itemId={item.id}
              itemName={item.name}
              currentUserRole={currentUser?.role}
            />
            <LinkButton
              href={`/commandes/nouveau/client?modele=${item.id}`}
              size="sm"
              className="col-span-2"
              icon={<ShoppingBag className="size-4" />}
            >
              Commander ce modèle
            </LinkButton>
          </div>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* La photo téléversée était ignorée ici : la grille en montrait une, la
            fiche affichait un pictogramme. */}
        <div className="space-y-3">
          <ModelPhoto
            src={item.imageUrl}
            alt={item.name}
            className="aspect-4/3 w-full rounded-[var(--radius-lg)] border border-border shadow-sm"
            sizes="(max-width: 768px) 100vw, 45vw"
            priority
          />
          <Badge tone="info">{GARMENT_TYPE_LABELS[item.garmentType]}</Badge>
        </div>

        {/* Détails et spécifications */}
        <div className="rounded-lg border border-border bg-surface p-6 shadow-sm space-y-4">
          <div>
            <h2 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-1">
              Description
            </h2>
            <p className="text-sm text-text">
              {item.description || "Aucune description renseignée pour ce modèle."}
            </p>
          </div>

          <div className="border-t border-border pt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-muted">Prix indicatif de confection :</span>
              <span className="font-bold text-text text-base">
                {item.indicativePrice ? formatAmount(item.indicativePrice) : "Sur devis"}
              </span>
            </div>

            {item.estimatedDelayDays && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-text-muted">Délai estimé :</span>
                <span className="font-medium text-text">{item.estimatedDelayDays} jours</span>
              </div>
            )}
          </div>

          {item.tags.length > 0 && (
            <div className="border-t border-border pt-3">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">
                Tags & Styles
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full bg-canvas px-2.5 py-1 text-xs text-text-muted border border-border"
                  >
                    <Tag className="size-3 mr-1" />
                    {t}
                  </span>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
