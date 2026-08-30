import { PageHeader } from "@/components/shared/page-header";
import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

/**
 * Squelette de chargement pour /commandes — conserve la structure de la page
 * (PROJECT_RULES.md §3 "État Chargement").
 */
export default function CommandesLoading() {
  return (
    <>
      <PageHeader
        title="Commandes"
        description="Suivez la production, les délais de livraison et les règlements de vos commandes."
      />
      <div className="mb-4 flex flex-col gap-3">
        <Skeleton className="h-11 max-w-md" />
        <Skeleton className="h-9 w-full max-w-lg" />
      </div>
      <div className="flex flex-col gap-2.5">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    </>
  );
}
