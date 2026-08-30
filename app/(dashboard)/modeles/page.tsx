import Link from "next/link";
import Image from "next/image";
import { Plus, Scissors, Shirt, Sparkles, Clock, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/link-button";
import { getCatalogItems } from "@/lib/mock-data/catalog";
import { formatAmount } from "@/lib/money/format";
import { CATALOG_CATEGORY_LABELS, type CatalogCategory } from "@/features/catalog/types";

const CATEGORY_DEFAULT_PHOTOS: Record<string, string> = {
  robe: "/images/tailor-couturiere.jpg",
  boubou_femme: "/images/tailor-modeliste.jpg",
  boubou_homme: "/images/tailor-hero.jpg",
  costume: "/images/tailor-workshop.jpg",
  chemise: "/images/tailor-craft.jpg",
  ensemble: "/images/tailor-fabrics.jpg",
  mariage: "/images/tailor-designer.jpg",
};

function ModelCardImage({ category, name, imageUrl }: { category: CatalogCategory; name: string; imageUrl?: string }) {
  const photoSrc = imageUrl || CATEGORY_DEFAULT_PHOTOS[category];

  if (photoSrc) {
    return (
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-2xl bg-primary-950">
        <Image
          src={photoSrc}
          alt={name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-108"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
        <div className="absolute top-3 left-3 rounded-full bg-black/40 px-3 py-1 text-[11px] font-bold text-white backdrop-blur-md border border-white/20">
          {CATALOG_CATEGORY_LABELS[category] || category}
        </div>
      </div>
    );
  }

  return (
    <div
      role="img"
      aria-label={name}
      className="relative flex aspect-4/3 w-full items-center justify-center rounded-t-2xl bg-primary-50 border-b border-border transition-transform group-hover:scale-102"
    >
      <div className="flex flex-col items-center gap-2 p-4 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-white text-primary-900 shadow-xs">
          <Scissors className="size-6" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-primary-900">
          {CATALOG_CATEGORY_LABELS[category] || category}
        </span>
      </div>
    </div>
  );
}

export default async function ModelesPage({
  searchParams,
}: {
  searchParams: Promise<{ cat?: string }>;
}) {
  const { cat } = await searchParams;
  const activeCategory = cat || "all";

  const allItems = await getCatalogItems();

  const filteredItems = activeCategory === "all"
    ? allItems
    : allItems.filter((item) => item.category === activeCategory);

  const categories = [
    { key: "all", label: "Tous les modèles", count: allItems.length },
    { key: "robe", label: "Robes", count: allItems.filter((i) => i.category === "robe").length },
    { key: "boubou_femme", label: "Boubous femme", count: allItems.filter((i) => i.category === "boubou_femme").length },
    { key: "boubou_homme", label: "Boubous homme", count: allItems.filter((i) => i.category === "boubou_homme").length },
    { key: "costume", label: "Costumes", count: allItems.filter((i) => i.category === "costume").length },
    { key: "chemise", label: "Chemises", count: allItems.filter((i) => i.category === "chemise").length },
    { key: "ensemble", label: "Ensembles", count: allItems.filter((i) => i.category === "ensemble").length },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Modèles"
        description="Catalogue des créations, coupes et inspirations de votre atelier."
        action={
          <LinkButton href="/modeles/nouveau" icon={<Plus className="size-4" />}>
            Nouveau modèle
          </LinkButton>
        }
      />

      {/* Sélecteur de filtres avec défilement horizontal et compteurs */}
      <div className="overflow-x-auto no-scrollbar pb-1 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-center gap-2 min-w-max">
          {categories.map((c) => {
            const isActive = activeCategory === c.key;
            return (
              <Link
                key={c.key}
                href={c.key === "all" ? "/modeles" : `/modeles?cat=${c.key}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all duration-200 cursor-pointer select-none active:scale-95 ${
                  isActive
                    ? "bg-primary-900 text-white shadow-sm ring-2 ring-primary-900/20"
                    : "bg-surface text-text-muted hover:bg-surface-muted hover:text-text border border-border"
                }`}
              >
                <span>{c.label}</span>
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                    isActive ? "bg-white/20 text-white" : "bg-surface-muted text-text-subtle"
                  }`}
                >
                  {c.count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<Shirt className="size-6" />}
          title="Aucun modèle dans cette catégorie."
          description="Ajoutez une création pour enrichir votre catalogue et faciliter vos prises de commande."
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
              className="group flex flex-col justify-between rounded-2xl border border-border bg-surface shadow-xs transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:border-primary-800/50 overflow-hidden cursor-pointer"
            >
              <div>
                <ModelCardImage category={item.category} name={item.name} imageUrl={item.imageUrl} />

                <div className="p-4 sm:p-5 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-text text-base leading-tight group-hover:text-primary-900 transition-colors">
                      {item.name}
                    </h3>
                  </div>

                  {item.description && (
                    <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-md bg-surface-muted px-2 py-0.5 text-[11px] font-semibold text-text-muted border border-border/80"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="border-t border-border bg-canvas/30 p-4 flex items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] text-text-subtle uppercase tracking-wider block font-bold">
                    Prix indicatif
                  </span>
                  <span className="font-extrabold text-primary-950 text-sm">
                    {item.indicativePrice ? formatAmount(item.indicativePrice) : "Sur devis"}
                  </span>
                </div>

                <LinkButton
                  href={`/modeles/${item.id}`}
                  size="sm"
                  variant="secondary"
                  className="font-bold border border-border bg-surface hover:bg-surface-muted shadow-2xs group-hover:border-primary-800/60"
                >
                  <span>Détails</span>
                  <ArrowRight className="size-3.5" />
                </LinkButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
