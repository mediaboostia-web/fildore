import { PageHeader } from "@/components/shared/page-header";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour /modeles — conserve la structure de la page
 * (PROJECT_RULES.md §3 "État Chargement").
 */
export default function ModelesLoading() {
  return (
    <>
      <PageHeader
        title="Modèles & Catalogue"
        description="Inspirez vos clients avec votre catalogue de créations et modèles de l'atelier."
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-2">
            <Skeleton className="aspect-square w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </div>
    </>
  );
}
