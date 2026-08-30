import { notFound } from "next/navigation";
import { ArrowLeft, Scissors, Tag, Plus, ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { LinkButton } from "@/components/ui/link-button";
import { Badge } from "@/components/ui/badge";
import { getCatalogItemById } from "@/lib/mock-data/catalog";
import { formatAmount } from "@/lib/money/format";
import { CATALOG_CATEGORY_LABELS } from "@/features/catalog/types";
import { GARMENT_TYPE_LABELS } from "@/features/measurements/constants";

export default async function ModeleDetailPage({
  params,
}: {
  params: Promise<{ modeleId: string }>;
}) {
  const { modeleId } = await params;
  const item = await getCatalogItemById(modeleId);
  if (!item) notFound();

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <LinkButton href="/modeles" variant="tertiary" size="sm" icon={<ArrowLeft className="size-4" />}>
          Retour au catalogue
        </LinkButton>
      </div>

      <PageHeader
        title={item.name}
        description={`Catégorie : ${CATALOG_CATEGORY_LABELS[item.category] || item.category}`}
        action={
          <LinkButton
            href={`/commandes/nouveau/client?modele=${item.id}`}
            icon={<ShoppingBag className="size-4" />}
          >
            Créer une commande avec ce modèle
          </LinkButton>
        }
      />

      <div className="grid gap-6 md:grid-cols-2">
        {/* Placeholder visuel grand format */}
        <div className="flex aspect-4/3 items-center justify-center rounded-lg border border-border bg-canvas/70 p-8 shadow-sm">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="flex size-20 items-center justify-center rounded-full bg-surface text-primary-800 shadow-sm">
              <Scissors className="size-10" />
            </div>
            <span className="font-bold text-text text-lg">{item.name}</span>
            <Badge tone="info">{GARMENT_TYPE_LABELS[item.garmentType]}</Badge>
          </div>
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

          <div className="pt-4 border-t border-border">
            <LinkButton href="/commandes/nouveau/client" fullWidth icon={<Plus className="size-4" />}>
              Lancer une commande client
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
