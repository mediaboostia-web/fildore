import { Plus, Shirt, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/link-button";
import { ListToolbar } from "@/components/ui/list-toolbar";
import { ModelPhoto } from "@/components/ui/model-photo";
import { getCatalogItems } from "@/lib/mock-data/catalog";
import { formatAmount } from "@/lib/money/format";
import { matchesQuery } from "@/lib/utils/search";
import { CATALOG_CATEGORY_LABELS } from "@/features/catalog/types";
import { requireCurrentUser } from "@/lib/auth/session";

export default async function ModelesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string }>;
}) {
  const { q, cat } = await searchParams;
  const query = q?.trim() ?? "";
  const activeCategory = cat?.trim() || "all";

  const user = await requireCurrentUser();
  const allItems = await getCatalogItems(user.workshopId);

  const searchedItems = allItems.filter((item) =>
    matchesQuery([item.name, item.description, ...item.tags], query)
  );

  // Les puces listent les catégories réellement présentes dans le catalogue —
  // une puce « Costumes (0) » n'apprend rien et occupe une largeur précieuse.
  const categoryCounts = new Map<string, number>();
  for (const item of searchedItems) {
    categoryCounts.set(item.category, (categoryCounts.get(item.category) ?? 0) + 1);
  }

  const filterChips = [
    { key: "all", label: "Tous les modèles", count: searchedItems.length },
    ...[...categoryCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .map(([category, count]) => ({
        key: category,
        label: CATALOG_CATEGORY_LABELS[category as keyof typeof CATALOG_CATEGORY_LABELS] ?? category,
        count,
      })),
  ];

  const filteredItems =
    activeCategory === "all"
      ? searchedItems
      : searchedItems.filter((item) => item.category === activeCategory);

  return (
    <div>
      <PageHeader
        title="Modèles"
        description="Catalogue des créations, coupes et inspirations de votre atelier."
        action={
          <LinkButton href="/modeles/nouveau" icon={<Plus className="size-4" />}>
            Nouveau modèle
          </LinkButton>
        }
      />

      <ListToolbar
        searchParam="q"
        searchValue={query}
        searchLabel="Rechercher un modèle"
        searchPlaceholder="Nom, description ou mot-clé"
        filterParam="cat"
        filterValue={activeCategory}
        filters={filterChips}
        resultCount={filteredItems.length}
        totalCount={allItems.length}
        noun={["modèle", "modèles"]}
      />

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<Shirt className="size-6" />}
          title={
            query || activeCategory !== "all"
              ? "Aucun modèle ne correspond à cette recherche."
              : "Aucun modèle dans votre catalogue."
          }
          description={
            query || activeCategory !== "all"
              ? "Essayez un autre mot-clé, ou choisissez « Tous les modèles »."
              : "Ajoutez une création pour enrichir votre catalogue et gagner du temps à la prise de commande."
          }
          action={
            <LinkButton href="/modeles/nouveau" icon={<Plus className="size-4" />}>
              Ajouter un modèle
            </LinkButton>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col justify-between overflow-hidden rounded-[var(--radius-xl)] border border-border bg-surface shadow-xs transition-all duration-200 hover:border-primary-800/50 hover:shadow-md"
            >
              <div>
                <ModelPhoto
                  src={item.imageUrl}
                  alt={item.name}
                  category={CATALOG_CATEGORY_LABELS[item.category] || item.category}
                  className="aspect-4/3 w-full rounded-t-[var(--radius-xl)]"
                />

                <div className="space-y-2.5 p-4 sm:p-5">
                  <h3 className="text-base font-bold leading-tight text-text transition-colors group-hover:text-primary-900">
                    {item.name}
                  </h3>

                  {item.description && (
                    <p className="line-clamp-2 text-xs leading-relaxed text-text-muted">
                      {item.description}
                    </p>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md border border-border/80 bg-surface-muted px-2 py-0.5 text-[11px] font-semibold text-text-muted"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 border-t border-border bg-canvas/30 p-4">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-wider text-text-subtle">
                    Prix indicatif
                  </span>
                  <span className="text-sm font-bold text-primary-950">
                    {item.indicativePrice ? formatAmount(item.indicativePrice) : "Sur devis"}
                  </span>
                </div>

                {/* La flèche suit le mot : `icon` le placerait avant. */}
                <LinkButton href={`/modeles/${item.id}`} size="sm" variant="secondary">
                  Détails
                  <ArrowRight className="size-3.5" aria-hidden="true" />
                </LinkButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
