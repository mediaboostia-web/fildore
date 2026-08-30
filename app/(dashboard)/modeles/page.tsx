import Link from "next/link";
import Image from "next/image";
import { Plus, Scissors, Shirt, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkButton } from "@/components/ui/link-button";
import { getCatalogItems } from "@/lib/mock-data/catalog";
import { formatAmount } from "@/lib/money/format";
import { CATALOG_CATEGORY_LABELS, type CatalogCategory } from "@/features/catalog/types";

const CATEGORY_DEFAULT_PHOTOS: Record<string, string> = {
  robe: "/Une Couturière Africaine Coud Avec Diligence Des Vêtements à Laide De Machines Dans Son Bureau De Tailleur Photo Et Image en Téléchargement Gratuit - Pngtree.jpg",
  boubou_femme: "/Je suis votre modéliste.jpg",
  boubou_homme: "/African tailor happily standing in front of her sewing machine _ Premium Photo.jpg",
  costume: "/Images pro.jpg",
  chemise: "/image couture.jpg",
  ensemble: "/Une Couturière Africaine Coud Avec Diligence Des Vêtements à Laide De Machines Dans Son Bureau De Tailleur Photo Et Image en Téléchargement Gratuit - Pngtree.jpg",
  mariage: "/Je suis votre modéliste.jpg",
};

function ModelCardImage({ category, name, imageUrl }: { category: CatalogCategory; name: string; imageUrl?: string }) {
  const photoSrc = imageUrl || CATEGORY_DEFAULT_PHOTOS[category];

  if (photoSrc) {
    return (
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-t-xl bg-primary-950">
        <Image
          src={photoSrc}
          alt={name}
          fill
          className="object-cover object-top transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute top-2.5 left-2.5 rounded-full bg-black/40 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-md">
          {CATALOG_CATEGORY_LABELS[category] || category}
        </div>
      </div>
    );
  }

  const colors: Record<string, { bg: string; stroke: string; accent: string }> = {
    robe: { bg: "#FDF1EC", stroke: "#DD7A46", accent: "#9C4C24" },
    boubou_femme: { bg: "#F7F0EA", stroke: "#855A2E", accent: "#54381E" },
    boubou_homme: { bg: "#F1F8F5", stroke: "#2C675C", accent: "#173B36" },
    costume: { bg: "#EAF1FB", stroke: "#2E6BB8", accent: "#1D4577" },
    chemise: { bg: "#FDF1EC", stroke: "#DD7A46", accent: "#C4622F" },
  };
  const color = colors[category] || { bg: "#FBF7F2", stroke: "#855A2E", accent: "#54381E" };

  return (
    <div
      role="img"
      aria-label={name}
      className="relative flex aspect-4/3 w-full items-center justify-center rounded-t-xl border-b border-border transition-transform group-hover:scale-102"
      style={{ backgroundColor: color.bg }}
    >
      <div className="flex flex-col items-center gap-2 p-4 text-center">
        <div
          className="flex size-14 items-center justify-center rounded-full shadow-sm"
          style={{ backgroundColor: "#FFFFFF", color: color.stroke }}
        >
          <Scissors className="size-7" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: color.accent }}>
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
    { key: "all", label: "Tous les modèles" },
    { key: "robe", label: "Robes" },
    { key: "boubou_femme", label: "Boubous femme" },
    { key: "boubou_homme", label: "Boubous homme" },
    { key: "costume", label: "Costumes" },
    { key: "chemise", label: "Chemises" },
    { key: "ensemble", label: "Ensembles" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Modèles"
        description="Inspirez vos clients avec votre catalogue de créations et modèles de l'atelier."
        action={
          <LinkButton href="/modeles/nouveau" icon={<Plus className="size-4" />}>
            Nouveau modèle
          </LinkButton>
        }
      />

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-1.5 border-b border-border pb-3">
        {categories.map((c) => {
          const isActive = activeCategory === c.key;
          return (
            <Link
              key={c.key}
              href={c.key === "all" ? "/modeles" : `/modeles?cat=${c.key}`}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                isActive
                  ? "bg-primary-900 text-white shadow-sm"
                  : "bg-surface text-text-muted hover:bg-canvas hover:text-text border border-border"
              }`}
            >
              {c.label}
            </Link>
          );
        })}
      </div>

      {filteredItems.length === 0 ? (
        <EmptyState
          icon={<Shirt className="size-6" />}
          title="Aucun modèle dans cette catégorie."
          description="Ajoutez un modèle pour enrichir votre catalogue et faciliter vos prises de commande."
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
              className="group flex flex-col justify-between rounded-xl border border-border bg-surface shadow-xs transition-all hover:shadow-md hover:border-primary-800/40 overflow-hidden"
            >
              <div>
                <ModelCardImage category={item.category} name={item.name} imageUrl={item.imageUrl} />

                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-text text-base leading-tight group-hover:text-primary-900">
                      {item.name}
                    </h3>
                  </div>

                  {item.description && (
                    <p className="text-xs text-text-muted line-clamp-2">{item.description}</p>
                  )}

                  <div className="flex flex-wrap gap-1 pt-1">
                    {item.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-surface-muted px-2 py-0.5 text-[11px] font-medium text-text-muted border border-border/80"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="border-t border-border bg-canvas/40 p-4 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-text-muted block font-medium">Prix indicatif</span>
                  <span className="font-bold text-text text-sm">
                    {item.indicativePrice ? formatAmount(item.indicativePrice) : "Sur devis"}
                  </span>
                </div>

                <LinkButton href={`/modeles/${item.id}`} size="sm" variant="secondary">
                  Voir détails
                </LinkButton>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
